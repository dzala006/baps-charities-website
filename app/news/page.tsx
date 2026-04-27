"use client";

import { useState } from "react";
import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import PhotoPlaceholder from "../components/PhotoPlaceholder";

const ARTICLES = [
  { date: "Feb 14, 2026", cat: "Health", title: "Annual Health Fair Network Serves Record 4,200 Patients", excerpt: "Across 18 cities in the U.S. and Canada, volunteer physicians provided free screenings, immunizations, and primary‑care consults during the spring health fair circuit.", read: "4 min read" },
  { date: "Jan 30, 2026", cat: "Environment", title: "Walk Green 2025 Plants 12,000 Trees in 32 Cities", excerpt: "Walkers raised funds for tree planting and climate education in their home communities — the largest Walk Green to date.", read: "3 min read" },
  { date: "Jan 18, 2026", cat: "Humanitarian", title: "Flood Relief Underway in Eastern Kentucky", excerpt: "BAPS Charities volunteers have delivered 28 truckloads of supplies and $180,000 in direct aid to families displaced by the December floods.", read: "5 min read" },
  { date: "Dec 22, 2025", cat: "Education", title: "$420K in Scholarships Awarded to 180 Students", excerpt: "The 2025 Merit Scholarship cohort spans 38 universities and 14 fields of study, including pre‑med, engineering, and public policy.", read: "3 min read" },
  { date: "Nov 11, 2025", cat: "Community", title: "Veterans Day Honor Walk in 22 Cities", excerpt: "Local volunteer chapters partnered with VFW posts to host community walks honoring veterans and active service members.", read: "2 min read" },
  { date: "Oct 4, 2025", cat: "Press", title: "BAPS Charities Earns 4‑Star Charity Navigator Rating — Again", excerpt: "For the seventh consecutive year, the organization has received the highest rating for financial efficiency, transparency, and accountability.", read: "2 min read" },
];

const CATS = ["All", "Health", "Environment", "Education", "Humanitarian", "Community", "Press"];

export default function NewsPage() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? ARTICLES : ARTICLES.filter((a) => a.cat === cat);

  return (
    <PageShell>
      <section style={{ background: "#faf7f3", padding: "88px 32px 56px", borderBottom: "1px solid #E4DFDA" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "News" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 16 }}>News & Press</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 1.05, margin: 0, color: "#2a241f", letterSpacing: "-0.01em", maxWidth: 900 }}>
            Stories from the field.
          </h1>
        </div>
      </section>

      <section style={{ padding: "56px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 40, flexWrap: "wrap" }}>
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid #c9c2bb", background: cat === c ? "#2a241f" : "#fff", color: cat === c ? "#fff" : "#4C4238", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                {c}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {filtered.map((a, i) => (
              <a key={a.title} href="#" style={{ display: "grid", gridTemplateColumns: "280px 1fr auto", gap: 32, padding: "28px 0", borderTop: "1px solid #E4DFDA", borderBottom: i === filtered.length - 1 ? "1px solid #E4DFDA" : "none", textDecoration: "none", color: "inherit", alignItems: "start" }}>
                <PhotoPlaceholder label={a.title.slice(0, 40)} ratio="4/3" />
                <div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12, fontSize: 12 }}>
                    <span style={{ fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8E191D" }}>{a.cat}</span>
                    <span style={{ color: "#7a716a" }}>·</span>
                    <span style={{ color: "#7a716a" }}>{a.date}</span>
                    <span style={{ color: "#7a716a" }}>·</span>
                    <span style={{ color: "#7a716a" }}>{a.read}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, lineHeight: 1.15, margin: 0, color: "#2a241f" }}>{a.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "#4C4238", marginTop: 12 }}>{a.excerpt}</p>
                </div>
                <div style={{ alignSelf: "center", fontSize: 20, color: "#8E191D" }}>→</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
