"use client";

import { useState } from "react";
import Link from "next/link";

const WAYS = [
  {
    cat: "Volunteer",
    title: "Join a local centre",
    body: "BAPS Charities has 100+ volunteer centres across the United States and 15 across Canada. Health camps, food drives, tutoring, park cleanups — find what fits. No prior experience needed; all training is provided by fellow volunteers.",
    cta: "Find a centre",
    href: "/find-a-center",
  },
  {
    cat: "Volunteer",
    title: "Health awareness programs",
    body: "Volunteer physicians, nurses, and allied health professionals run free health camps and awareness lectures in cities across North America. If you have a clinical background, your expertise is urgently needed.",
    cta: "Learn more",
    href: "/programs",
  },
  {
    cat: "Volunteer",
    title: "Food drives & food banks",
    body: "Help collect, sort, pack, and deliver food to families in need. BAPS volunteers donated over 662,000 pounds — 33.1 tons — of food to Canadian food banks in a single season. US drives run year-round.",
    cta: "Get started",
    href: "/find-a-center",
  },
  {
    cat: "Volunteer",
    title: "Skills-based service",
    body: "Physicians, attorneys, accountants, engineers, designers — your professional skills power some of our most impactful programs. Healthcare Professionals Conferences, legal clinics, financial literacy workshops: real work, real impact.",
    cta: "Apply your skills",
    href: "/contact",
  },
  {
    cat: "Volunteer",
    title: "Youth & student leaders",
    body: "High school and college students lead chapters, organize annual walks and drives, and earn meaningful service hours. Youth volunteers are the foundation of the next generation of servant leaders.",
    cta: "Youth program",
    href: "/find-a-center",
  },
  {
    cat: "Volunteer",
    title: "Environmental stewardship",
    body: "Tree plantings, river cleanups, recycling drives, Earth Day events — BAPS Charities runs environmental volunteer programs in dozens of cities year-round. Every event starts with a single volunteer.",
    cta: "Join a cleanup",
    href: "/programs",
  },
  {
    cat: "Donate",
    title: "One-time gift",
    body: "Direct support for the program of your choice — health awareness, educational scholarships, environmental protection, humanitarian relief, or the general fund.",
    cta: "Donate now",
    href: "/donate",
  },
  {
    cat: "Donate",
    title: "Recurring giving",
    body: "Sustaining members enable us to plan multi-year initiatives. A monthly gift of any size keeps our programs running between event seasons. Cancel anytime.",
    cta: "Set up monthly giving",
    href: "/donate",
  },
  {
    cat: "Donate",
    title: "Workplace matching",
    body: "Over 7,500 companies offer matching gift programs that can double or triple your contribution at no extra cost. Check with your HR department or search your employer on Double the Donation.",
    cta: "Check if your employer matches",
    href: "https://doublethedonation.com",
  },
  {
    cat: "Donate",
    title: "Stocks & DAFs",
    body: "Donor-advised funds, appreciated securities, and IRA qualified charitable distributions are welcomed. Contact us to arrange a planned gift.",
    cta: "Plan a gift",
    href: "/contact",
  },
  {
    cat: "Partner",
    title: "Corporate partnership",
    body: "Sponsor an annual walk, co-host a community health fair, or build a multi-year giving partnership with clear, measurable impact reporting. We partner with companies of all sizes.",
    cta: "Talk to us",
    href: "/sponsorship",
  },
  {
    cat: "Partner",
    title: "NGO & institution collaboration",
    body: "BAPS Charities partners with hospitals, blood banks, food banks, parks departments, universities, and community organizations across 12 countries on five continents. Reach out to explore joint programs.",
    cta: "Partner with us",
    href: "/contact",
  },
];

export default function GetInvolvedFilter() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? WAYS : WAYS.filter((w) => w.cat === filter);

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
        {["All", "Volunteer", "Donate", "Partner"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "10px 20px", borderRadius: 999, border: "1px solid #c9c2bb", background: filter === f ? "#2a241f" : "#fff", color: filter === f ? "#fff" : "#4C4238", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {filtered.map((w) => (
          <div key={w.title} style={{ background: "#fff", padding: 32, borderRadius: 4, border: "1px solid #E4DFDA", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 8 }}>{w.cat}</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 24, lineHeight: 1.2, margin: 0, color: "#2a241f" }}>{w.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "#4C4238", marginTop: 12, flex: 1 }}>{w.body}</p>
            <Link href={w.href} style={{ marginTop: 20, fontSize: 13, fontWeight: 600, color: "#8E191D", textDecoration: "none" }}>{w.cta} &rarr;</Link>
          </div>
        ))}
      </div>
    </>
  );
}
