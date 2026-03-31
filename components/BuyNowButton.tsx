"use client";

import { useRouter } from "next/navigation";
import type { ProductForCart } from "@/utils/cart";
import { saveBuyNowProduct } from "@/utils/buyNow";

type BuyNowButtonProps = {
  product: ProductForCart;
  fullWidth?: boolean;
  dark?: boolean;
};

export default function BuyNowButton({
  product,
  fullWidth = false,
  dark = false,
}: BuyNowButtonProps) {
  const router = useRouter();

  const handleBuyNow = () => {
    saveBuyNowProduct(product);
    router.push("/checkout?mode=buy-now");
  };

  return (
    <button
      onClick={handleBuyNow}
      className={`px-6 py-4 text-center text-lg font-semibold uppercase tracking-wide ${
        dark ? "bg-black text-white" : "border border-black bg-white text-black"
      } ${fullWidth ? "w-full" : "w-fit rounded-full"}`}
    >
      Buy It Now
    </button>
  );
}