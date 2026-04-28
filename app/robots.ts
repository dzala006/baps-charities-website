import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/api/"],
      },
    ],
    sitemap: "https://baps-charities-website.vercel.app/sitemap.xml",
  };
}
