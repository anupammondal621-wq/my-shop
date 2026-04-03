"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { addToCart } from "@/utils/cart";

type ProductType = {
  slug: string;
  name: string;
  price: string;
  buttonPrice: string;
  pack?: string;
  image: string;
};

const specials: ProductType[] = [
  {
    slug: "product-five",
    name: "HAMPER BOX",
    price: "Rs. 999.00",
    buttonPrice: "Rs. 999.00",
    image: "/product-5.jpg",
  },
  {
    slug: "product-six",
    name: "MITHAI BAR - KAJU KATLI",
    price: "From Rs. 249.00",
    buttonPrice: "Rs. 249.00",
    pack: "Pack of 1 - Rs. 249.00",
    image: "/product-6.jpg",
  },
  {
    slug: "product-one",
    name: "AAM PAPAD STRIPS",
    price: "From Rs. 249.00",
    buttonPrice: "Rs. 249.00",
    pack: "Pack of 1 - Rs. 249.00",
    image: "/product-1.jpg",
  },
  {
    slug: "product-four",
    name: "MYSORE PAK IN AN EASY OPEN CAN",
    price: "From Rs. 249.00",
    buttonPrice: "Rs. 199.00",
    pack: "Can of 1 - Rs. 199.00",
    image: "/product-4.jpg",
  },
];

const allProducts: ProductType[] = [
  {
    slug: "product-one",
    name: "PISTABARFI - BOX OF 6",
    price: "Rs. 899.00",
    buttonPrice: "Rs. 899.00",
    image: "/product-1.jpg",
  },
  {
    slug: "product-six",
    name: "KAJU KATLI - BOX OF 18",
    price: "Rs. 499.00",
    buttonPrice: "Rs. 499.00",
    pack: "Box of 18 - Rs. 499.00",
    image: "/product-6.jpg",
  },
  {
    slug: "product-five",
    name: "GUR LADOO - BOX OF 6",
    price: "Rs. 399.00",
    buttonPrice: "Rs. 399.00",
    pack: "Box of 6 - Rs. 399.00",
    image: "/product-5.jpg",
  },
  {
    slug: "product-four",
    name: "MYSORE PAK - BOX OF 12",
    price: "Rs. 749.00",
    buttonPrice: "Rs. 749.00",
    pack: "Box of 12 - Rs. 749.00",
    image: "/product-4.jpg",
  },
];

const faqs = [
  {
    question: "Where are you based, and do you have a physical store?",
    answer:
      "We are based out of Mumbai. At the moment, we operate as a cloud kitchen, which allows us to make everything fresh and to order. We currently do not have a physical retail store.",
  },
  {
    question: "Where do you deliver, and how long does delivery take?",
    answer:
      "We deliver pan-India and also internationally.\n\nMumbai: Delivery within 2 days\nOther cities in India: Delivery within 3–4 days\n\nAll our products are made to order and shipped with care to maintain freshness and quality.",
  },
  {
    question: "Do you take bulk, corporate, or B2B orders?",
    answer:
      "Yes, we do. We handle bulk gifting, wedding favours, corporate gifting, and B2B orders. Customisation options are available, and we offer special pricing for bulk orders.",
  },
];

const galleryImages = [
  "/product-1.jpg",
  "/product-2.jpg",
  "/product-3.jpg",
  "/product-4.jpg",
  "/product-5.jpg",
  "/product-6.jpg",
  "/product-7.jpg",
  "/product-8.jpeg",
  "/product-9.jpeg",
];

export default function Home() {
  const router = useRouter();

  const [heroSwiper, setHeroSwiper] = useState<SwiperType | null>(null);
  const [productSwiper, setProductSwiper] = useState<SwiperType | null>(null);
  const [gallerySwiper, setGallerySwiper] = useState<SwiperType | null>(null);

  const [activeSlide, setActiveSlide] = useState(1);
  const [openFAQs, setOpenFAQs] = useState<number[]>([]);

  const totalSlides = 2;

  const handleAddToCartAndGoCart = async (product: ProductType) => {
    await addToCart({
      slug: product.slug,
      name: product.name,
      price: product.buttonPrice,
      image: product.image,
    });

    window.dispatchEvent(new Event("cartUpdated"));
    router.push("/cart");
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQs((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

const ProductCard = ({ product }: { product: ProductType }) => {
  return (
    <div className="group relative flex h-full flex-col bg-[#f3f3f3]">
      <Link href={`/product/${product.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex h-[132px] flex-col justify-between p-4">
          <h3 className="min-h-[44px] text-[14px] uppercase tracking-wide leading-5">
            {product.name}
          </h3>
          <p className="mt-3 text-[14px]">{product.price}</p>
        </div>
      </Link>
    </div>
  );
};

  return (
    <main className="w-full bg-white text-black">
      {/* HERO */}
      <section className="h-[62vh] w-full sm:h-[75vh] lg:h-screen">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          loop={true}
          className="h-full w-full"
          onSwiper={setHeroSwiper}
          onSlideChange={(swiperInstance) => {
            setActiveSlide(swiperInstance.realIndex + 1);
          }}
        >
          <SwiperSlide>
            <div className="relative h-full w-full">
              <img
                src="/1.webp"
                className="h-full w-full object-cover object-[center_35%] sm:object-center"
                alt="Slide 1"
              />

              <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-10">
                <button
                  onClick={() => router.push("/product/product-one")}
                  className="border border-black bg-white px-6 py-3 text-[13px] uppercase tracking-wide text-black transition-all duration-300 hover:bg-gray-200 sm:px-7 sm:py-4 sm:text-[14px]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative h-full w-full">
              <img
                src="/2.webp"
                className="h-full w-full object-cover object-[center_35%] sm:object-center"
                alt="Slide 2"
              />

              <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-10">
                <button
                  onClick={() => router.push("/shop")}
                  className="border border-black bg-white px-6 py-3 text-[13px] uppercase tracking-wide text-black transition-all duration-300 hover:bg-gray-200 sm:px-7 sm:py-4 sm:text-[14px]"
                >
                  Shop More
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* HERO SLIDER NAV */}
      <div className="flex items-center justify-between border-t border-b border-black px-6 py-3 text-sm">
        <button
          onClick={() => heroSwiper?.slidePrev()}
          className="px-2 py-1 hover:opacity-60"
          aria-label="Previous slide"
        >
          ←
        </button>

        <span>
          {activeSlide} / {totalSlides}
        </span>

        <button
          onClick={() => heroSwiper?.slideNext()}
          className="px-2 py-1 hover:opacity-60"
          aria-label="Next slide"
        >
          →
        </button>
      </div>

{/* PISTABARFI SPECIALS */}
<section className="w-full">
  <div className="border-b border-black px-6 py-4">
    <h2 className="text-sm uppercase tracking-widest">
      Pistabarfi Specials
    </h2>
  </div>

<div className="grid grid-cols-2 auto-rows-fr border-b border-black lg:grid-cols-4">
  {specials.map((product, index) => (
    <div
      key={`special-${product.slug}-${product.name}-${index}`}
      className={`
        h-full bg-[#f3f3f3]
        border-black
        ${index < specials.length - 2 ? "border-b" : ""}
        ${index % 2 === 0 ? "border-r" : ""}
        lg:border-b-0 lg:border-r
        lg:[&:nth-child(4n)]:border-r-0
      `}
    >
      <ProductCard product={product} />
    </div>
  ))}
</div>

  <div className="border-b border-black px-6 py-5 text-center">
    <button
      onClick={() => router.push("/shop")}
      className="text-sm font-medium hover:underline"
    >
      View all products
    </button>
  </div>
</section>

      {/* ALL PRODUCTS */}
      <section className="w-full overflow-hidden">
        <div className="flex items-center justify-between border-b border-black px-6 py-4">
          <h2 className="text-sm uppercase tracking-widest">All Products</h2>

          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => productSwiper?.slidePrev()}
              className="text-2xl leading-none"
              aria-label="Previous product"
            >
              ←
            </button>
            <button
              onClick={() => productSwiper?.slideNext()}
              className="text-2xl leading-none"
              aria-label="Next product"
            >
              →
            </button>
          </div>
        </div>

        {/* Mobile slider */}
        <div className="lg:hidden overflow-hidden">
          <Swiper
            onSwiper={setProductSwiper}
            slidesPerView="auto"
            spaceBetween={0}
            loop={false}
            allowTouchMove={true}
            touchStartPreventDefault={false}
            className="w-full"
          >
            {allProducts.map((product, index) => (
<SwiperSlide
  key={`all-mobile-${product.slug}-${product.name}-${index}`}
  className={`
    !w-[86%]
    border-b border-black
    ${index !== allProducts.length - 1 ? "border-r border-black" : ""}
  `}
>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop grid */}
<div className="hidden lg:grid lg:grid-cols-4 border-b border-black">
  {allProducts.map((product, index) => (
    <div
      key={`all-desktop-${product.slug}-${product.name}-${index}`}
      className={`
        border-r border-black
        last:border-r-0
      `}
    >
      <ProductCard product={product} />
    </div>
  ))}
</div>
      </section>

      {/* MOVING TEXT SECTION */}
      <section className="w-full overflow-hidden border-b border-black bg-white py-4">
        <div className="flex w-max flex-nowrap animate-marquee whitespace-nowrap">
          <div className="flex items-center shrink-0">
            <span className="mx-6 text-[18px] font-normal tracking-wide">
              Wedding Announcements / Corporate Gifting / Customizations ·
            </span>
            <span className="mx-6 text-[18px] font-normal tracking-wide">
              Weddings / Birth Announcements / Corporate Gifting /
              Customizations ·
            </span>
            <span className="mx-6 text-[18px] font-normal tracking-wide">
              Wedding Announcements / Corporate Gifting / Customizations ·
            </span>
            <span className="mx-6 text-[18px] font-normal tracking-wide">
              Weddings / Birth Announcements / Corporate Gifting /
              Customizations ·
            </span>
          </div>

          <div className="flex items-center shrink-0">
            <span className="mx-6 text-[18px] font-normal tracking-wide">
              Wedding Announcements / Corporate Gifting / Customizations ·
            </span>
            <span className="mx-6 text-[18px] font-normal tracking-wide">
              Weddings / Birth Announcements / Corporate Gifting /
              Customizations ·
            </span>
            <span className="mx-6 text-[18px] font-normal tracking-wide">
              Wedding Announcements / Corporate Gifting / Customizations ·
            </span>
            <span className="mx-6 text-[18px] font-normal tracking-wide">
              Weddings / Birth Announcements / Corporate Gifting /
              Customizations ·
            </span>
          </div>
        </div>
      </section>

{/* GIFTING SECTION */}
<section className="w-full border-b border-black">
  <div className="grid grid-cols-1 lg:grid-cols-2">
    
    {/* IMAGE (now on left) */}
    <div className="relative min-h-[420px] border-b border-black lg:min-h-[540px] lg:border-b-0 lg:border-r">
      <Image
        src="/product-7.jpg"
        alt="Gifting with Pistabarfi"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
    </div>

    {/* TEXT (now on right) */}
    <div className="flex items-start bg-[#f5f5f5] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="max-w-[640px]">
        <h2 className="text-[24px] uppercase tracking-wide sm:text-[28px]">
          Gifting with Pistabarfi
        </h2>

        <div className="mt-8 space-y-6 text-[16px] leading-8 text-black">
          <p>
            At Pistabarfi, we create thoughtful, customised pieces for
            wedding favours, birth announcements, corporate gifting etc.
            Everything can be personalised, whether it&apos;s a name, a
            logo, or a detail that makes it uniquely yours.
          </p>

          <p>For more details, feel free to get in touch.</p>

          <p>
            You can watch one of the weddings we worked on by clicking the
            button below.
          </p>
        </div>

        <button
          onClick={() => router.push("/contact")}
          className="mt-10 bg-black px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
        >
          Contact Us
        </button>
      </div>
    </div>

  </div>
</section>

      {/* TWO IMAGE SECTION */}
      <section className="w-full border-b border-black">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="border-b border-black lg:border-b-0 lg:border-r">
            <Image
              src="/product-8.jpeg"
              alt="Product 8"
              width={1000}
              height={1000}
              className="h-auto w-full"
            />
          </div>

          <div>
            <Image
              src="/product-9.jpeg"
              alt="Product 9"
              width={1000}
              height={1000}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* FEATURES / BRAND LOGOS SECTION */}
      <section className="w-full border-t border-b border-black bg-[#f3f3f3]">
        <div className="border-b border-black py-4 text-center">
          <h2 className="text-sm uppercase tracking-[0.2em]">Features</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="flex items-center justify-center px-6 py-10">
            <Image
              src="/logos/vogue.png"
              alt="Vogue"
              width={160}
              height={60}
              className="w-[120px] object-contain"
            />
          </div>

          <div className="flex items-center justify-center px-6 py-10">
            <Image
              src="/logos/sharktank.png"
              alt="Shark Tank India"
              width={160}
              height={60}
              className="w-[120px] object-contain"
            />
          </div>

          <div className="flex items-center justify-center px-6 py-10">
            <Image
              src="/logos/puma.png"
              alt="Puma"
              width={140}
              height={60}
              className="w-[110px] object-contain"
            />
          </div>

          <div className="flex items-center justify-center px-6 py-10">
            <Image
              src="/logos/nykaa.png"
              alt="Nykaa"
              width={140}
              height={60}
              className="w-[110px] object-contain"
            />
          </div>

          <div className="col-span-2 flex items-center justify-center px-6 py-10 md:col-span-1">
            <Image
              src="/logos/ikea.png"
              alt="IKEA"
              width={140}
              height={60}
              className="w-[110px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="w-full border-b border-black bg-[#f3f3f3]">
        <div className="border-b border-black px-4 py-5 sm:px-6">
          <h2 className="text-sm uppercase tracking-[0.2em]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-black md:min-h-[335px] md:border-b-0 md:border-r last:md:border-r-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center gap-3 px-5 py-5 text-left sm:px-8"
              >
                <span className="text-[13px] leading-6 sm:text-[14px]">
                  {openFAQs.includes(index) ? "▼" : "▶"}
                </span>

                <span className="text-[14px] font-semibold leading-6 sm:text-[15px]">
                  {index + 1}. {faq.question}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFAQs.includes(index) ? "max-h-[500px] pb-8" : "max-h-0"
                }`}
              >
                <div className="px-5 sm:px-8">
                  <p className="whitespace-pre-line text-[14px] leading-8 sm:text-[15px]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-black py-5 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-medium hover:underline"
          >
            View all FAQ
          </button>
        </div>
      </section>

      {/* BACK TO TOP + IMAGE SLIDER SECTION */}
      <section className="w-full border-b border-black bg-[#f3f3f3]">
        <div className="border-b border-black py-4 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-semibold uppercase tracking-[0.15em]"
          >
            Back to Top
          </button>
        </div>

        <div className="relative bg-white px-[8px] py-[8px]">
          <button
            onClick={() => gallerySwiper?.slidePrev()}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black bg-white text-black transition hover:opacity-80"
            aria-label="Previous gallery slide"
          >
            ←
          </button>

          <button
            onClick={() => gallerySwiper?.slideNext()}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black bg-white text-black transition hover:opacity-80"
            aria-label="Next gallery slide"
          >
            →
          </button>

<Swiper
  modules={[Autoplay]}
  onSwiper={setGallerySwiper}
  loop={true}
  speed={700}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  }}
  allowTouchMove={true}
  spaceBetween={8}
  slidesPerView={2} // default (mobile)
  breakpoints={{
    640: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 5,
    },
  }}
  slidesPerGroup={1}
  className="w-full"
>
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
<div className="bg-white aspect-[5/7] w-full relative">
  <Image
    src={image}
    alt={`Gallery image ${index + 1}`}
    fill
    className="object-cover"
  />
</div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <section className="w-full border-b border-black bg-[#f3f3f3]">
        <div className="grid grid-cols-1 border-b border-black lg:grid-cols-2">
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

        <div className="border-b border-black px-5 py-6 sm:px-8">
          <div className="flex flex-wrap justify-end gap-8 text-[16px] text-right">
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
          <p className="text-right text-[16px]">
            © 2026 BongoMithai. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}