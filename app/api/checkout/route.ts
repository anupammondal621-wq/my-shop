import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const shippingDetails = body?.shippingDetails;
    const mode = body?.mode;
    const buyNowProduct = body?.buyNowProduct;
    const totalAmount = Number(body?.totalAmount || 0);

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        email: shippingDetails?.email || "",
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
        email: shippingDetails?.email || "",
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