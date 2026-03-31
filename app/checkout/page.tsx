"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { loadCart, CartItem } from "@/utils/cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    const getProductsForCheckout = async () => {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");

      if (mode === "buy-now") {
        const raw = localStorage.getItem("buy_now_product");
        const buyNowProduct = raw ? JSON.parse(raw) : null;

        if (buyNowProduct) {
          setCart([buyNowProduct]);
          return;
        }
      }

      const data = await loadCart();
      setCart(data);
    };

    getProductsForCheckout();

    const savedShipping = localStorage.getItem("checkout_shipping");
    if (savedShipping) {
      setForm(JSON.parse(savedShipping));
    }
  }, []);

  const subtotal: number = useMemo(() => {
    return cart.reduce((total: number, item: CartItem) => {
      const numericPrice = Number(String(item.price).replace(/[^\d.]/g, ""));
      return total + numericPrice * item.quantity;
    }, 0);
  }, [cart]);

  const getShippingCost = (postalCode: string) => {
    if (!postalCode || postalCode.length < 2) return 0;

    const prefix = postalCode.slice(0, 2);

    if (prefix === "11" || prefix === "12") return 40;
    if (prefix === "40" || prefix === "41") return 60;

    return 90;
  };

  const shipping = subtotal > 0 ? getShippingCost(form.postalCode) : 0;
  const estimatedTax = subtotal * 0.18;
  const total = subtotal + shipping + estimatedTax;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    localStorage.setItem("checkout_shipping", JSON.stringify(updated));
  };

  const handleContinueToPayment = async () => {
    if (
      !form.email ||
      !form.firstName ||
      !form.lastName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.postalCode
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      localStorage.setItem("checkout_shipping", JSON.stringify(form));

      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");

      const buyNowRaw =
        mode === "buy-now" ? localStorage.getItem("buy_now_product") : null;
      const buyNowProduct = buyNowRaw ? JSON.parse(buyNowRaw) : null;

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingDetails: form,
          mode,
          buyNowProduct,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Checkout failed");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Something went wrong while starting payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Same top bar style as Shop page */}
      <div className="border-b border-black px-6 py-4">
        <h1 className="text-sm uppercase tracking-widest">Checkout</h1>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.25fr_0.85fr]">
        <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-8 text-4xl font-semibold tracking-tight">
            Delivery Details
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-xl font-semibold">Contact</h3>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">Shipping Address</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
                />
                <input
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
                />
              </div>

              <div className="mt-4 grid gap-4">
                <input
                  name="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
                />

                <input
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
                />

                <input
                  name="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={form.apartment}
                  onChange={handleChange}
                  className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
                  />
                  <input
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
                  />
                  <div>
                    <input
                      name="postalCode"
                      placeholder="PIN code"
                      value={form.postalCode}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Shipping and estimated tax are calculated based on your PIN
                      code.
                    </p>
                  </div>
                </div>

                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="rounded-2xl border border-black/10 px-4 py-3 outline-none"
                >
                  <option>India</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.slug}
                className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 p-3"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={72}
                    height={72}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">{item.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₹{shipping.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estimated Tax</span>
              <span className="font-medium">₹{estimatedTax.toFixed(2)}</span>
            </div>

            <div className="border-t border-black/10 pt-4">
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-semibold">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinueToPayment}
            disabled={loading || cart.length === 0}
            className="mt-8 w-full rounded-full bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Continue to Payment"}
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Secure payment powered by Stripe.
          </p>
        </aside>
      </div>
    </main>
  );
}