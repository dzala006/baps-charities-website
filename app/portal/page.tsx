import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — BAPS Charities Portal",
  robots: { index: false, follow: false },
};

export default async function PortalDashboard() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Friend";

  const userEmail = user?.email ?? "";

  // Fetch next upcoming confirmed walk
  const { data: nextWalk } = await supabase
    .from("walk_cities")
    .select("city, state, date_display, venue, registration_url")
    .eq("confirmed", true)
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  // Fetch last 3 donations by this user
  const { data: recentDonations } = userEmail
    ? await supabase
        .from("donations")
        .select("amount_usd, designation, created_at")
        .eq("donor_email", userEmail)
        .order("created_at", { ascending: false })
        .limit(3)
    : { data: [] };

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 48 }}>
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
          Dashboard
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
          Welcome back, {displayName}
        </h1>
        <p style={{ fontSize: 16, color: "#7a716a", marginTop: 10 }}>
          Here&apos;s a summary of your impact and upcoming events.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {/* Next Walk Card */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E4DFDA",
            borderRadius: 6,
            padding: 28,
          }}
        >
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
            Next Walkathon
          </div>

          {nextWalk ? (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 400,
                  color: "#2a241f",
                  marginBottom: 6,
                }}
              >
                {nextWalk.city}, {nextWalk.state}
              </div>
              {nextWalk.date_display && (
                <div style={{ fontSize: 14, color: "#4C4238", marginBottom: 4 }}>
                  {nextWalk.date_display}
                </div>
              )}
              {nextWalk.venue && (
                <div style={{ fontSize: 14, color: "#7a716a", marginBottom: 16 }}>
                  {nextWalk.venue}
                </div>
              )}
              {nextWalk.registration_url && (
                <a
                  href={nextWalk.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    background: "#8E191D",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Register Now
                </a>
              )}
            </div>
          ) : (
            <p style={{ color: "#7a716a", fontSize: 15 }}>
              No upcoming walks confirmed yet. Check back soon.
            </p>
          )}
        </div>

        {/* Recent Donations Card */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E4DFDA",
            borderRadius: 6,
            padding: 28,
          }}
        >
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
            Recent Donations
          </div>

          {recentDonations && recentDonations.length > 0 ? (
            <div>
              {recentDonations.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: i < recentDonations.length - 1 ? "1px solid #E4DFDA" : "none",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, color: "#2a241f", fontWeight: 500 }}>
                      {d.designation ?? "General"}
                    </div>
                    <div style={{ fontSize: 12, color: "#b1aca7", marginTop: 2 }}>
                      {d.created_at
                        ? new Date(d.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#2a241f" }}>
                    ${d.amount_usd != null ? Number(d.amount_usd).toFixed(2) : "—"}
                  </div>
                </div>
              ))}
              <Link
                href="/portal/donations"
                style={{
                  display: "inline-block",
                  marginTop: 16,
                  fontSize: 13,
                  color: "#8E191D",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                View all donations →
              </Link>
            </div>
          ) : (
            <div>
              <p style={{ color: "#7a716a", fontSize: 15, marginBottom: 16 }}>
                No donations found for this account.
              </p>
              <Link
                href="/donate"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  background: "#8E191D",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Make a Gift
              </Link>
            </div>
          )}
        </div>

        {/* Volunteer CTA */}
        <div
          style={{
            background: "#8E191D",
            borderRadius: 6,
            padding: 28,
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#d59b9d",
              marginBottom: 16,
            }}
          >
            Get Involved
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 400,
              marginBottom: 12,
              lineHeight: 1.3,
            }}
          >
            Volunteer with BAPS Charities
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "#d59b9d", marginBottom: 20 }}>
            Join thousands of volunteers making a difference in communities across North America.
          </p>
          <Link
            href="/get-involved"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#fff",
              color: "#8E191D",
              textDecoration: "none",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Find Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}
