import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import PhotoPlaceholder from "../components/PhotoPlaceholder";

export const metadata: Metadata = { title: "Programs — BAPS Charities" };

const PROGRAMS = [
  { id: "health", name: "Health", color: "#8E191D", tagline: "Healing communities, one camp at a time.", body: "Free health camps, blood drives, organ donation registration, and chronic disease screenings — delivered by volunteer physicians, nurses, and technicians at BAPS mandirs across North America.", stats: [{ num: "64", label: "Health camps in 2024" }, { num: "12,400+", label: "Patients served" }, { num: "3,200", label: "Blood donations" }], initiatives: ["Annual Health Fairs", "Blood Drive Network", "Walk Green Wellness Walks", "Organ Donor Registration", "CPR & First Aid Training", "Mental Health Awareness"] },
  { id: "education", name: "Education", color: "#CF3728", tagline: "Learning is service. Service is learning.", body: "Scholarships, tutoring programs, character‑education workshops, and youth leadership development — designed to nurture both academic excellence and ethical grounding.", stats: [{ num: "$420K", label: "Scholarships awarded" }, { num: "180", label: "Students supported" }, { num: "24", label: "Tutoring chapters" }], initiatives: ["Merit Scholarships", "After‑School Tutoring", "Character Building Workshops", "College Application Mentorship", "STEM Outreach", "Youth Leadership Conferences"] },
  { id: "environment", name: "Environment", color: "#4f7a3a", tagline: "A greener world is a kinder world.", body: "Tree planting, park cleanups, recycling drives, and the flagship Walk Green initiative — turning environmental stewardship into a community ritual.", stats: [{ num: "88,000", label: "Trees planted" }, { num: "210", label: "Cleanup events" }, { num: "32", label: "Walk Green cities" }], initiatives: ["Walk Green", "Tree Planting Drives", "Park & River Cleanups", "Recycling & E‑Waste Drives", "Community Gardens", "Earth Day Programs"] },
  { id: "humanitarian", name: "Humanitarian Relief", color: "#c08a2c", tagline: "When disaster strikes, we are already mobilizing.", body: "Rapid disaster response, food drives, winter clothing collections, and partnerships with regional food banks and shelters across North America.", stats: [{ num: "$1.4M", label: "Disaster relief 2024" }, { num: "180,000", label: "Meals served" }, { num: "14", label: "Major responses" }], initiatives: ["Disaster Relief Fund", "Food Bank Partnerships", "Winter Coat Drives", "Refugee Support", "Hurricane / Wildfire Response", "Holiday Meal Programs"] },
  { id: "community", name: "Community Empowerment", color: "#4a6b7a", tagline: "Strong families build strong communities.", body: "Workshops on parenting, financial literacy, addiction recovery, and women's empowerment — building the social fabric that holds everything else together.", stats: [{ num: "90+", label: "Workshops / year" }, { num: "8,500", label: "Participants" }, { num: "38", label: "Partner orgs" }], initiatives: ["Parenting Series", "Financial Literacy", "Anti‑Addiction Campaigns", "Women's Empowerment", "Senior Wellness", "Newcomer Support"] },
];

export default function ProgramsPage() {
  return (
    <PageShell>
      <section style={{ background: "#faf7f3", padding: "88px 32px 56px", borderBottom: "1px solid #E4DFDA" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Programs" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 16 }}>What We Do</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px,5vw,68px)", lineHeight: 1.05, margin: 0, color: "#2a241f", maxWidth: 1000 }}>Five pillars of service. One unbroken thread.</h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: "#4C4238", maxWidth: 720, marginTop: 24 }}>Health, education, environment, humanitarian relief, and community empowerment. Each program operates independently — and every one is rooted in the same principle: service is the highest form of worship.</p>
        </div>
      </section>
      <section style={{ padding: "64px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {PROGRAMS.map((p, i) => (
            <article key={p.id} style={{ background: "#fff", borderRadius: 4, overflow: "hidden", display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1.4fr" : "1.4fr 1fr", boxShadow: "0 2px 6px rgba(76,66,56,0.08)" }}>
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}><PhotoPlaceholder label={`${p.name} program`} ratio="4/3" /></div>
              <div style={{ padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, background: p.color, borderRadius: 4 }} />
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: p.color }}>0{i + 1} · {p.name}</div>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 36, lineHeight: 1.1, margin: 0, color: "#2a241f" }}>{p.tagline}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4C4238", marginTop: 18 }}>{p.body}</p>
                <div style={{ display: "flex", gap: 32, marginTop: 28, paddingTop: 24, borderTop: "1px solid #E4DFDA" }}>
                  {p.stats.map(s => (
                    <div key={s.label}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: p.color, lineHeight: 1 }}>{s.num}</div>
                      <div style={{ fontSize: 11, color: "#7a716a", marginTop: 6, letterSpacing: "0.04em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 12 }}>Initiatives</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {p.initiatives.map(it => <span key={it} style={{ fontSize: 12, padding: "6px 12px", background: "#faf7f3", color: "#4C4238", borderRadius: 999 }}>{it}</span>)}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
