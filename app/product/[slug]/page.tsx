"use client";

import { use, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import { useRouter } from "next/navigation";

const products = {
  "product-one": {
    slug: "product-one",
    brand: "BongoMithai",
    name: "Kaju Katli - Box of 18",
    price: "Rs. 499.00",
    buttonPrice: "Rs. 499",
    image: "/product-1.jpg",
    description: [
      "18 pieces of bite sized , mini Kaju katli made out of Cashewnuts & Suga",
      "Shelf life : 7 days",
    ],
    packSizes: ["Pack of 1"],
  },
  "product-two": {
    slug: "product-two",
    brand: "BongoMithai",
    name: "Kaju Katli - Box of 36",
    price: "Rs. 899.00",
    buttonPrice: "Rs. 899",
    image: "/product-2.jpg",
    description: [
      "A premium assorted mithai selection for festive gifting.",
      "Shelf life : 7 days",
    ],
    packSizes: ["Box of 16"],
  },
  "product-three": {
    slug: "product-three",
    brand: "BongoMithai",
    name: "Mysore Pak - Box of 6",
    price: "Rs. 399.00",
    buttonPrice: "Rs. 399",
    image: "/product-3.jpg",
    description: ["A curated box of assorted mithai.", "Shelf life : 7 days"],
    packSizes: ["Box of 8"],
  },
  "product-four": {
    slug: "product-four",
    brand: "BongoMithai",
    name: "Mysore Pak - Box of 12",
    price: "Rs. 749.00",
    buttonPrice: "Rs. 749",
    image: "/product-4.jpg",
    description: [
      "Classic gajar halwa packed for convenience.",
      "Shelf life : 7 days",
    ],
    packSizes: ["Can of 1"],
  },
  "product-five": {
    slug: "product-five",
    brand: "BongoMithai",
    name: "Pistabarfi - Box of 6",
    price: "Rs. 899.00",
    buttonPrice: "Rs. 899",
    image: "/product-5.jpg",
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-six": {
    slug: "product-six",
    brand: "BongoMithai",
    name: "Pistabarfi - Box of 12",
    price: "Rs. 1699.00",
    buttonPrice: "Rs. 1699",
    image: "/product-6.jpg",
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-seven": {
    slug: "product-six",
    brand: "BongoMithai",
    name: "Khajur Barfi - Box of 6",
    price: "Rs. 399.00",
    buttonPrice: "Rs. 399",
    image: "/product-6.jpg",
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-eight": {
    slug: "product-six",
    brand: "BongoMithai",
    name: "Khajur Barfi - Box of 12",
    price: "Rs. 749.00",
    buttonPrice: "Rs. 749",
    image: "/product-6.jpg",
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-nine": {
    slug: "product-six",
    brand: "BongoMithai",
    name: "Matichur Laddu - Box of 6",
    price: "Rs. 739.00",
    buttonPrice: "Rs. 399",
    image: "/product-6.jpg",
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-ten": {
    slug: "product-six",
    brand: "BongoMithai",
    name: "Matichur Laddu - Box of 12",
    price: "Rs. 749.00",
    buttonPrice: "Rs. 749",
    image: "/product-6.jpg",
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },

};

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const { slug } = use(params);
  const product = products[slug as keyof typeof products];

  const relatedProducts = useMemo(() => {
    return Object.values(products)
      .filter((item) => item.slug !== slug)
      .slice(0, 4);
  }, [slug]);

  if (!product) {
    return <main className="p-6">Product not found.</main>;
  }

  return (
    <main className="min-h-screen bg-white text-black pt-[0px]">
      <div className="grid min-h-[calc(100vh-70px)] grid-cols-1 lg:grid-cols-2">
        
        {/* IMAGE */}
        <div className="relative border-b border-r border-black lg:border-b-0">
          <div className="relative h-[500px] w-full lg:h-[calc(100vh-70px)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>

          {/* BRAND + SHARE */}
          <div className="px-5 py-4 flex items-center justify-between text-sm">
            <span>{product.brand}</span>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: product.name,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied!");
                }
              }}
              className="flex items-center gap-2 text-black text-sm hover:opacity-70"
              aria-label="Share"
            >
              {/* ICON */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 16V4" />
                <path d="M8 8l4-4 4 4" />
                <path d="M4 20h16" />
              </svg>

              <span>Share</span>
            </button>
          </div>

          {/* TITLE */}
          <div className="border-b border-black px-5 py-4">
            <h1 className="text-2xl tracking-wide">
              {product.name}
            </h1>
          </div>

          {/* DESCRIPTION */}
          <button
            type="button"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="flex w-full items-center justify-between border-b border-black px-5 py-4 text-left"
          >
            <span className="text-sm tracking-wide">
              Description
            </span>
            <span className="text-sm">
              {isDescriptionOpen ? "▲" : "▼"}
            </span>
          </button>

          {isDescriptionOpen && (
            <div className="border-b border-black px-5 py-8">
              <div className="space-y-6 text-base">
                {product.description.map((line, index) => (
                  <p key={index} className="font-medium">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* PRICE */}
<div className="px-5 py-6">
  <p className="text-2xl font-medium">{product.price}</p>

  <p className="mt-2 text-sm text-gray-600">
    Shipping calculated at checkout.
  </p>
</div>

          {/* BUTTONS */}
<div className="px-5 pb-5">
  <div className="mb-3 w-full">
    <AddToCartButton product={product} fullWidth />
  </div>

  <div className="w-full">
    <BuyNowButton product={product} fullWidth dark />
  </div>

  <p className="mt-3 text-sm text-gray-600 text-center">
    Additional delivery cost will apply at checkout.
  </p>
</div>
        </div>
      </div>

      {/* YOU MAY ALSO LIKE */}
      <section className="w-full bg-white">
        <div className="border-b border-t border-black px-6 py-4">
          <h2 className="text-sm tracking-widest">
            You may also like
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <div
              key={item.slug}
              className="group relative border-b border-r border-black"
            >
              <Link href={`/product/${item.slug}`} className="block">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-h-[110px] p-4">
                  <h3 className="text-[14px] tracking-wide">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-[14px]">{item.price}</p>
                </div>
              </Link>
            </div>
          ))}
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
      <div className="space-y-6 text-[16px] leading-8">
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
    <p className="text-[16px]">
      © 2026 BongoMithai. All rights reserved.
    </p>
  </div>
</section>
    </main>
  );
}