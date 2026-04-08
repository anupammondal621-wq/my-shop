"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { loadCart, CartItem } from "@/utils/cart";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const updateCartCount = async () => {
      const cart: CartItem[] = await loadCart();
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
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
    setMenuOpen(false);
    window.dispatchEvent(new Event("cartUpdated"));
    window.location.href = "/";
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 h-[70px] border-b border-black bg-white text-black">
        <div className="relative flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LEFT: HAMBURGER / CLOSE */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center"
          >
            {menuOpen ? (
              <span className="text-3xl leading-none">×</span>
            ) : (
              <div className="flex h-4 w-5 flex-col justify-between">
                <span className="block h-[2px] w-full rounded bg-black" />
                <span className="block h-[2px] w-full rounded bg-black" />
                <span className="block h-[2px] w-full rounded bg-black" />
              </div>
            )}
          </button>

          {/* MIDDLE: LOGO + BRAND */}
          <Link
            href="/"
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap"
          >
            <img
              src="/logo_vector.svg"
              alt="Logo"
              className="h-14 w-auto sm:h-16"
            />
            <span className="text-lg font-bold sm:text-xl">BongoMithai</span>
          </Link>

          {/* RIGHT: SEARCH + CART */}
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <button
              type="button"
              onClick={() => (window.location.href = "/search")}
              aria-label="Search"
              className="shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L15.8 15.8" />
              </svg>
            </button>

            {/* CART */}
            <Link href="/cart" className="relative shrink-0" aria-label="Cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
              >
                <path d="M9 7a3 3 0 0 1 6 0" />
                <path d="M5 8h14l-1.2 10.5a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5L5 8Z" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute bottom-0 right-0 flex h-5 w-5 translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* OVERLAY UNDER HEADER */}
      {menuOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-[70px] z-40 bg-black/30"
          onClick={() => setMenuOpen(false)}
        >
          {/* SIDE MENU UNDER HEADER */}
          <div
            className="h-full w-[82%] max-w-[320px] border-r border-black bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="mt-2 flex flex-col gap-5 text-base">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>

              <Link href="/shop" onClick={() => setMenuOpen(false)}>
                Shop
              </Link>

              <Link href="/cart" onClick={() => setMenuOpen(false)}>
                Cart
              </Link>

              {!user ? (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>

                  <Link href="/signup" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/account" onClick={() => setMenuOpen(false)}>
                    Account
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}