"use client";

import { addToCart, type ProductForCart } from "@/utils/cart";

type AddToCartButtonProps = {
  product: ProductForCart;
  fullWidth?: boolean;
};

export default function AddToCartButton({
  product,
  fullWidth = false,
}: AddToCartButtonProps) {
  const handleAddToCart = async () => {
    await addToCart(product);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`border border-black bg-white px-6 py-4 text-center text-lg font-semibold uppercase tracking-wide text-black ${
        fullWidth ? "w-full" : "w-fit rounded-full"
      }`}
    >
      Add to Cart
    </button>
  );
}