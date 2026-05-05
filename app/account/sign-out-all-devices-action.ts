"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signOutAllDevices() {
  const supabase = await createClient();

  await supabase.auth.signOut({
    scope: "global",
  });

  redirect("/login");
}