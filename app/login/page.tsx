"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mergeGuestCartIntoUserCart } from "@/utils/cart";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    await mergeGuestCartIntoUserCart();

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "/account";

    router.push(redirect);
    router.refresh();
  };

  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      <div className="flex-1 px-6 pt-[100px] pb-12">
        <div className="mx-auto max-w-md rounded-2xl border p-8">
          <h1 className="mb-6 text-3xl font-semibold">Login</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border px-4 py-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border px-4 py-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-full bg-black px-6 py-3 text-white"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* FOOTER SECTION */}
      <section className="w-full border-t border-black bg-[#f3f3f3]">
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
    </main>
  );
}