import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = { title: "Reports — BAPS Charities" };

// All PDF links are sourced directly from media.bapscharities.org
const REPORTS = [
  {
    year: "2023",
    title: "USA Annual Report 2023",
    stat: "Volunteer-driven service across 100+ US cities",
    pdfUrl: "https://media.bapscharities.org/2024/02/14155705/BAPS-Charities-Annual-Report-2023_USA.pdf",
    region: "USA",
  },
  {
    year: "2023",
    title: "Canada Annual Report 2023",
    stat: "15 Canadian centres · 662K+ lbs food donated",
    pdfUrl: "https://media.bapscharities.org/2024/02/14160045/BAPS-Charities-Annual-Report-2023_Canada.pdf",
    region: "Canada",
  },
  {
    year: "2022",
    title: "USA Annual Report 2022",
    stat: "Health camps · blood drives · environmental service",
    pdfUrl: "https://media.bapscharities.org/2023/03/13195656/BAPS-Charities-Annual-Report-2022.pdf",
    region: "USA",
  },
  {
    year: "2022",
    title: "Canada Annual Report 2022",
    stat: "Food drives · health awareness · community outreach",
    pdfUrl: "https://media.bapscharities.org/2023/03/13204101/BAPS-Charities-Annual-Report-2022_C.pdf",
    region: "Canada",
  },
  {
    year: "2021",
    title: "USA Annual Report 2021",
    stat: "COVID‑19 response · community resilience",
    pdfUrl: "https://media.bapscharities.org/2022/05/19093723/2021-BAPS-Charities-Annual-Review-a.pdf",
    region: "USA",
  },
  {
    year: "2021",
    title: "Canada Annual Report 2021",
    stat: "Pandemic response · food bank partnerships",
    pdfUrl: "https://media.bapscharities.org/2022/05/09172008/2021-BAPS-Charities-Annual-Review-Canada.pdf",
    region: "Canada",
  },
];

export default function ReportsPage() {
  return (
    <PageShell>
      <section style={{ background: "#faf7f3", padding: "88px 32px 56px", borderBottom: "1px solid #E4DFDA" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Reports" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 16 }}>Annual Reports & Financials</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 1.05, margin: 0, color: "#2a241f", letterSpacing: "-0.01em", maxWidth: 900 }}>
            Transparency, on the record.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#4C4238", maxWidth: 720, marginTop: 24 }}>
            Every year we publish a full accounting of where money came from and where it went. IRS Form 990, audited financials, and program reports — all available for download.
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Featured: 2025 Reports */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            <a href="https://media.bapscharities.org/2026/03/17155534/BAPSCharitiesAnnualReportUSA2025-1.pdf" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#2a241f", color: "#fff", padding: 40, borderRadius: 4, textDecoration: "none" }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 12 }}>Latest · 2025 · USA</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, lineHeight: 1.2, margin: "0 0 16px" }}>BAPS Charities Annual Report 2025 — USA</h3>
              <div style={{ padding: "10px 18px", background: "#CF3728", borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "inline-block" }}>Download PDF →</div>
            </a>
            <a href="https://media.bapscharities.org/2026/03/17155728/BAPSCharitiesAnnualReportCANADA2025-1.pdf" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#4C4238", color: "#fff", padding: 40, borderRadius: 4, textDecoration: "none" }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 12 }}>Latest · 2025 · Canada</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, lineHeight: 1.2, margin: "0 0 16px" }}>BAPS Charities Annual Report 2025 — Canada</h3>
              <div style={{ padding: "10px 18px", background: "#CF3728", borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "inline-block" }}>Download PDF →</div>
            </a>
          </div>

          {/* 2024 Report */}
          <a href="https://media.bapscharities.org/2025/02/28143049/2024-Outreach-Annual-Report-Updated-for-Web-1.pdf" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#fff", border: "1px solid #E4DFDA", padding: 32, borderRadius: 4, textDecoration: "none", marginBottom: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 8 }}>2024 · USA</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, lineHeight: 1.2, margin: 0, color: "#2a241f" }}>BAPS Charities Annual Report 2024</h3>
                <div style={{ fontSize: 13, color: "#7a716a", marginTop: 8 }}>Published February 28, 2025 · Full outreach report</div>
              </div>
              <div style={{ padding: "12px 22px", background: "#2a241f", color: "#fff", borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Download PDF →</div>
            </div>
          </a>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {REPORTS.map((r) => (
              <div key={`${r.year}-${r.region}`} style={{ background: "#fff", padding: 28, border: "1px solid #E4DFDA", borderRadius: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "#8E191D" }}>{r.year}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7a716a", background: "#f0ece7", padding: "4px 8px", borderRadius: 2, marginTop: 6 }}>{r.region}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#2a241f", marginTop: 8 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: "#4C4238", marginTop: 8, lineHeight: 1.5 }}>{r.stat}</div>
                <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 12 }}>
                  <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#8E191D", textDecoration: "none", fontWeight: 600 }}>Download PDF →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
