"use client";

import { useState, useActionState, useMemo } from "react";
import { submitRegistration } from "./actions";
import {
  ageFromDob,
  classifyMinor,
  SHIRT_SIZE_GROUPS,
  validateRegistration,
  type FormInput,
} from "@/app/lib/registrationValidation";

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
