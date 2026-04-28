import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Use | BAPS Charities",
  description:
    "Terms of Use for the BAPS Charities website, including donation policy, volunteer agreements, and intellectual property.",
};

export default function TermsPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "#2a241f", color: "#fff", padding: "96px 32px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Terms of Use" },
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
            Legal
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
            Terms of Use
          </h1>
          <p style={{ fontSize: 16, color: "#b1aca7", marginTop: 20 }}>
            Last updated: April 27, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 30,
              color: "#2a241f",
              margin: "0 0 16px",
            }}
          >
            Use of Site
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            The BAPS Charities website is provided for informational purposes only. While we strive to
            maintain accurate and up-to-date content, BAPS Charities makes no warranties — express or
            implied — regarding the completeness, accuracy, reliability, or suitability of any
            information on this site. Your use of the site and reliance on any information contained
            herein is solely at your own risk.
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 30,
              color: "#2a241f",
              margin: "0 0 16px",
            }}
          >
            Donations
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 16px" }}>
            All donations to BAPS Charities USA, Inc. are generally non-refundable. Exceptions may be
            made at the sole discretion of BAPS Charities. If you have a concern about a donation,
            please contact us within 30 days of your transaction at{" "}
            <a href="mailto:info@bapscharities.org" style={{ color: "#8E191D", fontWeight: 600 }}>
              info@bapscharities.org
            </a>
            .
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            BAPS Charities USA, Inc. is a registered 501(c)(3) tax-exempt organization. Donations are
            tax-deductible to the extent permitted by law. Official donation receipts are issued
            electronically following each completed transaction.
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 30,
              color: "#2a241f",
              margin: "0 0 16px",
            }}
          >
            Volunteer Agreements
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            Participation as a BAPS Charities volunteer is entirely voluntary and at will. Volunteers
            are not employees or contractors of BAPS Charities. All volunteer participation is subject
            to the BAPS Charities Code of Conduct, which promotes respect, inclusion, and the
            spirit of selfless service. BAPS Charities reserves the right to decline or discontinue
            any individual&apos;s volunteer participation at any time.
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 30,
              color: "#2a241f",
              margin: "0 0 16px",
            }}
          >
            Intellectual Property
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            All content on this website — including but not limited to text, photography, video,
            graphics, logos, and design — is the exclusive property of BAPS Charities USA, Inc. and
            is protected by applicable copyright, trademark, and other intellectual property laws.
            Reproduction, redistribution, or commercial use of any content without prior written
            permission is strictly prohibited. To request permission, contact{" "}
            <a href="mailto:press@bapscharities.org" style={{ color: "#8E191D", fontWeight: 600 }}>
              press@bapscharities.org
            </a>
            .
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 30,
              color: "#2a241f",
              margin: "0 0 16px",
            }}
          >
            Disclaimers
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            This site is provided &ldquo;as is&rdquo; without warranty of any kind, either express or
            implied, including but not limited to the implied warranties of merchantability, fitness for
            a particular purpose, or non-infringement. BAPS Charities does not warrant that the site
            will be uninterrupted, error-free, or free of viruses or other harmful components.
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 30,
              color: "#2a241f",
              margin: "0 0 16px",
            }}
          >
            Governing Law
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            These Terms of Use shall be governed by and construed in accordance with the laws of the
            State of New Jersey, without regard to its conflict of law provisions. Any disputes arising
            under or related to these terms shall be subject to the exclusive jurisdiction of the courts
            located in New Jersey.
          </p>

          <div
            style={{
              borderTop: "1px solid #E4DFDA",
              paddingTop: 32,
              marginTop: 16,
              fontSize: 14,
              lineHeight: 1.7,
              color: "#7a716a",
            }}
          >
            Questions about these Terms of Use? Contact us at{" "}
            <a href="mailto:info@bapscharities.org" style={{ color: "#8E191D" }}>
              info@bapscharities.org
            </a>{" "}
            or write to BAPS Charities, 81 Suttons Lane, Piscataway, NJ 08854.
          </div>
        </div>
      </section>
    </PageShell>
  );
}
