"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { loadCart, CartItem } from "@/utils/cart";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const updateCartCount = async () => {
      const cart: CartItem[] = await loadCart();
      const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartCount(totalItems);
    };

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    updateCartCount();
    getUser();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.dispatchEvent(new Event("cartUpdated"));
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[70px] border-b bg-white text-black">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LEFT: TEXT + LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold sm:text-xl">
            BongoMithai
          </span>

          <img
            src="/logo_vector.svg"
            alt="Logo"
            className="h-12 w-auto"
          />
        </Link>

        {/* RIGHT: NAVIGATION */}
        <nav className="flex items-center gap-3 whitespace-nowrap text-xs font-medium sm:gap-6 sm:text-sm">
          <Link href="/" className="shrink-0">
            Home
          </Link>

          <Link href="/shop" className="shrink-0">
            Shop
          </Link>

          <Link href="/cart" className="relative shrink-0 pr-3">
            Cart
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-[11px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {!user ? (
            <>
              <Link href="/login" className="shrink-0">
                Login
              </Link>
              <Link href="/signup" className="shrink-0">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link href="/account" className="shrink-0">
                Account
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="shrink-0 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}