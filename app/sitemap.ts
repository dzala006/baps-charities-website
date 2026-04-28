import type { MetadataRoute } from "next";
import { supabase } from "./lib/supabase";
import { ARTICLES } from "./lib/news-data";

export const revalidate = 3600;

const BASE = "https://baps-charities-website.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    "/",
    "/about",
    "/programs",
    "/events",
    "/events/walk-run-2026",
    "/donate",
    "/get-involved",
    "/find-a-center",
    "/news",
    "/reports",
    "/reports/annual-2024",
    "/sponsorship",
    "/contact",
    "/privacy",
    "/terms",
    "/press",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority:
      route === "/"
        ? 1.0
        : route.includes("walk-run") || route === "/donate"
        ? 0.9
        : 1.0,
  }));

  // Dynamic: centers
  const { data: centersData } = await supabase.from("centers").select("slug");
  const centerEntries: MetadataRoute.Sitemap = (centersData ?? []).map(
    (row: { slug: string }) => ({
      url: `${BASE}/centers/${row.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // Dynamic: news articles (from static data file)
  const newsEntries: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${BASE}/news/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Dynamic: walk cities
  const { data: walkCitiesData } = await supabase
    .from("walk_cities")
    .select("slug");
  const walkCityEntries: MetadataRoute.Sitemap = (walkCitiesData ?? []).map(
    (row: { slug: string }) => ({
      url: `${BASE}/events/walk-run-2026/${row.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [
    ...staticEntries,
    ...centerEntries,
    ...newsEntries,
    ...walkCityEntries,
  ];
}
