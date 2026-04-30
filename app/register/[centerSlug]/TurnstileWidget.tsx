"use client";

/**
 * TurnstileWidget.tsx — Cloudflare Turnstile captcha widget.
 *
 * Required env vars (set on Vercel for the website project):
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY  Public site key, baked into the bundle.
 *                                   Renders the widget when present.
 *   TURNSTILE_SECRET_KEY            Server-only secret. Used by
 *                                   actions.ts → verifyTurnstile() to validate
 *                                   the submitted token against Cloudflare.
 *   TURNSTILE_DEV_BYPASS            Set to "true" in local dev to skip
 *                                   server-side verification (do NOT set in
 *                                   prod). When set, this widget still renders
 *                                   only if the site key is present.
 *
 * Behaviour:
 *   - Site key set:        loads the Turnstile script and auto-renders the
 *                          widget. On success it injects a hidden form field
 *                          named `cf-turnstile-response` which the server
 *                          action picks up via formData.get().
 *   - Site key not set:    renders nothing. The server-side dev bypass should
 *                          be on for local dev, otherwise submissions are
 *                          rejected with "captcha required".
 *
 * No npm dependency — Turnstile's hosted script auto-renders any
 * `<div class="cf-turnstile" data-sitekey="…">` it finds on the page.
 */

import Script from "next/script";

export interface TurnstileWidgetProps {
  /** Optional theme override. Default = "auto" (matches user prefs). */
  theme?: "light" | "dark" | "auto";
}

export default function TurnstileWidget({ theme = "auto" }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    // No widget rendered. Server-side TURNSTILE_DEV_BYPASS must be on for
    // submissions to succeed; otherwise actions.ts will reject with the
    // "captcha required" path.
    return null;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
      />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme={theme}
        aria-label="Captcha challenge"
        style={{ marginTop: 8 }}
      />
    </>
  );
}
