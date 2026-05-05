import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import EditProfileModal from "@/components/EditProfileModal";
import AddAddressModal from "@/components/AddAddressModal";

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
    <main className="min-h-screen bg-[#f4f4f4] px-[52px] pt-3 pb-12 text-black">
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
          <div className="mb-8 flex items-center gap-8">
            <h2 className="text-lg font-semibold">Addresses</h2>

<AddAddressModal />
          </div>

          <div className="rounded-lg border border-gray-200 bg-[#f7f7f7] px-5 py-5">
{addresses && addresses.length > 0 ? (
  <div className="space-y-4">
    {addresses.map((addr) => (
      <div
        key={addr.id}
        className="rounded-lg border border-gray-200 bg-[#f7f7f7] px-5 py-5"
      >
        <p className="text-base">
          {addr.first_name} {addr.last_name}
          {addr.company ? `, ${addr.company}` : ""}
          {addr.address ? `, ${addr.address}` : ""}
          {addr.apartment ? `, ${addr.apartment}` : ""}
        </p>

        <p className="text-base">
          {addr.postal_code} {addr.city} {addr.state}, IN
        </p>

        {addr.is_default && (
          <span className="mt-2 inline-block rounded-full bg-gray-600 px-2 py-1 text-xs text-white">
            Default
          </span>
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

        <div className="mb-10 flex items-center gap-7">
          <LogoutButton />

          <button type="button" className="text-sm text-blue-600 hover:underline">
            Sign out of all devices
          </button>
        </div>

        <div>
          <h2 className="mb-6 text-3xl font-semibold">Order History</h2>

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
                    className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                          Order
                        </p>

                        <p className="font-medium">{order.id}</p>

                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                          Status
                        </p>

                        <p className="font-medium capitalize">{order.status}</p>

                        <p className="mt-1 text-xl font-semibold">
                          ₹{Number(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {items.map((item: OrderItem) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 rounded-2xl border border-black/10 p-4"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={90}
                            height={90}
                            className="h-20 w-20 rounded-xl object-cover"
                          />

                          <div>
                            <h3 className="font-medium">{item.name}</h3>

                            <p className="text-gray-600">{item.price}</p>

                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
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