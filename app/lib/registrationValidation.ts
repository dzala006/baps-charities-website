/**
 * registrationValidation.ts — shared rules for the website's walkathon
 * registration form. Mirrors the portal's
 * `~/baps-walkathon-portal/src/pages/Register.tsx` validation logic
 * verbatim so COPPA + age-classification behavior stays identical
 * regardless of which surface a registrant hits. The DB CHECK
 * constraint on `walk_registrations` is the non-bypassable backstop.
 *
 * If the portal version changes, change this file in lockstep.
 */

// Gendered shirt sizes (Men / Women / Boy / Girl) plus legacy unisex
// Adult-* / Youth-* values retained for backward compatibility with rows
// already in walk_registrations. The grouped form is the canonical
// presentation for the registration dropdown.
export const SHIRT_SIZE_GROUPS: ReadonlyArray<{
  label: string;
  options: readonly string[];
}> = [
  { label: "Men", options: ["Men-S", "Men-M", "Men-L", "Men-XL", "Men-2XL", "Men-3XL"] },
  { label: "Women", options: ["Women-S", "Women-M", "Women-L", "Women-XL", "Women-2XL", "Women-3XL"] },
  { label: "Boy", options: ["Boy-XS", "Boy-S", "Boy-M", "Boy-L", "Boy-XL"] },
  { label: "Girl", options: ["Girl-XS", "Girl-S", "Girl-M", "Girl-L", "Girl-XL"] },
];

export const SHIRT_SIZES = [
  ...SHIRT_SIZE_GROUPS.flatMap((g) => g.options),
  // Legacy unisex (deprecated for new orders, retained for backward compat)
  "Adult-S",
  "Adult-M",
  "Adult-L",
  "Adult-XL",
  "Adult-2XL",
  "Adult-3XL",
  "Youth-XS",
  "Youth-S",
  "Youth-M",
  "Youth-L",
  "Youth-XL",
] as const;

export type ShirtSize = (typeof SHIRT_SIZES)[number];

export type AgeGroup = "adult" | "youth" | "child";
export type MinorClass = "adult" | "minor_13_17" | "minor_under_13";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(s: unknown): s is string {
  return typeof s === "string" && EMAIL_REGEX.test(s) && s.length <= 320;
}

/** Returns the integer age in years on today (UTC), or -1 for invalid input. */
export function ageFromDob(dob: string): number {
  if (!dob) return -1;
  const d = new Date(dob + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return -1;
  const today = new Date();
  let age = today.getUTCFullYear() - d.getUTCFullYear();
  const m = today.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && today.getUTCDate() < d.getUTCDate())) age--;
  return age;
}

/** UI-tier classification: tracks the under-13 COPPA branch separately from 13–17. */
export function classifyMinor(age: number): MinorClass {
  if (age < 0) return "adult";
  if (age >= 18) return "adult";
  if (age >= 13) return "minor_13_17";
  return "minor_under_13";
}

/** DB-column classification: matches the walk_registrations.age_group CHECK. */
export function ageGroupFor(age: number): AgeGroup {
  if (age >= 18) return "adult";
  if (age >= 13) return "youth";
  return "child";
}

export interface FamilyMemberInput {
  name: string;
  dateOfBirth: string;
  shirtSize: string;
  waiverConsent: boolean;
}

export const MAX_FAMILY_MEMBERS = 5;

export interface FormInput {
  participantName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  shirtSize: string;
  fundraisingTargetDollars: string;
  waiverConsent: boolean;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianConsent: boolean;
  coppaSelfAttest: boolean;
  coppaDataConsent: boolean;
  teamName: string;
  familyMembers: FamilyMemberInput[];
}

export type FormErrors = Record<string, string>;

export const TEAM_NAME_MAX_LENGTH = 80;

/**
 * Validate a registration form input. Returns a map of field → message;
 * an empty object means the form is valid. Mirrors the portal's
 * validateForm() in Register.tsx.
 *
 * Family members are validated under the same rules as the primary; their
 * errors are namespaced under `familyMembers.{i}.{field}` so the form can
 * surface them next to the correct row.
 */
export function validateRegistration(form: FormInput): FormErrors {
  const errs: FormErrors = {};

  if (!form.participantName.trim()) errs.participantName = "Required";
  if (form.participantName.length > 200) errs.participantName = "Too long (max 200)";
  if (!isEmail(form.email)) errs.email = "Valid email required";
  if (!form.dateOfBirth) {
    errs.dateOfBirth = "Required";
  } else {
    const age = ageFromDob(form.dateOfBirth);
    if (age < 0 || age > 120) errs.dateOfBirth = "Invalid date";
  }
  if (!form.shirtSize) errs.shirtSize = "Required";
  else if (!SHIRT_SIZES.includes(form.shirtSize as ShirtSize)) {
    errs.shirtSize = "Invalid shirt size";
  }
  if (!form.waiverConsent) errs.waiverConsent = "Waiver must be signed";
  if (
    form.fundraisingTargetDollars &&
    Number.isNaN(parseInt(form.fundraisingTargetDollars, 10))
  ) {
    errs.fundraisingTargetDollars = "Must be a number";
  }

  if (form.teamName && form.teamName.length > TEAM_NAME_MAX_LENGTH) {
    errs.teamName = `Team name must be ${TEAM_NAME_MAX_LENGTH} characters or fewer`;
  }

  const age = ageFromDob(form.dateOfBirth);
  const minorClass = classifyMinor(age);
  const isMinor = minorClass !== "adult";
  const isUnder13 = minorClass === "minor_under_13";

  if (isMinor) {
    if (!form.guardianName.trim()) errs.guardianName = "Required for under-18 registrations";
    if (!isEmail(form.guardianEmail)) errs.guardianEmail = "Valid email required";
    if (!form.guardianConsent) errs.guardianConsent = "Guardian consent required";

    if (isUnder13) {
      if (!form.coppaSelfAttest) errs.coppaSelfAttest = "COPPA: parent/guardian attestation required";
      if (!form.coppaDataConsent) errs.coppaDataConsent = "COPPA: data-collection consent required";
    }
  }

  // Family members
  if (form.familyMembers.length > MAX_FAMILY_MEMBERS) {
    errs.familyMembers = `At most ${MAX_FAMILY_MEMBERS} additional walkers per registration`;
  }

  // If ANY family member is under 18, the primary form's guardian fields
  // are required even when the primary registrant themselves is an adult —
  // the same guardian data is reused on each minor's row.
  const anyFamilyMinor = form.familyMembers.some((m) => {
    if (!m.dateOfBirth) return false;
    const a = ageFromDob(m.dateOfBirth);
    return a >= 0 && a < 18;
  });
  if (anyFamilyMinor && !isMinor) {
    if (!form.guardianName.trim())
      errs.guardianName = "Required when registering a minor in the family group";
    if (!isEmail(form.guardianEmail))
      errs.guardianEmail = "Valid email required when registering a minor";
    if (!form.guardianConsent)
      errs.guardianConsent = "Guardian consent required";
  }

  form.familyMembers.forEach((member, i) => {
    const prefix = `familyMembers.${i}.`;
    if (!member.name.trim()) errs[`${prefix}name`] = "Required";
    if (member.name.length > 200) errs[`${prefix}name`] = "Too long (max 200)";
    if (!member.dateOfBirth) {
      errs[`${prefix}dateOfBirth`] = "Required";
    } else {
      const a = ageFromDob(member.dateOfBirth);
      if (a < 0 || a > 120) errs[`${prefix}dateOfBirth`] = "Invalid date";
    }
    if (!member.shirtSize) errs[`${prefix}shirtSize`] = "Required";
    else if (!SHIRT_SIZES.includes(member.shirtSize as ShirtSize)) {
      errs[`${prefix}shirtSize`] = "Invalid shirt size";
    }
    if (!member.waiverConsent)
      errs[`${prefix}waiverConsent`] = "Waiver must be signed for each walker";

    // Reject under-13 family members for now — COPPA dual-consent UX is only
    // built for the primary registrant. Adults / 13–17 are allowed.
    if (member.dateOfBirth) {
      const a = ageFromDob(member.dateOfBirth);
      if (a >= 0 && a < 13) {
        errs[`${prefix}dateOfBirth`] =
          "For walkers under 13, please register them as the primary participant in a separate form.";
      }
    }
  });

  return errs;
}
