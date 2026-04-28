"use server";

import { createClient } from "@supabase/supabase-js";

type Result = { success: true } | { success: false; error: string };

export async function registerInterest2027(formData: FormData): Promise<Result> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const city = (formData.get("city") as string | null)?.trim() ?? "";

  if (!name || !email) return { success: false, error: "Name and email are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: "Please enter a valid email." };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("walkathon_interest_2027").insert({
    full_name: name,
    email,
    city: city || null,
    registered_at: new Date().toISOString(),
  });

  if (error) {
    console.error("walkathon_interest_2027 insert error:", error.message);
    return { success: false, error: "Registration failed. Please try again." };
  }

  return { success: true };
}
