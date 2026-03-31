import type { ProductForCart } from "@/utils/cart";

export function saveBuyNowProduct(product: ProductForCart) {
  localStorage.setItem("buy_now_product", JSON.stringify({
    ...product,
    quantity: 1,
  }));
}

export function getBuyNowProduct() {
  const raw = localStorage.getItem("buy_now_product");
  return raw ? JSON.parse(raw) : null;
}

export function clearBuyNowProduct() {
  localStorage.removeItem("buy_now_product");
}