/**
 * aggregate.ts — pure aggregation helper extracted from the leaderboard
 * page so it can be unit-tested without spinning up Next/Supabase.
 */

export interface RawRegistrationRow {
  team_name: string | null;
  center_id: string | null;
  fundraising_target_cents: number | null;
}

export interface LeaderboardRow {
  teamName: string;
  walkers: number;
  centersRepresented: number;
  fundraisingTargetCents: number;
}

export function aggregateTeams(rows: RawRegistrationRow[]): LeaderboardRow[] {
  const groups = new Map<
    string,
    {
      displayName: string;
      walkers: number;
      centerIds: Set<string>;
      fundraisingTargetCents: number;
    }
  >();

  for (const row of rows) {
    const raw = row.team_name?.trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    let entry = groups.get(key);
    if (!entry) {
      entry = {
        displayName: raw,
        walkers: 0,
        centerIds: new Set<string>(),
        fundraisingTargetCents: 0,
      };
      groups.set(key, entry);
    }
    entry.walkers += 1;
    if (row.center_id) entry.centerIds.add(row.center_id);
    entry.fundraisingTargetCents += Math.max(
      0,
      row.fundraising_target_cents ?? 0,
    );
  }

  const out: LeaderboardRow[] = Array.from(groups.values()).map((g) => ({
    teamName: g.displayName,
    walkers: g.walkers,
    centersRepresented: g.centerIds.size,
    fundraisingTargetCents: g.fundraisingTargetCents,
  }));

  out.sort(
    (a, b) =>
      b.fundraisingTargetCents - a.fundraisingTargetCents ||
      b.walkers - a.walkers ||
      a.teamName.localeCompare(b.teamName),
  );
  return out;
}
