"use client";

import { useState, useTransition, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../actions";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const D_BRAND = "#8E191D";
const D_INK = "#2a241f";
const D_BODY = "#4C4238";
const D_MUTED = "#7a716a";
const D_CREAM = "#faf7f3";
const D_LINE = "#E4DFDA";

const STEPS = ["Amount", "Designation", "Payment", "Review", "Done"];

function CheckoutShell({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: D_CREAM }}>
      <header style={{ background: "#fff", borderBottom: `1px solid ${D_LINE}`, padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: D_INK, textDecoration: "none" }}>BAPS Charities</Link>
        <div style={{ fontSize: 12, color: D_MUTED, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3d6029", display: "inline-block" }} />
          Secure checkout · 256-bit SSL · Stripe
        </div>
      </header>

      <div style={{ background: "#fff", borderBottom: `1px solid ${D_LINE}`, padding: "20px 48px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? D_BRAND : active ? "#fff" : D_LINE, border: active ? `2px solid ${D_BRAND}` : "none", color: done ? "#fff" : active ? D_BRAND : D_MUTED, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {done ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: active ? D_INK : done ? D_BODY : D_MUTED, letterSpacing: "0.04em" }}>{s}</div>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: done ? D_BRAND : D_LINE, margin: "0 12px" }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 24px" }}>{children}</div>
    </div>
  );
}

function Card({ children, padding = 32 }: { children: React.ReactNode; padding?: number }) {
  return <div style={{ background: "#fff", border: `1px solid ${D_LINE}`, borderRadius: 4, padding, marginBottom: 16 }}>{children}</div>;
}

function Heading({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, color: D_BRAND, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700 }}>{eyebrow}</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, lineHeight: 1.1, color: D_INK, margin: "12px 0 0", fontWeight: 400, letterSpacing: "-0.015em" }}>{title}</h1>
      {blurb && <p style={{ fontSize: 15, color: D_BODY, lineHeight: 1.65, marginTop: 14 }}>{blurb}</p>}
    </div>
  );
}

function CtaRow({ back, primary, onBack, onPrimary, disabled }: { back?: string; primary: string; onBack?: () => void; onPrimary: () => void; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
      {back ? <button onClick={onBack} style={{ background: "none", border: "none", color: D_BODY, fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "14px 0" }}>← {back}</button> : <span />}
      <button onClick={onPrimary} disabled={disabled} style={{ padding: "14px 32px", background: disabled ? "#c9c2bb" : D_BRAND, color: "#fff", border: "none", borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer" }}>{primary} →</button>
    </div>
  );
}

const PROGRAMS = [
  { name: "Where most needed", sub: "Let us direct your gift to the program with the greatest need this quarter", badge: "Recommended" },
  { name: "Health Awareness", sub: "Free health camps, mobile clinics, and medical outreach across North America" },
  { name: "Educational Services", sub: "Scholarships, tutoring programs, and educational support" },
  { name: "Humanitarian Relief", sub: "Disaster response, food distribution, and emergency aid" },
  { name: "Environmental Protection", sub: "Tree planting drives, conservation, and environmental education" },
  { name: "Community Empowerment", sub: "Skill-building, mentorship, and community development programs" },
];

function SummaryRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, padding: "16px 24px", borderBottom: `1px solid ${D_LINE}`, alignItems: "center" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: D_MUTED, letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: emphasis ? 22 : 14, color: D_INK, fontFamily: emphasis ? "var(--font-display)" : "inherit" }}>{value}</div>
    </div>
  );
}

function StripePaymentForm({ clientSecret, onSuccess, amount, designation, monthly }: { clientSecret: string; onSuccess: () => void; amount: number; designation: string; monthly: boolean }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  function handlePay() {
    if (!stripe || !elements) return;
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMsg("Please fill in your name and email.");
      return;
    }

    startTransition(async () => {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate/checkout?success=1`,
          receipt_email: email,
          payment_method_data: {
            billing_details: {
              name: `${firstName} ${lastName}`,
              email,
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMsg(error.message ?? "Payment failed. Please try again.");
      } else {
        onSuccess();
      }
    });
  }

  const inputStyle: React.CSSProperties = { padding: "12px 14px", border: `1px solid ${D_LINE}`, borderRadius: 4, fontSize: 14, width: "100%", boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <>
      {errorMsg && (
        <div style={{ marginBottom: 16, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, fontSize: 13, color: D_BRAND }}>
          {errorMsg}
        </div>
      )}

      <Card padding={28}>
        <div style={{ fontSize: 12, fontWeight: 600, color: D_INK, letterSpacing: "0.04em", marginBottom: 16 }}>Donor information</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: D_MUTED, display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>First name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: D_MUTED, display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Last name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: D_MUTED, display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Email (receipt will be sent here)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </Card>

      <Card padding={28}>
        <div style={{ fontSize: 12, fontWeight: 600, color: D_INK, letterSpacing: "0.04em", marginBottom: 16 }}>Payment details</div>
        <PaymentElement />
      </Card>

      <div style={{ background: D_CREAM, padding: 16, borderRadius: 4, fontSize: 12, color: D_BODY, lineHeight: 1.6, marginBottom: 16 }}>
        By clicking &quot;Give now,&quot; you authorize BAPS Charities (EIN 26-1530694) to charge ${amount.toFixed(2)} USD. Your gift is tax-deductible.
        {monthly && " This is a recurring monthly gift — you may cancel at any time by emailing donate@bapscharities.org."}
      </div>

      <button
        onClick={handlePay}
        disabled={!stripe || isPending}
        style={{ width: "100%", padding: 18, background: !stripe || isPending ? "#c9c2bb" : D_BRAND, color: "#fff", border: "none", borderRadius: 4, fontSize: 17, fontWeight: 600, cursor: !stripe || isPending ? "not-allowed" : "pointer" }}
      >
        {isPending ? "Processing…" : `Give $${amount.toFixed(2)} now →`}
      </button>
    </>
  );
}

function CheckoutInner() {
  const searchParams = useSearchParams();
  const initialAmount = Number(searchParams.get("amount")) || 250;
  const initialProgram = searchParams.get("program") || "Where most needed";
  const initialRecurring = searchParams.get("recurring") === "true";

  // Find the matching program index (case-insensitive), fall back to 0
  const initialDesignation = Math.max(
    0,
    PROGRAMS.findIndex((p) => p.name.toLowerCase() === initialProgram.toLowerCase())
  );

  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(initialAmount);
  const [customAmt, setCustomAmt] = useState(String(initialAmount));
  const [monthly, setMonthly] = useState(initialRecurring);
  const [designation, setDesignation] = useState(initialDesignation);
  const [coverFee, setCoverFee] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState("");
  const [isCreatingIntent, startCreating] = useTransition();
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const fee = Math.round(amount * 0.029 * 100) / 100;
  const total = coverFee ? amount + fee : amount;
  const totalCents = Math.round(total * 100);

  function proceedToPayment() {
    startCreating(async () => {
      setStripeError("");
      const result = await createPaymentIntent(totalCents, PROGRAMS[designation].name);
      if ("error" in result) {
        setStripeError(result.error);
      } else {
        setClientSecret(result.clientSecret);
        setStep(2);
      }
    });
  }

  if (step === 4) {
    return (
      <CheckoutShell step={4}>
        <Card padding={48}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#3d6029", color: "#fff", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>✓</div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: "#3d6029", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700 }}>Gift confirmed</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1.1, color: D_INK, margin: "14px 0 0", fontWeight: 400 }}>
              {donorName ? `Thank you, ${donorName.split(" ")[0]}.` : "Thank you."}
            </h1>
            <p style={{ fontSize: 16, color: D_BODY, lineHeight: 1.65, marginTop: 16, maxWidth: 480, margin: "16px auto 0" }}>
              Your ${total.toFixed(2)} gift to <strong style={{ color: D_INK }}>{PROGRAMS[designation].name}</strong> has been processed.
              {donorEmail && ` A receipt is on its way to ${donorEmail}.`}
            </p>
          </div>
          <div style={{ background: D_CREAM, borderLeft: `3px solid ${D_BRAND}`, padding: 20, borderRadius: 2, fontSize: 14, color: D_BODY, lineHeight: 1.65 }}>
            <div style={{ fontSize: 11, color: D_MUTED, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Tax deduction</div>
            BAPS Charities is a 501(c)(3) public charity. EIN: 26-1530694. Your receipt is your tax deduction record.
          </div>
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Link href="/get-involved" style={{ padding: 14, background: "#fff", color: D_INK, border: `1px solid ${D_LINE}`, borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "none", textAlign: "center" }}>Volunteer now</Link>
            <Link href="/" style={{ padding: 14, background: D_BRAND, color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none", textAlign: "center" }}>Return home →</Link>
          </div>
        </Card>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell step={step}>
      {step === 0 && (
        <>
          <Heading eyebrow="Step 1 of 4" title="Make a gift." blurb="Every gift is tax-deductible — BAPS Charities is a 501(c)(3) public charity (EIN 26-1530694)." />
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[50, 100, 250, 500, 1000].map((p) => (
                <button key={p} onClick={() => { setAmount(p); setCustomAmt(String(p)); }} style={{ padding: "20px 16px", background: amount === p ? "#fdeae5" : "#fff", border: `1.5px solid ${amount === p ? D_BRAND : D_LINE}`, borderRadius: 4, fontFamily: "var(--font-display)", fontSize: 24, color: D_INK, cursor: "pointer" }}>
                  ${p}
                </button>
              ))}
              <button style={{ padding: "20px 16px", background: "#fff", border: `1.5px solid ${D_LINE}`, borderRadius: 4, fontFamily: "var(--font-display)", fontSize: 16, color: D_MUTED, cursor: "pointer" }}>Other ↓</button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: D_INK, letterSpacing: "0.04em" }}>Custom amount</label>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${D_LINE}`, borderRadius: 4, marginTop: 6 }}>
                <span style={{ padding: "14px 16px", fontSize: 18, color: D_MUTED, fontFamily: "var(--font-display)" }}>$</span>
                <input value={customAmt} onChange={(e) => { setCustomAmt(e.target.value); setAmount(Number(e.target.value) || 0); }} style={{ flex: 1, padding: "14px 0", fontSize: 22, fontFamily: "var(--font-display)", color: D_INK, border: "none", outline: "none", background: "transparent" }} />
                <span style={{ padding: "14px 16px", fontSize: 12, color: D_MUTED, fontWeight: 600, letterSpacing: "0.1em" }}>USD</span>
              </div>
            </div>
            <label style={{ display: "flex", gap: 12, padding: 16, background: D_CREAM, borderLeft: `3px solid ${D_BRAND}`, borderRadius: 2, alignItems: "flex-start", cursor: "pointer" }}>
              <input type="checkbox" checked={monthly} onChange={(e) => setMonthly(e.target.checked)} style={{ marginTop: 4 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: D_INK }}>Make this a monthly gift</div>
                <div style={{ fontSize: 12, color: D_MUTED, marginTop: 4, lineHeight: 1.5 }}>Recurring gifts let us plan ahead and fund the hard-to-fund items — clinician travel, equipment, logistics.</div>
              </div>
            </label>
          </Card>
          <CtaRow primary="Continue to designation" onPrimary={() => setStep(1)} disabled={amount < 1} />
        </>
      )}

      {step === 1 && (
        <>
          <Heading eyebrow="Step 2 of 4" title={`Where should your $${amount} go?`} blurb="Pick a program, or let us direct your gift to where the need is greatest right now." />
          <div style={{ display: "grid", gap: 10 }}>
            {PROGRAMS.map((p, i) => (
              <Card key={i} padding={0}>
                <label style={{ display: "flex", gap: 14, padding: 20, alignItems: "center", cursor: "pointer", borderLeft: designation === i ? `3px solid ${D_BRAND}` : "3px solid transparent", background: designation === i ? "#fdeae5" : "#fff" }} onClick={() => setDesignation(i)}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${designation === i ? D_BRAND : D_LINE}`, background: "#fff", position: "relative", flexShrink: 0 }}>
                    {designation === i && <span style={{ position: "absolute", inset: 3, borderRadius: "50%", background: D_BRAND }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: D_INK }}>{p.name}</div>
                      {"badge" in p && p.badge && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3d6029", background: "#dceac9", padding: "3px 8px", borderRadius: 999 }}>{p.badge}</span>}
                    </div>
                    <div style={{ fontSize: 13, color: D_BODY, marginTop: 4 }}>{p.sub}</div>
                  </div>
                </label>
              </Card>
            ))}
          </div>

          <Card padding={20}>
            <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: D_BODY, cursor: "pointer" }}>
              <input type="checkbox" checked={coverFee} onChange={(e) => setCoverFee(e.target.checked)} />
              <div>
                <div style={{ fontWeight: 600, color: D_INK }}>Cover the 2.9% processing fee?</div>
                <div style={{ fontSize: 12, color: D_MUTED, marginTop: 2 }}>Add ${fee.toFixed(2)} so 100% of your ${amount} reaches the program. Total: ${total.toFixed(2)}.</div>
              </div>
            </label>
          </Card>

          {stripeError && (
            <div style={{ marginBottom: 16, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, fontSize: 13, color: D_BRAND }}>
              {stripeError}
            </div>
          )}

          <CtaRow back="Back" primary={isCreatingIntent ? "Preparing…" : "Continue to payment"} onBack={() => setStep(0)} onPrimary={proceedToPayment} disabled={isCreatingIntent} />
        </>
      )}

      {step === 2 && clientSecret && stripePromise ? (
        <>
          <Heading eyebrow="Step 3 of 4" title="How would you like to pay?" blurb="Card, bank account, or wallet. Your information is encrypted and tokenized by Stripe — we never see your full card number." />
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: D_BRAND, fontFamily: "Avenir, Helvetica Neue, sans-serif" } } }}>
            <StripePaymentForm
              clientSecret={clientSecret}
              amount={total}
              designation={PROGRAMS[designation].name}
              monthly={monthly}
              onSuccess={() => setStep(4)}
            />
          </Elements>
          <div style={{ marginTop: 16 }}>
            <button onClick={() => { setStep(1); setClientSecret(null); }} style={{ background: "none", border: "none", color: D_BODY, fontSize: 13, cursor: "pointer" }}>← Back to designation</button>
          </div>
        </>
      ) : step === 2 ? (
        <Card>
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: D_MUTED }}>
              {stripeError || "Payment processing is not yet activated on this site. To donate, please contact "}
              <a href="mailto:donate@bapscharities.org" style={{ color: D_BRAND }}>donate@bapscharities.org</a>.
            </div>
            <button onClick={() => setStep(1)} style={{ marginTop: 16, padding: "12px 24px", background: D_BRAND, color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>← Back</button>
          </div>
        </Card>
      ) : null}
    </CheckoutShell>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
