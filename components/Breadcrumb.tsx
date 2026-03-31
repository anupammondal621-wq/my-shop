"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const productNameMap: Record<string, string> = {
  "product-one": "MITHAI BAR - KAJU KATLI",
  "product-two": "ASSORTED MITHAI - BOX OF 16",
  "product-three": "ASSORTED MITHAI - BOX OF 8",
  "product-four": "GAJAR HALWA IN CAN",
  "product-five": "PRODUCT FIVE",
  "product-six": "PRODUCT SIX",
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