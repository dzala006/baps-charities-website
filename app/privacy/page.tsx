import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy | BAPS Charities",
  description:
    "Learn how BAPS Charities collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "#2a241f", color: "#fff", padding: "96px 32px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Privacy Policy" },
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: 16, color: "#b1aca7", marginTop: 20 }}>
            Last updated: April 27, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          <div style={{ background: "#fff8e1", border: "1px solid #f9a825", borderRadius: 4, padding: "12px 20px", marginBottom: 32, fontSize: 13, color: "#5d4037" }}>
            <strong>DRAFT — pending org legal review.</strong> This policy has not yet been reviewed by BAPS Charities legal counsel. Do not treat as final.
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 30,
              color: "#2a241f",
              margin: "0 0 16px",
            }}
          >
            Information We Collect
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            When you interact with BAPS Charities — whether through donations, event registration, or
            volunteer sign-up — we may collect your name, email address, and postal address. For
            donations processed through Stripe, we also collect the information necessary to complete
            your transaction. We never store credit or debit card numbers on our servers; all payment
            data is transmitted directly to and handled by Stripe in accordance with PCI-DSS standards.
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
            How We Use It
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 16px" }}>
            Information you provide is used for the following purposes:
          </p>
          <ul style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px", paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Generating and delivering tax-deductible donation receipts</li>
            <li>Coordinating volunteer schedules, roles, and assignments</li>
            <li>Sending event updates, reminders, and logistics information</li>
            <li>Delivering our newsletters and program announcements (with your consent)</li>
          </ul>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            We do not sell, rent, or trade your personal information to third parties for marketing
            purposes.
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
            Third-Party Services
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 16px" }}>
            BAPS Charities uses the following trusted third-party services to operate our website and
            programs:
          </p>
          <ul style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px", paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>
              <strong>Stripe</strong> — Payment processing for donations. Your payment information is
              collected and handled solely by Stripe; we never store card numbers on our servers. Subject
              to Stripe&apos;s Privacy Policy at stripe.com/privacy.
            </li>
            <li>
              <strong>Supabase</strong> — Secure cloud database and authentication (Supabase Auth).
              User account credentials, session tokens, and donor/volunteer records are stored in
              Supabase. Subject to Supabase&apos;s privacy policy at supabase.com/privacy.
            </li>
            <li>
              <strong>Mailgun</strong> — Transactional email delivery for donation receipts,
              confirmations, and notifications. Mailgun may process your email address and message
              metadata. Subject to Mailgun&apos;s privacy policy at mailgun.com/privacy-policy.
            </li>
            <li>
              <strong>Vercel</strong> — Website hosting and edge delivery infrastructure.
            </li>
            <li>
              <strong>Sentry</strong> — Error monitoring and performance tracking. Sentry may capture
              limited request metadata (e.g., browser type, page URL, error stack traces) to help us
              diagnose and fix issues. No payment or password data is sent to Sentry. Subject to
              Sentry&apos;s privacy policy at sentry.io/privacy.
            </li>
          </ul>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            Each of these providers maintains its own privacy practices and security standards. We have
            selected them based on their commitment to data protection.
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
            Cookies
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            We use session cookies to maintain your authenticated state when you log in to your BAPS
            Charities account. These cookies are essential for the site to function and are deleted when
            you close your browser or log out. We do not use advertising or cross-site tracking cookies.
            If we introduce any optional analytics cookies in the future, we will update this policy and
            request your consent where required by applicable law.
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
            Data Retention
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            We retain donor records — including name, contact information, and donation history — for
            seven years following the date of donation to comply with applicable tax and charitable
            reporting obligations. Contact form submissions and event registration data are retained for
            up to two years unless you request earlier deletion. Account data is retained for as long as
            your account is active. Upon a verified deletion request, we will remove or anonymize your
            personal information within 30 days, except where retention is required by law.
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
            Your Rights
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: "0 0 32px" }}>
            You have the right to access, correct, or request deletion of any personal information we
            hold about you, including your donation records and account data. To submit a privacy
            request, please contact us at{" "}
            <a href="mailto:info@bapscharities.org" style={{ color: "#8E191D", fontWeight: 600 }}>
              info@bapscharities.org
            </a>{" "}
            or{" "}
            <a href="mailto:privacy@bapscharities.org" style={{ color: "#8E191D", fontWeight: 600 }}>
              privacy@bapscharities.org
            </a>
            . We will respond to all verified requests within 30 days. You will not be discriminated
            against for exercising your privacy rights.
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
            Contact
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", margin: 0 }}>
            For privacy-related questions or requests, contact us at:
          </p>
          <address
            style={{
              fontStyle: "normal",
              fontSize: 16,
              lineHeight: 1.7,
              color: "#4C4238",
              marginTop: 12,
            }}
          >
            BAPS Charities
            <br />
            81 Suttons Lane
            <br />
            Piscataway, NJ 08854
            <br />
            <a href="mailto:privacy@bapscharities.org" style={{ color: "#8E191D", fontWeight: 600 }}>
              privacy@bapscharities.org
            </a>
          </address>
        </div>
      </section>
    </PageShell>
  );
}
