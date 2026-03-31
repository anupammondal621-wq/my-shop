import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

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
    <main className="min-h-screen bg-white px-6 pt-[100px] pb-12 text-black">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm uppercase tracking-[0.25em] text-gray-500">
            My Account
          </p>
          <h1 className="mb-3 text-4xl font-semibold">Welcome back</h1>
          <p className="text-gray-600">{user.email}</p>
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