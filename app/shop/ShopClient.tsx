"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { products } from "@/utils/products";

const PRODUCTS_PER_PAGE = 8;

export default function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search")?.toLowerCase().trim() || "";
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedSearch = search.toLowerCase().trim();

  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) return products;

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.slug,
        product.pack,
        "category" in product ? product.category : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [normalizedSearch]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedSearch]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="border-b border-black px-6 py-4">
        <h1 className="text-sm uppercase tracking-widest">
          {normalizedSearch
            ? `Search Results for "${normalizedSearch}"`
            : "Products"}
        </h1>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <h2 className="text-lg font-medium uppercase tracking-wide">
            No products found
          </h2>

          <p className="mt-3 text-[14px]">
            We could not find any product matching "{normalizedSearch}".
          </p>

<button
  onClick={() => {
    window.location.href = "/shop";
  }}
  className="mt-6 border border-black px-5 py-3 text-sm uppercase tracking-wider transition hover:bg-black hover:text-white"
>
  View All Products
</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {currentProducts.map((product) => (
              <div
                key={product.slug}
                className="group relative border-b border-r border-black"
              >
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />

                    {product.inStock === false && (
                      <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white">
                        Sold out
                      </div>
                    )}
                  </div>

                  <div className="min-h-[110px] p-4">
                    <h2 className="text-[14px] tracking-wide">
                      {product.name}
                    </h2>

                    <p className="mt-3 text-[14px]">
                      Rs. {product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <section className="w-full border-b border-black bg-[#f3f3f3]">
              <div className="flex flex-wrap items-center justify-center gap-6 py-6 text-[16px]">
                {currentPage > 1 && (
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    className="hover:underline"
                  >
                    « Previous
                  </button>
                )}

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isActive = currentPage === pageNumber;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={
                        isActive
                          ? "flex h-10 w-10 items-center justify-center border border-black"
                          : "hover:underline"
                      }
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {currentPage < totalPages && (
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    className="hover:underline"
                  >
                    Next »
                  </button>
                )}
              </div>
            </section>
          )}
        </>
      )}

      <section className="w-full border-b border-black bg-[#f3f3f3]">
        <div className="border-b border-black py-4 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-semibold uppercase tracking-[0.15em]"
          >
            Back to Top
          </button>
        </div>

        <div className="grid grid-cols-1 border-b border-black lg:grid-cols-2">
          <div className="px-5 py-8 sm:px-8 lg:border-r lg:border-black">
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

          <div className="px-5 py-6 sm:px-8">
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
                className="w-full bg-black px-4 py-3 text-[18px] font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

<div className="border-b border-black px-5 py-6 sm:px-8">
  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[16px] sm:justify-start sm:gap-8">
    
    <button
      onClick={() => router.push("/search")}
      className="hover:underline"
    >
      Returns policy
    </button>

    <button
      onClick={() => router.push("/search")}
      className="hover:underline"
    >
      Refund policy
    </button>

    <button
      onClick={() => router.push("/search")}
      className="hover:underline"
    >
      Terms of service
    </button>

    <button
      onClick={() => router.push("/search")}
      className="hover:underline"
    >
      Shipping policy
    </button>

    <button
      onClick={() => router.push("/search")}
      className="hover:underline"
    >
      Contact information
    </button>
  </div>
</div>

        <div className="px-5 py-4 sm:px-8">
          <p className="text-[16px]">© 2026 BongoMithai. All rights reserved.</p>
        </div>
      </section>
    </main>
  );
}