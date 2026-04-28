"use server";

import { createClient } from "@supabase/supabase-js";

type SubmitResult = { success: true } | { success: false; error: string };

export async function submitContactForm(formData: FormData): Promise<SubmitResult> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const subject = (formData.get("subject") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || !email || !message) {
    return { success: false, error: "Name, email, and message are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (message.length < 10) {
    return { success: false, error: "Message must be at least 10 characters." };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("contact_submissions").insert({
    full_name: name,
    email,
    subject: subject || null,
    message,
    submitted_at: new Date().toISOString(),
  });

  if (error) {
    console.error("contact_submissions insert error:", error.message);
    return { success: false, error: "Failed to send message. Please try again or email info@bapscharities.org." };
  }

  return { success: true };
}
