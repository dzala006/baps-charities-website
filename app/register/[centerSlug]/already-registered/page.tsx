import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE } from "@/app/lib/featureFlags";

export const metadata: Metadata = {
  title: "Already registered",
  robots: { index: false, follow: false },
};

export default async function AlreadyRegisteredPage({
  params,
}: {
  params: Promise<{ centerSlug: string }>;
}) {
  if (!FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE) notFound();
  const { centerSlug } = await params;

  return (
    <main style={pageStyle}>
      <p style={eyebrowStyle}>Already registered</p>
      <h1 style={titleStyle}>This email is already on the list.</h1>
      <p style={bodyStyle}>
        We have a registration on file for this email and walkathon. Each walker can only
        register once per year. Check your inbox for the original confirmation.
      </p>
      <p style={bodyStyle}>
        Need to update or cancel? Contact your local BAPS Charities center.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <Link href={`/register/${centerSlug}`} style={primaryLinkStyle}>
          Register a different walker
        </Link>
        <Link href="/" style={secondaryLinkStyle}>
          Back to home
        </Link>
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  maxWidth: 640,
  margin: "0 auto",
  padding: "64px 24px",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};
const eyebrowStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#8E191D",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  margin: "0 0 8px",
};
const titleStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 400,
  color: "#2a241f",
  margin: "0 0 16px",
};
const bodyStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#4C4238",
  lineHeight: 1.6,
  margin: "0 0 12px",
};
const primaryLinkStyle: React.CSSProperties = {
  padding: "12px 20px",
  background: "#8E191D",
  color: "#fff",
  textDecoration: "none",
  borderRadius: 4,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
const secondaryLinkStyle: React.CSSProperties = {
  padding: "12px 20px",
  border: "1px solid #c9c2bb",
  color: "#4C4238",
  textDecoration: "none",
  borderRadius: 4,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
