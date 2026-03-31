import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getShippingCost(postalCode: string) {
  if (!postalCode || postalCode.length < 2) return 0;

  const prefix = postalCode.slice(0, 2);

  if (prefix === "11" || prefix === "12") return 40;
  if (prefix === "40" || prefix === "41") return 60;

  return 90;
}

export async function POST(req: NextRequest) {
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

  const line_items = [
    ...products.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: item.image
            ? [`${process.env.NEXT_PUBLIC_SITE_URL}${item.image}`]
            : [],
        },
        unit_amount: Math.round(
          Number(String(item.price).replace(/[^\d.]/g, "")) * 100
        ),
      },
    })),
    {
      quantity: 1,
      price_data: {
        currency: "inr",
        product_data: {
          name: "Shipping",
        },
        unit_amount: Math.round(shipping * 100),
      },
    },
    {
      quantity: 1,
      price_data: {
        currency: "inr",
        product_data: {
          name: "Estimated Tax",
        },
        unit_amount: Math.round(estimatedTax * 100),
      },
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&mode=${mode || "cart"}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout${mode === "buy-now" ? "?mode=buy-now" : ""}`,
    metadata: {
      user_id: user.id,
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
      buy_now_quantity: mode === "buy-now" ? String(buyNowProduct?.quantity || 1) : "",
    },
  });

  return NextResponse.json({ url: session.url });
}