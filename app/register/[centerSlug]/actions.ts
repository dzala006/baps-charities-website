"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/app/lib/supabase-admin";
import { sendMailgunEmail } from "@/app/lib/mailgun";
import {
  REGISTRATION_SUBJECT,
  renderConfirmationHtml,
} from "@/app/lib/walkRegistrationEmail";
import {
  validateRegistration,
  ageFromDob,
  ageGroupFor,
  classifyMinor,
  type FormInput,
} from "@/app/lib/registrationValidation";
import { FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE } from "@/app/lib/featureFlags";

interface ActionState {
  ok: boolean;
  errors?: Record<string, string>;
  message?: string;
}

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(token: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const bypass = process.env.TURNSTILE_DEV_BYPASS === "true";
  if (bypass) return true;
  if (!secret) {
    console.warn(
      "[register] TURNSTILE_SECRET_KEY not set; rejecting submission. Set TURNSTILE_DEV_BYPASS=true for dev.",
    );
    return false;
  }
  if (!token || typeof token !== "string") return false;
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch (err) {
    console.error("[register] turnstile verify failed", String(err));
    return false;
  }
}

function formInputFromFormData(fd: FormData): FormInput {
  const get = (k: string) => (fd.get(k) as string | null)?.toString() ?? "";
  const checked = (k: string) => fd.get(k) === "on" || fd.get(k) === "true";
  return {
    participantName: get("participantName").trim(),
    email: get("email").trim(),
    phone: get("phone").trim(),
    dateOfBirth: get("dateOfBirth"),
    shirtSize: get("shirtSize"),
    fundraisingTargetDollars: get("fundraisingTargetDollars"),
    waiverConsent: checked("waiverConsent"),
    guardianName: get("guardianName").trim(),
    guardianEmail: get("guardianEmail").trim(),
    guardianPhone: get("guardianPhone").trim(),
    guardianConsent: checked("guardianConsent"),
    coppaSelfAttest: checked("coppaSelfAttest"),
    coppaDataConsent: checked("coppaDataConsent"),
  };
}

export async function submitRegistration(
  centerSlug: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Hard gate at the action level — even if the form was somehow loaded
  // (cached HTML, etc.) when the flag is off, refuse to write.
  if (!FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE) {
    return { ok: false, message: "Registration is not enabled on this site." };
  }

  const input = formInputFromFormData(formData);
  const errors = validateRegistration(input);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, message: "Please correct the highlighted fields." };
  }

  const turnstileToken =
    (formData.get("cf-turnstile-response") as string | null) ??
    (formData.get("turnstileToken") as string | null);
  const captchaOk = await verifyTurnstile(turnstileToken);
  if (!captchaOk) {
    return { ok: false, message: "Captcha verification failed. Please try again." };
  }

  const supabase = getSupabaseAdmin();

  // Resolve center
  const { data: center, error: centerErr } = await supabase
    .from("centers")
    .select("id, name, slug, city, state")
    .eq("slug", centerSlug)
    .maybeSingle();
  if (centerErr || !center) {
    return { ok: false, message: `We couldn't find a center for "${centerSlug}".` };
  }

  // Resolve active walkathon (year 2026, status='Open')
  const { data: walkathon, error: walkErr } = await supabase
    .from("walkathons")
    .select("id, year, name, national_event_date")
    .eq("status", "Open")
    .order("year", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (walkErr || !walkathon) {
    return {
      ok: false,
      message: "Walkathon registration is not currently open. Please check back later.",
    };
  }

  const age = ageFromDob(input.dateOfBirth);
  const ageGroup = ageGroupFor(age);
  const minorClass = classifyMinor(age);
  const isMinor = minorClass !== "adult";

  const fundraisingCents =
    input.fundraisingTargetDollars && !Number.isNaN(parseInt(input.fundraisingTargetDollars, 10))
      ? Math.max(0, parseInt(input.fundraisingTargetDollars, 10) * 100)
      : null;

  const insertRow = {
    walkathon_id: walkathon.id,
    center_id: center.id,
    participant_name: input.participantName,
    email: input.email.toLowerCase(),
    phone: input.phone || null,
    date_of_birth: input.dateOfBirth,
    age_group: ageGroup,
    shirt_size: input.shirtSize,
    registration_fee_cents: 0,
    payment_status: "free",
    fundraising_target_cents: fundraisingCents,
    consent_waiver_signed_at: new Date().toISOString(),
    consent_minor_guardian_name: isMinor ? input.guardianName : null,
    consent_minor_guardian_email: isMinor ? input.guardianEmail.toLowerCase() : null,
    consent_minor_guardian_phone: isMinor ? input.guardianPhone || null : null,
    consent_minor_guardian_signed_at: isMinor ? new Date().toISOString() : null,
    source: "website",
  };

  const { data: inserted, error: insertErr } = await supabase
    .from("walk_registrations")
    .insert(insertRow)
    .select("id")
    .single();

  if (insertErr) {
    if (insertErr.code === "23505") {
      // Unique (walkathon_id, email) collision — already registered.
      redirect(`/register/${centerSlug}/already-registered`);
    }
    console.error("[register] insert failed", insertErr);
    return {
      ok: false,
      message: "Failed to save your registration. Please try again or contact your local center.",
    };
  }

  // Confirmation email — best-effort, never blocks the registration.
  try {
    const html = renderConfirmationHtml({
      participantName: input.participantName,
      centerName: center.name,
      centerCity: center.city,
      centerState: center.state,
      walkathonName: walkathon.name,
      walkDate: walkathon.national_event_date,
      shirtSize: input.shirtSize,
      guardianName: isMinor ? input.guardianName : null,
    });
    const recipient = isMinor ? input.guardianEmail.toLowerCase() : input.email.toLowerCase();
    await sendMailgunEmail({
      to: recipient,
      subject: REGISTRATION_SUBJECT,
      html,
      cc: isMinor ? input.email.toLowerCase() : undefined,
    });
  } catch (err) {
    console.error("[register] confirmation email failed (non-fatal)", err);
  }

  // Audit hint — log only the registration id; never the email or name.
  try {
    const ip =
      (await headers()).get("x-real-ip") ??
      (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ??
      "anonymous";
    console.log(`[register] new website registration id=${inserted.id} ip=${ip}`);
  } catch {
    // headers() may not be available outside a request scope; ignore.
  }

  redirect(`/register/${centerSlug}/confirmed?id=${inserted.id}`);
}
