"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { loadCart, CartItem } from "@/utils/cart";
import SearchOverlay from "@/components/SearchOverlay";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const updateCartCount = async () => {
      const cart: CartItem[] = await loadCart();
      const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount((prev) => {
        if (totalItems > prev) {
          setCartAnimate(false);

          setTimeout(() => {
            setCartAnimate(true);
          }, 10);
          
          setTimeout(() => {
            setCartAnimate(false);
          }, 700);
        }

        return totalItems;
      });
    };

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    updateCartCount();
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      subscription.unsubscribe();
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
      {/* local animation style */}
      <style jsx>{`
        @keyframes cartPop {
          0% { transform: translate(25%, 25%) scale(1); }
          25% { transform: translate(25%, 25%) scale(1.35); }
          50% { transform: translate(25%, 25%) scale(0.92); }
          75% { transform: translate(25%, 25%) scale(1.12); }
          100% { transform: translate(25%, 25%) scale(1); }
        }

        @keyframes sparkleOne {
          0% { opacity: 0; transform: translate(0, 0) scale(0.4); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translate(-8px, -10px) scale(1); }
        }

        @keyframes sparkleTwo {
          0% { opacity: 0; transform: translate(0, 0) scale(0.4); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translate(10px, -8px) scale(1); }
        }

        @keyframes sparkleThree {
          0% { opacity: 0; transform: translate(0, 0) scale(0.4); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translate(0, 10px) scale(1); }
        }

        .cart-badge-animate {
          animation: cartPop 0.6s ease;
        }

        .sparkle {
          position: absolute;
          pointer-events: none;
          color: #facc15;
          font-size: 10px;
          font-weight: bold;
          opacity: 0;
        }

        .sparkle-1 {
          right: 2px;
          top: -2px;
          animation: sparkleOne 0.6s ease-out;
        }

        .sparkle-2 {
          right: -6px;
          top: 8px;
          animation: sparkleTwo 0.6s ease-out;
        }

        .sparkle-3 {
          right: 10px;
          top: 10px;
          animation: sparkleThree 0.6s ease-out;
        }
      `}</style>

      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-50 h-[70px] border-b border-black bg-white text-black">
        <div className="relative flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* LEFT: HAMBURGER / CLOSE */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-start"
          >
            {menuOpen ? (
              <div className="flex h-4 w-5 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5">
                  <path d="M5 5L19 19" />
                  <path d="M5 19L19 5" />
                </svg>
              </div>
            ) : (
              <div className="flex h-4 w-5 flex-col justify-between">
                <span className="block h-[2px] w-full rounded bg-black" />
                <span className="block h-[2px] w-full rounded bg-black" />
                <span className="block h-[2px] w-full rounded bg-black" />
              </div>
            )}
          </button>

          {/* LOGO */}
          <Link href="/" className="absolute left-1/2 -translate-x-[58%] flex items-center whitespace-nowrap">
            <div className="flex items-center gap-1">
              <img src="/ANU_ultra_smooth.png" alt="Logo" className="h-14 w-auto sm:h-16" />
              <img src="/logo3.png" alt="Logo 3" className="h-9.5 w-auto sm:h-11.5" />
            </div>
          </Link>

          {/* RIGHT: SEARCH + CART */}
          <div className="flex items-center gap-4">
            
            {/* SEARCH */}
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L15.8 15.8" />
              </svg>
            </button>

            {/* CART */}
            <Link href="/cart" className="relative" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                <path d="M9 7a3 3 0 0 1 6 0" />
                <path d="M5 8h14l-1.2 10.5a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5L5 8Z" />
              </svg>

              {cartCount > 0 && (
                <>
                  <span
                    className={`absolute right-0 bottom-0 flex h-5 w-5 translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white ${
                      cartAnimate ? "cart-badge-animate" : ""
                    }`}
                  >
                    {cartCount}
                  </span>

                  {cartAnimate && (
                    <>
                      <span className="sparkle sparkle-1">✦</span>
                      <span className="sparkle sparkle-2">✦</span>
                      <span className="sparkle sparkle-3">✦</span>
                    </>
                  )}
                </>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* OVERLAY UNDER HEADER */}
      {menuOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-[70px] z-40 bg-black/30"
          onClick={() => setMenuOpen(false)}
        >
          {/* SIDEBAR */}
          <div
            className="h-full w-[82%] max-w-[320px] border-r border-black bg-white pt-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <nav className="flex flex-col gap-5 text-base">
                <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = "/shop";
                  }}
                  className="text-left"
                >
                  Shop
                </button>

                <Link href="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>

                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                    <Link href="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                  </>
                ) : (
                  <>
                    <Link href="/account" onClick={() => setMenuOpen(false)}>Account</Link>
                    <button type="button" onClick={handleLogout} className="text-left">Logout</button>
                  </>
                )}
              </nav>

              <div className="absolute bottom-0 left-0 w-full bg-gray-100 px-4 py-6 flex gap-5">
                {/* Instagram */}
                <a href="https://www.instagram.com/bongo_mithai/" target="_blank">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.7">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="black" stroke="none" />
                  </svg>
                </a>

                {/* Facebook */}
                <a href="https://www.facebook.com/profile.php?id=61567655514681" target="_blank">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="black">
                    <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7.3v3h2.8v8h3.4Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}