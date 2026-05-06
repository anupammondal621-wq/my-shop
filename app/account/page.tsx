import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import EditProfileModal from "@/components/EditProfileModal";
import AddAddressModal from "@/components/AddAddressModal";
import EditAddressModal from "@/components/EditAddressModal";
import { signOutAllDevices } from "./sign-out-all-devices-action";

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();

  const { data: addresses } = await supabase
  .from("user_addresses")
  .select("*")
  .eq("user_id", user.id)
  .order("is_default", { ascending: false })
  .order("created_at", { ascending: false });

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f4f4f4] px-4 pt-3 pb-12 text-black sm:px-[52px]">
      <div>
        <h1 className="mb-12 text-2xl font-semibold">Profile</h1>

<div className="mb-9 rounded-xl bg-white px-7 py-8">
  <div className="mb-6">
    <div className="mb-6 flex items-center gap-3">
      <p className="text-sm text-gray-600">Name</p>

      <EditProfileModal
        email={user.email || ""}
        fullName={
          profile?.first_name || profile?.last_name
            ? `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim()
            : ""
        }
      />
    </div>

    {/* 👇 ADD THIS PART HERE */}
    <p className="text-base">
      {profile?.first_name || profile?.last_name
        ? `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim()
        : ""}
    </p>
  </div>

  <div>
    <p className="mb-2 text-sm text-gray-600">Email</p>
    <p className="text-base">{user.email}</p>
  </div>
</div>

        <div className="mb-8 rounded-xl bg-white px-7 py-7">
<div className="mb-8 flex items-center justify-between lg:justify-start lg:gap-8">
  <h2 className="text-lg font-semibold">Addresses</h2>

  <AddAddressModal />
</div>

<div>
  {addresses && addresses.length > 0 ? (
    <div className="flex flex-wrap gap-8">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className={`relative w-full rounded-lg px-5 py-4 pr-10 sm:w-[260px] ${
            addr.is_default ? "bg-[#f3f3f3]" : "bg-white"
          }`}
        >
          <EditAddressModal address={addr} />

          {addr.is_default && (
            <p className="mb-3 text-sm text-gray-500">Default address</p>
          )}

          <p className="text-sm leading-6">
            {addr.first_name} {addr.last_name}
          </p>

          {addr.company && (
            <p className="text-sm leading-6">{addr.company}</p>
          )}

          <p className="text-sm leading-6">{addr.address}</p>

          {addr.apartment && (
            <p className="text-sm leading-6">{addr.apartment}</p>
          )}

          <p className="text-sm leading-6">{addr.city}</p>

          <p className="text-sm leading-6">
            {addr.postal_code} {addr.city} {addr.state}
          </p>

          <p className="text-sm leading-6">{addr.country || "India"}</p>

          {addr.phone && (
            <p className="text-sm leading-6">+{addr.phone}</p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-lg border border-gray-200 bg-[#f7f7f7] px-5 py-5">
      <p className="text-base text-gray-700">ⓘ &nbsp; No addresses added</p>
    </div>
  )}
</div>
        </div>

<div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-7">
  
  {/* Logout Button */}
  <div className="w-full rounded-lg border border-gray-300 bg-white py-4 text-center lg:w-auto lg:border-0 lg:bg-transparent lg:p-0">
    <LogoutButton />
  </div>

  {/* Sign out all devices */}
  <form action={signOutAllDevices} className="text-center lg:text-left">
    <button
      type="submit"
      className="text-base text-blue-600 hover:underline lg:text-sm"
    >
      Sign out of all devices
    </button>
  </form>

</div>

        <div>
          <h2 className="mb-6 text-xl font-medium">Order History</h2>

          {!orders || orders.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-gray-600">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order: Order) => {
                const items =
                  orderItems?.filter(
                    (item: OrderItem) => item.order_id === order.id
                  ) ?? [];

                return (
<div
  key={order.id}
  className="rounded-xl bg-white px-4 py-4"
>
  <div className="relative flex items-start gap-4 sm:items-center sm:gap-5">
    <div className="flex shrink-0 -space-x-3">
      {items.slice(0, 2).map((item: OrderItem) => (
        <Image
          key={item.id}
          src={item.image}
          alt={item.name}
          width={62}
          height={80}
          className="h-20 w-14 rounded-lg object-cover"
        />
      ))}
    </div>

    <div className="pt-1 sm:min-w-[140px] sm:pt-0">
      <p className="text-sm font-semibold">
        {order.status === "paid" ? "On its way" : order.status}
      </p>

      <p className="text-sm text-gray-500">
        {new Date(order.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })}
      </p>

      <p className="mt-2 text-sm text-gray-500 sm:hidden">
        #{order.id.slice(0, 4)} ·{" "}
        {items.reduce((total, item) => total + item.quantity, 0)}{" "}
        {items.reduce((total, item) => total + item.quantity, 0) === 1
          ? "item"
          : "items"}
      </p>

      <p className="text-sm text-gray-500 sm:hidden">
        ₹{Number(order.total_amount).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} INR
      </p>
    </div>

    <div className="hidden min-w-[120px] sm:block">
      <p className="text-sm font-medium">#{order.id.slice(0, 4)}</p>
      <p className="text-sm text-gray-500">
        {items.reduce((total, item) => total + item.quantity, 0)}{" "}
        {items.reduce((total, item) => total + item.quantity, 0) === 1
          ? "item"
          : "items"}
      </p>
    </div>

    <div className="ml-auto hidden text-sm font-medium sm:block">
      ₹{Number(order.total_amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} INR
    </div>

    <details className="absolute right-0 top-0 sm:relative">
      <summary className="list-none cursor-pointer text-xl text-blue-600">
        ⋯
      </summary>

      <div className="absolute right-0 top-8 z-20 w-48 rounded-lg border border-gray-300 bg-white p-1 shadow-xl">
        <button
          type="button"
          className="w-full rounded-md px-4 py-3 text-left text-sm hover:bg-gray-100"
        >
          Buy again
        </button>
      </div>
    </details>
  </div>
</div>

                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}