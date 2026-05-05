"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { createClient } from "@/utils/supabase/client";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

export default function EditAddressModal({ address }: any) {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPhoneHint, setShowPhoneHint] = useState(false);
  const [isDefault, setIsDefault] = useState(Boolean(address.is_default));

  const [form, setForm] = useState({
    firstName: address.first_name || "",
    lastName: address.last_name || "",
    company: address.company || "",
    phone: address.phone || "",
    address: address.address || "",
    apartment: address.apartment || "",
    city: address.city || "",
    state: address.state || "",
    postalCode: address.postal_code || "",
    country: address.country || "India",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const supabase = createClient();

    if (isDefault) {
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", address.user_id);
    }

    const { error } = await supabase
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
        is_default: isDefault,
      })
      .eq("id", address.id);

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    window.location.reload();
  };

  const handleDelete = async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("user_addresses")
      .delete()
      .eq("id", address.id)
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    setShowDeleteModal(false);
    setOpen(false);
    window.location.reload();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute right-4 top-4 text-blue-600"
      >
        ✎
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
          <div className="max-h-[90vh] w-full max-w-[800px] overflow-y-auto rounded-xl bg-white p-7 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Edit address</h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-3xl leading-none text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-4 outline-blue-600"
              >
                <option>India</option>
              </select>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="rounded-lg border border-gray-300 px-4 py-4 outline-blue-600"
                />

                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="rounded-lg border border-gray-300 px-4 py-4 outline-blue-600"
                />
              </div>

              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company (optional)"
                className="w-full rounded-lg border border-gray-300 px-4 py-4 outline-blue-600"
              />

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full rounded-lg border border-gray-300 px-4 py-4 outline-blue-600"
              />

              <input
                name="apartment"
                value={form.apartment}
                onChange={handleChange}
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full rounded-lg border border-gray-300 px-4 py-4 outline-blue-600"
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="rounded-lg border border-gray-300 px-4 py-4 outline-blue-600"
                />

                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-4 outline-blue-600"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>

                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="PIN code"
                  className="rounded-lg border border-gray-300 px-4 py-4 outline-blue-600"
                />
              </div>

              <div className="relative">
                <PhoneInput
                  country="in"
                  value={form.phone}
                  onChange={(phone) => setForm({ ...form, phone })}
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

            <div className="mt-7 flex items-end justify-between">
<div>
  <label className="mb-4 flex items-center gap-3 text-sm">
    <input
      type="checkbox"
      checked={isDefault}
      onChange={(e) => setIsDefault(e.target.checked)}
      className="h-5 w-5 rounded border-gray-300"
    />
    This is my default address
  </label>

  <button
    type="button"
    onClick={handleDelete}
    className="text-red-600 hover:underline"
  >
    Delete
  </button>
</div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-blue-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdate}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[480px] rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Delete address?</h2>

              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="text-3xl leading-none text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            <p className="mb-6 text-sm text-gray-700">
              Existing orders are not affected.
            </p>

            <div className="flex items-center justify-end gap-5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="text-sm text-blue-600"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
              >
                Delete address
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}