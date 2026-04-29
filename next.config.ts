import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Portal Vercel project for Next.js Multi-Zone rewrites. Override via
// PORTAL_ZONE_URL env var (e.g. on a preview branch) if needed.
const PORTAL_ZONE_URL =
  process.env.PORTAL_ZONE_URL ?? "https://baps-walkathon-portal.vercel.app";

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
  // Multi-zone setup: /portal/* serves the BAPS Walkathon Portal (Vite SPA)
  // from a separate Vercel project. Users see one URL; under the hood,
  // requests are proxied to the portal deployment. The portal's
  // vite.config.ts must set base: '/portal/' for asset paths to resolve.
  // See https://nextjs.org/docs/app/building-your-application/routing/multi-zones
  async rewrites() {
    return [
      {
        source: "/portal",
        destination: `${PORTAL_ZONE_URL}/portal`,
      },
      {
        source: "/portal/:path*",
        destination: `${PORTAL_ZONE_URL}/portal/:path*`,
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
