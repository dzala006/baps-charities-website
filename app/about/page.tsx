import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import PhotoPlaceholder from "../components/PhotoPlaceholder";

export const metadata: Metadata = { title: "About — BAPS Charities" };

const STATS = [{ num: "12", label: "Countries" }, { num: "50,000+", label: "Walkers annually" }, { num: "662K+", label: "Lbs food distributed (Canada 2025)" }, { num: "100%", label: "Volunteer‑run" }];
const TIMELINE = [
  { year: "1945", title: "BAPS founded", body: "Bochasanwasi Akshar Purushottam Sanstha is established by Shastriji Maharaj in Gujarat, India." },
  { year: "2000", title: "BAPS Care International founded", body: "Established as an independent charitable organization to extend service across North America and beyond." },
  { year: "2001", title: "Gujarat earthquake response", body: "Coordinated relief and reconstruction efforts; rebuilt 16 villages and a hospital." },
  { year: "2007", title: "Renamed BAPS Charities", body: "Organization renamed to BAPS Charities, now active in 12 countries across five continents." },
];
const LEADERS = [
  { name: "Mahant Swami Maharaj", role: "Spiritual Guide" },
  { name: "Board of Trustees", role: "Governance — 7 members" },
  { name: "Regional Directors", role: "12 regions across NA" },
  { name: "Program Leads", role: "Health · Education · Environment" },
];

export default function AboutPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "#4C4238", color: "#E4DFDA", padding: "88px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb tone="light" items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 16 }}>About BAPS Charities</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px,5vw,72px)", lineHeight: 1.05, margin: 0, color: "#fff", maxWidth: 1000 }}>
            A global, volunteer‑driven movement <em style={{ color: "#CF3728", fontStyle: "italic" }}>in the spirit of service.</em>
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: "#b1aca7", maxWidth: 720, marginTop: 28 }}>
            Inspired by the teachings of His Holiness Pramukh Swami Maharaj and guided by His Holiness Mahant Swami Maharaj, BAPS Charities is a worldwide non‑profit serving humanity through health, education, environmental, and humanitarian initiatives.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "96px 32px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 20 }}>Our Mission</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.15, margin: 0, color: "#2a241f" }}>
              To care for the world by caring for societies, families, and individuals.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4C4238", marginTop: 28 }}>
              BAPS Charities operates as a registered 501(c)(3) nonprofit in North America, with sister organizations across 12 countries on five continents. Every dollar donated, every hour volunteered, and every life touched is part of a single, unbroken thread: service as worship.
            </p>
            <div style={{ marginTop: 32, padding: 28, background: "#fff", borderLeft: "3px solid #8E191D" }}>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.5, color: "#2a241f" }}>"In the joy of others lies our own."</div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginTop: 14 }}>— Pramukh Swami Maharaj</div>
            </div>
          </div>
          <PhotoPlaceholder label="Pramukh Swami Maharaj — archival portrait" ratio="3/4" />
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "88px 32px", background: "#2a241f", color: "#E4DFDA" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 20 }}>By the numbers</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 48, lineHeight: 1.1, margin: 0, color: "#fff", maxWidth: 800 }}>Service measured in hands raised, not headlines.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, marginTop: 64, borderTop: "1px solid #5c5249" }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ padding: "40px 24px", borderRight: i < 3 ? "1px solid #5c5249" : "none" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 64, lineHeight: 1, color: "#CF3728" }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "#b1aca7", marginTop: 12, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "96px 32px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 20 }}>Our History</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.15, margin: 0, color: "#2a241f", maxWidth: 700 }}>25 years of quiet, persistent service.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32, marginTop: 56 }}>
            {TIMELINE.map(m => (
              <div key={m.year} style={{ borderTop: "2px solid #8E191D", paddingTop: 20 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "#8E191D", lineHeight: 1 }}>{m.year}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#2a241f", marginTop: 12 }}>{m.title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "#4C4238", marginTop: 8 }}>{m.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section style={{ padding: "96px 32px", background: "#fdfcfa" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 20 }}>Leadership</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.15, margin: 0, color: "#2a241f", maxWidth: 700 }}>Guided by spiritual leaders. Run by volunteers.</h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4C4238", maxWidth: 680, marginTop: 20 }}>BAPS Charities North America is governed by a volunteer Board of Trustees and operated by 5,000+ volunteers across the United States and Canada. No paid staff. No overhead consultants.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32, marginTop: 56 }}>
            {LEADERS.map(p => (
              <div key={p.name}>
                <PhotoPlaceholder label={p.name} ratio="1/1" />
                <div style={{ fontSize: 16, fontWeight: 600, color: "#2a241f", marginTop: 16 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: "#7a716a", marginTop: 4 }}>{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
