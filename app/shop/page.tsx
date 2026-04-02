"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/utils/cart";

const products = [
  {
    slug: "product-one",
    name: "AAM PAPAD STRIPS",
    price: "From ₹ 249.00",
    buttonPrice: "₹249",

    image: "/product-1.jpg",
  },
  {
    slug: "product-two",
    name: "ASSORTED MITHAI - BOX OF 16",
    price: "₹ 1149.00",
    buttonPrice: "₹1149",
    pack: "Box of 16 - Rs. 1149.00",
    image: "/product-2.jpg",
  },
  {
    slug: "product-three",
    name: "ASSORTED MITHAI - BOX OF 8",
    price: "₹ 649.00",
    buttonPrice: "₹649",
    pack: "Box of 8 - Rs. 649.00",
    image: "/product-3.jpg",
  },
  {
    slug: "product-four",
    name: "GAJAR HALWA IN CAN",
    price: "₹ 199.00",
    buttonPrice: "₹199",
    pack: "Can of 1 - Rs. 199.00",
    image: "/product-4.jpg",
  },
  {
    slug: "product-five",
    name: "PRODUCT FIVE",
    price: "₹ 299.00",
    buttonPrice: "₹299",
    pack: "Pack of 1 - Rs. 299.00",
    image: "/product-5.jpg",
  },
  {
    slug: "product-six",
    name: "PRODUCT SIX",
    price: "₹ 399.00",
    buttonPrice: "₹399",
    pack: "Pack of 1 - Rs. 399.00",
    image: "/product-6.jpg",
  },
];

const PRODUCTS_PER_PAGE = 8;

export default function Shop() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [currentPage]);

  const handleAddToCartAndGoCart = async (product: {
    slug: string;
    name: string;
    buttonPrice: string;
    image: string;
  }) => {
    await addToCart({
      slug: product.slug,
      name: product.name,
      price: product.buttonPrice,
      image: product.image,
    });

    window.dispatchEvent(new Event("cartUpdated"));
    router.push("/cart");
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="border-b border-black px-6 py-4">
        <h1 className="text-sm uppercase tracking-widest">Products</h1>
      </div>

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
              </div>

              <div className="min-h-[110px] p-4">
                <h2 className="text-[14px] uppercase tracking-wide">
                  {product.name}
                </h2>
                <p className="mt-3 text-[14px]">{product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
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

      {/* BACK TO TOP + FOOTER */}
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
          <div className="flex flex-wrap gap-8 text-[16px]">
            <button
              onClick={() => router.push("/search")}
              className="hover:underline"
            >
              Search
            </button>

            <button
              onClick={() => router.push("/returns")}
              className="hover:underline"
            >
              Returns
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