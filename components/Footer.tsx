"use client";

import { useRouter } from "next/navigation";

const footerLinks = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Refund policy", href: "/refund-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
  { label: "Shipping policy", href: "/shipping-policy" },
  { label: "Contact information", href: "/contact-information" },
];

export default function Footer() {
  const router = useRouter();

  return (
    <section className="border-t border-black">
      <div className="border-b border-black px-5 py-6 sm:px-8">
        <div className="flex flex-wrap justify-center text-[16px] sm:justify-start">
          {footerLinks.map((item, index) => (
            <div key={item.label} className="flex items-center">
              <button
                onClick={() => router.push(item.href)}
                className="hover:underline"
              >
                {item.label}
              </button>

              {index !== footerLinks.length - 1 && (
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