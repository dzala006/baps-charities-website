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
 * Boot-time assertion (audit MEDIUM I3): refuse to start the production
 * server if the newsletter rate limiter is not wired. In dev we warn but do
 * not fail, so local development without Upstash still works.
 */
function assertProductionRateLimitsConfigured(): void {
  const isProd = process.env.NODE_ENV === "production";
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return;

  const msg =
    "[newsletter] Rate limiter is not configured — set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. " +
    "Without them /api/newsletter accepts unlimited POSTs.";
  if (isProd) {
    // Fail fast — Vercel surfaces this in the build/runtime logs and the
    // function will not start.
    throw new Error(msg);
  }
  // eslint-disable-next-line no-console
  console.warn(msg);
}
