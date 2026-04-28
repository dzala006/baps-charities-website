import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer — BAPS Charities Portal",
  robots: { index: false, follow: false },
};

export default function VolunteerPage() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8E191D",
            marginBottom: 12,
          }}
        >
          Get Involved
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.15,
            color: "#2a241f",
            margin: 0,
          }}
        >
          Find Volunteer Opportunities
        </h1>
      </div>

      <div style={{ maxWidth: 720 }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #E4DFDA",
            borderRadius: 6,
            padding: "40px 36px",
          }}
        >
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: "#4C4238",
              marginBottom: 32,
            }}
          >
            BAPS Charities is powered by thousands of dedicated volunteers who give their time and
            talent to uplift communities across North America and around the world. Whether you
            want to help at a local walkathon, serve at a blood drive, or support disaster relief
            efforts, there is a place for you.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 36,
            }}
          >
            {[
              { title: "Walkathon Events", desc: "Support registration, logistics, and day-of operations at Walk | Run events nationwide." },
              { title: "Health Camps", desc: "Assist at free health screening camps and blood donation drives in your community." },
              { title: "Disaster Relief", desc: "Join rapid-response teams providing food, supplies, and support during crises." },
              { title: "Environmental Drives", desc: "Participate in tree-planting, clean-up, and sustainability initiatives." },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#faf7f3",
                  border: "1px solid #E4DFDA",
                  borderRadius: 4,
                  padding: "20px 18px",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#2a241f",
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </div>
                <div style={{ fontSize: 13, color: "#7a716a", lineHeight: 1.6 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/get-involved"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "#8E191D",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Browse All Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}
