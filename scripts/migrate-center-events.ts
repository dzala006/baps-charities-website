/**
 * Scrapes old BAPS Charities website and seeds center_events in Supabase.
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/migrate-center-events.ts
 *
 * The script maps center slugs from the new DB to old-site URLs, fetches each
 * center's news page, parses article titles/dates/descriptions, and inserts rows.
 * Already-existing slugs are skipped (upsert with ignore on conflict).
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OLD_BASE = "https://www.bapscharities.org/usa";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function inferType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("walk") || t.includes("run")) return "walk-run";
  if (t.includes("health") || t.includes("medical") || t.includes("blood") || t.includes("dental")) return "health";
  if (t.includes("food") || t.includes("hunger") || t.includes("pantry")) return "food-drive";
  if (t.includes("education") || t.includes("school") || t.includes("scholarship")) return "education";
  if (t.includes("environment") || t.includes("green") || t.includes("tree") || t.includes("clean")) return "environmental";
  if (t.includes("relief") || t.includes("disaster") || t.includes("hurricane") || t.includes("flood")) return "humanitarian";
  return "community";
}

/** Build old-site slug from center city+state. Matches common patterns. */
function oldSlug(city: string, state: string): string {
  const c = city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const s = state.toLowerCase();
  return `${c}-${s}`;
}

async function fetchCenterNews(oldPath: string): Promise<{ title: string; date: string | null; description: string; photoUrl: string | null }[]> {
  const url = `${OLD_BASE}/${oldPath}/`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return [];
    const html = await res.text();

    const items: { title: string; date: string | null; description: string; photoUrl: string | null }[] = [];

    // Parse article/news entries — old site uses <h2 class="entry-title"> and <div class="entry-summary">
    const articleRe = /<article[^>]*>([\s\S]*?)<\/article>/gi;
    let match;
    while ((match = articleRe.exec(html)) !== null) {
      const block = match[1];

      const titleMatch = block.match(/<h2[^>]*class="[^"]*entry-title[^"]*"[^>]*>\s*<a[^>]*>([^<]+)<\/a>/i)
        ?? block.match(/<h2[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i);
      if (!titleMatch) continue;
      const title = titleMatch[1].trim();

      const dateMatch = block.match(/datetime="([^"]+)"/i) ?? block.match(/<time[^>]*>([^<]+)<\/time>/i);
      const rawDate = dateMatch ? dateMatch[1].trim() : null;
      let date: string | null = null;
      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) date = d.toISOString().split("T")[0];
      }

      const descMatch = block.match(/<div[^>]*class="[^"]*entry-summary[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim().slice(0, 400) : "";

      const imgMatch = block.match(/<img[^>]+src="([^"]+)"/i);
      const photoUrl = imgMatch ? imgMatch[1] : null;

      items.push({ title, date, description, photoUrl });
    }
    return items;
  } catch {
    return [];
  }
}

async function main() {
  console.log("Fetching centers from Supabase…");
  const { data: centers, error } = await supabase.from("centers").select("id, city, state, slug");
  if (error) { console.error(error.message); process.exit(1); }

  let inserted = 0, skipped = 0, failed = 0;

  for (const center of (centers ?? []) as { id: string; city: string; state: string; slug: string }[]) {
    const path = oldSlug(center.city, center.state);
    console.log(`  → ${center.city}, ${center.state} (${OLD_BASE}/${path}/)`);

    const articles = await fetchCenterNews(path);
    if (articles.length === 0) { console.log(`     (no articles found)`); continue; }

    for (const a of articles) {
      const slug = slugify(a.title);
      const { error: insertErr } = await supabase.from("center_events").insert({
        center_id: center.id,
        slug,
        title: a.title,
        event_type: inferType(a.title),
        event_date: a.date,
        description: a.description || null,
        photo_url: a.photoUrl || null,
        is_published: true,
        source: "migrated",
      });
      if (insertErr) {
        if (insertErr.code === "23505") { skipped++; } // unique violation — already exists
        else { console.warn(`     WARN: ${a.title} — ${insertErr.message}`); failed++; }
      } else {
        inserted++;
      }
    }
    await new Promise((r) => setTimeout(r, 300)); // polite delay
  }

  console.log(`\nDone. Inserted: ${inserted} | Skipped (duplicate): ${skipped} | Failed: ${failed}`);
}

main();
