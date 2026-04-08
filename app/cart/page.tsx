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
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const decreaseQuantity = async (slug: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      await removeCartItem(slug);
    } else {
      await updateCartItemQuantity(slug, currentQuantity - 1);
    }
    refreshCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = async (slug: string) => {
    await removeCartItem(slug);
    refreshCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getNumericPrice = (price: string | number) => {
    return Number(String(price).replace(/[^\d.]/g, ""));
  };

  const subtotal: number = cart.reduce((total: number, item: CartItem) => {
    const numericPrice = getNumericPrice(item.price);
    return total + numericPrice * item.quantity;
  }, 0);

  const total: number = subtotal;

  return (
    <>
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 lg:px-12">
          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <h1 className="text-[42px] font-normal leading-none text-[#ef6b61]">
                Your cart
              </h1>
              <p className="mt-8 text-[16px] text-[#ef6b61]">
                Your cart is empty.
              </p>
              <button
                onClick={() => router.push("/shop")}
                className="mt-8 inline-block border border-[#efb1aa] px-8 py-3 text-[15px] text-[#ef6b61] transition hover:bg-[#ef6b61] hover:text-white"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              {/* TOP HEADER */}
              <div className="flex items-start justify-between gap-6">
                <h1 className="text-[42px] font-normal leading-none text-[#ef6b61]">
                  Your cart
                </h1>

                <button
                  onClick={() => router.push("/shop")}
                  className="text-[14px] underline underline-offset-4 text-[#ef6b61]"
                >
                  Continue shopping
                </button>
              </div>

              {/* TABLE HEADER */}
              <div className="mt-10 hidden grid-cols-[1.8fr_0.8fr_0.7fr] border-b border-[#f2d5d1] pb-4 md:grid">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#efb1aa]">
                  Product
                </div>
                <div className="text-center text-[11px] uppercase tracking-[0.22em] text-[#efb1aa]">
                  Quantity
                </div>
                <div className="text-right text-[11px] uppercase tracking-[0.22em] text-[#efb1aa]">
                  Total
                </div>
              </div>

              {/* CART ITEMS */}
              <div className="mt-2 border-b border-[#f2d5d1]">
                {cart.map((item) => {
                  const itemPrice = getNumericPrice(item.price);
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={item.slug}
                      className="grid gap-6 border-t border-[#f8e7e4] py-8 md:grid-cols-[1.8fr_0.8fr_0.7fr] md:items-start"
                    >
                      {/* PRODUCT */}
                      <div className="flex gap-5">
                        <div className="relative h-[108px] w-[108px] shrink-0 overflow-hidden bg-[#f6f6f6]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="pt-1">
                          <h2 className="text-[28px] leading-tight text-[#ef6b61] md:text-[18px]">
                            {item.name}
                          </h2>
                          <p className="mt-3 text-[16px] text-[#ef6b61] md:text-[14px]">
                            Rs. {itemPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* QUANTITY */}
                      <div className="flex items-center md:justify-center">
                        <div className="flex h-[46px] w-[142px] items-center justify-between border border-[#efb1aa] px-5 text-[#ef6b61]">
                          <button
                            onClick={() =>
                              decreaseQuantity(item.slug, item.quantity)
                            }
                            className="text-[24px] leading-none"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>

                          <span className="text-[18px]">{item.quantity}</span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.slug, item.quantity)
                            }
                            className="text-[24px] leading-none"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.slug)}
                          className="ml-6 text-[18px] text-[#ef6b61]"
                          aria-label={`Remove ${item.name}`}
                        >
                          🗑
                        </button>
                      </div>

                      {/* TOTAL */}
                      <div className="flex items-center justify-between md:block md:text-right">
                        <span className="text-[12px] uppercase tracking-[0.2em] text-[#efb1aa] md:hidden">
                          Total
                        </span>
                        <span className="text-[18px] text-[#ef6b61] md:text-[16px]">
                          Rs. {itemTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BOTTOM SUMMARY */}
              <div className="flex justify-end pt-14">
                <div className="w-full max-w-[350px] text-right">
                  <div className="flex items-center justify-between text-[18px] text-[#ef6b61]">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>

                  <p className="mt-6 text-[14px] text-[#ef9b93]">
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