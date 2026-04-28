import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Press | BAPS Charities",
  description:
    "Press kit, media contacts, press releases, and media assets for BAPS Charities.",
};

export default function PressPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "#2a241f", color: "#fff", padding: "96px 32px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Press" },
            ]}
          />
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#CF3728",
              marginTop: 24,
              marginBottom: 16,
            }}
          >
            Media
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-0.015em",
            }}
          >
            Press &amp; Media Kit
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 22,
              color: "#b1aca7",
              marginTop: 20,
              marginBottom: 0,
              maxWidth: 700,
            }}
          >
            Everything journalists and media professionals need to cover BAPS Charities.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 64 }}>

          {/* Main column */}
          <div>

            {/* About */}
            <div style={{ marginBottom: 64 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8E191D",
                  marginBottom: 16,
                }}
              >
                About BAPS Charities
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: 36,
                  color: "#2a241f",
                  margin: "0 0 24px",
                }}
              >
                Organization Overview
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "#4C4238",
                }}
              >
                <p style={{ margin: 0 }}>
                  BAPS Charities USA, Inc. is a global, volunteer-driven nonprofit dedicated to serving
                  humanity through health, education, environmental, and humanitarian initiatives. Founded
                  in 2008, the organization operates across 12 countries, reaching hundreds of thousands
                  of people each year through free health camps, scholarships, disaster relief, and
                  community service programs.
                </p>
                <p style={{ margin: 0 }}>
                  BAPS Charities has received Charity Navigator&apos;s 4-Star rating for seven
                  consecutive years, achieving a 97% efficiency rating — meaning 97 cents of every dollar
                  donated goes directly to programs. The organization is staffed entirely by volunteers.
                </p>
              </div>
              <div
                style={{
                  marginTop: 28,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 16,
                }}
              >
                {[
                  { label: "EIN", value: "26-1530694" },
                  { label: "Founded", value: "2008" },
                  { label: "Countries", value: "12" },
                  { label: "Efficiency Rating", value: "97% (Charity Navigator)" },
                  { label: "Headquarters", value: "81 Suttons Lane, Piscataway, NJ 08854" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: "#fff",
                      border: "1px solid #E4DFDA",
                      borderRadius: 4,
                      padding: "14px 18px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#b1aca7",
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 14, color: "#2a241f", fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Press Releases */}
            <div style={{ marginBottom: 64 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8E191D",
                  marginBottom: 16,
                }}
              >
                Press Releases
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: 36,
                  color: "#2a241f",
                  margin: "0 0 24px",
                }}
              >
                Latest Releases
              </h2>
              <a
                href="https://baps.sl/walk-pressrelease"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: "#fff",
                  border: "1px solid #E4DFDA",
                  borderRadius: 4,
                  padding: "24px 28px",
                  textDecoration: "none",
                  borderLeft: "4px solid #8E191D",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#CF3728",
                    marginBottom: 10,
                  }}
                >
                  2026
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#2a241f",
                    marginBottom: 8,
                  }}
                >
                  Walk &amp; Run 2026 Press Release
                </div>
                <div style={{ fontSize: 14, color: "#7a716a", marginBottom: 16 }}>
                  Official press release announcing BAPS Charities Walk &amp; Run 2026, event details,
                  beneficiary information, and registration.
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#8E191D",
                  }}
                >
                  Download PDF ↗
                </div>
              </a>
            </div>

            {/* Media Downloads */}
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8E191D",
                  marginBottom: 16,
                }}
              >
                Media Downloads
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: 36,
                  color: "#2a241f",
                  margin: "0 0 24px",
                }}
              >
                Photography &amp; Video
              </h2>
              <a
                href="https://baps.sl/walk-photo-video-guide"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: "#fff",
                  border: "1px solid #E4DFDA",
                  borderRadius: 4,
                  padding: "24px 28px",
                  textDecoration: "none",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#2a241f",
                    marginBottom: 8,
                  }}
                >
                  Photo &amp; Video Guide
                </div>
                <div style={{ fontSize: 14, color: "#7a716a", marginBottom: 16 }}>
                  Guidelines, usage rights, and curated imagery for editorial use.
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#8E191D",
                  }}
                >
                  Open Guide ↗
                </div>
              </a>
              <div
                style={{
                  background: "#faf7f3",
                  border: "1px solid #E4DFDA",
                  borderRadius: 4,
                  padding: "18px 24px",
                  fontSize: 14,
                  color: "#4C4238",
                  lineHeight: 1.65,
                }}
              >
                Hi-res photography and video assets are available on request from{" "}
                <a
                  href="mailto:archive.media@na.baps.org"
                  style={{ color: "#8E191D", fontWeight: 600 }}
                >
                  archive.media@na.baps.org
                </a>
                . Please include your publication name, deadline, and intended usage in your request.
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Press Contacts */}
            <div
              style={{
                background: "#2a241f",
                color: "#fff",
                borderRadius: 4,
                padding: 28,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#CF3728",
                  marginBottom: 16,
                }}
              >
                Press Contacts
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#b1aca7",
                      marginBottom: 6,
                    }}
                  >
                    Media Inquiries
                  </div>
                  <a
                    href="mailto:press@bapscharities.org"
                    style={{
                      fontSize: 15,
                      color: "#fff",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    press@bapscharities.org
                  </a>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#b1aca7",
                      marginBottom: 6,
                    }}
                  >
                    Photo &amp; Video Archive
                  </div>
                  <a
                    href="mailto:archive.media@na.baps.org"
                    style={{
                      fontSize: 15,
                      color: "#fff",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    archive.media@na.baps.org
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E4DFDA",
                borderRadius: 4,
                padding: 28,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#7a716a",
                  marginBottom: 20,
                }}
              >
                Social Media
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  {
                    platform: "Instagram",
                    handle: "@BAPSCharities",
                    href: "https://instagram.com/BAPSCharities",
                  },
                  {
                    platform: "Facebook",
                    handle: "facebook.com/BAPScharities",
                    href: "https://facebook.com/BAPScharities",
                  },
                  {
                    platform: "Twitter / X",
                    handle: "@bapscharities",
                    href: "https://twitter.com/bapscharities",
                  },
                  {
                    platform: "YouTube",
                    handle: "youtube.com/bapscharities",
                    href: "https://youtube.com/bapscharities",
                  },
                ].map(({ platform, handle, href }) => (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 0",
                      borderBottom: "1px solid #E4DFDA",
                      textDecoration: "none",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#2a241f" }}>
                        {platform}
                      </div>
                      <div style={{ fontSize: 12, color: "#7a716a", marginTop: 2 }}>{handle}</div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#8E191D",
                      }}
                    >
                      Follow ↗
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick facts */}
            <div
              style={{
                background: "#faf7f3",
                border: "1px solid #E4DFDA",
                borderRadius: 4,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#7a716a",
                  marginBottom: 14,
                }}
              >
                Quick Facts
              </div>
              <div style={{ fontSize: 13, color: "#4C4238", lineHeight: 1.7 }}>
                <strong>Legal name:</strong> BAPS Charities USA, Inc.
                <br />
                <strong>EIN:</strong> 26-1530694
                <br />
                <strong>Tax status:</strong> 501(c)(3) nonprofit
                <br />
                <strong>Founded:</strong> 2008
                <br />
                <strong>HQ:</strong> 81 Suttons Lane, Piscataway, NJ 08854
              </div>
            </div>

          </aside>
        </div>
      </section>
    </PageShell>
  );
}
