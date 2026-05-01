"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordClient() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Preparing password setup...");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const setupSession = async () => {
      const code = searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setMessage(error.message);
          setReady(false);
          return;
        }

        setReady(true);
        setMessage("");
        return;
      }

      const hashParams = new URLSearchParams(
        window.location.hash.substring(1)
      );

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setMessage(error.message);
          setReady(false);
          return;
        }

        setReady(true);
        setMessage("");
        return;
      }

      setMessage(
        "Invalid or expired password setup link. Please request a new link."
      );
      setReady(false);
    };

    setupSession();
  }, [searchParams, supabase]);

  const updatePassword = async () => {
    if (!password) {
      setMessage("Please enter a password.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password set successfully. Redirecting...");

    setTimeout(() => {
      window.location.href = "/account";
    }, 800);
  };

  return (
    <main className="min-h-screen bg-white px-6 pt-[120px] text-black">
      <div className="mx-auto max-w-md rounded-2xl border p-6">
        <h1 className="mb-4 text-2xl font-semibold">Set password</h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!ready}
          className="mb-4 w-full rounded-lg border px-4 py-3"
        />

        <button
          onClick={updatePassword}
          disabled={!ready}
          className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-50"
        >
          Set password
        </button>

        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </main>
  );
}