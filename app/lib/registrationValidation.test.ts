/**
 * registrationValidation.test.ts — covers family-member + team-name rules
 * added in the family / team / leaderboard work. The single-walker rules
 * are exercised in production via the form; this file pins the new
 * behaviour so a refactor can't silently regress.
 */
import { describe, it, expect } from "vitest";
import {
  validateRegistration,
  TEAM_NAME_MAX_LENGTH,
  MAX_FAMILY_MEMBERS,
  type FormInput,
  type FamilyMemberInput,
} from "./registrationValidation";

const ADULT_DOB = "1990-06-15";
const TEEN_DOB = "2012-04-01"; // ~14
const CHILD_DOB = "2018-04-01"; // ~7

const baseAdult: FormInput = {
  participantName: "Test Walker",
  email: "test@example.com",
  phone: "",
  dateOfBirth: ADULT_DOB,
  shirtSize: "Men-M",
  fundraisingTargetDollars: "",
  waiverConsent: true,
  guardianName: "",
  guardianEmail: "",
  guardianPhone: "",
  guardianConsent: false,
  coppaSelfAttest: false,
  coppaDataConsent: false,
  teamName: "",
  familyMembers: [],
};

function fm(overrides: Partial<FamilyMemberInput> = {}): FamilyMemberInput {
  return {
    name: "Family Walker",
    dateOfBirth: ADULT_DOB,
    shirtSize: "Women-S",
    waiverConsent: true,
    ...overrides,
  };
}

describe("validateRegistration — adult primary, no family", () => {
  it("returns no errors for a valid adult primary", () => {
    expect(validateRegistration(baseAdult)).toEqual({});
  });
});

describe("validateRegistration — team name", () => {
  it("accepts a team name within the limit", () => {
    expect(validateRegistration({ ...baseAdult, teamName: "Atlanta Avengers" })).toEqual({});
  });

  it("rejects a team name longer than the max length", () => {
    const tooLong = "x".repeat(TEAM_NAME_MAX_LENGTH + 1);
    const errs = validateRegistration({ ...baseAdult, teamName: tooLong });
    expect(errs.teamName).toMatch(new RegExp(`${TEAM_NAME_MAX_LENGTH}`));
  });
});

describe("validateRegistration — family members", () => {
  it("accepts up to MAX_FAMILY_MEMBERS adult/teen members with their own waivers", () => {
    const familyMembers = Array.from({ length: MAX_FAMILY_MEMBERS }, (_, i) =>
      fm({ name: `Sibling ${i + 1}`, dateOfBirth: i % 2 === 0 ? ADULT_DOB : TEEN_DOB }),
    );
    const form: FormInput = {
      ...baseAdult,
      familyMembers,
      // Adult primary becomes guardian for any teen family members.
      guardianName: "Test Walker",
      guardianEmail: "test@example.com",
      guardianConsent: true,
    };
    expect(validateRegistration(form)).toEqual({});
  });

  it("rejects more than MAX_FAMILY_MEMBERS additional walkers", () => {
    const familyMembers = Array.from({ length: MAX_FAMILY_MEMBERS + 1 }, () => fm());
    const errs = validateRegistration({ ...baseAdult, familyMembers });
    expect(errs.familyMembers).toMatch(new RegExp(`${MAX_FAMILY_MEMBERS}`));
  });

  it("flags missing fields per family member with namespaced keys", () => {
    const errs = validateRegistration({
      ...baseAdult,
      familyMembers: [fm({ name: "", dateOfBirth: "", shirtSize: "", waiverConsent: false })],
    });
    expect(errs["familyMembers.0.name"]).toBe("Required");
    expect(errs["familyMembers.0.dateOfBirth"]).toBe("Required");
    expect(errs["familyMembers.0.shirtSize"]).toBe("Required");
    expect(errs["familyMembers.0.waiverConsent"]).toMatch(/each walker/);
  });

  it("requires guardian fields on the primary form when ANY family member is a minor", () => {
    const errs = validateRegistration({
      ...baseAdult,
      // Adult primary, teen family member.
      familyMembers: [fm({ dateOfBirth: TEEN_DOB })],
    });
    expect(errs.guardianName).toMatch(/minor/);
    expect(errs.guardianEmail).toMatch(/Valid email/);
    expect(errs.guardianConsent).toBeDefined();
  });

  it("rejects under-13 family members (route them through primary form)", () => {
    const errs = validateRegistration({
      ...baseAdult,
      familyMembers: [fm({ dateOfBirth: CHILD_DOB })],
      // Even with guardian fields filled, the under-13 path is forbidden.
      guardianName: "Test Walker",
      guardianEmail: "test@example.com",
      guardianConsent: true,
    });
    expect(errs["familyMembers.0.dateOfBirth"]).toMatch(/under 13/i);
  });
});
