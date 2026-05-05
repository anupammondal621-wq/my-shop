import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null, shippingDetails: null });
  }

  const { data: profile } = await supabase
    .from("profiles")
.select(
  "first_name,last_name,company,phone,address,apartment,city,state,postal_code,country"
)
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
    },
    shippingDetails: profile
      ? {
          email: user.email || "",
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          company: profile.company || "",
          phone: profile.phone || "",
          address: profile.address || "",
          apartment: profile.apartment || "",
          city: profile.city || "",
          state: profile.state || "",
          postalCode: profile.postal_code || "",
          country: profile.country || "India",
        }
      : null,
  });
}