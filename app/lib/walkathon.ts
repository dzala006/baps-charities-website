/**
 * walkathon.ts — Active-walkathon resolver + per-walkathon registration URL helper.
 *
 * Source of truth:
 *   public.walkathons.registration_url (added in migration 2400). May contain
 *   a literal URL ("https://walk2026.na.bapscharities.org") or a {slug}
 *   placeholder ("https://baps-walkathon-portal.vercel.app/portal/register/{slug}")
 *   that the website substitutes with the current center's slug at render.
 *
 * Per-center override:
 *   public.center_pages.host_own_walk + walk_registration_url (migration 2500).
 *   When a coordinator turns "host own walk" on in the portal CMS and provides
 *   a URL, that URL takes precedence over the walkathon-level link on
 *   /centers/[slug]. Empty URL with the flag on falls through to the default.
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

export type CenterWalkOverride = {
  hostOwnWalk: boolean;
  walkRegistrationUrl: string | null;
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

/**
 * Map of center_id → host-own-walk override. Used by /events/walk-run-2027 city
 * picker so the per-center URL is resolved client-side without re-querying
 * Supabase per selection.
 */
export async function getCenterWalkOverrides(): Promise<Record<string, CenterWalkOverride>> {
  const { data, error } = await supabase
    .from("center_pages")
    .select("center_id, host_own_walk, walk_registration_url");
  if (error || !data) return {};
  const out: Record<string, CenterWalkOverride> = {};
  for (const row of data as Array<{
    center_id: string;
    host_own_walk: boolean | null;
    walk_registration_url: string | null;
  }>) {
    out[row.center_id] = {
      hostOwnWalk: row.host_own_walk === true,
      walkRegistrationUrl: row.walk_registration_url,
    };
  }
  return out;
}

export type RegistrationCta = {
  href: string;
  isExternal: boolean;
  // Whether to open in a new tab. External links → true. The in-portal flow is
  // a different deployed app (separate origin), so it also opens in a new tab.
  target?: "_blank";
  rel?: "noopener noreferrer";
  // True when this CTA came from a per-center host-own-walk override (lets the
  // page surface a "Hosted by this center" hint near the button).
  isCenterHosted?: boolean;
};

const SAFE_URL_RE = /^https?:\/\/[^\s]+$/i;

function externalCta(href: string, isCenterHosted = false): RegistrationCta {
  return {
    href,
    isExternal: true,
    target: "_blank",
    rel: "noopener noreferrer",
    isCenterHosted,
  };
}

/**
 * Build the registration CTA href + link attrs for a given walkathon + center slug.
 *
 *   override.hostOwnWalk + safe URL → use the per-center URL (highest priority).
 *   walkathon.registration_url contains "{slug}" → substitute with centerSlug.
 *   walkathon.registration_url is a literal URL → use as-is (legacy 2026 path).
 *   walkathon.registration_url = NULL → fall back to the website-hosted form
 *     (/register/:slug, gated by FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE).
 */
export function resolveRegistrationCta(
  walkathon: Walkathon | null,
  centerSlug: string | null,
  websiteFallbackEnabled: boolean,
  centerOverride?: CenterWalkOverride | null,
): RegistrationCta {
  // 1. Per-center override wins when both flag is on AND URL is set+safe.
  if (
    centerOverride?.hostOwnWalk &&
    centerOverride.walkRegistrationUrl &&
    SAFE_URL_RE.test(centerOverride.walkRegistrationUrl)
  ) {
    return externalCta(centerOverride.walkRegistrationUrl, true);
  }

  // 2. Walkathon-level URL.
  const url = walkathon?.registration_url ?? null;
  if (url) {
    const href = centerSlug ? url.replace("{slug}", centerSlug) : url;
    return externalCta(href);
  }

  // 3. Website-hosted form fallback.
  if (websiteFallbackEnabled && centerSlug) {
    return { href: `/register/${centerSlug}`, isExternal: false };
  }

  // 4. Last-resort default. Matches the historical hardcoded fallback.
  return externalCta("https://walk2026.na.bapscharities.org");
}
