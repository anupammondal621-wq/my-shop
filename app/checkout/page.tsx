"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loadCart, CartItem } from "@/utils/cart";
import { clearBuyNowProduct } from "@/utils/buyNow";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { createClient } from "@/utils/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [billingSame, setBillingSame] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [showManualAddress, setShowManualAddress] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  const getCheckoutAddress = async () => {
    const res = await fetch("/api/user/checkout-address");
    const data = await res.json();

    if (data?.user?.email) {
      setIsLoggedIn(true);
      setUserEmail(data.user.email);

      if (data.shippingDetails?.address) {
        setForm(data.shippingDetails);
        setShowManualAddress(false);
      } else {
        setForm((prev) => ({
          ...prev,
          email: data.user.email,
        }));
        setShowManualAddress(true);
      }
    } else {
      setIsLoggedIn(false);
      setShowManualAddress(true);

      const savedShipping = localStorage.getItem("checkout_shipping");
      if (savedShipping) {
        setForm(JSON.parse(savedShipping));
      }
    }
  };

  getProductsForCheckout();
  getCheckoutAddress();
}, []);

  const subtotal: number = useMemo(() => {
    return cart.reduce((total: number, item: CartItem) => {
      const numericPrice = Number(String(item.price).replace(/[^\d.]/g, ""));
      return total + numericPrice * item.quantity;
    }, 0);
  }, [cart]);

  const shipping = subtotal > 0 && subtotal >= 1400 ? 0 : subtotal > 0 ? 199 : 0;
  const estimatedTax = subtotal * 0.05;
  const total = subtotal + shipping + estimatedTax;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    localStorage.setItem("checkout_shipping", JSON.stringify(updated));
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const existingScript = document.getElementById("razorpay-checkout-script");

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
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

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load.");
        return;
      }

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
  totalAmount: total,
}),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Checkout failed");
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: data.name,
        description: data.description,
        order_id: data.orderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        notes: {
          address: `${form.address} ${form.apartment}`.trim(),
          city: form.city,
          state: form.state,
          postal_code: form.postalCode,
          country: form.country,
        },
        theme: {
          color: "#000000",
        },
        handler: async function (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              mode,
              buyNowProduct,
              totalAmount: total,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (!verifyResponse.ok) {
            alert(verifyData.error || "Payment verification failed");
            return;
          }

          localStorage.removeItem("checkout_shipping");

          if (mode === "buy-now") {
            clearBuyNowProduct();
          }

          window.location.href = verifyData.redirectUrl || "/checkout/success";
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while starting payment.");
    } finally {
      setLoading(false);
    }
  };

const handleLogout = async () => {
  const supabase = createClient();

  await supabase.auth.signOut();

  localStorage.removeItem("checkout_shipping");

  router.refresh();
  router.push("/");
};

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT CHECKOUT FORM */}
        <section className="px-6 py-10 sm:px-10 lg:px-12">
          <div className="max-w-[650px] lg:ml-auto lg:mr-10">
{/* CONTACT */}
{isLoggedIn ? (
    <div className="mb-8 border-b border-gray-300 pb-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">
          {userEmail.charAt(0).toUpperCase()}
        </div>

        <p className="text-sm no-underline break-all">
  {userEmail}
</p>
      </div>

<div className="relative">
  <button
    type="button"
    onClick={() => setShowMenu(!showMenu)}
    className="text-xl"
  >
    ⋮
  </button>

  {showMenu && (
    <div className="absolute right-0 mt-2 w-32 rounded-lg border bg-white shadow-lg">
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
      >
        Sign out
      </button>
    </div>
  )}
</div>
    </div>
  </div>
) : (
  <div className="mb-8">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Contact</h2>
      <button
        type="button"
        onClick={() => router.push("/login?redirect=/checkout")}
        className="text-sm text-black-600 underline"
      >
        Sign in
      </button>
    </div>

    <input
      name="email"
      type="email"
      placeholder="Email"
      value={form.email}
      onChange={handleChange}
      className="w-full rounded-lg border border-gray-300 px-4 py-4 outline-none focus:border-blue-600"
    />
  </div>
)}

{/* DELIVERY */}
{isLoggedIn && !showManualAddress ? (
  <div className="mb-8">
    <p className="mb-2 text-sm text-gray-600">Ship to</p>

    <div className="rounded-lg bg-[#f4f6ff] p-4 text-sm">
      <p>
        {form.firstName} {form.lastName}, {form.address}
        {form.apartment ? `, ${form.apartment}` : ""}
      </p>

      <p>
        {form.postalCode} {form.city} {form.state}, IN
      </p>

      <span className="mt-2 inline-block rounded-full bg-gray-600 px-2 py-1 text-xs text-white">
        Default
      </span>
    </div>

    <button
      type="button"
      onClick={() => setShowManualAddress(true)}
      className="mt-5 text-sm text-blue-600"
    >
      + Use a different address
    </button>
  </div>
) : (
  <div className="mb-8">
    <h2 className="mb-4 text-2xl font-semibold">Delivery</h2>

    <div className="space-y-4">
      <select
        name="country"
        value={form.country}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-4 outline-none"
      >
        <option>India</option>
      </select>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="firstName"
          placeholder="First name"
          value={form.firstName}
          onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-4 outline-none"
        />

        <input
          name="lastName"
          placeholder="Last name"
          value={form.lastName}
          onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-4 outline-none"
        />
      </div>

      <input
        placeholder="Company (optional)"
        className="w-full rounded-lg border border-gray-300 px-4 py-4 outline-none"
      />

      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-4 outline-none"
      />

      <input
        name="apartment"
        placeholder="Apartment, suite, etc. (optional)"
        value={form.apartment}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-4 outline-none"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-4 outline-none"
        />

        <select
          name="state"
          value={form.state}
          onChange={handleChange}
          className="rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none"
        >
          <option value="">Select State</option>
          <option>Andhra Pradesh</option>
          <option>Arunachal Pradesh</option>
          <option>Assam</option>
          <option>Bihar</option>
          <option>Chhattisgarh</option>
          <option>Goa</option>
          <option>Gujarat</option>
          <option>Haryana</option>
          <option>Himachal Pradesh</option>
          <option>Jharkhand</option>
          <option>Karnataka</option>
          <option>Kerala</option>
          <option>Madhya Pradesh</option>
          <option>Maharashtra</option>
          <option>Manipur</option>
          <option>Meghalaya</option>
          <option>Mizoram</option>
          <option>Nagaland</option>
          <option>Odisha</option>
          <option>Punjab</option>
          <option>Rajasthan</option>
          <option>Sikkim</option>
          <option>Tamil Nadu</option>
          <option>Telangana</option>
          <option>Tripura</option>
          <option>Uttar Pradesh</option>
          <option>Uttarakhand</option>
          <option>West Bengal</option>
          <option>Andaman and Nicobar Islands</option>
          <option>Chandigarh</option>
          <option>Dadra and Nagar Haveli and Daman and Diu</option>
          <option>Delhi</option>
          <option>Jammu and Kashmir</option>
          <option>Ladakh</option>
          <option>Lakshadweep</option>
          <option>Puducherry</option>
        </select>

        <input
          name="postalCode"
          placeholder="PIN code"
          value={form.postalCode}
          onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-4 outline-none"
        />
      </div>

      <div className="relative group">
        <PhoneInput
          country={"in"}
          value={form.phone}
          onChange={(phone) => {
            const updated = { ...form, phone };
            setForm(updated);
            localStorage.setItem(
              "checkout_shipping",
              JSON.stringify(updated)
            );
          }}
          inputProps={{
            name: "phone",
            required: true,
          }}
          inputClass="!w-full !h-[58px] !rounded-lg !border !border-gray-300 !pl-14 !pr-12 !text-base !outline-none"
          buttonClass="!rounded-l-lg !border-gray-300"
          dropdownClass="!text-black"
        />

        <span className="absolute right-4 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-gray-400 text-xs text-gray-600">
          ?
        </span>

        <div className="absolute right-0 -top-16 hidden w-52 rounded-lg bg-black p-2 text-xs text-white group-hover:block">
          In case we need to contact you about your order
        </div>
      </div>
    </div>
  </div>
)}

            {/* SHIPPING METHOD */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Shipping method</h2>

              <div className="flex items-center justify-between rounded-lg border border-black bg-[#f4f6ff] px-4 py-4">
                <span>{shipping === 0 ? "Free Shipping" : "Standard"}</span>
                <span className="font-semibold">
                  {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="mb-8 flex items-center gap-3">
              <input
                type="checkbox"
                id="saveInfo"
                className="h-5 w-5 rounded border-gray-300"
              />
              <label htmlFor="saveInfo" className="text-sm text-gray-700">
                Save this information for next time
              </label>
            </div>

            {/* PAYMENT */}
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-semibold">Payment</h2>
              <p className="mb-4 text-sm text-gray-600">
                All transactions are secure and encrypted.
              </p>

              <div className="overflow-hidden rounded-lg border border-black">
                <div className="flex items-center justify-between bg-[#f4f6ff] px-4 py-4">
                  <span>Razorpay Payment Gateway (UPI, Cards & NetBanking)</span>
                  <span className="text-sm font-semibold">UPI</span>
                </div>

                <div className="bg-gray-50 px-4 py-5 text-center text-sm">
                  You'll be redirected to Razorpay Payment Gateway to complete
                  your purchase.
                </div>
              </div>
            </div>

            {/* BILLING ADDRESS */}
            <div className="mb-10">
              <h2 className="mb-4 text-xl font-semibold">Billing address</h2>

              <div className="overflow-hidden rounded-lg border border-gray-300">
                <label
                  className={`flex cursor-pointer items-center gap-3 px-4 py-4 ${
                    billingSame ? "bg-[#f4f6ff]" : "bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="billingAddress"
                    checked={billingSame}
                    onChange={() => setBillingSame(true)}
                  />
                  Same as shipping address
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 border-t border-gray-300 px-4 py-4 ${
                    !billingSame ? "bg-[#f4f6ff]" : "bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="billingAddress"
                    checked={!billingSame}
                    onChange={() => setBillingSame(false)}
                  />
                  Use a different billing address
                </label>

                {!billingSame && (
                  <div className="space-y-4 border-t border-gray-300 bg-[#f4f4f4] p-4">
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none">
                      <option>India</option>
                    </select>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        placeholder="First name"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none"
                      />
                      <input
                        placeholder="Last name"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none"
                      />
                    </div>

                    <input
                      placeholder="Company (optional)"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none"
                    />

                    <input
                      placeholder="Address"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none"
                    />

                    <input
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none"
                    />

                    <div className="grid gap-4 sm:grid-cols-3">
                      <input
                        placeholder="City"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none"
                      />

                      <select className="rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none">
                        <option value="">Select State</option>
                        <option>Andhra Pradesh</option>
                        <option>Arunachal Pradesh</option>
                        <option>Assam</option>
                        <option>Bihar</option>
                        <option>Chhattisgarh</option>
                        <option>Goa</option>
                        <option>Gujarat</option>
                        <option>Haryana</option>
                        <option>Himachal Pradesh</option>
                        <option>Jharkhand</option>
                        <option>Karnataka</option>
                        <option>Kerala</option>
                        <option>Madhya Pradesh</option>
                        <option>Maharashtra</option>
                        <option>Manipur</option>
                        <option>Meghalaya</option>
                        <option>Mizoram</option>
                        <option>Nagaland</option>
                        <option>Odisha</option>
                        <option>Punjab</option>
                        <option>Rajasthan</option>
                        <option>Sikkim</option>
                        <option>Tamil Nadu</option>
                        <option>Telangana</option>
                        <option>Tripura</option>
                        <option>Uttar Pradesh</option>
                        <option>Uttarakhand</option>
                        <option>West Bengal</option>
                        <option>Andaman and Nicobar Islands</option>
                        <option>Chandigarh</option>
                        <option>Dadra and Nagar Haveli and Daman and Diu</option>
                        <option>Delhi</option>
                        <option>Jammu and Kashmir</option>
                        <option>Ladakh</option>
                        <option>Lakshadweep</option>
                        <option>Puducherry</option>
                      </select>

                      <input
                        placeholder="PIN code"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none"
                      />
                    </div>

                    <div className="relative group">
                      <PhoneInput
                        country={"in"}
                        value={form.phone}
                        onChange={(phone) => {
                          const updated = { ...form, phone };
                          setForm(updated);
                          localStorage.setItem(
                            "checkout_shipping",
                            JSON.stringify(updated)
                          );
                        }}
                        inputProps={{
                          name: "phone",
                          required: true,
                        }}
                        inputClass="!w-full !h-[58px] !rounded-lg !border !border-gray-300 !pl-14 !pr-12 !text-base !outline-none"
                        buttonClass="!rounded-l-lg !border-gray-300"
                        dropdownClass="!text-black"
                      />

                      <span className="absolute right-4 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-gray-400 text-xs text-gray-600">
                        ?
                      </span>

                      <div className="absolute right-0 -top-16 hidden w-52 rounded-lg bg-black p-2 text-xs text-white group-hover:block">
                        In case we need to contact you about your order
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT ORDER SUMMARY */}
        <aside className="border-l border-gray-200 bg-[#f5f5f5] px-6 py-10 sm:px-10 lg:px-12">
          <div className="max-w-[520px] lg:mr-auto">
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={72}
                        height={72}
                        className="h-[72px] w-[72px] rounded-lg border object-cover"
                      />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <p>{item.name}</p>
                  </div>

                  <p>
                    ₹
                    {(
                      Number(String(item.price).replace(/[^\d.]/g, "")) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <input
                placeholder="Discount code"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-4 outline-none"
              />
              <button className="rounded-lg bg-gray-200 px-6 font-semibold text-gray-600">
                Apply
              </button>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated taxes</span>
                <span>₹{estimatedTax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between pt-5 text-2xl font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleContinueToPayment}
                disabled={loading || cart.length === 0}
                className="mt-8 w-full rounded-lg bg-black px-6 py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay now"}
              </button>
            </div>
          </div>
        </aside>
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