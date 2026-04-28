import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import GalleryGrid from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery — BAPS Charities",
  description:
    "Photos from BAPS Charities health awareness programs, food drives, environmental initiatives, community events, and annual walks across the US, Canada, and beyond.",
};

export default function GalleryPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "#2a241f", color: "#fff", padding: "88px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
          />
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#CF3728",
              marginBottom: 16,
            }}
          >
            Photo Gallery
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(40px,5vw,72px)",
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 900,
            }}
          >
            Service, in{" "}
            <em style={{ color: "#CF3728", fontStyle: "italic" }}>every frame.</em>
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: "#b1aca7",
              maxWidth: 680,
              marginTop: 24,
            }}
          >
            Photographs from health awareness programs, food drives, tree plantings, community
            walks, and volunteer efforts across 12 countries — all organized by BAPS Charities
            volunteers.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section style={{ padding: "56px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <GalleryGrid />
        </div>
      </section>
    </PageShell>
  );
}
