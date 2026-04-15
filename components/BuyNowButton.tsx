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
  className={`h-[48px] rounded-full text-[16px] font-medium transition ${
    dark
      ? "bg-black text-white hover:opacity-90"
      : "bg-white text-black border border-black hover:bg-black hover:text-white"
  } ${fullWidth ? "w-full" : "px-6"}`}
>
  Buy it now
</button>
  );
}