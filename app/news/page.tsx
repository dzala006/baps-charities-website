import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import { ARTICLES, type Article } from "../lib/news-data";
import { getChapterArticles } from "../lib/news-from-events";
import NewsFilter from "./NewsFilter";

export const metadata: Metadata = {
  title: "News & Press | BAPS Charities",
  description:
    "Stories from the field — health, environment, education, humanitarian, and community news from BAPS Charities.",
};

// Short ISR so chapter activities published from the portal surface within
// ~1 minute. The route already merges the static curated feed with center_events
// rows filtered to is_published+source='legacy-import'.
export const revalidate = 60;

// Sort by parsed date descending; entries without a parseable date sink
// to the bottom but still render.
function dateRank(a: Article): number {
  const t = Date.parse(a.date);
  return isNaN(t) ? 0 : t;
}

export default async function NewsPage() {
  const chapter = await getChapterArticles();
  // De-dup by slug if the static list ever overlaps with chapter feeds.
  const seen = new Set<string>(ARTICLES.map(a => a.slug));
  const additions = chapter.filter(a => !seen.has(a.slug));
  const merged = [...ARTICLES, ...additions].sort((a, b) => dateRank(b) - dateRank(a));
  return (
    <PageShell>
      <section
        style={{
          background: "#faf7f3",
          padding: "88px 32px 56px",
          borderBottom: "1px solid #E4DFDA",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "News" }]} />
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8E191D",
              marginBottom: 16,
            }}
          >
            News &amp; Press
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 68px)",
              lineHeight: 1.05,
              margin: 0,
              color: "#2a241f",
              letterSpacing: "-0.01em",
              maxWidth: 900,
            }}
          >
            Stories from the field.
          </h1>
        </div>
      </section>

      <section style={{ padding: "56px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <NewsFilter articles={merged} />
        </div>
      </section>
    </PageShell>
  );
}
