"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type EditProfileModalProps = {
  email: string;
  fullName: string;
};

export default function EditProfileModal({ email, fullName }: EditProfileModalProps) {
  const [open, setOpen] = useState(false);

  const nameParts = (fullName || "").trim().split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");

  const handleSave = async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

const { error } = await supabase.from("profiles").upsert({
  id: user.id,
  first_name: firstName,
  last_name: lastName,
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
      <button type="button" onClick={() => setOpen(true)} className="text-blue-600 hover:underline">
        ✎
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-[800px] rounded-xl bg-white p-7 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Edit profile</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-3xl leading-none text-gray-500 hover:text-black">
                ×
              </button>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="rounded-lg border border-gray-300 px-4 py-4 text-base outline-blue-600" />
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="rounded-lg border border-gray-300 px-4 py-4 text-base outline-blue-600" />
            </div>

            <div className="mb-2 rounded-lg border border-gray-300 px-4 py-3">
              <p className="text-sm text-gray-500">Email</p>
              <p>{email}</p>
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-blue-600">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}