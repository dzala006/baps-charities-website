import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Security headers (audit MEDIUM I2). Enforced everywhere except CSP, which
// is sent Report-Only so violations land in Sentry without breaking the site
// while we tighten the policy. Switch to `Content-Security-Policy` (enforcing)
// once the baseline is clean.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  // 'unsafe-inline' / 'unsafe-eval' kept for Next.js hydration + dev tooling;
  // remove once we wire nonces.
  // challenges.cloudflare.com hosts Turnstile's api.js + widget XHR.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.sentry.io https://*.ingest.sentry.io https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://media.bapscharities.org https://images.unsplash.com https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://*.sentry.io https://*.ingest.sentry.io https://api.stripe.com https://challenges.cloudflare.com",
  "frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 6 months; do not preload until the user is ready to commit to HTTPS-only.
  { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.bapscharities.org",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "baps-charities",
  project: "baps-charities-website",
  silent: !process.env.CI,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  widenClientFileUpload: true,
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
});
