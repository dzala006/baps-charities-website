/**
 * news-from-events.ts — Surfaces center_events rows (source='legacy-import')
 * as global /news Articles.
 *
 * Imported via the portal's Phase 3.4 content population pass. 72 articles
 * scraped from bapscharities.org/usa/<city>/news/ across 15 priority centers.
 *
 * Slug strategy: prefix the event_slug with the center slug to avoid
 * collisions across chapters that ran the same nationally-themed program
 * (e.g. several centers each have a "walk-run-2025-NN" entry).
 */
import { supabase } from "./supabase";
import type { Article } from "./news-data";

const SLUG_PREFIX = "chapter-";

// Fallback hero image when an imported chapter event has no photo_url. Lives
// on the BAPS-owned media CDN and is referenced from a single place so a
// future asset rotation only requires touching this constant.
const FALLBACK_HERO_IMAGE =
  "https://media.bapscharities.org/2026/01/23113836/Embrace-the-Spirit-of-Service-Walk-for-Your-Community.jpg";

// Shape after Supabase's PostgREST join: `centers(...)` arrives as a one-row
// array even though the FK is 1:1. We normalise it to a single object inside
// `normaliseRow` below so the rest of the module can keep using a flat shape.
interface CenterEventRowFromSupabase {
  slug: string;
  title: string;
  event_type: string | null;
  event_date: string | null;
  description: string | null;
  body: string | null;
  photo_url: string | null;
  centers: Array<{ slug: string; city: string; state: string; name: string }> | { slug: string; city: string; state: string; name: string } | null;
}

interface CenterEventRow {
  slug: string;
  title: string;
  event_type: string | null;
  event_date: string | null;
  description: string | null;
  body: string | null;
  photo_url: string | null;
  centers: { slug: string; city: string; state: string; name: string } | null;
}

function normaliseRow(row: CenterEventRowFromSupabase): CenterEventRow {
  const centers = Array.isArray(row.centers) ? row.centers[0] ?? null : row.centers;
  return {
    slug: row.slug,
    title: row.title,
    event_type: row.event_type,
    event_date: row.event_date,
    description: row.description,
    body: row.body,
    photo_url: row.photo_url,
    centers,
  };
}

const ROW_SELECT =
  "slug, title, event_type, event_date, description, body, photo_url, centers(slug, city, state, name)";

function categoryFor(row: CenterEventRow): string {
  const t = (row.event_type || "").toLowerCase();
  if (t === "walk-run" || t === "walkathon") return "Fundraiser";
  if (t === "health") return "Health";
  if (t === "environmental" || t === "environment") return "Environment";
  if (t === "education") return "Education";
  if (t === "community") return "Community";

  // event_type='other' (the bulk of legacy-import rows) — derive from title
  const title = row.title.toLowerCase();
  if (/health|lecture|sleep|cardio|wellness|cancer|anxiety|caregiv|digestive/.test(title)) return "Health";
  if (/walk[- ]?run|walk\|run|walkathon|gala|fund|sponsor|donate/.test(title)) return "Fundraiser";
  if (/blood|food drive|food donation|toy drive|backpack|essentials|drive\b/.test(title)) return "Humanitarian";
  if (/earth day|tree planting|clean[- ]?up|environment/.test(title)) return "Environment";
  if (/special needs|education|youth|leadership|workshop|talk\b/.test(title)) return "Education";
  return "Community";
}

function readTimeFor(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  // event_date is a DATE column, no time component — parse safely as UTC noon
  const d = new Date(iso + "T12:00:00Z");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function rowToArticle(row: CenterEventRow): Article {
  const desc = row.description || "";
  const body = row.body && row.body.trim() ? row.body.split(/\n\s*\n/).filter(Boolean) : [desc].filter(Boolean);
  const center = row.centers;
  const centerLine = center ? `Reported by BAPS Charities ${center.name} chapter (${center.city}, ${center.state}).` : "";
  const bodyWithFooter = centerLine ? [...body, centerLine] : body;
  return {
    slug: SLUG_PREFIX + (center ? `${center.slug}__` : "") + row.slug,
    date: formatDate(row.event_date),
    cat: categoryFor(row),
    title: row.title,
    excerpt: desc ? (desc.length > 220 ? desc.slice(0, 217).trimEnd() + "…" : desc) : `${center?.name ?? ""} chapter activity.`,
    read: readTimeFor(bodyWithFooter.join(" ")),
    body: bodyWithFooter.length ? bodyWithFooter : ["No additional details were captured for this activity."],
    image: row.photo_url || FALLBACK_HERO_IMAGE,
  };
}

/**
 * Fetch all 'legacy-import' center_events as Article[]. Cached by Next.js
 * RSC-fetch dedup; safe to call from multiple server components in one
 * render. Returns [] if Supabase isn't reachable so /news still renders.
 */
export async function getChapterArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("center_events")
      .select(ROW_SELECT)
      .eq("source", "legacy-import")
      .eq("is_published", true)
      .order("event_date", { ascending: false });
    if (error || !data) return [];
    const rows = data as unknown as CenterEventRowFromSupabase[];
    return rows.map(normaliseRow).map(rowToArticle);
  } catch {
    return [];
  }
}

/**
 * Look up a single chapter article by its prefixed slug. Returns null if
 * the slug doesn't match the expected shape or no row exists.
 */
export async function getChapterArticleBySlug(slug: string): Promise<Article | null> {
  if (!slug.startsWith(SLUG_PREFIX)) return null;
  const stripped = slug.slice(SLUG_PREFIX.length);
  const sep = stripped.indexOf("__");
  if (sep < 0) return null;
  const centerSlug = stripped.slice(0, sep);
  const eventSlug = stripped.slice(sep + 2);
  try {
    const { data, error } = await supabase
      .from("center_events")
      .select(ROW_SELECT)
      .eq("slug", eventSlug)
      .eq("source", "legacy-import")
      .eq("is_published", true);
    if (error || !data) return null;
    const rows = (data as unknown as CenterEventRowFromSupabase[]).map(normaliseRow);
    const match = rows.find((r) => r.centers?.slug === centerSlug);
    return match ? rowToArticle(match) : null;
  } catch {
    return null;
  }
}
