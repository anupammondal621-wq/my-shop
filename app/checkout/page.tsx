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
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressMenu, setShowAddressMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPhoneHint, setShowPhoneHint] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [editingAddressId, setEditingAddressId] = useState("");
  const [showSavedAddresses, setShowSavedAddresses] = useState(true);
  const [modalIsDefault, setModalIsDefault] = useState(false);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
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

    const allAddresses = data.addresses || [];
    setAddresses(allAddresses);

    const defaultAddress =
      allAddresses.find((addr: any) => addr.is_default) || allAddresses[0];

    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);

      setForm({
        email: data.user.email || "",
        firstName: defaultAddress.first_name || "",
        lastName: defaultAddress.last_name || "",
        company: defaultAddress.company || "",
        phone: defaultAddress.phone || "",
        address: defaultAddress.address || "",
        apartment: defaultAddress.apartment || "",
        city: defaultAddress.city || "",
        state: defaultAddress.state || "",
        postalCode: defaultAddress.postal_code || "",
        country: defaultAddress.country || "India",
      });

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
          company: form.company,
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
  shippingDetails: form,
  cartItems: cart,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (!verifyResponse.ok) {
            alert(verifyData.error || "Payment verification failed");
            return;
          }

          const supabase = createClient();

const {
  data: { user },
} = await supabase.auth.getUser();

if (user) {
  await supabase.from("user_addresses").insert({
    user_id: user.id,
    first_name: form.firstName,
    last_name: form.lastName,
    company: form.company,
    phone: form.phone,
    address: form.address,
    apartment: form.apartment,
    city: form.city,
    state: form.state,
    postal_code: form.postalCode,
    country: form.country,
    is_default: false,
  });
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

const handleSetDefaultAddress = async (addressId: string) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("User not found");
    return;
  }

  const { error: clearError } = await supabase
    .from("user_addresses")
    .update({ is_default: false })
    .eq("user_id", user.id);

  if (clearError) {
    alert(clearError.message);
    return;
  }

  const { error: setError } = await supabase
    .from("user_addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (setError) {
    alert(setError.message);
    return;
  }

  setAddresses((prev) =>
    prev.map((addr) => ({
      ...addr,
      is_default: addr.id === addressId,
    }))
  );

  setSelectedAddressId(addressId);
};

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT CHECKOUT FORM */}
        <section className="px-6 py-10 sm:px-10 lg:px-12">
          <div className="max-w-[650px] lg:ml-auto lg:mr-10">
{/* CONTACT */}
{isLoggedIn ? (
    <div className="mb-8 pb-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 no-underline">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">
          {userEmail.charAt(0).toUpperCase()}
        </div>

<span className="text-sm break-all email-text">
  {userEmail}
</span>
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
<div className="mb-2 flex items-center justify-between">
  <p className="text-sm text-gray-600">Ship to</p>

  <button
    type="button"
    onClick={() => setShowSavedAddresses(!showSavedAddresses)}
    className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4f6ff] text-blue-600"
  >
    {showSavedAddresses ? "⌃" : "⌄"}
  </button>
</div>

{showSavedAddresses ? (
  <div className="space-y-3">

  {addresses.map((addr) => (
    <div
      key={addr.id}
      onClick={() => {
        setSelectedAddressId(addr.id);

        setForm({
          email: userEmail,
          firstName: addr.first_name || "",
          lastName: addr.last_name || "",
          company: addr.company || "",
          phone: addr.phone || "",
          address: addr.address || "",
          apartment: addr.apartment || "",
          city: addr.city || "",
          state: addr.state || "",
          postalCode: addr.postal_code || "",
          country: addr.country || "India",
        });
      }}
className={`relative cursor-pointer rounded-lg p-4 pl-11 pr-12 text-sm ${
  selectedAddressId === addr.id ? "bg-[#f4f6ff]" : "bg-white"
}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedAddressId(addr.id);
          setShowAddressMenu(!showAddressMenu);
        }}
        className="absolute right-3 top-3 text-xl"
      >
        ⋮
      </button>

      {showAddressMenu && selectedAddressId === addr.id && (
        <div className="absolute right-3 top-10 z-20 w-24 rounded-lg border bg-white py-2 shadow-lg">
<button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    setShowAddressMenu(false);
    setEditingAddressId(addr.id);
    setModalIsDefault(Boolean(addr.is_default));

    setForm({
      email: userEmail,
      firstName: addr.first_name || "",
      lastName: addr.last_name || "",
      company: addr.company || "",
      phone: addr.phone || "",
      address: addr.address || "",
      apartment: addr.apartment || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postal_code || "",
      country: addr.country || "India",
    });

    setShowAddressModal(true);
  }}
  className="block w-full px-4 py-2 text-left text-sm text-blue-600"
>
  Edit
</button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddressMenu(false);
              setShowDeleteConfirm(true);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-red-600"
          >
            Delete
          </button>
        </div>
      )}

      <span
  className={`absolute left-4 top-5 h-4 w-4 rounded-full border ${
    selectedAddressId === addr.id
      ? "border-blue-600 bg-blue-600"
      : "border-gray-300 bg-white"
  }`}
/>

      <p>
        {[
          `${addr.first_name} ${addr.last_name}`.trim(),
          addr.company,
          addr.address,
          addr.apartment,
        ]
          .filter(Boolean)
          .join(", ")}
      </p>

      <p className="text-gray-500">
        {[addr.postal_code, addr.city, addr.state, "IN"]
          .filter(Boolean)
          .join(" ")}
      </p>

{addr.is_default ? (
  <span className="mt-2 inline-block rounded-full bg-gray-600 px-2 py-1 text-xs text-white">
    Default
  </span>
) : (
  selectedAddressId === addr.id && (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleSetDefaultAddress(addr.id);
      }}
      className="mt-2 block text-sm text-blue-600"
    >
      Set as default
    </button>
  )
)}
    </div>
  ))}
  </div>
) : (
  <div className="pb-2 text-sm">
    <p>
      {[
        `${form.firstName} ${form.lastName}`.trim(),
        form.company,
        form.address,
        form.apartment,
        form.postalCode,
        form.city,
        form.state,
        "IN",
      ]
        .filter(Boolean)
        .join(", ")}
    </p>

    {form.phone && <p>+{form.phone}</p>}
  </div>
)}

<button
  type="button"
  onClick={() => {
  setEditingAddressId("");
  setModalIsDefault(false);
  setShowAddressModal(true);
}}
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
  name="company"
  placeholder="Company (optional)"
  value={form.company}
  onChange={handleChange}
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

<span
  onClick={() => setShowPhoneHint(!showPhoneHint)}
  className="absolute right-4 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-xs text-gray-600"
>
  ?
</span>

{showPhoneHint && (
  <div className="absolute right-0 -top-16 z-20 w-52 rounded-lg bg-black p-2 text-xs text-white">
    In case we need to contact you about your order
  </div>
)}
      </div>
    </div>
  </div>
)}

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

<span
  onClick={() => setShowPhoneHint(!showPhoneHint)}
  className="absolute right-4 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-xs text-gray-600"
>
  ?
</span>

{showPhoneHint && (
  <div className="absolute right-0 -top-16 z-20 w-52 rounded-lg bg-black p-2 text-xs text-white">
    In case we need to contact you about your order
  </div>
)}
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

{showAddressModal && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-3">
    <div className="w-full max-w-[640px] rounded-xl bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Add address</h2>

        <button
          type="button"
          onClick={() => setShowAddressModal(false)}
          className="text-3xl leading-none text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
        >
          <option>India</option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none"
          />

          <input
            name="lastName"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

<input
  name="company"
  placeholder="Company (optional)"
  value={form.company}
  onChange={handleChange}
  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
/>

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
        />

        <input
          name="apartment"
          placeholder="Apartment, suite, etc. (optional)"
          value={form.apartment}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
        />

        <div className="grid grid-cols-3 gap-3">
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none"
          />

          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none"
          >
            <option value="">State</option>
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
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

<div className="relative group">
  <PhoneInput
    country={"in"}
    value={form.phone}
    onChange={(phone) => {
      const updated = { ...form, phone };
      setForm(updated);
      localStorage.setItem("checkout_shipping", JSON.stringify(updated));
    }}
    inputProps={{
      name: "phone",
      required: true,
    }}
    inputClass="!w-full !h-[52px] !rounded-lg !border !border-gray-300 !pl-14 !pr-12 !text-base !outline-none"
    buttonClass="!rounded-l-lg !border-gray-300"
    dropdownClass="!text-black"
  />

<span
  onClick={() => setShowPhoneHint(!showPhoneHint)}
  className="absolute right-4 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-xs text-gray-600"
>
  ?
</span>

{showPhoneHint && (
  <div className="absolute right-0 -top-16 z-20 w-52 rounded-lg bg-black p-2 text-xs text-white">
    In case we need to contact you about your order
  </div>
)}
</div>

        <label className="flex items-center gap-3 text-sm">
          <input
  type="checkbox"
  checked={modalIsDefault}
  onChange={(e) => setModalIsDefault(e.target.checked)}
  className="h-5 w-5 rounded border-gray-300"
/>
          This is my default address
        </label>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowAddressModal(false)}
            className="rounded-lg border border-gray-300 px-4 py-4 font-semibold text-black-600"
          >
            Cancel
          </button>

          <button
            type="button"
onClick={async () => {
  if (
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

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  if (modalIsDefault) {
  await supabase
    .from("user_addresses")
    .update({ is_default: false })
    .eq("user_id", user.id);
}

  if (editingAddressId) {
    const { data: updatedAddress, error } = await supabase
      .from("user_addresses")
      .update({
        first_name: form.firstName,
        last_name: form.lastName,
        company: form.company,
        phone: form.phone,
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        postal_code: form.postalCode,
        country: form.country,
        is_default: modalIsDefault,
      })
      .eq("id", editingAddressId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

setAddresses((prev) =>
  prev.map((addr) => {
    if (addr.id === editingAddressId) {
      return updatedAddress;
    }

    if (modalIsDefault) {
      return { ...addr, is_default: false };
    }

    return addr;
  })
);

    setEditingAddressId("");
  } else {
    const { data: newAddress, error } = await supabase
      .from("user_addresses")
      .insert({
        user_id: user.id,
        first_name: form.firstName,
        last_name: form.lastName,
        company: form.company,
        phone: form.phone,
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        postal_code: form.postalCode,
        country: form.country,
        is_default: modalIsDefault,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
  }

  setShowManualAddress(false);
  setShowAddressModal(false);
}}
            className="rounded-lg bg-blue-600 px-4 py-4 font-semibold text-white"
          >
            Save address
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{showDeleteConfirm && (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4">
    <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-lg">
      <h3 className="mb-3 text-lg font-semibold">Delete address?</h3>

      <p className="mb-6 text-sm text-gray-600">
        Are you sure you want to delete this existing address?
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(false)}
          className="flex-1 rounded-lg border border-gray-300 py-3"
        >
          Cancel
        </button>

        <button
          type="button"
onClick={async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !selectedAddressId) return;

  const deletedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  const { error } = await supabase
    .from("user_addresses")
    .delete()
    .eq("id", selectedAddressId)
    .eq("user_id", user.id);

  if (error) {
    alert(error.message);
    return;
  }

  const remainingAddresses = addresses.filter(
    (addr) => addr.id !== selectedAddressId
  );

  if (deletedAddress?.is_default && remainingAddresses.length > 0) {
    const nextDefault = remainingAddresses[0];

    await supabase
      .from("user_addresses")
      .update({ is_default: true })
      .eq("id", nextDefault.id)
      .eq("user_id", user.id);

    nextDefault.is_default = true;
  }

  setAddresses(remainingAddresses);

  if (remainingAddresses.length > 0) {
    const nextSelected = remainingAddresses.find((addr) => addr.is_default) || remainingAddresses[0];

    setSelectedAddressId(nextSelected.id);

    setForm({
      email: user.email || "",
      firstName: nextSelected.first_name || "",
      lastName: nextSelected.last_name || "",
      company: nextSelected.company || "",
      phone: nextSelected.phone || "",
      address: nextSelected.address || "",
      apartment: nextSelected.apartment || "",
      city: nextSelected.city || "",
      state: nextSelected.state || "",
      postalCode: nextSelected.postal_code || "",
      country: nextSelected.country || "India",
    });

    setShowManualAddress(false);
  } else {
    setSelectedAddressId("");

    setForm({
      email: user.email || "",
      firstName: "",
      lastName: "",
      company: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    });

    setShowManualAddress(true);
  }

  setShowDeleteConfirm(false);
}}
          className="flex-1 rounded-lg bg-red-600 py-3 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


    </main>
  );
}