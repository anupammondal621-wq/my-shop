import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("VERIFY BODY:", body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      mode,
      buyNowProduct,
      totalAmount,
      shippingDetails,
    } = body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

if (shippingDetails?.address) {
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      first_name: shippingDetails.firstName,
      last_name: shippingDetails.lastName,
      phone: shippingDetails.phone,
      address: shippingDetails.address,
      apartment: shippingDetails.apartment,
      city: shippingDetails.city,
      state: shippingDetails.state,
      postal_code: shippingDetails.postalCode,
      country: shippingDetails.country || "India",
    },
    { onConflict: "id" }
  );

  console.log("PROFILE SAVE ERROR:", profileError);

  if (profileError) {
    return NextResponse.json(
      { error: "Failed to save shipping address" },
      { status: 500 }
    );
  }
} else {
  console.log("NO SHIPPING DETAILS RECEIVED:", shippingDetails);
}

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .maybeSingle();

    if (!existingOrder) {
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          email: user.email,
          total_amount: totalAmount,
          status: "paid",
          razorpay_order_id,
          razorpay_payment_id,
        })
        .select()
        .single();

      if (orderError) {
        console.error(orderError);
        return NextResponse.json(
          { error: "Failed to save order" },
          { status: 500 }
        );
      }

      if (mode === "buy-now" && buyNowProduct) {
        await supabase.from("order_items").insert({
          order_id: newOrder.id,
          user_id: user.id,
          slug: buyNowProduct.slug,
          name: buyNowProduct.name,
          price: buyNowProduct.price,
          image: buyNowProduct.image,
          quantity: buyNowProduct.quantity || 1,
        });
      } else {
        const { data: cartItems, error: cartError } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id);

        if (!cartError && cartItems && cartItems.length > 0) {
          const itemsToInsert = cartItems.map((item) => ({
            order_id: newOrder.id,
            user_id: user.id,
            slug: item.slug,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          }));

          await supabase.from("order_items").insert(itemsToInsert);
          await supabase.from("cart_items").delete().eq("user_id", user.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      redirectUrl: "/checkout/success",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}