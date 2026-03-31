import { redirect } from "next/navigation";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; mode?: string }>;
}) {
  const { session_id, mode } = await searchParams;

  if (!session_id) {
    redirect("/cart");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (!existingOrder) {
    const totalAmount =
      typeof session.amount_total === "number"
        ? session.amount_total / 100
        : 0;

    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        email: user.email,
        total_amount: totalAmount,
        status: "paid",
        stripe_session_id: session.id,
      })
      .select()
      .single();

    if (!orderError && newOrder) {
      if (mode === "buy-now") {
        const md = session.metadata || {};

        const itemToInsert = {
          order_id: newOrder.id,
          user_id: user.id,
          slug: md.buy_now_slug || "",
          name: md.buy_now_name || "",
          price: md.buy_now_price || "",
          image: md.buy_now_image || "",
          quantity: Number(md.buy_now_quantity || "1"),
        };

        await supabase.from("order_items").insert(itemToInsert);
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
  }

  return (
    <main className="min-h-screen bg-white px-6 pt-[100px] pb-12 text-black">
      <div className="mx-auto max-w-3xl rounded-3xl border border-black/10 bg-white p-10 text-center shadow-sm">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
          Order Confirmed
        </p>
        <h1 className="mb-4 text-4xl font-semibold">Payment Successful</h1>
        <p className="mx-auto mb-8 max-w-xl text-gray-600">
          Thank you for your order. Your payment was completed successfully and
          your order has been saved in your account.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/account"
            className="rounded-full bg-black px-6 py-3 text-white"
          >
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-black/10 px-6 py-3"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}