"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { products, websiteSuggestions } from "@/utils/products";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  const goToSearch = () => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      router.push("/shop");
    } else {
      router.push(`/shop?search=${encodeURIComponent(cleanQuery)}`);
    }

    onClose();
  };

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
        {/* 🔥 RESPONSIVE SEARCH BAR */}
        <div className="mx-auto flex h-[70px] w-[92%] max-w-[700px] items-center sm:w-[65%]">
          <div className="flex h-[44px] w-full items-center overflow-hidden border border-black px-3">
            {/* INPUT */}
            <div className="min-w-0 flex-1">
              <label className="block text-[9px] leading-none text-black/50">
                Search
              </label>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    goToSearch();
                  }
                }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="mt-0.5 block w-full min-w-0 border-none bg-transparent text-[18px] leading-tight text-black outline-none placeholder:text-black/30"
              />
            </div>

            {/* ICONS */}
            <div className="ml-3 flex shrink-0 items-center gap-3">
              {/* SEARCH ICON */}
              <button
                type="button"
                onClick={goToSearch}
                className="shrink-0 text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20L15.8 15.8" />
                </svg>
              </button>

              {/* CLOSE ICON */}
              <button onClick={onClose} className="shrink-0 text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
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
          <div className="mx-auto mt-4 grid w-[92%] max-w-[700px] grid-cols-1 gap-10 pb-8 sm:w-[65%] md:grid-cols-2">
            {/* SUGGESTIONS */}
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

              <button
                type="button"
                onClick={goToSearch}
                className="mt-6 flex w-full justify-between border-t border-black/20 pt-3 text-left text-[14px]"
              >
                <span>Search for “{query}”</span>
                <span>→</span>
              </button>
            </div>

            {/* PRODUCTS */}
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