"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { products, websiteSuggestions } from "@/utils/products";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const normalized = query.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalized) return [];

    return products.filter((product) =>
      [product.name, product.slug, product.pack]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(normalized))
    );
  }, [normalized]);

  const filteredSuggestions = useMemo(() => {
    if (!normalized) return [];

    const productSuggestions = products.map((p) => ({
      label: p.name,
      href: `/product/${p.slug}`,
    }));

    const combined = [...productSuggestions, ...websiteSuggestions];

    return combined
      .filter((item) => item.label.toLowerCase().includes(normalized))
      .filter(
        (item, index, arr) =>
          index ===
          arr.findIndex(
            (x) => x.label.toLowerCase() === item.label.toLowerCase()
          )
      )
      .slice(0, 6);
  }, [normalized]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/10">
      <div className="w-full bg-white">

        {/* ✅ SHORTER SEARCH BAR */}
        <div className="mx-auto flex h-[70px] w-[65%] max-w-[700px] items-center">
          <div className="flex max-h-[38px] w-full items-center border border-black px-3 py-1">
            
            <div className="flex-1">
              <label className="block text-[9px] leading-none text-black/50">
                Search
              </label>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mt-0.5 w-full border-none bg-transparent text-[16px] leading-none text-black outline-none placeholder:text-black/30"
              />
            </div>

            <div className="ml-3 flex items-center gap-3">
              {/* SEARCH */}
              <button className="text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20L15.8 15.8" />
                </svg>
              </button>

              {/* CLOSE */}
              <button onClick={onClose} className="text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                >
                  <path d="M6 6L18 18" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {normalized && (
          <div className="mx-auto mt-4 grid w-[65%] max-w-[700px] grid-cols-1 gap-10 pb-8 md:grid-cols-2">
            
            <div>
              <h3 className="mb-3 text-[11px] uppercase tracking-[0.2em] text-black/50">
                Suggestions
              </h3>

              <div className="flex flex-col gap-2.5">
                {filteredSuggestions.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={onClose}
                    className="text-[15px] hover:underline"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href={`/shop?search=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="mt-6 flex justify-between border-t border-black/20 pt-3 text-[14px]"
              >
                <span>Search for “{query}”</span>
                <span>→</span>
              </Link>
            </div>

            <div>
              <h3 className="mb-3 text-[11px] uppercase tracking-[0.2em] text-black/50">
                Products
              </h3>

              <div className="flex flex-col gap-3">
                {filteredProducts.slice(0, 6).map((product) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3"
                  >
                    <div className="relative h-12 w-12 bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <p className="text-[15px]">{product.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BACKDROP */}
      <div className="h-full w-full" onClick={onClose} />
    </div>
  );
}