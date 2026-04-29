/**
 * walkathon.ts — Active-walkathon resolver + per-walkathon registration URL helper.
 *
 * Source of truth:
 *   public.walkathons.registration_url (added in migration 2400). May contain
 *   a literal URL ("https://walk2026.na.bapscharities.org") or a {slug}
 *   placeholder ("https://baps-walkathon-portal.vercel.app/portal/register/{slug}")
 *   that the website substitutes with the current center's slug at render.
 *
 * "Active" = highest-year row whose status='Open'. Two rows can be Open at once
 * (e.g. 2026 legacy promo + 2027 in-portal); the website surfaces the highest year.
 */
import { supabase } from "./supabase";

export type Walkathon = {
  id: string;
  year: number;
  name: string;
  status: string;
  national_event_date: string;
  registration_url: string | null;
};

export async function getActiveWalkathon(): Promise<Walkathon | null> {
  const { data, error } = await supabase
    .from("walkathons")
    .select("id, year, name, status, national_event_date, registration_url")
    .eq("status", "Open")
    .order("year", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as Walkathon;
}

export async function getWalkathonByYear(year: number): Promise<Walkathon | null> {
  const { data, error } = await supabase
    .from("walkathons")
    .select("id, year, name, status, national_event_date, registration_url")
    .eq("year", year)
    .maybeSingle();
  if (error || !data) return null;
  return data as Walkathon;
}

export type RegistrationCta = {
  href: string;
  isExternal: boolean;
  // Whether to open in a new tab. External links → true. The in-portal flow is
  // a different deployed app (separate origin), so it also opens in a new tab.
  target?: "_blank";
  rel?: "noopener noreferrer";
};

/**
 * Build the registration CTA href + link attrs for a given walkathon + center slug.
 *
 *   walkathon.registration_url = NULL → fall back to the website-hosted form
 *     (/register/:slug, gated by FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE).
 *   walkathon.registration_url contains "{slug}" → substitute with centerSlug.
 *   walkathon.registration_url is a literal URL → use as-is (legacy 2026 path).
 */
export function resolveRegistrationCta(
  walkathon: Walkathon | null,
  centerSlug: string | null,
  websiteFallbackEnabled: boolean,
): RegistrationCta {
  const url = walkathon?.registration_url ?? null;

  if (!url) {
    // No per-walkathon link configured — fall back to website-hosted form (or external default if flag off).
    if (websiteFallbackEnabled && centerSlug) {
      return { href: `/register/${centerSlug}`, isExternal: false };
    }
    // Last-resort default. Matches the historical hardcoded fallback.
    return {
      href: "https://walk2026.na.bapscharities.org",
      isExternal: true,
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  const href = centerSlug ? url.replace("{slug}", centerSlug) : url;
  return {
    href,
    isExternal: true,
    target: "_blank",
    rel: "noopener noreferrer",
  };
}
