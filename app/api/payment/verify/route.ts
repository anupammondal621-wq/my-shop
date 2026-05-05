import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

async function findUserByEmail(admin: any, email: string) {
  let page = 1;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) return null;

    const found = data.users.find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (found) return found;
    if (data.users.length < 1000) break;

    page++;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      mode,
      buyNowProduct,
      totalAmount,
      shippingDetails,
      cartItems,
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

    const {
      data: { user: loggedInUser },
    } = await supabase.auth.getUser();

    const email = loggedInUser?.email || shippingDetails?.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let userId = loggedInUser?.id;
    let accountAlreadyExists = !!loggedInUser;

    if (!userId) {
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingProfile?.id) {
        accountAlreadyExists = true;
        userId = existingProfile.id;
      } else {
        let existingAuthUser = await findUserByEmail(supabaseAdmin, email);

        if (!existingAuthUser) {
          accountAlreadyExists = false;

          const { data: createdUser, error: createUserError } =
            await supabaseAdmin.auth.admin.createUser({
              email,
              email_confirm: true,
              user_metadata: {
                first_name: shippingDetails?.firstName || "",
                last_name: shippingDetails?.lastName || "",
              },
            });

          if (createUserError) {
            console.error("Create user error:", createUserError);
            return NextResponse.json(
              { error: "Failed to create customer account" },
              { status: 500 }
            );
          }

          existingAuthUser = createdUser.user;
        } else {
          accountAlreadyExists = true;
        }

        userId = existingAuthUser.id;
      }
    }

    await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        email,
        first_name: shippingDetails?.firstName || "",
        last_name: shippingDetails?.lastName || "",
        phone: shippingDetails?.phone || "",
        address: shippingDetails?.address || "",
        apartment: shippingDetails?.apartment || "",
        city: shippingDetails?.city || "",
        state: shippingDetails?.state || "",
        postal_code: shippingDetails?.postalCode || "",
        country: shippingDetails?.country || "India",
      },
      { onConflict: "id" }
    );

    const { data: existingAddresses } = await supabaseAdmin
  .from("user_addresses")
  .select("id")
  .eq("user_id", userId);

const isFirstAddress =
  !existingAddresses || existingAddresses.length === 0;

const { data: sameAddress } = await supabaseAdmin
  .from("user_addresses")
  .select("id")
  .eq("user_id", userId)
  .eq("address", shippingDetails?.address || "")
  .eq("postal_code", shippingDetails?.postalCode || "")
  .maybeSingle();

if (!sameAddress && shippingDetails?.address) {
  await supabaseAdmin.from("user_addresses").insert({
    user_id: userId,
    first_name: shippingDetails?.firstName || "",
    last_name: shippingDetails?.lastName || "",
    company: shippingDetails?.company || "",
    phone: shippingDetails?.phone || "",
    address: shippingDetails?.address || "",
    apartment: shippingDetails?.apartment || "",
    city: shippingDetails?.city || "",
    state: shippingDetails?.state || "",
    postal_code: shippingDetails?.postalCode || "",
    country: shippingDetails?.country || "India",
    is_default: isFirstAddress,
  });
}

    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .maybeSingle();

    if (!existingOrder) {
      const { data: newOrder, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: userId,
          email,
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
        await supabaseAdmin.from("order_items").insert({
          order_id: newOrder.id,
          user_id: userId,
          slug: buyNowProduct.slug,
          name: buyNowProduct.name,
          price: buyNowProduct.price,
          image: buyNowProduct.image,
          quantity: buyNowProduct.quantity || 1,
        });
      } else if (cartItems && cartItems.length > 0) {
        const itemsToInsert = cartItems.map((item: any) => ({
          order_id: newOrder.id,
          user_id: userId,
          slug: item.slug,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }));

        await supabaseAdmin.from("order_items").insert(itemsToInsert);

        if (loggedInUser) {
          await supabaseAdmin
            .from("cart_items")
            .delete()
            .eq("user_id", loggedInUser.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      redirectUrl: `/checkout/success?email=${encodeURIComponent(
        email
      )}&existing=${accountAlreadyExists ? "true" : "false"}`,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}