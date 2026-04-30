import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "../../components/PageShell";
import Breadcrumb from "../../components/Breadcrumb";
import WalkContent from "./WalkContent";
import { getWalkathonByYear } from "../../lib/walkathon";

export const metadata: Metadata = {
  title: "Walk | Run 2026 | BAPS Charities",
  description:
    "BAPS Charities Walk | Run 2026 — 50+ cities, 50,000+ walkers. Register now. $15 per person. All ages welcome.",
};

// Refresh the registration URL link within ~1 minute of an org change to
// walkathons.registration_url for 2026.
export const revalidate = 60;

// Default to the legacy external URL so the page still renders if the DB
// row is somehow unreachable. Replaced at runtime with the live value.
const DEFAULT_WALK2026_URL = "https://walk2026.na.bapscharities.org";

export default async function WalkRun2026Page() {
  const walkathon2026 = await getWalkathonByYear(2026);
  const registrationUrl = walkathon2026?.registration_url ?? DEFAULT_WALK2026_URL;
  return (
    <PageShell>
      {/* Hero */}
      <section style={{ position: "relative", height: 560, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "#4C4238" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 480 }}>
            <Image
              src="https://media.bapscharities.org/2026/01/23113836/Embrace-the-Spirit-of-Service-Walk-for-Your-Community.jpg"
              alt="BAPS Charities Walk & Run 2026"
              fill
              style={{ objectFit: "cover" }}
              sizes="100vw"
              priority
            />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(42,36,31,0.2) 0%, rgba(42,36,31,0.85) 70%, rgba(42,36,31,0.95) 100%)" }} />
        </div>
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "64px 32px 56px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#fff" }}>
          <Breadcrumb tone="light" items={[{ label: "Home", href: "/" }, { label: "Events", href: "/events" }, { label: "Walk | Run 2026" }]} />
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <span style={{ padding: "6px 14px", background: "#8E191D", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", borderRadius: 4 }}>Annual Event</span>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E4DFDA" }}>Spring 2026 &middot; 50+ Cities Nationwide</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 1, margin: 0, letterSpacing: "-0.015em", maxWidth: 1100 }}>
            BAPS Charities Walk | Run 2026
          </h1>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 26, color: "#E4DFDA", marginTop: 16, marginBottom: 0 }}>The Spirit of Service</p>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: "#2a241f", borderBottom: "1px solid #3a322b" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px", display: "flex", gap: 48, flexWrap: "wrap" }}>
          {[
            ["50,000+", "walkers nationwide"],
            ["50+", "cities"],
            ["35+", "states"],
            ["$15", "registration per person"],
            ["20+", "years running"],
          ].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#CF3728", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7a716a", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky action bar */}
      <div style={{ position: "sticky", top: 64, zIndex: 40, background: "#fff", borderBottom: "1px solid #E4DFDA", boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#4C4238" }}>3K walk/run &middot; All ages &middot; Free parking</div>
          <a href={registrationUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "12px 22px", background: "#8E191D", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 4, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Register Now &rarr;
          </a>
        </div>
      </div>

      {/* Main content (tabs — client component) */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <WalkContent registrationUrl={registrationUrl} />
        </div>
      </section>
    </PageShell>
  );
}
