import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageShell from "../../components/PageShell";
import Breadcrumb from "../../components/Breadcrumb";
import { supabase } from "../../lib/supabase";

export const revalidate = 3600;

type CenterEvent = {
  id: string;
  slug: string;
  title: string;
  event_type: string;
  event_date: string | null;
  description: string | null;
  photo_url: string | null;
};

const EVENT_TYPE_LABEL: Record<string, string> = {
  "walk-run": "Walk | Run", health: "Health", education: "Education",
  humanitarian: "Humanitarian Relief", environmental: "Environmental",
  "food-drive": "Food Drive", community: "Community", other: "Event",
};

const EVENT_TYPE_COLOR: Record<string, string> = {
  "walk-run": "#8E191D", health: "#1a6b3a", education: "#1a4a6b",
  humanitarian: "#8E191D", environmental: "#3a6b1a", "food-drive": "#6b4a1a",
  community: "#4a1a6b", other: "#7a716a",
};

type Center = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  photo_url: string | null;
  regions: { name: string } | null;
};

type WalkStat = {
  year: number | null;
  walkers_count: number | null;
  funds_raised: number | null;
  beneficiary: string | null;
};

async function getCenterBySlug(slug: string): Promise<Center | null> {
  const { data } = await supabase
    .from("centers")
    .select("id, name, slug, city, state, address, photo_url, primary_contact_phone, primary_contact_email, regions(name)")
    .eq("slug", slug)
    .single();
  if (!data) return null;
  const row = data as Record<string, unknown>;
  return {
    ...(row as unknown as Center),
    phone: (row.primary_contact_phone as string) ?? null,
    email: (row.primary_contact_email as string) ?? null,
  };
}

async function getCenterEvents(centerId: string): Promise<CenterEvent[]> {
  const { data } = await supabase
    .from("center_events")
    .select("id, slug, title, event_type, event_date, description, photo_url")
    .eq("center_id", centerId)
    .eq("is_published", true)
    .order("event_date", { ascending: false })
    .limit(20);
  return (data as CenterEvent[]) ?? [];
}

async function getWalkStats(centerId: number): Promise<WalkStat[]> {
  const { data } = await supabase
    .from("walkathons")
    .select("year, walkers_count, funds_raised, beneficiary")
    .eq("center_id", centerId)
    .order("year", { ascending: false })
    .limit(5);
  return (data as WalkStat[]) ?? [];
}

async function getAllSlugs(): Promise<string[]> {
  const { data } = await supabase.from("centers").select("slug");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const center = await getCenterBySlug(slug);
  if (!center) return { title: "Center Not Found" };
  return {
    title: `BAPS Center — ${center.city}, ${center.state}`,
    description: `BAPS Charities center in ${center.city}, ${center.state}. Discover volunteer opportunities and local programs.`,
    alternates: {
      canonical: `https://baps-charities-website.vercel.app/centers/${slug}`,
    },
  };
}

export default async function CenterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const center = await getCenterBySlug(slug);
  if (!center) notFound();

  const [walkStats, centerEvents] = await Promise.all([
    getWalkStats(center.id),
    getCenterEvents(String(center.id)),
  ]);

  return (
    <PageShell>
      <section style={{ background: "#2a241f", color: "#fff", padding: "96px 32px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Find a Center", href: "/find-a-center" },
              { label: `${center.city}, ${center.state}` },
            ]}
          />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginTop: 24, marginBottom: 16 }}>
            {center.regions?.name ?? "BAPS Center"}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 80px)", lineHeight: 1.05, margin: 0, letterSpacing: "-0.015em" }}>
            {center.city}, {center.state}
          </h1>
          {center.name && center.name !== center.city && (
            <p style={{ fontSize: 18, color: "#b1aca7", marginTop: 12 }}>{center.name}</p>
          )}
        </div>
      </section>

      {/* Center hero image */}
      <section style={{ background: "#2a241f" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 0" }}>
          <div style={{ position: "relative", aspectRatio: "16/5", width: "100%", overflow: "hidden", background: "#c9bdb1" }}>
            <Image
              src={center.photo_url ?? "https://media.bapscharities.org/2026/01/15014830/DP1_6670-1024x683.jpg"}
              alt={`${center.name} BAPS Center`}
              fill
              style={{ objectFit: "cover", opacity: 0.7 }}
              sizes="(max-width: 768px) 100vw, 1280px"
            />
          </div>
        </div>
      </section>

      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 64 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 36, color: "#2a241f", margin: "0 0 32px" }}>About this center</h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4C4238" }}>
              The BAPS center in {center.city} is part of a network of over 100 centers across North America, each serving its local community through health, education, environmental, and humanitarian programs — all powered by volunteers.
            </p>

            {walkStats.length > 0 && (
              <>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, color: "#2a241f", marginTop: 48, marginBottom: 20 }}>Walk | Run History</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {walkStats.map((w, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 24, padding: "20px 0", borderBottom: "1px solid #E4DFDA" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#8E191D", fontWeight: 400 }}>{w.year ?? "—"}</div>
                      <div>
                        {w.beneficiary && <div style={{ fontWeight: 600, color: "#4f7a3a", fontSize: 14 }}>Beneficiary: {w.beneficiary}</div>}
                        <div style={{ fontSize: 13, color: "#7a716a", marginTop: 4, display: "flex", gap: 20 }}>
                          {w.walkers_count != null && <span>{w.walkers_count.toLocaleString()} walkers</span>}
                          {w.funds_raised != null && <span>${w.funds_raised.toLocaleString()} raised</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {centerEvents.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 32, color: "#2a241f", margin: "0 0 8px" }}>
                  Events &amp; Activities
                </h2>
                <p style={{ fontSize: 14, color: "#7a716a", marginBottom: 28 }}>
                  {centerEvents.length} event{centerEvents.length !== 1 ? "s" : ""} from this center
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {centerEvents.map((ev) => {
                    const color = EVENT_TYPE_COLOR[ev.event_type] ?? "#7a716a";
                    const label = EVENT_TYPE_LABEL[ev.event_type] ?? "Event";
                    const dateStr = ev.event_date
                      ? new Date(ev.event_date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                      : null;
                    return (
                      <Link
                        key={ev.id}
                        href={`/centers/${center.slug}/events/${ev.slug}`}
                        style={{ display: "grid", gridTemplateColumns: ev.photo_url ? "100px 1fr" : "1fr", gap: 16, padding: "20px 0", borderBottom: "1px solid #E4DFDA", textDecoration: "none", alignItems: "center" }}
                      >
                        {ev.photo_url && (
                          <div style={{ position: "relative", width: 100, height: 70, borderRadius: 4, overflow: "hidden", background: "#E4DFDA", flexShrink: 0 }}>
                            <img src={ev.photo_url} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color, background: color + "15", padding: "3px 8px", borderRadius: 999 }}>{label}</span>
                            {dateStr && <span style={{ fontSize: 12, color: "#7a716a" }}>{dateStr}</span>}
                          </div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#2a241f", fontWeight: 400, lineHeight: 1.25, marginBottom: 4 }}>{ev.title}</div>
                          {ev.description && <div style={{ fontSize: 13, color: "#7a716a", lineHeight: 1.5 }}>{ev.description.slice(0, 120)}{ev.description.length > 120 ? "…" : ""}</div>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: 48 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, color: "#2a241f", marginBottom: 20 }}>Get Involved</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {[
                  { title: "Volunteer", desc: "Join local service projects and community events.", href: "/get-involved" },
                  { title: "Walk | Run 2026", desc: "Register for the annual walkathon in your city.", href: "/events/walk-run-2026" },
                  { title: "Donate", desc: "Support programs in your community.", href: "/donate" },
                  { title: "Sponsor", desc: "Partner with us for the Walk | Run.", href: "/sponsorship" },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 20, textDecoration: "none", display: "block" }}
                  >
                    <div style={{ fontWeight: 600, color: "#2a241f", fontSize: 15 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "#7a716a", marginTop: 4 }}>{item.desc}</div>
                    <div style={{ fontSize: 12, color: "#8E191D", fontWeight: 600, marginTop: 8 }}>Learn more →</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Contact card */}
            <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 16 }}>Center info</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b1aca7", marginBottom: 4 }}>Location</div>
                  <div style={{ fontSize: 14, color: "#4C4238" }}>{center.city}, {center.state}</div>
                  {center.address && <div style={{ fontSize: 13, color: "#7a716a", marginTop: 2 }}>{center.address}</div>}
                </div>
                {center.regions?.name && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b1aca7", marginBottom: 4 }}>Region</div>
                    <div style={{ fontSize: 14, color: "#4C4238" }}>{center.regions.name}</div>
                  </div>
                )}
                {center.email && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b1aca7", marginBottom: 4 }}>Email</div>
                    <a href={`mailto:${center.email}`} style={{ fontSize: 14, color: "#8E191D" }}>{center.email}</a>
                  </div>
                )}
                {center.phone && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b1aca7", marginBottom: 4 }}>Phone</div>
                    <a href={`tel:${center.phone}`} style={{ fontSize: 14, color: "#8E191D" }}>{center.phone}</a>
                  </div>
                )}
              </div>
            </div>

            {/* Walk 2026 CTA */}
            <div style={{ background: "#2a241f", color: "#fff", borderRadius: 4, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728" }}>Walk | Run 2026</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 22, margin: "8px 0 12px", lineHeight: 1.2 }}>Walk with us in {center.city}</h3>
              <div style={{ fontSize: 14, color: "#b1aca7", lineHeight: 1.7, marginBottom: 20 }}>
                The annual 3K community walk/run · $15 per person · All ages · Free parking
              </div>
              <a
                href="https://walk2026.na.bapscharities.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", padding: "14px 0", background: "#CF3728", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}
              >
                Register Now →
              </a>
            </div>

            {/* HQ contact */}
            <div style={{ background: "#faf7f3", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 12 }}>General inquiries</div>
              <div style={{ fontSize: 13, color: "#4C4238", lineHeight: 1.7 }}>
                <a href="mailto:info@bapscharities.org" style={{ color: "#8E191D", fontWeight: 600 }}>info@bapscharities.org</a>
                <br />
                112 North Main Street, Suite 301
                <br />
                Robbinsville, NJ 08561
              </div>
            </div>
          </aside>
        </div>
      </section>

      {center.address && (
        <section style={{ padding: "48px 32px", background: "#faf7f3", borderTop: "1px solid #E4DFDA" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 20 }}>
              Location
            </div>
            <div style={{ borderRadius: 4, overflow: "hidden", border: "1px solid #E4DFDA" }}>
              <iframe
                title={`Map of ${center.name}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${center.address}, ${center.city}, ${center.state}`)}&output=embed&zoom=15`}
                width="100%"
                height="360"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: "#7a716a" }}>
              {center.address}, {center.city}, {center.state}
              {" · "}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${center.address}, ${center.city}, ${center.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#8E191D", textDecoration: "none" }}
              >
                Get directions →
              </a>
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
