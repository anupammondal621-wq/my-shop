import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function CheckoutSuccessPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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