"use client";
import { useState } from "react";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import Link from "next/link";

const WAYS = [
  { cat: "Volunteer", title: "Volunteer locally", body: "Join one of 80+ volunteer chapters across North America. Health camps, tutoring, environmental drives — find a fit near you.", cta: "Find a chapter" },
  { cat: "Donate", title: "One‑time gift", body: "Direct support for the program of your choice — health, education, environment, humanitarian relief, or general fund.", cta: "Donate now" },
  { cat: "Donate", title: "Recurring giving", body: "Sustaining members enable us to plan multi‑year initiatives. Set it and forget it; cancel anytime.", cta: "Set up monthly" },
  { cat: "Donate", title: "Workplace matching", body: "Many North American employers match charitable gifts dollar‑for‑dollar. Check if yours does.", cta: "Check matching" },
  { cat: "Donate", title: "Stocks & DAFs", body: "Donor‑advised funds, appreciated securities, and IRA qualified charitable distributions are welcomed.", cta: "Plan a gift" },
  { cat: "Volunteer", title: "Skills‑based volunteering", body: "Physicians, attorneys, accountants, designers, software engineers — your professional skills are needed.", cta: "Apply skills" },
  { cat: "Volunteer", title: "Youth & student leaders", body: "High school and college students lead chapters, organize events, and earn service hours that matter.", cta: "Youth program" },
  { cat: "Partner", title: "Corporate partnership", body: "Sponsor an event, co‑host a health fair, or build a multi‑year giving partnership with measurable impact.", cta: "Talk to us" },
  { cat: "Partner", title: "NGO collaboration", body: "We partner with hospitals, food banks, parks departments, and community orgs across 12 regions.", cta: "Partner with us" },
];

export default function GetInvolvedPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? WAYS : WAYS.filter(w => w.cat === filter);
  return (
    <PageShell>
      <section style={{ background: "#8E191D", color: "#fff", padding: "88px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb tone="light" items={[{ label: "Home", href: "/" }, { label: "Get Involved" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f9e2dd", marginBottom: 16 }}>Get Involved</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px,5vw,72px)", lineHeight: 1.05, margin: 0, maxWidth: 1000 }}>
            Service is not what you give.<br /><em style={{ color: "#f9e2dd", fontStyle: "italic" }}>It is who you become.</em>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: "#f1dcdd", maxWidth: 700, marginTop: 28 }}>There is a place for you here — whether you have an hour a year, an evening a month, or a career to dedicate.</p>
        </div>
      </section>
      <section style={{ padding: "56px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
            {["All", "Volunteer", "Donate", "Partner"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "10px 20px", borderRadius: 999, border: "1px solid #c9c2bb", background: filter === f ? "#2a241f" : "#fff", color: filter === f ? "#fff" : "#4C4238", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{f}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {filtered.map(w => (
              <div key={w.title} style={{ background: "#fff", padding: 32, borderRadius: 4, border: "1px solid #E4DFDA", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 8 }}>{w.cat}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 24, lineHeight: 1.2, margin: 0, color: "#2a241f" }}>{w.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "#4C4238", marginTop: 12, flex: 1 }}>{w.body}</p>
                <Link href="/donate" style={{ marginTop: 20, fontSize: 13, fontWeight: 600, color: "#8E191D", textDecoration: "none" }}>{w.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
