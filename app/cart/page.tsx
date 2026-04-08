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

type CartItemWithPack = CartItem & {
  pack?: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItemWithPack[]>([]);
  const router = useRouter();

  const refreshCart = async () => {
    const data = await loadCart();
    setCart(data as CartItemWithPack[]);
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

  const subtotal: number = cart.reduce((total: number, item) => {
    const numericPrice = getNumericPrice(item.price);
    return total + numericPrice * item.quantity;
  }, 0);

  return (
    <>
      <main className="min-h-screen bg-[#f3f3f3] text-black">
        {/* HEADER */}
        <div className="border-b border-black px-6 py-4 flex justify-between">
          <h1 className="text-sm uppercase tracking-widest">Cart</h1>
          <button
            onClick={() => router.push("/shop")}
            className="text-sm underline"
          >
            Continue shopping
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {cart.map((item) => {
            const itemPrice = getNumericPrice(item.price);
            const itemTotal = itemPrice * item.quantity;

            return (
              <div key={item.slug} className="border-b py-8">
                {/* MOBILE */}
                <div className="block md:hidden">
                  <div className="flex gap-4">
                    {/* IMAGE */}
                    <div className="relative h-[90px] w-[90px] bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* RIGHT */}
                    <div className="flex-1">
                      {/* TOP ROW */}
                      <div className="flex justify-between gap-3">
                        <div>
                          <h2 className="text-[14px] font-light uppercase tracking-[0.05em] text-[#d26a6a]">
                            {item.name}
                          </h2>

                          <p className="mt-2 text-[14px] text-[#d26a6a] font-light">
                            Rs. {itemPrice.toFixed(2)}
                          </p>

                          {item.pack && (
                            <p className="mt-2 text-[13px] text-[#d26a6a] font-light">
                              {item.pack}
                            </p>
                          )}
                        </div>

                        {/* TOTAL */}
                        <p className="text-[14px] text-[#d26a6a] font-light whitespace-nowrap">
                          Rs. {itemTotal.toFixed(2)}
                        </p>
                      </div>

                      {/* QUANTITY */}
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex h-[44px] w-[130px] items-center justify-between border border-[#d26a6a]/60 px-4 text-[#d26a6a]">
                          <button
                            onClick={() =>
                              decreaseQuantity(item.slug, item.quantity)
                            }
                            className="text-[20px]"
                          >
                            -
                          </button>

                          <span className="text-[15px]">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.slug, item.quantity)
                            }
                            className="text-[20px]"
                          >
                            +
                          </button>
                        </div>

                        {/* DELETE */}
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="text-[#d26a6a]"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DESKTOP */}
                <div className="hidden md:flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="relative h-[120px] w-[120px] bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h2 className="text-lg text-[#d26a6a]">{item.name}</h2>
                      <p className="mt-2 text-[#d26a6a]">
                        Rs. {itemPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex border px-4 py-2">
                      <button
                        onClick={() =>
                          decreaseQuantity(item.slug, item.quantity)
                        }
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() =>
                          increaseQuantity(item.slug, item.quantity)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className="text-[#d26a6a]">
                      Rs. {itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* SUMMARY */}
          <div className="mt-10 max-w-sm ml-auto">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="mt-6 w-full bg-black text-white py-4 rounded-full"
            >
              Checkout
            </button>
          </div>
        </div>
      </main>
    </>
  );
}