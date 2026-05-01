"use client";

import { useState } from "react";

export default function GuestPasswordSetupButton({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleClick = async () => {
    setSending(true);

    const res = await fetch("/api/auth/send-password-setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    setSending(false);

    if (res.ok) {
      setSent(true); // ✅ THIS HIDES BUTTON
    }
  };

  // ✅ AFTER CLICK → ONLY MESSAGE
  if (sent) {
    return (
      <p className="text-sm text-gray-600">
        Password setup email sent. Please check your inbox.
      </p>
    );
  }

  // ✅ BEFORE CLICK → SHOW BUTTON
  return (
    <button
      onClick={handleClick}
      disabled={sending}
      className="rounded-full bg-black px-6 py-3 text-white disabled:opacity-50"
    >
      {sending ? "Sending..." : "Create your account to see your orders"}
    </button>
  );
}