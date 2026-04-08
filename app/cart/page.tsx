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
    await refreshCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const decreaseQuantity = async (slug: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      await removeCartItem(slug);
    } else {
      await updateCartItemQuantity(slug, currentQuantity - 1);
    }
    await refreshCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = async (slug: string) => {
    await removeCartItem(slug);
    await refreshCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getNumericPrice = (price: string | number) => {
    return Number(String(price).replace(/[^\d.]/g, ""));
  };

  const subtotal: number = cart.reduce((total: number, item: CartItem) => {
    const numericPrice = getNumericPrice(item.price);
    return total + numericPrice * item.quantity;
  }, 0);

  return (
    <>
      <main className="min-h-screen bg-white text-black">
        {/* TOP HEADER */}
        <div className="border-b border-black px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-sm uppercase tracking-widest">Cart</h1>

            <button
              onClick={() => router.push("/shop")}
              className="text-sm underline underline-offset-4"
            >
              Continue shopping
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="mt-3 text-gray-600">
                Add something beautiful to get started.
              </p>
              <button
                onClick={() => router.push("/shop")}
                className="mt-6 border border-black px-6 py-3 text-sm uppercase tracking-wide"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE HEADER */}
              <div className="hidden grid-cols-[1.7fr_0.9fr_0.7fr] border-b border-black/20 pb-4 md:grid">
                <div className="text-[11px] uppercase tracking-[0.22em]">
                  Product
                </div>
                <div className="text-center text-[11px] uppercase tracking-[0.22em]">
                  Quantity
                </div>
                <div className="text-right text-[11px] uppercase tracking-[0.22em]">
                  Total
                </div>
              </div>

              {/* ITEMS */}
              <div>
                {cart.map((item) => {
                  const itemPrice = getNumericPrice(item.price);
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={item.slug}
                      className="border-b border-black/20 py-8"
                    >
                      {/* MOBILE */}
                      <div className="md:hidden">
                        <div className="grid grid-cols-[96px_1fr_auto] gap-4">
                          {/* image */}
                          <div className="relative h-24 w-24 overflow-hidden bg-[#f5f5f5]">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* details */}
                          <div className="min-w-0">
                            <h2 className="text-[18px] leading-snug uppercase">
                              {item.name}
                            </h2>
                            <p className="mt-2 text-[16px]">
                              Rs. {itemPrice.toFixed(2)}
                            </p>
                            {"pack" in item && item.pack ? (
                              <p className="mt-2 text-[14px] text-black/70">
                                {item.pack}
                              </p>
                            ) : null}
                          </div>

                          {/* total */}
                          <div className="text-right">
                            <p className="text-[16px] whitespace-nowrap">
                              Rs. {itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* quantity + remove */}
                        <div className="mt-5 flex items-center gap-4 pl-[112px]">
                          <div className="flex h-[52px] w-[180px] items-center justify-between border border-black px-6">
                            <button
                              onClick={() =>
                                decreaseQuantity(item.slug, item.quantity)
                              }
                              className="text-[28px] leading-none"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              -
                            </button>

                            <span className="text-[18px] leading-none">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(item.slug, item.quantity)
                              }
                              className="text-[28px] leading-none"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.slug)}
                            aria-label={`Remove ${item.name}`}
                            className="shrink-0"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* DESKTOP */}
                      <div className="hidden md:grid md:grid-cols-[1.7fr_0.9fr_0.7fr] md:items-start md:gap-6">
                        {/* product */}
                        <div className="flex items-start gap-5">
                          <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden bg-[#f5f5f5]">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="pt-1">
                            <h2 className="text-[18px] leading-snug">
                              {item.name}
                            </h2>
                            <p className="mt-3 text-[15px]">
                              Rs. {itemPrice.toFixed(2)}
                            </p>
                            {"pack" in item && item.pack ? (
                              <p className="mt-3 text-[15px] text-black/70">
                                {item.pack}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        {/* quantity */}
                        <div className="flex items-center justify-center gap-5">
                          <div className="flex h-[52px] w-[180px] items-center justify-between border border-black px-6">
                            <button
                              onClick={() =>
                                decreaseQuantity(item.slug, item.quantity)
                              }
                              className="text-[28px] leading-none"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              -
                            </button>

                            <span className="text-[18px] leading-none">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(item.slug, item.quantity)
                              }
                              className="text-[28px] leading-none"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.slug)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
                          </button>
                        </div>

                        {/* total */}
                        <div className="pt-1 text-right">
                          <p className="text-[18px]">
                            Rs. {itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SUMMARY */}
              <div className="flex justify-end pt-10 sm:pt-14">
                <div className="w-full max-w-[420px]">
                  <div className="flex items-center justify-between text-[18px] sm:text-[20px]">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>

                  <p className="mt-5 text-[14px] text-black/75 sm:text-[15px]">
                    Taxes and shipping calculated at checkout
                  </p>

                  <button
                    onClick={() => router.push("/checkout")}
                    className="mt-8 w-full rounded-full bg-black px-6 py-4 text-[18px] text-white transition hover:opacity-90"
                  >
                    Check out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <section className="w-full border-b border-black bg-[#f3f3f3]">
        <div className="grid grid-cols-1 border-b border-black lg:grid-cols-2">
          <div className="px-5 py-6 sm:px-8 lg:border-r lg:border-black">
            <p className="mb-4 text-[16px] leading-7">
              Get 10% off your next purchase. Subscribe to our newsletter.
            </p>

            <form className="space-y-2">
              <input
                type="email"
                placeholder="your@email.address"
                className="w-full border border-black bg-[#f3f3f3] px-4 py-3 text-[16px] outline-none placeholder:text-black"
              />

              <button
                type="submit"
                className="w-full bg-black px-4 py-3 text-[18px] font-semibold uppercase tracking-wide text-white"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="px-5 py-8 sm:px-8">
            <div className="space-y-3 text-[16px] leading-8">
              <p>
                <span className="font-semibold">Contact</span> : +91 9775534553
              </p>
              <p>
                <span className="font-semibold">Email</span> :
                support@bongomithai.com
              </p>
              <p>
                <span className="font-semibold">Location</span> : Kolkata
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-black px-5 py-6 sm:px-8">
          <div className="flex justify-end gap-8 text-[16px]">
            <button onClick={() => router.push("/search")}>Search</button>
            <button onClick={() => router.push("/returns")}>Returns</button>
          </div>
        </div>

        <div className="px-5 py-4 sm:px-8">
          <p className="text-right text-[16px]">
            © 2026 BongoMithai. All rights reserved.
          </p>
        </div>
      </section>
    </>
  );
}