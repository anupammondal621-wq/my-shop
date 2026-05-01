"use client";

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <section className="border-t border-black">
      <div className="border-b border-black px-5 py-6 sm:px-8">
        <div className="flex flex-wrap justify-center text-[16px] sm:justify-start">
          {[
            "Returns policy",
            "Refund policy",
            "Terms of service",
            "Shipping policy",
            "Contact information",
          ].map((item, index, arr) => (
            <div key={item} className="flex items-center">
              <button
                onClick={() => router.push("/search")}
                className="hover:underline"
              >
                {item}
              </button>

              {index !== arr.length - 1 && (
                <span className="mx-2 text-black/70">•</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 sm:px-8">
        <p className="text-[16px]">© 2026 BongoMithai. All rights reserved.</p>
      </div>
    </section>
  );
}