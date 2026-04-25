import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading products...</div>}>
      <ShopClient />
    </Suspense>
  );
}