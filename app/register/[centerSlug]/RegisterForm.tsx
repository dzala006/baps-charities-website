"use client";

import { useState, useActionState, useMemo } from "react";
import { submitRegistration } from "./actions";
import {
  ageFromDob,
  classifyMinor,
  MAX_FAMILY_MEMBERS,
  SHIRT_SIZE_GROUPS,
  TEAM_NAME_MAX_LENGTH,
  validateRegistration,
  type FamilyMemberInput,
  type FormInput,
} from "@/app/lib/registrationValidation";
import TurnstileWidget from "./TurnstileWidget";

interface CenterCtx {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
}

interface WalkathonCtx {
  id: string;
  year: number;
  name: string;
  nationalEventDate: string;
}

const EMPTY: FormInput = {
  participantName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  shirtSize: "",
  fundraisingTargetDollars: "",
  waiverConsent: false,
  guardianName: "",
  guardianEmail: "",
  guardianPhone: "",
  guardianConsent: false,
  coppaSelfAttest: false,
  coppaDataConsent: false,
  teamName: "",
  familyMembers: [],
};

const EMPTY_FAMILY_MEMBER: FamilyMemberInput = {
  name: "",
  dateOfBirth: "",
  shirtSize: "",
  waiverConsent: false,
};

const INITIAL_STATE = { ok: false } as const;

export default function RegisterForm({
  center,
  walkathon,
}: {
  center: CenterCtx;
  walkathon: WalkathonCtx;
}) {
  const action = submitRegistration.bind(null, center.slug);
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  const [form, setForm] = useState<FormInput>(EMPTY);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const age = ageFromDob(form.dateOfBirth);
  const minorClass = classifyMinor(age);
  const isMinor = minorClass !== "adult";
  const isUnder13 = minorClass === "minor_under_13";

  const errors = useMemo(
    () => ({ ...(state.errors ?? {}), ...clientErrors }),
    [state.errors, clientErrors],
  );

  function update<K extends keyof FormInput>(key: K, value: FormInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (clientErrors[key as string]) {
      setClientErrors((e) => {
        const next = { ...e };
        delete next[key as string];
        return next;
      });
    }
  }

  function updateFamilyMember<K extends keyof FamilyMemberInput>(
    index: number,
    key: K,
    value: FamilyMemberInput[K],
  ) {
    setForm((f) => {
      const next = [...f.familyMembers];
      next[index] = { ...next[index], [key]: value };
      return { ...f, familyMembers: next };
    });
    const errKey = `familyMembers.${index}.${key as string}`;
    if (clientErrors[errKey]) {
      setClientErrors((e) => {
        const next = { ...e };
        delete next[errKey];
        return next;
      });
    }
  }

  function handleClientValidate(e: React.FormEvent<HTMLFormElement>) {
    const errs = validateRegistration(form);
    if (Object.keys(errs).length > 0) {
      e.preventDefault();
      setClientErrors(errs);
    }
  }

  const date = walkathon.nationalEventDate;
  const formattedDate = useMemo(() => {
    try {
      return new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return date;
    }
  }, [date]);

  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <p style={eyebrowStyle}>{walkathon.name}</p>
        <h1 style={titleStyle}>Register at {center.name}</h1>
        <p style={subtitleStyle}>
          {center.city && center.state ? `${center.city}, ${center.state} • ` : ""}
          {formattedDate}
        </p>
      </header>

      <form action={formAction} onSubmit={handleClientValidate} style={formStyle} noValidate>
        <input
          type="hidden"
          name="familyMemberCount"
          value={String(form.familyMembers.length)}
        />
        <Field
          id="participantName"
          name="participantName"
          label="Walker's full name"
          autoComplete="name"
          required
          value={form.participantName}
          onChange={(v) => update("participantName", v)}
          error={errors.participantName}
        />

        <div style={twoCol}>
          <Field
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(v) => update("email", v)}
            error={errors.email}
          />
          <Field
            id="phone"
            name="phone"
            type="tel"
            label="Phone (optional)"
            autoComplete="tel"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            error={errors.phone}
          />
        </div>

        <div style={twoCol}>
          <Field
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            label="Date of birth"
            required
            value={form.dateOfBirth}
            onChange={(v) => update("dateOfBirth", v)}
            error={errors.dateOfBirth}
          />
          <SelectField
            id="shirtSize"
            name="shirtSize"
            label="Shirt size"
            required
            optgroups={SHIRT_SIZE_GROUPS}
            value={form.shirtSize}
            onChange={(v) => update("shirtSize", v)}
            error={errors.shirtSize}
          />
        </div>

        <Field
          id="fundraisingTargetDollars"
          name="fundraisingTargetDollars"
          type="number"
          label="Fundraising goal — USD (optional)"
          inputMode="numeric"
          value={form.fundraisingTargetDollars}
          onChange={(v) => update("fundraisingTargetDollars", v)}
          error={errors.fundraisingTargetDollars}
        />

        <div style={fieldStyle}>
          <label htmlFor="teamName" style={labelStyle}>
            Team name (optional)
          </label>
          <input
            id="teamName"
            name="teamName"
            type="text"
            maxLength={TEAM_NAME_MAX_LENGTH}
            autoComplete="off"
            value={form.teamName}
            onChange={(e) => update("teamName", e.target.value)}
            aria-invalid={errors.teamName ? "true" : undefined}
            aria-describedby={errors.teamName ? "teamName-error" : "teamName-help"}
            style={inputStyle}
          />
          <p id="teamName-help" style={helpTextStyle}>
            Walking with friends? Pick a team name; everyone using the same name
            is grouped on the public{" "}
            <a href="/leaderboard" style={{ color: "#8E191D" }}>
              leaderboard
            </a>
            .
          </p>
          {errors.teamName && (
            <p id="teamName-error" role="alert" style={fieldErrorStyle}>
              {errors.teamName}
            </p>
          )}
        </div>

        {isMinor && (
          <fieldset style={guardianBlockStyle}>
            <legend style={legendStyle}>Guardian — required for under-18 registration</legend>
            <Field
              id="guardianName"
              name="guardianName"
              label="Guardian's full name"
              autoComplete="name"
              required
              value={form.guardianName}
              onChange={(v) => update("guardianName", v)}
              error={errors.guardianName}
            />
            <div style={twoCol}>
              <Field
                id="guardianEmail"
                name="guardianEmail"
                type="email"
                label="Guardian email"
                autoComplete="email"
                required
                value={form.guardianEmail}
                onChange={(v) => update("guardianEmail", v)}
                error={errors.guardianEmail}
              />
              <Field
                id="guardianPhone"
                name="guardianPhone"
                type="tel"
                label="Guardian phone (optional)"
                autoComplete="tel"
                value={form.guardianPhone}
                onChange={(v) => update("guardianPhone", v)}
                error={errors.guardianPhone}
              />
            </div>
            <Checkbox
              id="guardianConsent"
              name="guardianConsent"
              label="I am the parent or legal guardian of this walker and consent to their participation."
              checked={form.guardianConsent}
              onChange={(v) => update("guardianConsent", v)}
              error={errors.guardianConsent}
            />

            {isUnder13 && (
              <div style={coppaBlockStyle} role="region" aria-label="COPPA notice">
                <p style={coppaIntroStyle}>
                  Because this walker is under 13, federal COPPA rules require the parent or
                  legal guardian to confirm the data we collect (name, date of birth, shirt
                  size; optionally guardian phone) and consent to its use solely for organizing
                  this walkathon. To remove the registration at any time, contact your local
                  BAPS Charities center. See our{" "}
                  <a href="/privacy" style={{ color: "#8E191D" }}>
                    privacy policy
                  </a>
                  .
                </p>
                <Checkbox
                  id="coppaSelfAttest"
                  name="coppaSelfAttest"
                  label="I am the parent or legal guardian of this child."
                  checked={form.coppaSelfAttest}
                  onChange={(v) => update("coppaSelfAttest", v)}
                  error={errors.coppaSelfAttest}
                />
                <Checkbox
                  id="coppaDataConsent"
                  name="coppaDataConsent"
                  label="I consent to the data collection above for the sole purpose of organizing this walkathon."
                  checked={form.coppaDataConsent}
                  onChange={(v) => update("coppaDataConsent", v)}
                  error={errors.coppaDataConsent}
                />
              </div>
            )}
          </fieldset>
        )}

        <fieldset style={familyBlockStyle}>
          <legend style={legendStyle}>Add family members (optional)</legend>
          <p style={familyHelpStyle}>
            Register up to {MAX_FAMILY_MEMBERS} additional walkers in this same
            submission. Each walker needs their own date of birth, shirt size,
            and waiver consent. For walkers under 13, please register them as
            the primary participant in a separate form.
          </p>

          {form.familyMembers.map((member, i) => {
            const prefix = `familyMembers.${i}.`;
            return (
              <div key={i} style={familyMemberRowStyle}>
                <div style={familyMemberHeaderStyle}>
                  <span style={familyMemberLabelStyle}>Walker #{i + 2}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((f) => {
                        const next = [...f.familyMembers];
                        next.splice(i, 1);
                        return { ...f, familyMembers: next };
                      });
                      // Clear stale errors for this member
                      setClientErrors((e) => {
                        const next = { ...e };
                        Object.keys(next).forEach((k) => {
                          if (k.startsWith(prefix)) delete next[k];
                        });
                        return next;
                      });
                    }}
                    style={familyRemoveBtnStyle}
                    aria-label={`Remove walker #${i + 2}`}
                  >
                    Remove
                  </button>
                </div>
                <Field
                  id={`fm-name-${i}`}
                  name={`${prefix}name`}
                  label="Walker's full name"
                  required
                  value={member.name}
                  onChange={(v) => updateFamilyMember(i, "name", v)}
                  error={errors[`${prefix}name`]}
                />
                <div style={twoCol}>
                  <Field
                    id={`fm-dob-${i}`}
                    name={`${prefix}dateOfBirth`}
                    type="date"
                    label="Date of birth"
                    required
                    value={member.dateOfBirth}
                    onChange={(v) => updateFamilyMember(i, "dateOfBirth", v)}
                    error={errors[`${prefix}dateOfBirth`]}
                  />
                  <SelectField
                    id={`fm-shirt-${i}`}
                    name={`${prefix}shirtSize`}
                    label="Shirt size"
                    required
                    optgroups={SHIRT_SIZE_GROUPS}
                    value={member.shirtSize}
                    onChange={(v) => updateFamilyMember(i, "shirtSize", v)}
                    error={errors[`${prefix}shirtSize`]}
                  />
                </div>
                <Checkbox
                  id={`fm-waiver-${i}`}
                  name={`${prefix}waiverConsent`}
                  label="I have read and agree to the BAPS Charities walk/run waiver and release of liability for this walker."
                  checked={member.waiverConsent}
                  onChange={(v) => updateFamilyMember(i, "waiverConsent", v)}
                  error={errors[`${prefix}waiverConsent`]}
                />
              </div>
            );
          })}

          {form.familyMembers.length < MAX_FAMILY_MEMBERS && (
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  familyMembers: [...f.familyMembers, { ...EMPTY_FAMILY_MEMBER }],
                }))
              }
              style={familyAddBtnStyle}
            >
              + Add another walker
            </button>
          )}

          {errors.familyMembers && (
            <p role="alert" style={fieldErrorStyle}>
              {errors.familyMembers}
            </p>
          )}
        </fieldset>

        <details style={waiverDetailsStyle}>
          <summary style={waiverSummaryStyle}>
            Read the full liability waiver and release
          </summary>
          <div style={waiverBodyStyle}>
            <h3 style={waiverHeadingStyle}>Walk/Run Liability Waiver and Release</h3>
            <p style={waiverParaStyle}>
              In consideration of being permitted to participate in the BAPS Charities
              Walk/Run, I, on behalf of myself, my heirs, executors, administrators, and
              assigns, hereby release and discharge BAPS Charities, its volunteers,
              employees, sponsors, and affiliated organizations from any and all claims,
              demands, actions, causes of action, suits of every kind and character
              arising from or related to my participation.
            </p>
            <p style={waiverParaStyle}>
              I acknowledge that I am physically able to participate in this 3K walk/run
              event. I understand that I am responsible for my own safety and for the
              safety of any minors I am registering. I agree to follow event guidelines
              and instructions from event volunteers.
            </p>
            <p style={waiverParaStyle}>
              <strong>Photo release:</strong> I grant permission for photographs and
              video taken at the event to be used by BAPS Charities for promotional and
              educational purposes.
            </p>
            <p style={waiverParaStyle}>
              <strong>Medical authorization (for minors):</strong> In the event of a
              medical emergency, I authorize event volunteers to seek medical care for
              the participant if I am not immediately reachable.
            </p>
            <p style={waiverParaStyle}>
              <a
                href="/walk-run-waiver.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#8E191D" }}
              >
                Open the full waiver in a new tab (printable)
              </a>
            </p>
          </div>
        </details>

        <Checkbox
          id="waiverConsent"
          name="waiverConsent"
          label="I have read and agree to the BAPS Charities walk/run waiver and release of liability."
          checked={form.waiverConsent}
          onChange={(v) => update("waiverConsent", v)}
          error={errors.waiverConsent}
        />

        {state.message && !state.ok && (
          <p role="alert" style={errorBannerStyle}>
            {state.message}
          </p>
        )}

        {/* Turnstile renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is
            unset (dev bypass server-side), and a Cloudflare widget when set.
            The widget injects a hidden cf-turnstile-response field that
            actions.ts picks up via formData. */}
        <TurnstileWidget />

        <button type="submit" disabled={isPending} style={submitButtonStyle}>
          {isPending ? "Submitting…" : "Submit registration"}
        </button>
      </form>
    </main>
  );
}

// --- Field components -------------------------------------------------------

function Field(props: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "text";
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div style={fieldStyle}>
      <label htmlFor={props.id} style={labelStyle}>
        {props.label}
        {props.required && <span aria-hidden="true" style={{ color: "#8E191D" }}> *</span>}
      </label>
      <input
        id={props.id}
        name={props.name}
        type={props.type ?? "text"}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        required={props.required}
        aria-required={props.required ? "true" : undefined}
        aria-invalid={props.error ? "true" : undefined}
        aria-describedby={props.error ? `${props.id}-error` : undefined}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        style={inputStyle}
      />
      {props.error && (
        <p id={`${props.id}-error`} role="alert" style={fieldErrorStyle}>
          {props.error}
        </p>
      )}
    </div>
  );
}

function SelectField(props: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  options?: readonly string[];
  optgroups?: ReadonlyArray<{ label: string; options: readonly string[] }>;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div style={fieldStyle}>
      <label htmlFor={props.id} style={labelStyle}>
        {props.label}
        {props.required && <span aria-hidden="true" style={{ color: "#8E191D" }}> *</span>}
      </label>
      <select
        id={props.id}
        name={props.name}
        required={props.required}
        aria-required={props.required ? "true" : undefined}
        aria-invalid={props.error ? "true" : undefined}
        aria-describedby={props.error ? `${props.id}-error` : undefined}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select…</option>
        {props.optgroups
          ? props.optgroups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </optgroup>
            ))
          : (props.options ?? []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
      </select>
      {props.error && (
        <p id={`${props.id}-error`} role="alert" style={fieldErrorStyle}>
          {props.error}
        </p>
      )}
    </div>
  );
}

function Checkbox(props: {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <label
        htmlFor={props.id}
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          fontSize: 14,
          color: "#4C4238",
          lineHeight: 1.5,
        }}
      >
        <input
          id={props.id}
          name={props.name}
          type="checkbox"
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)}
          aria-invalid={props.error ? "true" : undefined}
          aria-describedby={props.error ? `${props.id}-error` : undefined}
          style={{ marginTop: 4, cursor: "pointer" }}
        />
        <span>{props.label}</span>
      </label>
      {props.error && (
        <p id={`${props.id}-error`} role="alert" style={fieldErrorStyle}>
          {props.error}
        </p>
      )}
    </div>
  );
}

// --- Styles -----------------------------------------------------------------

const pageStyle: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "48px 24px 96px",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const headerStyle: React.CSSProperties = { marginBottom: 32 };
const eyebrowStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#8E191D",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  margin: "0 0 8px",
};
const titleStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 400,
  color: "#2a241f",
  margin: 0,
  letterSpacing: "-0.01em",
};
const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#7a716a",
  margin: "8px 0 0",
};

const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 16 };
const twoCol: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };
const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#4C4238",
};
const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 14,
  border: "1px solid #c9c2bb",
  borderRadius: 4,
  background: "#fff",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
};

const fieldErrorStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#8E191D",
  margin: 0,
};

const guardianBlockStyle: React.CSSProperties = {
  border: "1px solid #c9c2bb",
  padding: 20,
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  background: "#faf7f3",
};
const legendStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8E191D",
  padding: "0 8px",
};

const coppaBlockStyle: React.CSSProperties = {
  border: "1px solid #8E191D",
  background: "#f1dcdd",
  padding: 16,
  borderRadius: 4,
  marginTop: 12,
};
const coppaIntroStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#4C4238",
  lineHeight: 1.55,
  margin: "0 0 12px",
};

const errorBannerStyle: React.CSSProperties = {
  padding: 12,
  background: "#f1dcdd",
  border: "1px solid #8E191D",
  color: "#8E191D",
  borderRadius: 4,
  fontSize: 14,
  margin: 0,
};

const submitButtonStyle: React.CSSProperties = {
  padding: "14px 24px",
  background: "#8E191D",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  cursor: "pointer",
  marginTop: 8,
};

const helpTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#7a716a",
  margin: 0,
  lineHeight: 1.5,
};

const familyBlockStyle: React.CSSProperties = {
  border: "1px solid #c9c2bb",
  padding: 20,
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  background: "#faf7f3",
  marginTop: 4,
};

const familyHelpStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#4C4238",
  lineHeight: 1.55,
  margin: 0,
};

const familyMemberRowStyle: React.CSSProperties = {
  border: "1px solid #E4DFDA",
  background: "#fff",
  borderRadius: 4,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const familyMemberHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const familyMemberLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8E191D",
};

const familyRemoveBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #c9c2bb",
  color: "#4C4238",
  fontSize: 12,
  padding: "4px 12px",
  borderRadius: 4,
  cursor: "pointer",
};

const familyAddBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px dashed #8E191D",
  color: "#8E191D",
  fontSize: 13,
  fontWeight: 600,
  padding: "10px 16px",
  borderRadius: 4,
  cursor: "pointer",
  alignSelf: "flex-start",
};

const waiverDetailsStyle: React.CSSProperties = {
  border: "1px solid #c9c2bb",
  borderRadius: 4,
  background: "#faf7f3",
  padding: "12px 16px",
  fontSize: 14,
  color: "#4C4238",
};
const waiverSummaryStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
  color: "#2a241f",
  letterSpacing: "0.02em",
  outline: "none",
};
const waiverBodyStyle: React.CSSProperties = {
  marginTop: 12,
  paddingTop: 12,
  borderTop: "1px solid #E4DFDA",
};
const waiverHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  fontSize: 18,
  color: "#2a241f",
  margin: "0 0 12px",
};
const waiverParaStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.6,
  color: "#4C4238",
  margin: "0 0 12px",
};
