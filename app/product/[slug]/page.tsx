"use client";

import { use, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type ProductType = {
  slug: string;
  brand: string;
  name: string;
  price: number;
  buttonPrice: string;
  image: string[];
  inStock?: boolean;
  description: string[];
  packSizes: string[];
};


const products: Record<string, ProductType> = {
  "product-one": {
    slug: "product-one",
    brand: "BongoMithai",
    name: "Kaju Katli - Box of 18",
    price: 499,
    buttonPrice: "Rs. 499",
    image: ["/Kaju6_1.jpeg",
      "/Kaju6_1-2.jpeg",
      "/Kaju6_1-2-3.jpeg",
    ],
    //inStock: false,
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
    price: 899,
    buttonPrice: "Rs. 899",
    image: ["/product-2.jpg",],
    inStock: false,
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
    price: 399,
    buttonPrice: "Rs. 399",
    image: ["/product-3.jpg",],
    description: ["A curated box of assorted mithai.", "Shelf life : 7 days"],
    packSizes: ["Box of 8"],
    inStock: false,
  },
  "product-four": {
    slug: "product-four",
    brand: "BongoMithai",
    name: "Mysore Pak - Box of 12",
    price: 749,
    buttonPrice: "Rs. 749",
    image: ["/product-4.jpg",],
    inStock: false,
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
    price: 899,
    buttonPrice: "Rs. 899",
    image: ["/product-5.jpg",],
    inStock: false,
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-six": {
    slug: "product-six",
    brand: "BongoMithai",
    name: "Pistabarfi - Box of 12",
    price: 1699,
    buttonPrice: "Rs. 1699",
    image: ["/product-6.jpg",],
    inStock: false,
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-seven": {
    slug: "product-seven",
    brand: "BongoMithai",
    name: "Khajur Barfi - Box of 6",
    price: 399,
    buttonPrice: "Rs. 399",
    image: ["/product-6.jpg",],
    inStock: false,
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-eight": {
    slug: "product-eight",
    brand: "BongoMithai",
    name: "Khajur Barfi - Box of 12",
    price: 749,
    buttonPrice: "Rs. 749",
    image: ["/product-6.jpg",],
    inStock: false,
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-nine": {
    slug: "product-nine",
    brand: "BongoMithai",
    name: "Matichur Laddu - Box of 6",
    price: 739,
    buttonPrice: "Rs. 399",
    image: ["/product-6.jpg",],
    inStock: false,
    description: ["Premium sweet selection.", "Shelf life : 7 days"],
    packSizes: ["Pack of 1"],
  },
  "product-ten": {
    slug: "product-ten",
    brand: "BongoMithai",
    name: "Matichur Laddu - Box of 12",
    price: 749,
    buttonPrice: "Rs. 749",
    image: ["/product-6.jpg",],
    inStock: false,
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
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchMove, setTouchMove] = useState(0);
  const [initialSlide, setInitialSlide] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

const pinchStartDistance = useRef<number | null>(null);
const pinchStartScale = useRef(1);
const panStart = useRef<{ x: number; y: number } | null>(null);

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

  const nextImage = () => {
  setSelectedImage((prev) =>
    prev === product.image.length - 1 ? 0 : prev + 1
  );
};

const prevImage = () => {
  setSelectedImage((prev) =>
    prev === 0 ? product.image.length - 1 : prev - 1
  );
};

const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
  if (touchStart === null) return;
  setTouchMove(e.touches[0].clientX - touchStart);
};

const handleTouchEnd = () => {
  if (touchStart === null) return;

  if (touchMove > 80) prevImage();
  else if (touchMove < -80) nextImage();

  setTouchStart(null);
  setTouchMove(0);
};

const resetZoom = () => {
  setZoomScale(1);
  setZoomPosition({ x: 0, y: 0 });
};

const getDistance = (touches: React.TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const handleZoomTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
  if (e.touches.length === 2) {
    pinchStartDistance.current = getDistance(e.touches);
    pinchStartScale.current = zoomScale;
  }

  if (e.touches.length === 1 && zoomScale > 1) {
    panStart.current = {
      x: e.touches[0].clientX - zoomPosition.x,
      y: e.touches[0].clientY - zoomPosition.y,
    };
  }
};

const handleZoomTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
  if (e.touches.length === 2 && pinchStartDistance.current) {
    e.preventDefault();

    const distance = getDistance(e.touches);
    const newScale =
      pinchStartScale.current * (distance / pinchStartDistance.current);

    setZoomScale(Math.min(Math.max(newScale, 1), 4));
  }

  if (e.touches.length === 1 && zoomScale > 1 && panStart.current) {
    e.preventDefault();

const newX = e.touches[0].clientX - panStart.current.x;
const newY = e.touches[0].clientY - panStart.current.y;

const maxMove = (zoomScale - 1) * 180;

setZoomPosition({
  x: Math.max(-maxMove, Math.min(maxMove, newX)),
  y: Math.max(-maxMove, Math.min(maxMove, newY)),
});
  }
};

const handleZoomTouchEnd = () => {
  pinchStartDistance.current = null;
  panStart.current = null;

  if (zoomScale <= 1) {
    resetZoom();
  }
};

const toggleZoom = () => {
  if (zoomScale > 1) {
    resetZoom();
  } else {
    setZoomScale(2);
  }
};

  return (
    <main className="min-h-screen bg-white text-black pt-[0px]">
      <div className="grid min-h-[calc(100vh-70px)] grid-cols-1 lg:grid-cols-2">
{/* IMAGE */}
<div className="relative border-b border-r border-black lg:border-b-0">
  <div className="relative h-[500px] w-full lg:h-[calc(100vh-70px)]">
    <Swiper
      modules={[Navigation, Pagination]}
      loop={true}
      navigation={{
  prevEl: ".custom-swiper-prev",
  nextEl: ".custom-swiper-next",
}}
      pagination={{ clickable: true }}
className="h-full w-full"
onSlideChange={(swiper) => setInitialSlide(swiper.realIndex)}
onClick={() => setIsImageOpen(true)}
    >
      {product.image.map((img, index) => (
        <SwiperSlide key={img}>
          <div className="relative h-full w-full">
            <Image
              src={img}
              alt={`${product.name} ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>

    <style jsx global>{`
  .swiper-pagination-bullet-active {
    background: white !important;
  }
`}</style>

<button
  type="button"
  className="custom-swiper-prev absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-3xl font-light text-white backdrop-blur-sm transition hover:bg-black/70"
>
  ‹
</button>

<button
  type="button"
  className="custom-swiper-next absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-3xl font-light text-white backdrop-blur-sm transition hover:bg-black/70"
>
  ›
</button>

    {product.inStock === false && (
      <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white">
        Sold out
      </div>
    )}
  </div>
</div>

        {/* RIGHT SIDE */}
        <div>
          {/* BRAND + SHARE */}
          <div className="flex items-center justify-between px-5 py-4 text-sm">
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
              className="flex items-center gap-2 text-sm text-black hover:opacity-70"
              aria-label="Share"
            >
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
            <h1 className="text-2xl tracking-wide">{product.name}</h1>
          </div>

          {/* DESCRIPTION */}
          <button
            type="button"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="flex w-full items-center justify-between border-b border-black px-5 py-4 text-left"
          >
            <span className="text-sm tracking-wide">Description</span>
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
            <p className="text-2xl font-medium">Rs. {product.price.toFixed(2)}</p>

            <p className="mt-2 text-sm text-gray-600">
              Shipping calculated at checkout.
            </p>

            <div className="mt-6">
              <p className="mb-2 text-sm text-black">
                Quantity ({quantity} in cart)
              </p>

              <div className="flex h-[46px] w-[140px] items-center justify-between border border-black px-4">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="text-[20px] leading-none text-black"
                  disabled={product.inStock === false}
                >
                  -
                </button>

                <span className="text-[14px] leading-none text-black">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="text-[20px] leading-none text-black"
                  disabled={product.inStock === false}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="px-5 pb-5">
            {product.inStock === false ? (
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-full bg-gray-400 px-6 py-4 text-[18px] font-medium text-white"
              >
                Sold out
              </button>
            ) : (
              <>
                <div className="mb-3 w-full">
                  <AddToCartButton
                    product={{
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.image[0],
                      quantity,
                    }}
                    fullWidth
                  />
                </div>

                <div className="w-full">
                  <BuyNowButton
                    product={{
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.image[0],
                      quantity,
                    }}
                    fullWidth
                    dark
                  />
                </div>
              </>
            )}

            <p className="mt-3 text-center text-sm text-gray-600">
              Additional delivery cost will apply at checkout.
            </p>
          </div>
        </div>
      </div>

      {/* YOU MAY ALSO LIKE */}
      <section className="w-full bg-white">
        <div className="border-b border-t border-black px-6 py-4">
          <h2 className="text-sm tracking-widest">You may also like</h2>
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
                    src={item.image[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />

                  {item.inStock === false && (
                    <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white">
                      Sold out
                    </div>
                  )}
                </div>

                <div className="min-h-[110px] p-4">
                  <h3 className="text-[14px] tracking-wide">{item.name}</h3>
                  <p className="mt-3 text-[14px]">
                    Rs. {item.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* BACK TO TOP + FOOTER */}
      <section>
        <div className="border-b border-black py-4 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-semibold uppercase tracking-[0.15em]"
          >
            Back to Top
          </button>
        </div>
 </section>

      {/* FOOTER SECTION */}
      <section className="w-full bg-[#f3f3f3]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="px-5 py-6 sm:px-8 lg:border-r lg:border-black">
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

          <div className="px-5 py-8 sm:px-8">
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
        </div>
      </section>

{isImageOpen && (
  <div className="fixed inset-0 z-[9999] bg-black">
    <button
      type="button"
      onClick={() => {
  setIsImageOpen(false);
  resetZoom();
}}
      className="absolute right-5 top-5 z-30 text-3xl text-white"
    >
      ×
    </button>

<Swiper
  modules={[Navigation, Pagination]}
  loop={true}
  initialSlide={initialSlide}
  allowTouchMove={true}
  noSwiping={true}
  noSwipingClass="zoom-no-swiper"
  onSlideChange={resetZoom}
      navigation={{
        prevEl: ".fullscreen-swiper-prev",
        nextEl: ".fullscreen-swiper-next",
      }}
      pagination={{ clickable: true }}
      className="h-full w-full"
    >
      {product.image.map((img, index) => (
        <SwiperSlide key={img}>
<div
  className={`relative h-full w-full overflow-hidden ${
  zoomScale > 1 ? "zoom-no-swiper" : ""
}`}
  onTouchStart={handleZoomTouchStart}
  onTouchMove={handleZoomTouchMove}
  onTouchEnd={handleZoomTouchEnd}
  onDoubleClick={toggleZoom}
>
<div
  className="relative h-full w-full"
  style={{
    transform: `translate3d(${zoomPosition.x}px, ${zoomPosition.y}px, 0) scale(${zoomScale})`,
    transformOrigin: "center center",
    touchAction: "none",
    willChange: "transform",
  }}
>
    <Image
      src={img}
      alt={`${product.name} ${index + 1}`}
      fill
      className="object-contain"
      draggable={false}
    />
  </div>
</div>
        </SwiperSlide>
      ))}
    </Swiper>

    <button
      type="button"
      className="fullscreen-swiper-prev absolute left-4 top-1/2 z-30 -translate-y-1/2 text-5xl text-white"
    >
      ‹
    </button>

    <button
      type="button"
      className="fullscreen-swiper-next absolute right-4 top-1/2 z-30 -translate-y-1/2 text-5xl text-white"
    >
      ›
    </button>
  </div>
)}

    </main>
  );
}