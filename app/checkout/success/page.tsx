import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import GuestPasswordSetupButton from "@/components/GuestPasswordSetupButton";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; existing?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = await searchParams;
  const email = params.email || "";
  const existing = params.existing === "true";

  return (
    <main className="min-h-screen bg-white px-6 pt-[100px] pb-12 text-black">
      <div className="mx-auto max-w-3xl rounded-3xl border border-black/10 bg-white p-10 text-center shadow-sm">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
          Order Confirmed
        </p>

        <h1 className="mb-4 text-4xl font-semibold">Payment Successful</h1>

        <p className="mx-auto mb-8 max-w-xl text-gray-600">
          Thank you for your order. Your payment was completed successfully.
        </p>

        <div className="flex flex-col items-center gap-3">
          {user ? (
            <Link
              href="/account"
              className="rounded-full bg-black px-6 py-3 text-white"
            >
              View My Orders
            </Link>
          ) : existing ? (
            <Link
              href={`/login?email=${encodeURIComponent(email)}`}
              className="rounded-full bg-black px-6 py-3 text-white"
            >
              Login to see your orders
            </Link>
          ) : (
            <GuestPasswordSetupButton email={email} />
          )}

          <Link
            href="/shop"
            className="mt-2 rounded-full border border-black/10 px-6 py-3"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}