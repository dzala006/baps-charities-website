import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import { supabase } from "../lib/supabase";
import { aggregateTeams, type LeaderboardRow, type RawRegistrationRow } from "./aggregate";
import LeaderboardFilters, { type WalkathonOption, type CenterOption } from "./LeaderboardFilters";

export const metadata: Metadata = {
  title: "Leaderboard | BAPS Charities Walk 2027",
  description:
    "Top fundraising teams across BAPS Charities Walk 2027 — see how communities are pooling their effort.",
  alternates: {
    canonical: "https://baps-charities-website.vercel.app/leaderboard",
  },
};

// Short ISR so new team registrations show up promptly without hammering
// the Supabase edge function on every page view. searchParams are part of
// the cache key so each filter combination is cached independently.
export const revalidate = 60;

interface CenterRow {
  id: string;
  slug: string;
  city: string | null;
  state: string | null;
}

interface WalkathonRow {
  id: string;
  year: number;
  name: string;
  status: string;
}

async function loadFilterOptions(): Promise<{
  walkathons: WalkathonOption[];
  centers: CenterOption[];
  centerSlugToId: Map<string, string>;
  walkathonYearToId: Map<number, string>;
}> {
  const [{ data: walkRows }, { data: centerRows }] = await Promise.all([
    supabase
      .from("walkathons")
      .select("id, year, name, status")
      .order("year", { ascending: false }),
    supabase
      .from("centers")
      .select("id, slug, city, state")
      .order("city", { ascending: true }),
  ]);

  const walkathons: WalkathonOption[] = ((walkRows as WalkathonRow[]) ?? []).map(
    (w) => ({ year: w.year, name: w.name }),
  );
  const walkathonYearToId = new Map<number, string>();
  for (const w of (walkRows as WalkathonRow[]) ?? []) {
    walkathonYearToId.set(w.year, w.id);
  }

  const centers: CenterOption[] = ((centerRows as CenterRow[]) ?? [])
    .filter((c) => c.city && c.state)
    .map((c) => ({ slug: c.slug, city: c.city as string, state: c.state as string }));
  const centerSlugToId = new Map<string, string>();
  for (const c of (centerRows as CenterRow[]) ?? []) {
    centerSlugToId.set(c.slug, c.id);
  }

  return { walkathons, centers, centerSlugToId, walkathonYearToId };
}

async function loadLeaderboard(opts: {
  walkathonId: string | null;
  centerId: string | null;
}): Promise<LeaderboardRow[]> {
  let query = supabase
    .from("walk_registrations")
    .select("team_name, center_id, fundraising_target_cents")
    .not("team_name", "is", null);
  if (opts.walkathonId) query = query.eq("walkathon_id", opts.walkathonId);
  if (opts.centerId) query = query.eq("center_id", opts.centerId);
  const { data, error } = await query;
  if (error || !data) return [];
  return aggregateTeams(data as RawRegistrationRow[]);
}

function formatUsd(cents: number): string {
  if (cents <= 0) return "—";
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

interface PageProps {
  searchParams: Promise<{
    walkathon?: string | string[];
    center?: string | string[];
  }>;
}

export default async function LeaderboardPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const rawWalk = Array.isArray(sp.walkathon) ? sp.walkathon[0] : sp.walkathon;
  const rawCenter = Array.isArray(sp.center) ? sp.center[0] : sp.center;

  const { walkathons, centers, centerSlugToId, walkathonYearToId } =
    await loadFilterOptions();

  // Validate filter values against the option sets — drop any unknown values
  // silently rather than 404'ing the page (cleaner UX for stale URLs).
  const walkathonYearNum = rawWalk ? parseInt(rawWalk, 10) : NaN;
  const validWalkathonYear =
    !Number.isNaN(walkathonYearNum) && walkathonYearToId.has(walkathonYearNum)
      ? String(walkathonYearNum)
      : null;
  const validCenterSlug =
    rawCenter && centerSlugToId.has(rawCenter) ? rawCenter : null;

  const walkathonId = validWalkathonYear
    ? walkathonYearToId.get(parseInt(validWalkathonYear, 10)) ?? null
    : null;
  const centerId = validCenterSlug
    ? centerSlugToId.get(validCenterSlug) ?? null
    : null;

  const teams = await loadLeaderboard({ walkathonId, centerId });
  const totalWalkers = teams.reduce((s, t) => s + t.walkers, 0);
  const totalGoalCents = teams.reduce((s, t) => s + t.fundraisingTargetCents, 0);

  const hasFilters = Boolean(validWalkathonYear || validCenterSlug);

  return (
    <PageShell>
      <section style={{ background: "#2a241f", color: "#fff", padding: "96px 32px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Walk | Run 2027", href: "/events/walk-run-2027" },
              { label: "Leaderboard" },
            ]}
          />
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#CF3728",
              marginTop: 24,
              marginBottom: 12,
            }}
          >
            Walk | Run 2027
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 80px)",
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-0.015em",
            }}
          >
            Team Leaderboard
          </h1>
          <p style={{ fontSize: 17, color: "#b1aca7", marginTop: 16, maxWidth: 640, lineHeight: 1.6 }}>
            Walkers who picked the same team name on registration are grouped together. The board sorts by total fundraising goal across team members, then by walker count.
          </p>

          {teams.length > 0 && (
            <div style={{ display: "flex", gap: 48, marginTop: 32, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#CF3728" }}>{teams.length}</div>
                <div style={statSubStyle}>teams registered</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#CF3728" }}>{totalWalkers}</div>
                <div style={statSubStyle}>walkers on a team</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#CF3728" }}>
                  {formatUsd(totalGoalCents)}
                </div>
                <div style={statSubStyle}>total fundraising goal</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ background: "#faf7f3", padding: "48px 32px 96px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <LeaderboardFilters
            walkathons={walkathons}
            centers={centers}
            selectedWalkathon={validWalkathonYear}
            selectedCenter={validCenterSlug}
          />

          {teams.length === 0 ? (
            <div
              style={{
                background: "#fff",
                border: "1px solid #E4DFDA",
                borderRadius: 4,
                padding: 48,
                textAlign: "center",
              }}
            >
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, margin: "0 0 8px", color: "#2a241f" }}>
                {hasFilters ? "No teams match these filters" : "No teams registered yet"}
              </h2>
              <p style={{ fontSize: 14, color: "#7a716a", margin: "0 auto 20px", maxWidth: 480 }}>
                {hasFilters
                  ? "No teams have registered for the selected walkathon at the selected center yet."
                  : "Be the first. When you register for the walk, pick a team name and your group shows up here."}
              </p>
              {hasFilters ? (
                <Link
                  href="/leaderboard"
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    background: "#8E191D",
                    color: "#fff",
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Reset filters
                </Link>
              ) : (
                <Link
                  href="/events/walk-run-2027"
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    background: "#8E191D",
                    color: "#fff",
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Register for Walk 2027 →
                </Link>
              )}
            </div>
          ) : (
            <div
              style={{
                background: "#fff",
                border: "1px solid #E4DFDA",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
                aria-label="Team leaderboard"
              >
                <thead>
                  <tr style={{ background: "#faf7f3", borderBottom: "1px solid #E4DFDA" }}>
                    <th scope="col" style={thStyle}>#</th>
                    <th scope="col" style={thStyle}>Team</th>
                    <th scope="col" style={{ ...thStyle, textAlign: "right" }}>Walkers</th>
                    <th scope="col" style={{ ...thStyle, textAlign: "right" }}>Centers</th>
                    <th scope="col" style={{ ...thStyle, textAlign: "right" }}>Fundraising goal</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((t, i) => (
                    <tr
                      key={t.teamName + i}
                      style={{
                        borderBottom: i === teams.length - 1 ? "none" : "1px solid #E4DFDA",
                      }}
                    >
                      <td style={{ ...tdStyle, color: "#7a716a", width: 56 }}>{i + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: "#2a241f" }}>{t.teamName}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{t.walkers}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{t.centersRepresented}</td>
                      <td style={{ ...tdStyle, textAlign: "right", fontFamily: "var(--font-display)", color: "#8E191D" }}>
                        {formatUsd(t.fundraisingTargetCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p style={{ fontSize: 12, color: "#7a716a", marginTop: 16, lineHeight: 1.6 }}>
            Privacy note: the leaderboard only shows aggregate counts and goals. Individual walker names and contact details are never displayed publicly. To remove a registration from the board, contact your local BAPS Charities center.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#7a716a",
  padding: "14px 20px",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 20px",
  fontSize: 14,
  color: "#4C4238",
};

const statSubStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#7a716a",
  marginTop: 4,
};
