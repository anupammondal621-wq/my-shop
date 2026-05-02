"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { addToCart, loadCart, type ProductForCart } from "@/utils/cart";

type AddToCartButtonProps = {
  product: ProductForCart;
  fullWidth?: boolean;
};

export default function AddToCartButton({
  product,
  fullWidth = false,
}: AddToCartButtonProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  const handleAddToCart = async () => {
    await addToCart(product);

    const cart = await loadCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    setCartTotal(totalItems);
    setPopupOpen(true);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        className={`h-[48px] rounded-full bg-white text-black border border-black text-[16px] font-medium transition hover:bg-black hover:text-white ${
          fullWidth ? "w-full" : "px-6"
        }`}
      >
        Add to cart
      </button>

      {popupOpen && (
        <div className="fixed left-0 right-0 top-[70px] z-[999] bg-white px-6 py-5 shadow-lg md:hidden">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[16px]">
              <span>✓</span>
              <span>Item added to your cart</span>
            </div>

            <button
              type="button"
              onClick={() => setPopupOpen(false)}
              className="text-3xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="mb-8 flex items-center gap-5">
            <div className="relative h-[92px] w-[92px] overflow-hidden bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-[22px] tracking-wide">{product.name}</p>
          </div>

          <Link
            href="/cart"
            className="mb-4 flex h-[58px] w-full items-center justify-center rounded-full border-2 border-black-400 text-[22px] tracking-[0.15em] text-black-400"
          >
            View cart ({cartTotal})
          </Link>

          <Link
            href="/cart"
            className="mb-5 flex h-[58px] w-full items-center justify-center rounded-full bg-black text-[22px] tracking-[0.15em] text-white"
          >
            Check out
          </Link>

          <button
            type="button"
            onClick={() => setPopupOpen(false)}
            className="block w-full text-center text-[22px] tracking-[0.15em] text-black-400 underline"
          >
            Continue shopping
          </button>
        </div>
      )}
    </>
  );
}