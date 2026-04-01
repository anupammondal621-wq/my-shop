import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

function getShippingCost(postalCode: string) {
  if (!postalCode || postalCode.length < 2) return 0;

  const prefix = postalCode.slice(0, 2);

  if (prefix === "11" || prefix === "12") return 40;
  if (prefix === "40" || prefix === "41") return 60;

  return 90;
}

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
    const shippingDetails = body?.shippingDetails;
    const mode = body?.mode;
    const buyNowProduct = body?.buyNowProduct;

    let products: any[] = [];

    if (mode === "buy-now" && buyNowProduct) {
      products = [buyNowProduct];
    } else {
      const { data: cartItems, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id);

      if (error || !cartItems || cartItems.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      products = cartItems;
    }

    const subtotal = products.reduce((total, item) => {
      const numericPrice = Number(String(item.price).replace(/[^\d.]/g, ""));
      return total + numericPrice * item.quantity;
    }, 0);

    const shipping = getShippingCost(shippingDetails?.postalCode || "");
    const estimatedTax = subtotal * 0.18;
    const total = subtotal + shipping + estimatedTax;

    const order = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_id: user.id,
        email: user.email || "",
        checkout_mode: mode || "cart",
        shipping_postal_code: shippingDetails?.postalCode || "",
        shipping_city: shippingDetails?.city || "",
        shipping_state: shippingDetails?.state || "",
        shipping_address: shippingDetails?.address || "",
        shipping_phone: shippingDetails?.phone || "",
        buy_now_slug: mode === "buy-now" ? buyNowProduct?.slug || "" : "",
        buy_now_name: mode === "buy-now" ? buyNowProduct?.name || "" : "",
        buy_now_price: mode === "buy-now" ? buyNowProduct?.price || "" : "",
        buy_now_image: mode === "buy-now" ? buyNowProduct?.image || "" : "",
        buy_now_quantity:
          mode === "buy-now" ? String(buyNowProduct?.quantity || 1) : "",
      },
    });

    return NextResponse.json({
      success: true,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      name: "BongoMithai",
      description: "Order Payment",
      prefill: {
        email: user.email || "",
        contact: shippingDetails?.phone || "",
      },
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}