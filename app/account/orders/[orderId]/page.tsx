import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError || !order) {
    return (
      <main className="min-h-screen bg-[#f4f4f4] px-4 py-8 text-black sm:px-[52px]">
        <Link href="/account" className="text-blue-600">
          ← Back to account
        </Link>

        <div className="mt-6 rounded-xl bg-white p-6">
          <h1 className="text-xl font-semibold">Order not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            This order could not be loaded.
          </p>
          <p className="mt-4 text-xs text-gray-500">Order ID: {orderId}</p>
          <p className="mt-1 text-xs text-red-500">
            {orderError?.message}
          </p>
        </div>
      </main>
    );
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .eq("user_id", user.id);

  const orderItems = items ?? [];
  const shipping = order.shipping_details ?? {};
  const billing = order.billing_details ?? shipping;

  const itemCount = orderItems.reduce(
    (total: number, item: any) => total + Number(item.quantity || 0),
    0
  );

  const formatMoney = (amount: any) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <main className="min-h-screen bg-[#f4f4f4] px-4 py-5 text-black sm:px-[52px]">
<details open className="mb-6 bg-white lg:hidden">
  <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-5">
    <div className="flex items-center gap-2 text-blue-600">
      <span className="text-sm">Order summary</span>

      <span className="text-xs">⌃</span>
    </div>

    <span className="text-xl font-semibold">
      ₹{formatMoney(order.total_amount)}
    </span>
  </summary>

  <div className="border-t border-gray-200 px-5 py-5">
    <div className="space-y-5">
      {orderItems.map((item: any) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={item.image}
                alt={item.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-lg border object-cover"
              />

              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-md bg-black text-xs text-white">
                {item.quantity}
              </span>
            </div>

            <p className="text-sm">{item.name}</p>
          </div>

          <p className="text-sm">
            ₹{formatMoney(Number(item.price) * Number(item.quantity))}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-8 space-y-3 text-sm">
      <div className="flex justify-between">
        <span>Subtotal · {itemCount} items</span>

        <span>₹{formatMoney(order.subtotal_amount)}</span>
      </div>

      <div className="flex justify-between">
        <span>Shipping</span>

        <span>
          {Number(order.shipping_amount || 0) === 0
            ? "Free"
            : `₹${formatMoney(order.shipping_amount)}`}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Taxes</span>

        <span>₹{formatMoney(order.tax_amount)}</span>
      </div>

      <div className="flex justify-between pt-5 text-xl font-semibold">
        <span>Total</span>

        <div className="flex items-center gap-2">
          <span className="text-xs font-normal text-gray-500">
            INR
          </span>

          <span>
            ₹{formatMoney(order.total_amount)}
          </span>
        </div>
      </div>
    </div>
  </div>
</details>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link href="/account" className="text-2xl">
            ←
          </Link>

          <h1 className="mt-2 text-2xl font-semibold">
            Order #{order.id.slice(0, 4)}
          </h1>

          <p className="text-sm text-gray-500">
            Confirmed {formatDate(order.created_at)}
          </p>
        </div>

        <button className="rounded-lg border border-gray-300 bg-white px-5 py-4 text-sm font-semibold text-blue-600">
          Buy again
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-xl bg-white px-6 py-6">
            <p className="mb-6 text-sm">
              Razorpay{" "}
              <span className="text-blue-600">
                {order.razorpay_payment_id || "Payment confirmed"}
              </span>
            </p>

            <div className="space-y-5 border-l border-gray-300 pl-5">
              <div>
                <p className="font-semibold">
                  {order.status === "paid" ? "On its way" : order.status}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </p>
              </div>

              <div>
                <p>Confirmed</p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-8 rounded-xl bg-white px-6 py-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-3 font-semibold">Contact information</h2>
              <p>
                {shipping.firstName || ""} {shipping.lastName || ""}
              </p>
              <p>{shipping.email || user.email}</p>

              <h2 className="mb-3 mt-7 font-semibold">Shipping address</h2>
              <p>
                {shipping.firstName || ""} {shipping.lastName || ""}
              </p>
              {shipping.company && <p>{shipping.company}</p>}
              <p>{shipping.address || "Address not saved for this order"}</p>
              {shipping.apartment && <p>{shipping.apartment}</p>}
              <p>
                {shipping.postalCode || ""} {shipping.city || ""}{" "}
                {shipping.state || ""}
              </p>
              <p>{shipping.country || "India"}</p>
              {shipping.phone && <p>+{shipping.phone}</p>}

              <h2 className="mb-3 mt-7 font-semibold">Shipping method</h2>
              <p>
                {Number(order.shipping_amount || 0) === 0
                  ? "Free Shipping"
                  : "Standard Shipping"}
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-semibold">Billing address</h2>
              <p>
                {billing.firstName || ""} {billing.lastName || ""}
              </p>
              {billing.company && <p>{billing.company}</p>}
              <p>{billing.address || "Same as shipping address"}</p>
              {billing.apartment && <p>{billing.apartment}</p>}
              <p>
                {billing.postalCode || ""} {billing.city || ""}{" "}
                {billing.state || ""}
              </p>
              <p>{billing.country || "India"}</p>
              {billing.phone && <p>+{billing.phone}</p>}
            </div>
          </section>
        </div>

        <aside className="hidden rounded-xl bg-white px-6 py-6 lg:block">
          <div className="space-y-5">
            {orderItems.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-lg border object-cover"
                    />

                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-md bg-black text-xs text-white">
                      {item.quantity}
                    </span>
                  </div>

                  <p className="text-sm">{item.name}</p>
                </div>

                <p className="text-sm">
                  ₹{formatMoney(Number(item.price) * Number(item.quantity))}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal · {itemCount} items</span>
              <span>₹{formatMoney(order.subtotal_amount)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {Number(order.shipping_amount || 0) === 0
                  ? "Free"
                  : `₹${formatMoney(order.shipping_amount)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹{formatMoney(order.tax_amount)}</span>
            </div>

            <div className="flex justify-between pt-5 text-xl font-semibold">
              <span>Total</span>
              <span>
                <span className="mr-2 text-xs font-normal text-gray-500">
                  INR
                </span>
                ₹{formatMoney(order.total_amount)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

