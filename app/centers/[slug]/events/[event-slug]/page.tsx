import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageShell from "../../../../components/PageShell";
import Breadcrumb from "../../../../components/Breadcrumb";
import { supabase } from "../../../../lib/supabase";

type EventRow = {
  id: string;
  title: string;
  slug: string;
  event_type: string;
  event_date: string | null;
  description: string | null;
  body: string | null;
  photo_url: string | null;
  external_url: string | null;
};

type CenterRow = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
};

const TYPE_LABEL: Record<string, string> = {
  "walk-run": "Walk | Run",
  health: "Health",
  education: "Education",
  humanitarian: "Humanitarian Relief",
  environmental: "Environmental",
  "food-drive": "Food Drive",
  community: "Community",
  other: "Event",
};

async function getCenter(slug: string): Promise<CenterRow | null> {
  const { data } = await supabase
    .from("centers")
    .select("id, name, slug, city, state")
    .eq("slug", slug)
    .single();
  return (data as CenterRow) ?? null;
}

async function getEvent(centerId: string, eventSlug: string): Promise<EventRow | null> {
  const { data } = await supabase
    .from("center_events")
    .select("id, title, slug, event_type, event_date, description, body, photo_url, external_url")
    .eq("center_id", centerId)
    .eq("slug", eventSlug)
    .eq("is_published", true)
    .single();
  return (data as EventRow) ?? null;
}

async function getRelatedEvents(centerId: string, currentId: string): Promise<EventRow[]> {
  const { data } = await supabase
    .from("center_events")
    .select("id, title, slug, event_type, event_date, description, photo_url")
    .eq("center_id", centerId)
    .eq("is_published", true)
    .neq("id", currentId)
    .order("event_date", { ascending: false })
    .limit(3);
  return (data as EventRow[]) ?? [];
}

export async function generateStaticParams() {
  const { data: centers } = await supabase.from("centers").select("slug, id");
  if (!centers) return [];
  const params: { slug: string; "event-slug": string }[] = [];
  for (const c of centers as { slug: string; id: string }[]) {
    const { data: events } = await supabase
      .from("center_events")
      .select("slug")
      .eq("center_id", c.id)
      .eq("is_published", true);
    for (const e of (events ?? []) as { slug: string }[]) {
      params.push({ slug: c.slug, "event-slug": e.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; "event-slug": string }>;
}): Promise<Metadata> {
  const { slug, "event-slug": eventSlug } = await params;
  const center = await getCenter(slug);
  if (!center) return { title: "Not Found" };
  const event = await getEvent(center.id, eventSlug);
  if (!event) return { title: "Not Found" };
  return {
    title: `${event.title} — ${center.city}, ${center.state} | BAPS Charities`,
    description: event.description ?? undefined,
  };
}

export default async function CenterEventPage({
  params,
}: {
  params: Promise<{ slug: string; "event-slug": string }>;
}) {
  const { slug, "event-slug": eventSlug } = await params;
  const center = await getCenter(slug);
  if (!center) notFound();

  const event = await getEvent(center.id, eventSlug);
  if (!event) notFound();

  const related = await getRelatedEvents(center.id, event.id);
  const typeLabel = TYPE_LABEL[event.event_type] ?? "Event";
  const dateStr = event.event_date
    ? new Date(event.event_date + "T12:00:00").toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "#2a241f", color: "#fff", padding: "88px 32px 64px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Find a Center", href: "/find-a-center" },
              { label: `${center.city}, ${center.state}`, href: `/centers/${center.slug}` },
              { label: event.title },
            ]}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 24, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728" }}>
              {typeLabel}
            </span>
            {dateStr && (
              <>
                <span style={{ color: "#5c5249" }}>·</span>
                <span style={{ fontSize: 12, color: "#7a716a" }}>{dateStr}</span>
              </>
            )}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(32px,4vw,56px)", lineHeight: 1.1, margin: 0, letterSpacing: "-0.01em" }}>
            {event.title}
          </h1>
          {event.description && (
            <p style={{ fontSize: 18, color: "#b1aca7", marginTop: 20, lineHeight: 1.65, maxWidth: 700 }}>
              {event.description}
            </p>
          )}
        </div>
      </section>

      {/* Photo */}
      {event.photo_url && (
        <div style={{ background: "#1a1510" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", aspectRatio: "16/7", overflow: "hidden" }}>
            <Image
              src={event.photo_url}
              alt={event.title}
              fill
              style={{ objectFit: "cover", opacity: 0.9 }}
              sizes="860px"
              priority
            />
          </div>
        </div>
      )}

      {/* Body */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 280px", gap: 56 }}>
          <div>
            {event.body ? (
              <div
                style={{ fontSize: 17, lineHeight: 1.8, color: "#4C4238" }}
                dangerouslySetInnerHTML={{ __html: event.body.replace(/\n\n/g, "</p><p>").replace(/^/, "<p>").replace(/$/, "</p>") }}
              />
            ) : (
              <p style={{ fontSize: 17, lineHeight: 1.8, color: "#4C4238" }}>
                {event.description}
              </p>
            )}
            {event.external_url && (
              <div style={{ marginTop: 32 }}>
                <a
                  href={event.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", padding: "14px 28px", background: "#8E191D", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}
                >
                  Learn More →
                </a>
              </div>
            )}
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 16 }}>Center</div>
              <div style={{ fontWeight: 600, color: "#2a241f", marginBottom: 4 }}>{center.city}, {center.state}</div>
              <Link
                href={`/centers/${center.slug}`}
                style={{ fontSize: 13, color: "#8E191D", fontWeight: 600 }}
              >
                View all center events →
              </Link>
            </div>

            {related.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 16 }}>More from this center</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/centers/${center.slug}/events/${r.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#CF3728", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                        {TYPE_LABEL[r.event_type] ?? "Event"}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#2a241f", lineHeight: 1.3 }}>{r.title}</div>
                      {r.event_date && (
                        <div style={{ fontSize: 12, color: "#7a716a", marginTop: 4 }}>
                          {new Date(r.event_date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
