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
          {/* LEFT: HAMBURGER */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[4px]"
          >
            <span className="block h-[1.5px] w-6 bg-black" />
            <span className="block h-[1.5px] w-6 bg-black" />
            <span className="block h-[1.5px] w-6 bg-black" />
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
<button
  onClick={() => (window.location.href = "/search")}
  className="p-2 hover:opacity-70 transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.2}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20L16.5 16.5" />
  </svg>
</button>

<Link href="/cart" className="relative p-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.2}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path d="M6 8h12l-1 11H7L6 8Z" />
    <path d="M9 8V7a3 3 0 0 1 6 0v1" />
  </svg>

  {cartCount > 0 && (
    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">
      {cartCount}
    </span>
  )}
</Link>
          </div>
        </div>
      </header>

      {/* SIDE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/30" onClick={() => setMenuOpen(false)}>
          <div
            className="h-full w-[82%] max-w-[320px] border-r border-black bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <nav className="flex flex-col gap-5 text-base">
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