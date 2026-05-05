"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { createClient } from "@/utils/supabase/client";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export default function AddAddressModal() {
  const [open, setOpen] = useState(false);
  const [showPhoneHint, setShowPhoneHint] = useState(false);
  const [isDefault, setIsDefault] = useState(true);

  const [form, setForm] = useState({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
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

if (isDefault) {
  await supabase
    .from("user_addresses")
    .update({ is_default: false })
    .eq("user_id", user.id);
}

const { error } = await supabase.from("user_addresses").insert({
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
  is_default: isDefault,
});

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    window.location.reload();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-medium text-blue-600"
      >
        + Add
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="max-h-[90vh] w-full max-w-[800px] overflow-y-auto rounded-xl bg-white p-7 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Add address</h2>

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

              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300"
                />
                This is my default address
              </label>
            </div>

            <div className="mt-7 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-blue-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}