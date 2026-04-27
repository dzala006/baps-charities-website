import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = { title: "Reports — BAPS Charities" };

const REPORTS = [
  { year: "2023", title: "Annual Report 2023", stat: "$7.4M granted · 780K volunteer hours" },
  { year: "2022", title: "Annual Report 2022", stat: "$6.1M granted · 690K volunteer hours" },
  { year: "2021", title: "Annual Report 2021", stat: "$5.8M granted · 620K volunteer hours" },
  { year: "2020", title: "COVID‑19 Response Report", stat: "Special edition — pandemic response" },
  { year: "2019", title: "Annual Report 2019", stat: "$4.9M granted · 540K volunteer hours" },
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
          <Link href="/reports/annual-2024" style={{ display: "block", background: "#2a241f", color: "#fff", padding: 48, borderRadius: 4, textDecoration: "none", marginBottom: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 12 }}>Latest · 2024</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 36, lineHeight: 1.15, margin: 0 }}>In the Spirit of Service — FY2024 Annual Report</h3>
                <div style={{ fontSize: 14, color: "#b1aca7", marginTop: 12 }}>$8.2M granted · 850K volunteer hours · 64 health camps · 88,000 trees planted</div>
              </div>
              <div style={{ padding: "14px 24px", background: "#CF3728", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Read online →</div>
            </div>
          </Link>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {REPORTS.map((r) => (
              <div key={r.year} style={{ background: "#fff", padding: 28, border: "1px solid #E4DFDA", borderRadius: 4 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "#8E191D" }}>{r.year}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#2a241f", marginTop: 8 }}>{r.title}</div>
                <div style={{ fontSize: 13, color: "#4C4238", marginTop: 8 }}>{r.stat}</div>
                <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 12 }}>
                  <a href="#" style={{ color: "#8E191D", textDecoration: "none", fontWeight: 600 }}>📄 Report PDF</a>
                  <a href="#" style={{ color: "#7a716a", textDecoration: "none" }}>Form 990</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
