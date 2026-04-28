import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = { title: "Events — BAPS Charities" };

const CAT_COLOR: Record<string, string> = { Environment: "#4f7a3a", Health: "#8E191D", Education: "#CF3728", Fundraiser: "#c08a2c" };
const CAT_IMAGE: Record<string, string> = {
  Fundraiser: "https://media.bapscharities.org/2026/01/23113836/Embrace-the-Spirit-of-Service-Walk-for-Your-Community.jpg",
  Health: "https://media.bapscharities.org/2025/04/21194012/01.-detroit_anxiety_hlecture_2025-1620x1080.jpg",
  Environment: "https://media.bapscharities.org/2026/01/23113836/Embrace-the-Spirit-of-Service-Walk-for-Your-Community.jpg",
  Education: "https://media.bapscharities.org/2026/01/23113836/Embrace-the-Spirit-of-Service-Walk-for-Your-Community.jpg",
};
const EVENTS = [
  { date: "May 30–Jun 6, 2026", city: "50+ Cities Nationwide", title: "BAPS Charities Walk | Run 2026", cat: "Fundraiser", spots: "~50,000 walkers · $15 registration", slug: "walk-run-2026" },
  { date: "Apr 12, 2026", city: "Atlanta, GA", title: "Spring Health Fair", cat: "Health", spots: "RSVP open", slug: "" },
  { date: "Apr 26, 2026", city: "Toronto, ON", title: "Earth Day Tree Planting", cat: "Environment", spots: "180 volunteers needed", slug: "" },
  { date: "May 10, 2026", city: "Houston, TX", title: "Mother's Day Blood Drive", cat: "Health", spots: "88 / 120 slots", slug: "" },
  { date: "May 24, 2026", city: "Chicago, IL", title: "Youth Leadership Summit", cat: "Education", spots: "Register by Apr 30", slug: "" },
  { date: "Jun 14, 2026", city: "Edison, NJ", title: "Father's Day 5K Run", cat: "Health", spots: "Early bird $35", slug: "" },
  { date: "Jul 4, 2026", city: "Multiple Cities", title: "Independence Day Park Cleanup", cat: "Environment", spots: "32 cities", slug: "" },
  { date: "Aug 9, 2026", city: "Los Angeles, CA", title: "Back‑to‑School Drive", cat: "Education", spots: "2,500 backpacks goal", slug: "" },
  { date: "Sep 13, 2026", city: "Boston, MA", title: "Annual Gala — In the Spirit of Service", cat: "Fundraiser", spots: "Tables from $2,500", slug: "" },
];

export default function EventsPage() {
  return (
    <PageShell>
      <section style={{ background: "#faf7f3", padding: "88px 32px 56px", borderBottom: "1px solid #E4DFDA" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Events" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 16 }}>Upcoming Events</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px,5vw,68px)", lineHeight: 1.05, margin: 0, color: "#2a241f", maxWidth: 900 }}>Show up. Roll up your sleeves.</h1>
        </div>
      </section>
      <section style={{ padding: "56px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {EVENTS.map(e => (
            <Link key={e.title} href={e.slug ? `/events/${e.slug}` : "/events"} style={{ background: "#fff", borderRadius: 4, overflow: "hidden", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", border: "1px solid #E4DFDA" }}>
              <div style={{ position: "relative", aspectRatio: "3/2", width: "100%", overflow: "hidden" }}>
                <Image src={CAT_IMAGE[e.cat] || CAT_IMAGE.Fundraiser} alt={e.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: CAT_COLOR[e.cat] || "#8E191D" }}>{e.cat}</span>
                  <span style={{ fontSize: 12, color: "#7a716a" }}>{e.date}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 22, lineHeight: 1.2, margin: 0, color: "#2a241f" }}>{e.title}</h3>
                <div style={{ fontSize: 13, color: "#4C4238", marginTop: 8 }}>📍 {e.city}</div>
                <div style={{ fontSize: 12, color: "#7a716a", marginTop: 14, paddingTop: 14, borderTop: "1px solid #E4DFDA" }}>{e.spots}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
