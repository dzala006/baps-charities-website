import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageShell from "../../components/PageShell";
import Breadcrumb from "../../components/Breadcrumb";
import { ARTICLES, getArticleBySlug } from "../../lib/news-data";
import { getChapterArticleBySlug } from "../../lib/news-from-events";

const CAT_COLORS: Record<string, string> = {
  Health: "#8E191D",
  Environment: "#4f7a3a",
  Education: "#CF3728",
  Humanitarian: "#c08a2c",
  Community: "#4a6b7a",
  Press: "#4C4238",
};

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug) ?? (await getChapterArticleBySlug(slug));
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `https://baps-charities-website.vercel.app/news/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Static curated articles take precedence; fall back to the legacy-import
  // chapter feed (slug prefixed `chapter-<centerSlug>__<eventSlug>`).
  const article = getArticleBySlug(slug) ?? (await getChapterArticleBySlug(slug));
  if (!article) notFound();

  const color = CAT_COLORS[article.cat] ?? "#8E191D";
  const related = ARTICLES.filter((a) => a.slug !== slug && (a.cat === article.cat)).slice(0, 3);
  const otherArticles = related.length < 3
    ? [...related, ...ARTICLES.filter(a => a.slug !== slug && a.cat !== article.cat).slice(0, 3 - related.length)]
    : related;

  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "#2a241f", padding: "96px 32px 72px", color: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "News", href: "/news" },
              { label: article.cat },
            ]}
          />
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 24, marginBottom: 20 }}>
            <span style={{ padding: "5px 12px", background: color, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 4 }}>
              {article.cat}
            </span>
            <span style={{ fontSize: 12, color: "#b1aca7" }}>{article.date}</span>
            <span style={{ fontSize: 12, color: "#b1aca7" }}>·</span>
            <span style={{ fontSize: 12, color: "#b1aca7" }}>{article.read}</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(32px, 4vw, 64px)", lineHeight: 1.1, margin: 0, letterSpacing: "-0.015em", maxWidth: 1000 }}>
            {article.title}
          </h1>
        </div>
      </section>

      {/* Article body */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 360px", gap: 80 }}>
          <article>
            {/* Lead image */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ position: "relative", aspectRatio: "16/9", width: "100%", overflow: "hidden", borderRadius: 4 }}>
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 1280px"
                  priority
                />
              </div>
              <div style={{ fontSize: 12, color: "#7a716a", marginTop: 8 }}>Photo: BAPS Charities archive. Request originals at archive.media@na.baps.org</div>
            </div>

            {/* Lead paragraph */}
            <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.55, color: "#2a241f", margin: "0 0 32px" }}>
              {article.excerpt}
            </p>

            {/* Body paragraphs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {article.body.map((para, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.8, color: "#4C4238", margin: 0 }}>
                  {para}
                </p>
              ))}
            </div>

            {/* Footer */}
            <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid #E4DFDA", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div style={{ fontSize: 13, color: "#7a716a" }}>
                Published {article.date} · BAPS Charities
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Link href="/news" style={{ padding: "10px 20px", background: "#fff", border: "1px solid #c9c2bb", color: "#2a241f", borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}>
                  ← All news
                </Link>
                <a href="mailto:press@bapscharities.org" style={{ padding: "10px 20px", background: "#2a241f", color: "#fff", borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}>
                  Press inquiry
                </a>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* About BAPS */}
            <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 14 }}>About BAPS Charities</div>
              <p style={{ fontSize: 13, color: "#4C4238", lineHeight: 1.65, margin: 0 }}>
                A global, volunteer-driven nonprofit serving communities through health, education, environmental, humanitarian, and community programs. EIN: 26-1530694. Charity Navigator: 97/100.
              </p>
              <Link href="/about" style={{ display: "block", marginTop: 16, fontSize: 12, color: "#8E191D", fontWeight: 600 }}>Learn more →</Link>
            </div>

            {/* Get involved CTA */}
            <div style={{ background: color, color: "#fff", borderRadius: 4, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>{article.cat} Programs</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 20, margin: "0 0 12px", lineHeight: 1.2 }}>Get involved in {article.cat.toLowerCase()}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                <Link href="/get-involved" style={{ padding: "12px 0", background: "rgba(0,0,0,0.2)", color: "#fff", borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}>Volunteer →</Link>
                <Link href="/donate" style={{ padding: "12px 0", background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}>Donate →</Link>
              </div>
            </div>

            {/* Related articles */}
            {otherArticles.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 16 }}>More stories</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {otherArticles.map((a) => (
                    <Link key={a.slug} href={`/news/${a.slug}`} style={{ display: "block", padding: "12px 0", borderBottom: "1px solid #E4DFDA", textDecoration: "none" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: CAT_COLORS[a.cat] ?? "#8E191D", marginBottom: 4 }}>{a.cat}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#2a241f", lineHeight: 1.4 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: "#7a716a", marginTop: 4 }}>{a.date}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Press contact */}
            <div style={{ background: "#faf7f3", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 12 }}>Press & Media</div>
              <div style={{ fontSize: 13, color: "#4C4238", lineHeight: 1.7 }}>
                <a href="mailto:press@bapscharities.org" style={{ color: "#8E191D", fontWeight: 600 }}>press@bapscharities.org</a><br />
                <a href="mailto:archive.media@na.baps.org" style={{ color: "#8E191D", fontWeight: 600 }}>archive.media@na.baps.org</a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
