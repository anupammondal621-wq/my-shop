"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  loadCart,
  updateCartItemQuantity,
  removeCartItem,
  CartItem,
} from "@/utils/cart";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  const refreshCart = async () => {
    const data = await loadCart();
    setCart(data);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const increaseQuantity = async (slug: string, currentQuantity: number) => {
    await updateCartItemQuantity(slug, currentQuantity + 1);
    refreshCart();
  };

  const decreaseQuantity = async (slug: string, currentQuantity: number) => {
    await updateCartItemQuantity(slug, currentQuantity - 1);
    refreshCart();
  };

  const removeItem = async (slug: string) => {
    await removeCartItem(slug);
    refreshCart();
  };

  const subtotal: number = cart.reduce((total: number, item: CartItem) => {
    const numericPrice = Number(String(item.price).replace(/[^\d.]/g, ""));
    return total + numericPrice * item.quantity;
  }, 0);

  const total: number = subtotal;

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Same as Shop page header, but text is CART */}
      <div className="border-b border-black px-6 py-4">
        <h1 className="text-sm uppercase tracking-widest">Cart</h1>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {cart.length === 0 ? (
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center shadow-sm">
            <h2 className="mb-3 text-2xl font-semibold">Your cart is empty</h2>
            <p className="mb-6 text-gray-600">
              Add something beautiful to get started.
            </p>
            <button
              onClick={() => router.push("/shop")}
              className="rounded-full bg-black px-6 py-3 text-white"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.slug}
                  className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={120}
                        height={120}
                        className="h-28 w-28 rounded-2xl object-cover"
                      />
                      <div>
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="mt-1 text-gray-600">{item.price}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          Premium selection for your order
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center rounded-full border border-black/10 bg-[#f7f7f5] px-2 py-1">
                        <button
                          onClick={() =>
                            decreaseQuantity(item.slug, item.quantity)
                          }
                          className="rounded-full px-3 py-1 text-lg"
                        >
                          -
                        </button>

                        <span className="min-w-[32px] text-center font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.slug, item.quantity)
                          }
                          className="rounded-full px-3 py-1 text-lg"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.slug)}
                        className="rounded-full border border-black/10 px-4 py-2 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>

                <div className="border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-semibold">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="mt-8 w-full rounded-full bg-black px-6 py-3 text-white"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push("/shop")}
                className="mt-3 w-full rounded-full border border-black/10 px-6 py-3"
              >
                Continue Shopping
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}