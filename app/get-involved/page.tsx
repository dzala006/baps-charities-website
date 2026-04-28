import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import GetInvolvedFilter from "./GetInvolvedFilter";

export const metadata: Metadata = {
  title: "Get Involved | BAPS Charities",
  description:
    "Volunteer, donate, or partner with BAPS Charities. There is a place for you here.",
};

export default function GetInvolvedPage() {
  return (
    <PageShell>
      <section style={{ background: "#8E191D", color: "#fff", padding: "88px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb tone="light" items={[{ label: "Home", href: "/" }, { label: "Get Involved" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f9e2dd", marginBottom: 16 }}>Get Involved</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px,5vw,72px)", lineHeight: 1.05, margin: 0, maxWidth: 1000 }}>
            Service is not what you give.<br /><em style={{ color: "#f9e2dd", fontStyle: "italic" }}>It is who you become.</em>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: "#f1dcdd", maxWidth: 700, marginTop: 28 }}>
            There is a place for you here — whether you have an hour a year, an evening a month, or a career to dedicate.
          </p>
        </div>
      </section>
      <section style={{ padding: "56px 32px 0", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ background: "#fff", border: "1px solid #E4DFDA", padding: "40px 48px", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 12 }}>Employer Match</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 32, lineHeight: 1.15, margin: "0 0 20px", color: "#2a241f" }}>Double Your Impact</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#4C4238", maxWidth: 720, margin: 0 }}>
              Your employer may match your donation — doubling or tripling its impact at no extra cost to you. Over 7,500 companies offer matching gift programs. Check with your HR department or search your employer on{" "}
              <a href="https://doublethedonation.com" target="_blank" rel="noopener noreferrer" style={{ color: "#8E191D" }}>Double the Donation</a>.
            </p>
          </div>
        </div>
      </section>
      <section style={{ padding: "0 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <GetInvolvedFilter />
        </div>
      </section>
    </PageShell>
  );
}
