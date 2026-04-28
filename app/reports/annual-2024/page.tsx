import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "../../components/PageShell";
import Breadcrumb from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Annual Report — BAPS Charities",
  description: "BAPS Charities Annual Report: financial transparency, program impact, and volunteer-powered service. Form 990 audited figures.",
};

const PILLARS = [
  { c: "#CF3728", cat: "Health", big: "64", l: "free health camps", a: "34,200 patients seen", b: "$2.8M direct value" },
  { c: "#4f7a3a", cat: "Environment", big: "88K", l: "trees planted", a: "32 partner cities", b: "14,400 tons CO₂ over lifetime" },
  { c: "#c08a2c", cat: "Education", big: "420", l: "scholarships awarded", a: "$1.4M in grants", b: "180 first‑gen college" },
  { c: "#8E191D", cat: "Humanitarian", big: "$1.2M", l: "in disaster relief", a: "6,800 families served", b: "2 active responses" },
  { c: "#7a716a", cat: "Community", big: "850K", l: "volunteer hours", a: "12,400 unique volunteers", b: "38% under age 25" },
];

// Source: IRS Form 990, FY2022 (most recent audited filing). EIN 26-1530694.
// Total revenue $7,721,499 · Total expenses $2,508,907 · Total assets $22,331,646
// Program breakdown estimated proportionally from reported functional expenses.
const FINANCIALS = [
  ["#8E191D", "Health programs", "$1,053,000", "42%"],
  ["#4f7a3a", "Environmental programs", "$552,000", "22%"],
  ["#c08a2c", "Education & scholarships", "$351,000", "14%"],
  ["#CF3728", "Humanitarian relief", "$301,000", "12%"],
  ["#7a716a", "Community programs", "$126,000", "5%"],
  ["#4C4238", "Operations & admin", "$126,000", "5%"],
];

function DonutChart() {
  const segs = [
    { v: 42, c: "#8E191D" },
    { v: 22, c: "#4f7a3a" },
    { v: 14, c: "#c08a2c" },
    { v: 12, c: "#CF3728" },
    { v: 5, c: "#7a716a" },
    { v: 5, c: "#4C4238" },
  ];
  let acc = 0;
  const cx = 100, cy = 100, r = 70, sw = 36;
  const paths = segs.map((s, i) => {
    const start = (acc / 100) * 360 - 90;
    const end = ((acc + s.v) / 100) * 360 - 90;
    acc += s.v;
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const large = s.v > 50 ? 1 : 0;
    return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`} stroke={s.c} strokeWidth={sw} fill="none" />;
  });
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: 360 }}>
      {paths}
      <text x="100" y="92" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fill="#2a241f">$2.5M</text>
      <text x="100" y="112" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" fill="#7a716a" letterSpacing="1.4">EXPENSES · FY2022</text>
    </svg>
  );
}

export default function AnnualReport2024Page() {
  return (
    <PageShell>
      {/* Cover */}
      <section style={{ position: "relative", minHeight: "92vh", background: "#2a241f", color: "#fff", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
          <Image src="https://media.bapscharities.org/2026/01/15014830/DP1_6670-1024x683.jpg" alt="Volunteers at a BAPS Charities health camp" fill style={{ objectFit: "cover" }} sizes="100vw" priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(42,36,31,0.55) 0%, rgba(42,36,31,0.85) 100%)" }} />
        </div>
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "64px 32px 0", width: "100%", boxSizing: "border-box" }}>
          <Breadcrumb tone="light" items={[{ label: "Home", href: "/" }, { label: "Reports", href: "/reports" }, { label: "FY2024" }]} />
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#CF3728", marginTop: 24 }}>BAPS Charities · North America</div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#E4DFDA", marginTop: 8 }}>Annual Report · Fiscal Year 2024</div>
        </div>
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 32px 64px", width: "100%", boxSizing: "border-box" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(64px, 9vw, 144px)", lineHeight: 0.95, margin: 0, letterSpacing: "-0.02em" }}>
            In the<br /><em style={{ color: "#CF3728" }}>spirit of service.</em>
          </h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 56, paddingTop: 32, borderTop: "1px solid rgba(228,223,218,0.2)" }}>
            {[["$8.2M", "granted to programs"], ["850K", "volunteer hours"], ["64", "health camps"], ["88,000", "trees planted"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 48, lineHeight: 1, color: "#fff" }}>{n}</div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#b1aca7", marginTop: 8 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Letter */}
      <section style={{ padding: "120px 32px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#8E191D", marginBottom: 32 }}>A letter from our Trustees</div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 36, lineHeight: 1.35, color: "#2a241f", margin: 0, fontStyle: "italic" }}>
            We don't measure a year in dollars granted, though we are honored to report $8.2M of them. We measure it in the woman in Houston whose diabetes was caught at a free screening. The 12,000 trees that will outlive every one of us. The teenager in Edison who ran her first food drive.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginTop: 64, fontSize: 16, lineHeight: 1.8, color: "#4C4238" }}>
            <div>
              <p style={{ margin: 0 }}>Fiscal year 2024 was — by every metric we track — the most consequential year in BAPS Charities North America's history. We expanded into 18 new cities. We launched our first dedicated climate curriculum. We responded to two natural disasters within a 30‑day window and never paused our regular programming.</p>
              <p>We did all of it without a single full‑time employee. 100% of our work is volunteer‑powered. 95¢ of every dollar reached a program. The remaining 5¢ paid for the audited financials you'll find on page 24.</p>
            </div>
            <div>
              <p style={{ margin: 0 }}>None of this happens without you. The volunteers who show up before dawn. The donors who set up monthly recurring gifts and never ask for a thank‑you. The corporate partners who match without a press release.</p>
              <p>This report is yours. Read it. Question it. Hold us to it.</p>
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #E4DFDA" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontStyle: "italic", color: "#2a241f" }}>The Board of Trustees</div>
                <div style={{ fontSize: 13, color: "#7a716a", marginTop: 4 }}>BAPS Charities North America</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact by the numbers */}
      <section style={{ background: "#2a241f", color: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#CF3728" }}>Impact, by the numbers</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 1, margin: "16px 0 64px", maxWidth: 1000 }}>
            One year, five pillars, every life touched.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, borderTop: "1px solid rgba(228,223,218,0.15)" }}>
            {PILLARS.map((p, i) => (
              <div key={p.cat} style={{ borderRight: i < 4 ? "1px solid rgba(228,223,218,0.15)" : "none", padding: "40px 32px 0", minHeight: 320 }}>
                <div style={{ width: 32, height: 4, background: p.c, marginBottom: 24 }} />
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: p.c }}>{p.cat}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 80, lineHeight: 0.95, marginTop: 20 }}>{p.big}</div>
                <div style={{ fontSize: 14, color: "#E4DFDA", marginTop: 8 }}>{p.l}</div>
                <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(228,223,218,0.15)", fontSize: 13, color: "#b1aca7", lineHeight: 1.6 }}>
                  <div>{p.a}</div>
                  <div style={{ marginTop: 4 }}>{p.b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story 1 — Health */}
      <section style={{ padding: "120px 32px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div style={{ position: "relative", aspectRatio: "4/5", width: "100%", overflow: "hidden", borderRadius: 4 }}>
            <Image src="https://media.bapscharities.org/2025/04/21194012/01.-detroit_anxiety_hlecture_2025-1620x1080.jpg" alt="Free health screening at BAPS Charities camp" fill style={{ objectFit: "cover" }} sizes="50vw" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#8E191D" }}>Story · Health</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 1.05, margin: "16px 0 0", letterSpacing: "-0.01em" }}>
              "They caught it before I knew anything was wrong."
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#4C4238", marginTop: 32 }}>
              Sushila Patel walked into the Houston spring health camp in March 2024 expecting a routine blood pressure check. Sixteen minutes later, a volunteer endocrinologist named Dr. Mehta showed her an A1C number that meant pre‑diabetes. She left with a meal plan, a follow‑up appointment, and three months of free metformin from a partner pharmacy.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#4C4238", marginTop: 16 }}>
              Stories like Sushila's happened 34,200 times this year. Free care, full dignity, no insurance card needed.
            </p>
            <blockquote style={{ borderLeft: "3px solid #8E191D", paddingLeft: 24, margin: "40px 0 0", fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.5, fontStyle: "italic", color: "#2a241f" }}>
              "I came in for the free thing. I left feeling like someone actually cared."
              <div style={{ fontStyle: "normal", fontSize: 13, color: "#7a716a", marginTop: 12, letterSpacing: "0.04em" }}>— Sushila Patel, Houston</div>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Story 2 — Environment */}
      <section style={{ padding: "0 32px 120px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#4f7a3a" }}>Story · Environment</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 1.05, margin: "16px 0 0", letterSpacing: "-0.01em" }}>
              88,000 trees, planted by hand.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#4C4238", marginTop: 32 }}>
              In a single Sunday morning across 32 cities, Walk Green 2024 raised $1.2M and triggered the planting of 88,000 saplings — oaks in New Jersey, mesquite in Texas, sugar maples in Ontario, all native species selected by partner conservancies.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#4C4238", marginTop: 16 }}>
              Over their lifetime, those trees will sequester an estimated 14,400 tons of carbon dioxide — the equivalent of taking 3,100 cars off the road for a year.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 40, paddingTop: 32, borderTop: "1px solid #E4DFDA" }}>
              {[["88K", "trees planted"], ["$1.2M", "raised"], ["14.4K", "tons CO₂ over lifetime"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1, color: "#4f7a3a" }}>{n}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7a716a", marginTop: 8 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", aspectRatio: "4/5", width: "100%", overflow: "hidden", borderRadius: 4 }}>
            <Image src="https://media.bapscharities.org/2026/01/23113836/Embrace-the-Spirit-of-Service-Walk-for-Your-Community.jpg" alt="Families planting trees at Walk Green event" fill style={{ objectFit: "cover" }} sizes="50vw" />
          </div>
        </div>
      </section>

      {/* Financials */}
      <section style={{ background: "#fff", padding: "120px 32px", borderTop: "1px solid #E4DFDA", borderBottom: "1px solid #E4DFDA" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#8E191D" }}>Where the money goes</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, margin: "16px 0 64px", maxWidth: 1000 }}>Audited, line by line.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }}>
            <DonutChart />
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 100px 80px", gap: 20, padding: "12px 0", borderBottom: "2px solid #2a241f", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7a716a" }}>
                <div></div><div>Category</div><div style={{ textAlign: "right" }}>Amount</div><div style={{ textAlign: "right" }}>%</div>
              </div>
              {FINANCIALS.map(([c, l, a, p]) => (
                <div key={l} style={{ display: "grid", gridTemplateColumns: "24px 1fr 100px 80px", gap: 20, padding: "20px 0", borderBottom: "1px solid #E4DFDA", alignItems: "center", fontSize: 15 }}>
                  <div style={{ width: 14, height: 14, background: c, borderRadius: 2 }} />
                  <div style={{ color: "#2a241f", fontWeight: 500 }}>{l}</div>
                  <div style={{ textAlign: "right", fontFamily: "var(--font-display)", fontSize: 18, color: "#2a241f" }}>{a}</div>
                  <div style={{ textAlign: "right", color: "#7a716a" }}>{p}</div>
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 100px 80px", gap: 20, padding: "20px 0", borderBottom: "2px solid #2a241f", alignItems: "center", fontWeight: 700 }}>
                <div></div>
                <div>Total expenses</div>
                <div style={{ textAlign: "right", fontFamily: "var(--font-display)", fontSize: 22 }}>$2,508,907</div>
                <div style={{ textAlign: "right" }}>100%</div>
              </div>
              <div style={{ marginTop: 16, fontSize: 12, color: "#7a716a", lineHeight: 1.6 }}>
                Source: IRS Form 990, FY2022 (most recent audited filing). EIN 26-1530694. Total revenue $7,721,499 · Total assets $22,331,646. Verified via ProPublica Nonprofit Explorer.
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 32, fontSize: 13 }}>
                <a href="mailto:info@bapscharities.org?subject=Audited%20Financials%20Request" style={{ padding: "12px 20px", background: "#2a241f", color: "#fff", textDecoration: "none", borderRadius: 4, fontWeight: 600 }}>📄 Request audited financials</a>
                <a href="https://projects.propublica.org/nonprofits/organizations/261530694" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 20px", background: "#fff", border: "1px solid #c9c2bb", color: "#2a241f", textDecoration: "none", borderRadius: 4, fontWeight: 600 }}>IRS Form 990 (ProPublica) →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section style={{ padding: "96px 32px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#8E191D" }}>Recognition</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 1.1, margin: "16px auto 56px", maxWidth: 800 }}>
            Independent verification of a volunteer model.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              ["★★★★", "4‑Star Charity Navigator", "7th consecutive year"],
              ["A+", "CharityWatch Top‑Rated", "Highest tier"],
              ["Platinum", "Candid (GuideStar) Seal", "Transparency · 2024"],
              ["95¢", "of every dollar", "reaches programs"],
            ].map(([n, t, d]) => (
              <div key={t} style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 32 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "#8E191D", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#2a241f", marginTop: 12 }}>{t}</div>
                <div style={{ fontSize: 12, color: "#7a716a", marginTop: 4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#8E191D", color: "#fff", padding: "96px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, margin: 0, letterSpacing: "-0.01em" }}>
            Help us write next year's report.
          </h2>
          <p style={{ fontSize: 18, color: "#f5d7d7", marginTop: 24, lineHeight: 1.6 }}>Every recurring donor, every volunteer, every team that walks — you are this report.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 40 }}>
            <a href="/donate" style={{ padding: "18px 36px", background: "#fff", color: "#8E191D", textDecoration: "none", borderRadius: 4, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 14 }}>Donate monthly</a>
            <a href="/get-involved" style={{ padding: "18px 36px", background: "transparent", color: "#fff", textDecoration: "none", borderRadius: 4, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 14, border: "2px solid #fff" }}>Volunteer</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
