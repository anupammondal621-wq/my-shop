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
  className={`h-[48px] rounded-full bg-white text-black border border-black text-[16px] font-medium transition hover:bg-black hover:text-white ${
    fullWidth ? "w-full" : "px-6"
  }`}
>
  Add to cart
</button>
  );
}