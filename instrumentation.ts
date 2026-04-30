export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
    assertProductionRateLimitsConfigured();
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

/**
 * Boot-time check for the newsletter rate limiter.
 *
 * Original audit MEDIUM I3 made this throw in production so a missing
 * Upstash config would fail-loud. In practice the throw fires from
 * `registerInstrumentation` BEFORE per-route function init on Vercel, which
 * means every cold start of any dynamic route (e.g. /centers/[slug])
 * surfaces an unhandled rejection in logs. The only consumer of the limiter
 * is /api/newsletter, which `getNewsletterRatelimit()` already gracefully
 * degrades to "no rate limiting" when Upstash env vars are absent, so a
 * boot-time throw is heavier than warranted.
 *
 * TODO: when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set on
 *   Vercel, this check becomes a no-op (the early-return at the top
 *   handles it). No further action needed at that point.
 */
function assertProductionRateLimitsConfigured(): void {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return;

  // Soft-fail in every environment: log loudly so the gap is visible in
  // Vercel + Sentry, but do not crash route-handler init.
  console.error(
    "[newsletter] Rate limiter is not configured — set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. " +
      "Without them /api/newsletter accepts unlimited POSTs.",
  );
}
