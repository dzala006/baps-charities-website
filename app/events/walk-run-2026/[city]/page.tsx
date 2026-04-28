import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "../../../components/PageShell";
import Breadcrumb from "../../../components/Breadcrumb";
import { supabase } from "../../../lib/supabase";

export const revalidate = 3600;

type WalkCity = {
  id: number;
  city: string;
  state: string;
  slug: string;
  date_display: string | null;
  venue: string | null;
  beneficiary: string | null;
  confirmed: boolean;
  registration_url: string | null;
};

async function getCityBySlug(slug: string): Promise<WalkCity | null> {
  const { data } = await supabase
    .from("walk_cities")
    .select("id, city, state, slug, date_display, venue, beneficiary, confirmed, registration_url")
    .eq("slug", slug)
    .single();
  return data ?? null;
}

async function getAllCitySlugs(): Promise<string[]> {
  const { data } = await supabase.from("walk_cities").select("slug");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function generateStaticParams() {
  const slugs = await getAllCitySlugs();
  return slugs.map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const cityData = await getCityBySlug(slug);
  if (!cityData) return { title: "City Not Found" };
  return {
    title: `${cityData.city}, ${cityData.state} — Walk | Run 2026`,
    description: `BAPS Charities Walk | Run 2026 in ${cityData.city}, ${cityData.state}. ${cityData.date_display ?? ""} ${cityData.venue ?? ""}`.trim(),
    alternates: {
      canonical: `https://baps-charities-website.vercel.app/events/walk-run-2026/${slug}`,
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  const registerUrl = city.registration_url ?? "https://walk2026.na.bapscharities.org";

  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "#2a241f", color: "#fff", padding: "96px 32px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Events", href: "/events" },
              { label: "Walk | Run 2026", href: "/events/walk-run-2026" },
              { label: `${city.city}, ${city.state}` },
            ]}
          />
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 24, marginBottom: 16 }}>
            {city.confirmed && (
              <span style={{ padding: "5px 12px", background: "#4f7a3a", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 4, color: "#fff" }}>
                Confirmed
              </span>
            )}
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#b1aca7" }}>
              Walk | Run 2026
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 80px)", lineHeight: 1.05, margin: 0, letterSpacing: "-0.015em" }}>
            {city.city}, {city.state}
          </h1>
          {city.date_display && (
            <p style={{ fontSize: 22, color: "#CF3728", marginTop: 16, fontWeight: 600 }}>{city.date_display}</p>
          )}
          {city.venue && (
            <p style={{ fontSize: 16, color: "#b1aca7", marginTop: 8 }}>{city.venue}</p>
          )}
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href={registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "16px 32px", background: "#8E191D", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}
            >
              Register Now →
            </a>
            <Link
              href="/events/walk-run-2026"
              style={{ padding: "16px 28px", background: "transparent", color: "#E4DFDA", border: "1px solid #5c5249", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}
            >
              ← All Cities
            </Link>
          </div>
        </div>
      </section>

      {/* Event details */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 64 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 36, color: "#2a241f", margin: "0 0 32px" }}>About this walk</h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4C4238" }}>
              The BAPS Charities Walk | Run is an annual 3K community event raising funds for local beneficiaries while promoting health and selfless service. The event is fully organized by local volunteers.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4C4238", marginTop: 16 }}>
              Bring your family and friends. Walk for someone you love. At 3K, the trail welcomes all ages and abilities, with free parking at the venue.
            </p>

            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 26, color: "#2a241f", marginTop: 48, marginBottom: 20 }}>What to expect</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                ["Volunteer welcome table", "Name tag and t-shirt pickup upon arrival"],
                ["Opening ceremony", "Speeches and ribbon-cutting to kick off the event"],
                ["3K Walk / Run", "Trail through a local park — all ages welcome"],
                ["Sponsor booths", "Community partners along the route"],
                ["Check presentation", "Beneficiary receives funds on stage"],
                ["Post-walk family festival", "Celebration for all ages after the walk"],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid #E4DFDA" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#8E191D", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 2 }}>✓</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#2a241f", fontSize: 15 }}>{title}</div>
                    <div style={{ fontSize: 13, color: "#7a716a", marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Register card */}
            <div style={{ background: "#2a241f", color: "#fff", borderRadius: 4, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728" }}>Register</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 22, margin: "8px 0 12px", lineHeight: 1.2 }}>Walk with us in {city.city}</h3>
              <div style={{ fontSize: 14, color: "#b1aca7", lineHeight: 1.7, marginBottom: 20 }}>
                $15 per person · All ages · 3K trail walk/run · Free parking
              </div>
              <a
                href={registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", padding: "15px 0", background: "#CF3728", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}
              >
                Register at walk2026.na.bapscharities.org →
              </a>
            </div>

            {/* Date & venue card */}
            <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 16 }}>Event details</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {city.date_display && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b1aca7", marginBottom: 4 }}>Date</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#2a241f" }}>{city.date_display}</div>
                  </div>
                )}
                {city.venue && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b1aca7", marginBottom: 4 }}>Venue</div>
                    <div style={{ fontSize: 14, color: "#4C4238", lineHeight: 1.5 }}>{city.venue}</div>
                  </div>
                )}
                {city.beneficiary && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b1aca7", marginBottom: 4 }}>Local beneficiary</div>
                    <div style={{ fontSize: 14, color: "#4f7a3a", fontWeight: 600 }}>{city.beneficiary}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b1aca7", marginBottom: 4 }}>Registration fee</div>
                  <div style={{ fontSize: 14, color: "#4C4238" }}>$15 per person</div>
                </div>
              </div>
            </div>

            {/* Questions card */}
            <div style={{ background: "#faf7f3", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 12 }}>Questions?</div>
              <div style={{ fontSize: 13, color: "#4C4238", lineHeight: 1.7 }}>
                <a href="mailto:info@bapscharities.org" style={{ color: "#8E191D", fontWeight: 600 }}>info@bapscharities.org</a>
                <br />
                <a href="https://walk2026.na.bapscharities.org" target="_blank" rel="noopener noreferrer" style={{ color: "#8E191D", fontWeight: 600, marginTop: 4, display: "block" }}>walk2026.na.bapscharities.org →</a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
