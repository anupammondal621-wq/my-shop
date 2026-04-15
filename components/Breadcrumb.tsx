"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const productNameMap: Record<string, string> = {
  "product-one": "Kaju Katli - Box of 18",
  "product-two": "Kaju Katli - Box of 36",
  "product-three": "Mysore Pak - Box of 6",
  "product-four": "Mysore Pak - Box of 12",
  "product-five": "Pistabarfi - Box of 6",
  "product-six": "Pistabarfi - Box of 12",
  "product-seven": "Khajur Barfi - Box of 6",
  "product-eight": "Khajur Barfi - Box of 12",
  "product-nine": "Matichur Laddu - Box of 6",
  "product-ten": "Matichur Laddu - Box of 12",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const rawSegments = pathname.split("/").filter(Boolean);

  const formatName = (segment: string, index: number) => {
    const isLast = index === rawSegments.length - 1;
    const previousSegment = rawSegments[index - 1];

    if (segment === "product") return "Shop";

    if (isLast && previousSegment === "product" && productNameMap[segment]) {
      return productNameMap[segment];
    }

    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getHref = (index: number) => {
    const currentSegment = rawSegments[index];

    if (currentSegment === "product") {
      return "/shop";
    }

    return "/" + rawSegments.slice(0, index + 1).join("/");
  };

  return (
    <div className="border-b border-black bg-white px-6 py-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:underline">
          Home
        </Link>

        {rawSegments.map((segment, index) => {
          const href = getHref(index);
          const isLast = index === rawSegments.length - 1;
          const label = formatName(segment, index);

          return (
            <div key={href + index} className="flex items-center gap-2">
              <span>&gt;</span>
              {isLast ? (
                <span className="font-medium">{label}</span>
              ) : (
                <Link href={href} className="hover:underline">
                  {label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}