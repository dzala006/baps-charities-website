/**
 * walkathon.ts — Active-walkathon resolver + per-walkathon registration URL helper.
 *
 * Source of truth:
 *   public.walkathons.registration_url (added in migration 2400). May contain
 *   a literal URL ("https://walk2026.na.bapscharities.org") or a {slug}
 *   placeholder ("https://baps-walkathon-portal.vercel.app/portal/register/{slug}")
 *   that the website substitutes with the current center's slug at render.
 *
 * Per-center override (3-state, migration 2600):
 *   public.center_pages.walkathon_registration_mode in
 *     ('default', 'host_own', 'opt_out')
 *   public.center_pages.walk_registration_url (used when mode='host_own')
 *
 * "Active" = highest-year row whose status='Open'. Two rows can be Open at once
 * (e.g. 2026 legacy promo + 2027 in-portal); the website surfaces the highest year.
 */
import { supabase } from "./supabase";

export type WalkathonRegistrationMode = "default" | "host_own" | "opt_out";

export type Walkathon = {
  id: string;
  year: number;
  name: string;
  status: string;
  national_event_date: string;
  registration_url: string | null;
};

export type CenterWalkOverride = {
  /** Back-compat alias for mode='host_own'. */
  hostOwnWalk: boolean;
  walkRegistrationUrl: string | null;
  mode: WalkathonRegistrationMode;
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
 * Per-center walkathon registration mode for a single center. Returns
 * 'default' if the center_pages row does not exist (or on read error).
 */
export async function getCenterWalkathonMode(
  centerId: string,
): Promise<WalkathonRegistrationMode> {
  const { data } = await supabase
    .from("center_pages")
    .select("walkathon_registration_mode")
    .eq("center_id", centerId)
    .maybeSingle();
  const value = (data as { walkathon_registration_mode?: string } | null)
    ?.walkathon_registration_mode;
  if (value === "host_own" || value === "opt_out" || value === "default") {
    return value;
  }
  return "default";
}

/**
 * Map of center_id → CenterWalkOverride. Used by /events/walk-run-2027 city
 * picker so the per-center URL/mode is resolved client-side without
 * re-querying Supabase per selection.
 */
export async function getCenterWalkOverrides(): Promise<Record<string, CenterWalkOverride>> {
  const { data, error } = await supabase
    .from("center_pages")
    .select("center_id, host_own_walk, walk_registration_url, walkathon_registration_mode");
  if (error || !data) return {};
  const out: Record<string, CenterWalkOverride> = {};
  for (const row of data as Array<{
    center_id: string;
    host_own_walk: boolean | null;
    walk_registration_url: string | null;
    walkathon_registration_mode: string | null;
  }>) {
    const mode = normalizeMode(row.walkathon_registration_mode, row.host_own_walk);
    out[row.center_id] = {
      hostOwnWalk: mode === "host_own",
      walkRegistrationUrl: row.walk_registration_url,
      mode,
    };
  }
  return out;
}

function normalizeMode(
  raw: string | null | undefined,
  legacyHostOwn: boolean | null | undefined,
): WalkathonRegistrationMode {
  if (raw === "host_own" || raw === "opt_out" || raw === "default") return raw;
  return legacyHostOwn === true ? "host_own" : "default";
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
 * Returns null when the center is opted-out — callers must hide their CTA.
 *
 *   override.mode='opt_out'                    → null (caller hides CTA)
 *   override.mode='host_own' + safe URL        → use per-center URL
 *   walkathon.registration_url contains "{slug}" → substitute with centerSlug
 *   walkathon.registration_url is a literal URL  → use as-is (legacy 2026 path)
 *   walkathon.registration_url = NULL → fall back to website-hosted form
 *     (/register/:slug, gated by FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE).
 */
export function resolveRegistrationCta(
  walkathon: Walkathon | null,
  centerSlug: string | null,
  websiteFallbackEnabled: boolean,
  centerOverride?: CenterWalkOverride | null,
): RegistrationCta | null {
  // 0. Opt-out: caller hides the CTA entirely.
  if (centerOverride?.mode === "opt_out") {
    return null;
  }

  // 1. Per-center override wins when mode='host_own' AND URL is set+safe.
  const isHostOwn =
    centerOverride?.mode === "host_own" || centerOverride?.hostOwnWalk;
  if (
    isHostOwn &&
    centerOverride?.walkRegistrationUrl &&
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
