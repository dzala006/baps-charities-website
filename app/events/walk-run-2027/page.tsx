import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../../components/PageShell";
import Breadcrumb from "../../components/Breadcrumb";
import { supabase } from "../../lib/supabase";
import { getCenterWalkOverrides, getWalkathonByYear } from "../../lib/walkathon";
import RegisterCityPicker from "./RegisterCityPicker";

export const metadata: Metadata = {
  title: "Walk | Run 2027 — Register",
  description:
    "Register for the 2027 BAPS Charities Walk | Run in your city. Pick a city to register on the BAPS portal.",
};

// Force-dynamic for parity with /centers/[slug]: per-center
// walkathon_registration_mode flips (default / host_own / opt_out) need to
// surface in the city picker the moment a coordinator hits Save in the
// portal CMS, not after a 60s ISR window. The cost is one cheap server
// render per request — three Supabase reads, all on small tables — which
// is fine for this traffic level.
export const dynamic = "force-dynamic";

async function getCenters(): Promise<{ id: string; slug: string; city: string; state: string }[]> {
  const { data, error } = await supabase
    .from("centers")
    .select("id, slug, city, state")
    .order("city");
  if (error || !data) return [];
  return (data as { id: string; slug: string; city: string; state: string }[]).filter(
    (c) => !!c.slug,
  );
}

export default async function Walk2027Page() {
  const [walkathon, allCenters, centerOverrides] = await Promise.all([
    getWalkathonByYear(2027),
    getCenters(),
    getCenterWalkOverrides(),
  ]);

  // Filter out centers that opted out of hosting a walk this year — they
  // shouldn't appear in the city picker.
  const centers = allCenters.filter(
    (c) => centerOverrides[c.id]?.mode !== "opt_out",
  );

  const registrationUrlTemplate = walkathon?.registration_url ?? null;

  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: "#2a241f", color: "#fff", padding: "96px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Events", href: "/events" },
              { label: "Walk | Run 2027" },
            ]}
          />
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 24, marginBottom: 16 }}>
            <span
              style={{
                padding: "5px 12px",
                background: "#CF3728",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                borderRadius: 4,
              }}
            >
              Registration Open
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#b1aca7",
              }}
            >
              Walk | Run 2027
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(48px, 6vw, 96px)",
              lineHeight: 1,
              margin: 0,
              letterSpacing: "-0.015em",
            }}
          >
            Walk | Run 2027
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 24,
              color: "#E4DFDA",
              marginTop: 20,
            }}
          >
            The Spirit of Service continues.
          </p>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: "#b1aca7",
              maxWidth: 640,
              marginTop: 20,
            }}
          >
            Pick your city and register on the BAPS Center Portal. Registration is hosted on
            our portal — you&apos;ll be taken there in a new tab.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/leaderboard"
              style={{
                padding: "14px 28px",
                background: "#CF3728",
                color: "#fff",
                border: "1px solid #CF3728",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              See team leaderboard →
            </Link>
            <Link
              href="/events/walk-run-2026"
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
              View 2026 Walk →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ background: "#3d3530" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "24px 32px",
            display: "flex",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            ["50,000+", "walkers in 2026"],
            ["50+", "cities"],
            ["20+", "years running"],
            ["100%", "volunteer-driven"],
          ].map(([n, l]) => (
            <div key={l}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
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
                  marginTop: 4,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: 80,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: 40,
                color: "#2a241f",
                margin: "0 0 24px",
              }}
            >
              Find your city
            </h2>
            <p style={{ fontSize: 15, color: "#7a716a", marginTop: 0, marginBottom: 32 }}>
              {centers.length > 0
                ? `${centers.length} BAPS centers across North America are hosting the 2027 walk. Select yours to register.`
                : "Loading host centers…"}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 10,
                maxHeight: 480,
                overflow: "auto",
              }}
            >
              {centers.map((c) => (
                <div
                  key={c.slug}
                  style={{
                    background: "#fff",
                    border: "1px solid #E4DFDA",
                    borderRadius: 4,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#8E191D",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 14, color: "#2a241f", fontWeight: 500 }}>
                    {c.city}, {c.state}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 48,
                padding: 28,
                background: "#fff",
                border: "1px solid #E4DFDA",
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#7a716a",
                  marginBottom: 16,
                }}
              >
                About the walk
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 14,
                  color: "#4C4238",
                  lineHeight: 1.7,
                }}
              >
                <div>📍 3K trail walk/run · all ages · free parking</div>
                <div>💛 $15 registration per person</div>
                <div>🤝 100% volunteer organized and managed</div>
                <div>🏥 Local beneficiary receives funds on stage</div>
              </div>
            </div>
          </div>

          {/* Register CTA */}
          <div>
            <RegisterCityPicker
              centers={centers}
              registrationUrlTemplate={registrationUrlTemplate}
              centerOverrides={centerOverrides}
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
