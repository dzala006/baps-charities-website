import Link from "next/link";

/**
 * Walk2027Promo — homepage CTA section that surfaces the 2027 walkathon
 * between the editorial sections. Mid-page placement (not above the fold)
 * so the existing hero stays primary.
 *
 * Design language matches /events/walk-run-2027 — same dark walnut bg,
 * same red accent, same display-font headline.
 */
export default function Walk2027Promo() {
  return (
    <section
      style={{
        background: "#2a241f",
        color: "#fff",
        padding: "80px 32px",
      }}
      aria-label="Walk and Run 2027"
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        <div>
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
            Registration Open · May 30, 2027
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 64px)",
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-0.015em",
            }}
          >
            Walk | Run 2027
          </h2>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 22,
              color: "#E4DFDA",
              margin: "16px 0 0",
            }}
          >
            The Spirit of Service continues.
          </p>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "#b1aca7",
              maxWidth: 560,
              margin: "20px 0 0",
            }}
          >
            A 3K community walk and run across BAPS centers in North America.
            Register yourself, your family, or your team. All ages welcome,
            free parking, $15 per walker.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/events/walk-run-2027"
              style={{
                padding: "14px 28px",
                background: "#CF3728",
                color: "#fff",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Register for 2027 →
            </Link>
            <Link
              href="/leaderboard"
              style={{
                padding: "14px 28px",
                background: "transparent",
                color: "#E4DFDA",
                border: "1px solid #5c5249",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Team leaderboard
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {[
            ["50,000+", "walkers in 2026"],
            ["50+", "host cities"],
            ["20+", "years running"],
            ["100%", "volunteer-led"],
          ].map(([n, l]) => (
            <div
              key={l}
              style={{
                background: "#3d3530",
                border: "1px solid #5c5249",
                borderRadius: 4,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  color: "#CF3728",
                  lineHeight: 1,
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#7a716a",
                  marginTop: 8,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
