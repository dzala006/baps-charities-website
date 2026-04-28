import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../../components/PageShell";
import Breadcrumb from "../../components/Breadcrumb";
import Walk2027Form from "./Walk2027Form";

export const metadata: Metadata = {
  title: "Walk | Run 2027 — Interest Registration",
  description: "Be the first to know when BAPS Charities Walk | Run 2027 registration opens in your city.",
};

const CITIES_2026 = [
  "Atlanta, GA", "Boston, MA", "Chicago, IL", "Los Angeles, CA", "Philadelphia, PA",
  "Roanoke, VA", "San Francisco, CA", "West Chicago, IL", "Boca Raton, FL",
  "Irving (Dallas), TX", "Miami, FL", "New York City, NY", "Sacramento, CA",
];

export default function Walk2027Page() {
  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "#2a241f", color: "#fff", padding: "96px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb tone="light" items={[{ label: "Home", href: "/" }, { label: "Events", href: "/events" }, { label: "Walk | Run 2027" }]} />
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 24, marginBottom: 16 }}>
            <span style={{ padding: "5px 12px", background: "#CF3728", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 4 }}>Coming 2027</span>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#b1aca7" }}>Interest Registration Open</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(48px, 6vw, 96px)", lineHeight: 1, margin: 0, letterSpacing: "-0.015em" }}>
            Walk | Run 2027
          </h1>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24, color: "#E4DFDA", marginTop: 20 }}>
            The Spirit of Service continues.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#b1aca7", maxWidth: 640, marginTop: 20 }}>
            Registration for 2027 is not yet open. Register your interest below and we&apos;ll notify you the moment your city opens — before the public announcement.
          </p>
          <div style={{ marginTop: 32 }}>
            <Link href="/events/walk-run-2026" style={{ padding: "14px 28px", background: "transparent", color: "#E4DFDA", border: "1px solid #5c5249", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
              View 2026 Walk →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ background: "#3d3530" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 32px", display: "flex", gap: 48, flexWrap: "wrap" }}>
          {[["50,000+", "walkers in 2026"], ["50+", "cities"], ["20+", "years running"], ["100%", "volunteer-driven"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#CF3728", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7a716a", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 420px", gap: 80 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 40, color: "#2a241f", margin: "0 0 24px" }}>
              2026 host cities
            </h2>
            <p style={{ fontSize: 15, color: "#7a716a", marginTop: 0, marginBottom: 32 }}>
              All 13 confirmed 2026 cities are expected to return in 2027, alongside new additions. Register your interest to be notified when your city opens.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {CITIES_2026.map((city) => (
                <div key={city} style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8E191D", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "#2a241f", fontWeight: 500 }}>{city}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 48, padding: 28, background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 16 }}>About the walk</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "#4C4238", lineHeight: 1.7 }}>
                <div>📍 3K trail walk/run · all ages · free parking</div>
                <div>💛 $15 registration per person</div>
                <div>🤝 100% volunteer organized and managed</div>
                <div>🏥 Local beneficiary receives funds on stage</div>
              </div>
            </div>
          </div>

          {/* Interest form */}
          <div>
            <Walk2027Form />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
