/**
 * /my-walks — self-service page for logged-in walkers.
 *
 * Lists every walk_registrations row tied to the authenticated user
 * (via user_id, populated by the register action since migration 2620)
 * and lets the user edit only their team_name.
 *
 * Reads + writes go through the anon Supabase client; RLS enforces the
 * own-row scope:
 *   - walk_registrations_user_select_own (SELECT WHERE user_id = auth.uid())
 *   - walk_registrations_user_team_name (UPDATE team_name only, same scope)
 *
 * Required env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageShell from "../components/PageShell";
import { getCurrentUser, getServerSupabase } from "@/app/lib/auth";
import { TEAM_NAME_MAX_LENGTH } from "@/app/lib/registrationValidation";
import { updateMyTeamName } from "./actions";

export const metadata: Metadata = {
  title: "My walks — BAPS Charities",
  robots: { index: false, follow: false },
};

// Always render fresh: registrations and team_name updates need to surface
// immediately for the user who just submitted them.
export const dynamic = "force-dynamic";

interface MyWalkRow {
  id: string;
  participant_name: string;
  team_name: string | null;
  source: string | null;
  created_at: string | null;
  walkathon: { year: number; name: string } | null;
  center: { name: string; slug: string; city: string | null; state: string | null } | null;
}

async function loadMyWalks(userId: string): Promise<MyWalkRow[]> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("walk_registrations")
    .select(
      `id,
       participant_name,
       team_name,
       source,
       created_at,
       walkathon:walkathons(year, name),
       center:centers(name, slug, city, state)`,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[my-walks] select failed", error);
    return [];
  }
  // Supabase types the joined rows as arrays-of-rows by default; coerce to
  // the single-row shape our query returns.
  return (data ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    const walkathonRaw = r.walkathon as
      | { year: number; name: string }
      | { year: number; name: string }[]
      | null;
    const centerRaw = r.center as
      | { name: string; slug: string; city: string | null; state: string | null }
      | { name: string; slug: string; city: string | null; state: string | null }[]
      | null;
    const walkathon = Array.isArray(walkathonRaw)
      ? (walkathonRaw[0] ?? null)
      : walkathonRaw;
    const center = Array.isArray(centerRaw) ? (centerRaw[0] ?? null) : centerRaw;
    return {
      id: String(r.id),
      participant_name: String(r.participant_name ?? ""),
      team_name: (r.team_name as string | null) ?? null,
      source: (r.source as string | null) ?? null,
      created_at: (r.created_at as string | null) ?? null,
      walkathon,
      center,
    };
  });
}

export default async function MyWalksPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/my-walks");
  }

  const rows = await loadMyWalks(user.id);

  return (
    <PageShell>
      <main style={pageStyle}>
        <header style={headerStyle}>
          <p style={eyebrowStyle}>Your account</p>
          <h1 style={titleStyle}>My walks</h1>
          <p style={subtitleStyle}>
            Walks you have registered for. You can update your team name
            below; everything else is locked once submitted — contact your
            local center for other changes.
          </p>
        </header>

        {rows.length === 0 ? (
          <section style={emptyStateStyle} aria-label="No registrations yet">
            <p style={{ margin: "0 0 12px", color: "#4C4238" }}>
              You haven&apos;t registered for a walk yet.
            </p>
            <Link href="/events/walk-run-2027" style={linkStyle}>
              Find a walk near you →
            </Link>
          </section>
        ) : (
          <ul style={listStyle}>
            {rows.map((row) => (
              <li key={row.id} style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div>
                    <div style={cardEyebrowStyle}>
                      {row.walkathon?.name ?? "Walk"}
                    </div>
                    <h2 style={cardTitleStyle}>
                      {row.center?.city ?? "Center"}
                      {row.center?.state ? `, ${row.center.state}` : ""}
                    </h2>
                  </div>
                  {row.center?.slug && (
                    <Link
                      href={`/centers/${row.center.slug}`}
                      style={cardLinkStyle}
                    >
                      View center →
                    </Link>
                  )}
                </div>

                <dl style={metaListStyle}>
                  <div style={metaRowStyle}>
                    <dt style={metaLabelStyle}>Walker</dt>
                    <dd style={metaValueStyle}>{row.participant_name}</dd>
                  </div>
                  <div style={metaRowStyle}>
                    <dt style={metaLabelStyle}>Source</dt>
                    <dd style={metaValueStyle}>{row.source ?? "—"}</dd>
                  </div>
                  {row.created_at && (
                    <div style={metaRowStyle}>
                      <dt style={metaLabelStyle}>Registered</dt>
                      <dd style={metaValueStyle}>
                        {new Date(row.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </dd>
                    </div>
                  )}
                </dl>

                <form
                  action={updateMyTeamName}
                  style={teamFormStyle}
                  aria-label="Update team name"
                >
                  <input type="hidden" name="registrationId" value={row.id} />
                  <label
                    htmlFor={`team-${row.id}`}
                    style={teamLabelStyle}
                  >
                    Team name
                  </label>
                  <div style={teamRowStyle}>
                    <input
                      id={`team-${row.id}`}
                      name="teamName"
                      type="text"
                      defaultValue={row.team_name ?? ""}
                      maxLength={TEAM_NAME_MAX_LENGTH}
                      autoComplete="off"
                      placeholder="Walking solo"
                      style={teamInputStyle}
                    />
                    <button type="submit" style={saveButtonStyle}>
                      Save
                    </button>
                  </div>
                  <p style={teamHelpStyle}>
                    Walkers using the same team name are grouped on the
                    public{" "}
                    <Link href="/leaderboard" style={linkStyle}>
                      leaderboard
                    </Link>
                    .
                  </p>
                </form>
              </li>
            ))}
          </ul>
        )}
      </main>
    </PageShell>
  );
}

// ---------------------------------------------------------------- styles ---

const pageStyle: React.CSSProperties = {
  maxWidth: 880,
  margin: "0 auto",
  padding: "48px 24px 96px",
};
const headerStyle: React.CSSProperties = { marginBottom: 32 };
const eyebrowStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#8E191D",
  margin: "0 0 8px",
};
const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  fontSize: 40,
  color: "#2a241f",
  margin: 0,
  letterSpacing: "-0.01em",
};
const subtitleStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#7a716a",
  margin: "10px 0 0",
  maxWidth: 620,
  lineHeight: 1.55,
};

const emptyStateStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E4DFDA",
  borderRadius: 6,
  padding: 32,
  textAlign: "center",
};

const linkStyle: React.CSSProperties = {
  color: "#8E191D",
  fontWeight: 600,
  textDecoration: "none",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 24,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E4DFDA",
  borderRadius: 6,
  padding: "24px 28px",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 16,
};

const cardEyebrowStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#8E191D",
  marginBottom: 6,
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  fontSize: 24,
  color: "#2a241f",
  margin: 0,
  lineHeight: 1.2,
};

const cardLinkStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#8E191D",
  fontWeight: 600,
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const metaListStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 12,
  margin: "0 0 20px",
};

const metaRowStyle: React.CSSProperties = { margin: 0 };
const metaLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#b1aca7",
  marginBottom: 4,
};
const metaValueStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#4C4238",
  margin: 0,
};

const teamFormStyle: React.CSSProperties = {
  borderTop: "1px solid #E4DFDA",
  paddingTop: 16,
};
const teamLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#4C4238",
  marginBottom: 6,
};
const teamRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "stretch",
};
const teamInputStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  fontSize: 14,
  border: "1px solid #c9c2bb",
  borderRadius: 4,
  background: "#fff",
  fontFamily: "inherit",
};
const saveButtonStyle: React.CSSProperties = {
  padding: "10px 18px",
  background: "#8E191D",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  cursor: "pointer",
};
const teamHelpStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#7a716a",
  margin: "8px 0 0",
};
