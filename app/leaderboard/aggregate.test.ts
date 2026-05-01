import { describe, it, expect } from "vitest";
import { aggregateTeams, type RawRegistrationRow } from "./aggregate";

describe("aggregateTeams", () => {
  it("returns empty array for no rows", () => {
    expect(aggregateTeams([])).toEqual([]);
  });

  it("skips rows with null or whitespace team_name", () => {
    const rows: RawRegistrationRow[] = [
      { team_name: null, center_id: "c1", fundraising_target_cents: 100 },
      { team_name: "   ", center_id: "c1", fundraising_target_cents: 100 },
      { team_name: "Real", center_id: "c1", fundraising_target_cents: 100 },
    ];
    const out = aggregateTeams(rows);
    expect(out).toHaveLength(1);
    expect(out[0].teamName).toBe("Real");
  });

  it("groups case-insensitively but preserves first-seen casing", () => {
    const rows: RawRegistrationRow[] = [
      { team_name: "TeamA", center_id: "c1", fundraising_target_cents: 100 },
      { team_name: "teama", center_id: "c2", fundraising_target_cents: 200 },
      { team_name: "TEAMA", center_id: "c1", fundraising_target_cents: 50 },
    ];
    const out = aggregateTeams(rows);
    expect(out).toHaveLength(1);
    expect(out[0].teamName).toBe("TeamA");
    expect(out[0].walkers).toBe(3);
    expect(out[0].centersRepresented).toBe(2);
    expect(out[0].fundraisingTargetCents).toBe(350);
  });

  it("sorts by fundraisingTargetCents desc, then walkers desc, then teamName asc", () => {
    const rows: RawRegistrationRow[] = [
      { team_name: "Zebra", center_id: "c1", fundraising_target_cents: 100 },
      { team_name: "Apple", center_id: "c1", fundraising_target_cents: 100 },
      { team_name: "Big", center_id: "c1", fundraising_target_cents: 500 },
    ];
    const out = aggregateTeams(rows);
    expect(out.map((t) => t.teamName)).toEqual(["Big", "Apple", "Zebra"]);
  });

  it("clamps negative fundraising_target_cents to 0", () => {
    const rows: RawRegistrationRow[] = [
      { team_name: "Neg", center_id: "c1", fundraising_target_cents: -500 },
      { team_name: "Neg", center_id: "c1", fundraising_target_cents: 100 },
    ];
    const out = aggregateTeams(rows);
    expect(out[0].fundraisingTargetCents).toBe(100);
  });

  it("counts unique centers, not occurrences", () => {
    const rows: RawRegistrationRow[] = [
      { team_name: "Multi", center_id: "c1", fundraising_target_cents: 100 },
      { team_name: "Multi", center_id: "c1", fundraising_target_cents: 100 },
      { team_name: "Multi", center_id: "c2", fundraising_target_cents: 100 },
    ];
    const out = aggregateTeams(rows);
    expect(out[0].centersRepresented).toBe(2);
    expect(out[0].walkers).toBe(3);
  });

  it("ignores null center_id without crashing", () => {
    const rows: RawRegistrationRow[] = [
      { team_name: "T", center_id: null, fundraising_target_cents: 100 },
      { team_name: "T", center_id: "c1", fundraising_target_cents: 100 },
    ];
    const out = aggregateTeams(rows);
    expect(out[0].walkers).toBe(2);
    expect(out[0].centersRepresented).toBe(1);
  });

  it("treats null fundraising_target_cents as 0", () => {
    const rows: RawRegistrationRow[] = [
      { team_name: "T", center_id: "c1", fundraising_target_cents: null },
    ];
    const out = aggregateTeams(rows);
    expect(out[0].fundraisingTargetCents).toBe(0);
  });
});
