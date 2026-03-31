"use client";

import { use, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import { useRouter } from "next/navigation";

const products = {
  "product-one": {
    slug: "product-one",
    brand: "BongoMithai",
    name: "MITHAI BAR - KAJU KATLI",
    price: "₹249",
    image: "/product-1.jpg",
    description: [
      "1 x bar of kajukatli made out of cashewnuts & sugar",
      "Shelf life : 7 days",
    ],
    packSizes: ["Pack of 1"],
  },
  "product-two": {
    slug: "product-two",
    brand: "BongoMithai",
    name: "ASSORTED MITHAI - BOX OF 16",
    price: "₹1149",
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
    name: "ASSORTED MITHAI - BOX OF 8",
    price: "₹649",
    image: "/product-3.jpg",
    description: ["A curated box of assorted mithai.", "Shelf life : 7 days"],
    packSizes: ["Box of 8"],
  },
  "product-four": {
    slug: "product-four",
    brand: "BongoMithai",
    name: "GAJAR HALWA IN CAN",
    price: "₹199",
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
    name: "PRODUCT FIVE",
    price: "₹299",
    image: "/product-5.jpg",
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-six": {
    slug: "product-six",
    brand: "BongoMithai",
    name: "PRODUCT SIX",
    price: "₹399",
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

  if (!product) {
    return <main className="p-6">Product not found.</main>;
  }

  return (
    <main className="min-h-screen bg-white text-black pt-[0px]">
      <div className="grid min-h-[calc(100vh-70px)] grid-cols-1 lg:grid-cols-2">
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

        <div>
          <div className="px-5 py-4 text-sm">
            {product.brand}
          </div>

          <div className="border-b border-black px-5 py-4">
            <h1 className="text-2xl uppercase tracking-wide">{product.name}</h1>
          </div>

          <button
            type="button"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="flex w-full items-center justify-between border-b border-black px-5 py-4 text-left"
          >
            <span className="text-sm uppercase tracking-wide">DESCRIPTION</span>
            <span className="text-sm">{isDescriptionOpen ? "▼" : "▲"}</span>
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

          <div className="px-5 py-8">
            <p className="text-3xl font-medium">{product.price}</p>
          </div>

          <div className="px-5 pb-8">
            <label className="mb-3 block text-xl font-semibold">Pack Size</label>
            <select className="w-full border border-black px-4 py-4 text-lg outline-none">
              {product.packSizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="px-5 pb-5">
            <div className="mb-3 w-full">
              <AddToCartButton product={product} fullWidth />
            </div>

            <div className="w-full">
              <BuyNowButton product={product} fullWidth dark />
            </div>
          </div>
        </div>
      </div>

      <section className="w-full border-b border-black bg-[#f3f3f3]">
        <div className="border-b border-black py-4 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-semibold uppercase tracking-[0.15em]"
          >
            Back to Top
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-black">
          <div className="px-5 py-8 sm:px-8 lg:border-r lg:border-black">
            <div className="space-y-6 text-[16px] leading-8">
              <p>
                <span className="font-semibold">Contact</span> : +91 9775534553
              </p>
              <p>
                <span className="font-semibold">Email</span> : support@bongomithai.com
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