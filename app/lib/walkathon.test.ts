/**
 * walkathon.test.ts — resolveRegistrationCta priority order.
 *
 * The resolver chooses among 4 sources of truth, in order:
 *   1. per-center host_own_walk override (when flag on AND URL is safe)
 *   2. walkathons.registration_url (with {slug} substitution if templated)
 *   3. website-hosted /register/:slug form (when feature flag is on)
 *   4. legacy walk2026.na.bapscharities.org fallback
 *
 * These tests pin that order so a refactor can't silently break the override.
 */
import { describe, it, expect } from "vitest";
import {
  resolveRegistrationCta,
  type Walkathon,
  type CenterWalkOverride,
} from "./walkathon";

const walkathon2027: Walkathon = {
  id: "wk-2027",
  year: 2027,
  name: "Walk 2027",
  status: "Open",
  national_event_date: "2027-05-30",
  registration_url:
    "https://baps-walkathon-portal.vercel.app/portal/register/{slug}",
};

const walkathon2026: Walkathon = {
  id: "wk-2026",
  year: 2026,
  name: "Walk 2026",
  status: "Open",
  national_event_date: "2026-06-06",
  registration_url: "https://walk2026.na.bapscharities.org",
};

const slug = "atlanta";

describe("resolveRegistrationCta — per-center override (priority 1)", () => {
  it("uses the override URL when mode='host_own' and URL is safe", () => {
    const override: CenterWalkOverride = {
      hostOwnWalk: true,
      walkRegistrationUrl: "https://atlanta-walks.example.org/register",
      mode: "host_own",
    };
    const cta = resolveRegistrationCta(walkathon2027, slug, false, override);
    expect(cta).not.toBeNull();
    expect(cta?.href).toBe("https://atlanta-walks.example.org/register");
    expect(cta?.isExternal).toBe(true);
    expect(cta?.isCenterHosted).toBe(true);
    expect(cta?.target).toBe("_blank");
    expect(cta?.rel).toBe("noopener noreferrer");
  });

  it("ignores the override when mode='default' (falls through to walkathon-level)", () => {
    const override: CenterWalkOverride = {
      hostOwnWalk: false,
      walkRegistrationUrl: "https://stale-url.example.com/should-not-show",
      mode: "default",
    };
    const cta = resolveRegistrationCta(walkathon2027, slug, false, override);
    // Falls through to walkathon-level template with slug substituted.
    expect(cta?.href).toBe(
      "https://baps-walkathon-portal.vercel.app/portal/register/atlanta",
    );
    expect(cta?.isCenterHosted).toBeFalsy();
  });

  it("ignores override when URL is null (mode=host_own but URL not yet provided)", () => {
    const override: CenterWalkOverride = {
      hostOwnWalk: true,
      walkRegistrationUrl: null,
      mode: "host_own",
    };
    const cta = resolveRegistrationCta(walkathon2027, slug, false, override);
    // Falls through to walkathon template.
    expect(cta?.href).toBe(
      "https://baps-walkathon-portal.vercel.app/portal/register/atlanta",
    );
    expect(cta?.isCenterHosted).toBeFalsy();
  });

  it("rejects unsafe javascript: URL even with mode='host_own' (defense in depth)", () => {
    const override: CenterWalkOverride = {
      hostOwnWalk: true,
      // eslint-disable-next-line no-script-url
      walkRegistrationUrl: "javascript:alert(1)",
      mode: "host_own",
    };
    const cta = resolveRegistrationCta(walkathon2027, slug, false, override);
    // Falls through to safer source of truth.
    expect(cta?.href).toBe(
      "https://baps-walkathon-portal.vercel.app/portal/register/atlanta",
    );
    expect(cta?.isCenterHosted).toBeFalsy();
  });
});

describe("resolveRegistrationCta — opt-out (priority 0)", () => {
  it("returns null when mode='opt_out' regardless of other inputs", () => {
    const override: CenterWalkOverride = {
      hostOwnWalk: false,
      walkRegistrationUrl: null,
      mode: "opt_out",
    };
    expect(resolveRegistrationCta(walkathon2027, slug, false, override)).toBeNull();
    expect(resolveRegistrationCta(walkathon2026, slug, true, override)).toBeNull();
    expect(resolveRegistrationCta(null, slug, true, override)).toBeNull();
  });

  it("opt_out wins even when a host_own URL is also set (e.g. paused for a season)", () => {
    const override: CenterWalkOverride = {
      hostOwnWalk: true,
      walkRegistrationUrl: "https://still-saved-from-last-year.example.org",
      mode: "opt_out",
    };
    expect(resolveRegistrationCta(walkathon2027, slug, false, override)).toBeNull();
  });
});

describe("resolveRegistrationCta — walkathon-level (priority 2)", () => {
  it("substitutes {slug} into the templated URL", () => {
    const cta = resolveRegistrationCta(walkathon2027, slug, false);
    expect(cta?.href).toBe(
      "https://baps-walkathon-portal.vercel.app/portal/register/atlanta",
    );
    expect(cta?.isExternal).toBe(true);
  });

  it("uses literal URLs as-is (no slug substitution)", () => {
    const cta = resolveRegistrationCta(walkathon2026, slug, false);
    expect(cta?.href).toBe("https://walk2026.na.bapscharities.org");
  });
});

describe("resolveRegistrationCta — fallbacks (priority 3 + 4)", () => {
  it("uses website-hosted /register/:slug when no walkathon URL and flag is on", () => {
    const noUrlWalkathon = { ...walkathon2027, registration_url: null };
    const cta = resolveRegistrationCta(noUrlWalkathon, slug, true);
    expect(cta?.href).toBe("/register/atlanta");
    expect(cta?.isExternal).toBe(false);
  });

  it("falls back to walk2026 when neither URL nor website-form fallback is available", () => {
    const cta = resolveRegistrationCta(null, null, false);
    expect(cta?.href).toBe("https://walk2026.na.bapscharities.org");
    expect(cta?.isExternal).toBe(true);
  });
});
