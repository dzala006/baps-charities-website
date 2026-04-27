"use client";

import { useState } from "react";

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
        <a href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: D_INK, textDecoration: "none" }}>BAPS Charities</a>
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

function CtaRow({ back, primary, onBack, onPrimary }: { back?: string; primary: string; onBack?: () => void; onPrimary: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
      {back ? (
        <button onClick={onBack} style={{ background: "none", border: "none", color: D_BODY, fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "14px 0" }}>← {back}</button>
      ) : <span />}
      <button onClick={onPrimary} style={{ padding: "14px 32px", background: D_BRAND, color: "#fff", border: "none", borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>{primary} →</button>
    </div>
  );
}

const inputStyle: React.CSSProperties = { padding: "12px 14px", border: `1px solid ${D_LINE}`, borderRadius: 4, fontSize: 14, width: "100%", boxSizing: "border-box" };

function SummaryRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr auto", gap: 16, padding: "16px 24px", borderBottom: `1px solid ${D_LINE}`, alignItems: "center" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: D_MUTED, letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: emphasis ? 22 : 14, color: D_INK, fontFamily: emphasis ? "var(--font-display)" : "inherit" }}>{value}</div>
      <button style={{ fontSize: 12, color: D_BRAND, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Edit</button>
    </div>
  );
}

const PROGRAMS = [
  { name: "Where most needed", sub: "Let us direct your gift to the program with the greatest need this quarter", badge: "Recommended" },
  { name: "Health Awareness", sub: "Free health camps, mobile clinics, and medical outreach across North America" },
  { name: "Educational Services", sub: "Scholarships, tutoring programs, and educational support for underserved communities" },
  { name: "Humanitarian Relief", sub: "Disaster response, food distribution, and emergency aid — earthquakes, floods, and urgent crises" },
  { name: "Environmental Protection", sub: "Tree planting drives, conservation initiatives, and environmental education" },
  { name: "Community Empowerment", sub: "Skill-building, mentorship, and community development programs" },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(250);
  const [customAmt, setCustomAmt] = useState("250");
  const [monthly, setMonthly] = useState(false);
  const [designation, setDesignation] = useState(1);
  const [payMethod, setPayMethod] = useState(0);
  const [coverFee, setCoverFee] = useState(true);

  const fee = Math.round(amount * 0.029 * 100) / 100;
  const total = coverFee ? amount + fee : amount;

  if (step === 4) {
    return (
      <CheckoutShell step={4}>
        <Card padding={48}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#3d6029", color: "#fff", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>✓</div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: "#3d6029", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700 }}>Gift confirmed</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1.1, color: D_INK, margin: "14px 0 0", fontWeight: 400 }}>Thank you, Bharat.</h1>
            <p style={{ fontSize: 16, color: D_BODY, lineHeight: 1.65, marginTop: 16, maxWidth: 480, margin: "16px auto 0" }}>
              Your ${total.toFixed(2)} gift to <strong style={{ color: D_INK }}>Annapurna India</strong> has been processed. A receipt is on its way to bharat.patel@example.org.
            </p>
          </div>
          <div style={{ background: D_CREAM, borderLeft: `3px solid ${D_BRAND}`, padding: 20, borderRadius: 2, fontSize: 14, color: D_BODY, lineHeight: 1.65 }}>
            <div style={{ fontSize: 11, color: D_MUTED, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>What your gift does</div>
            <strong style={{ color: D_INK }}>${amount} funds approximately {amount * 2.5} hot meals</strong> at the Sarangpur children's home.
          </div>
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button style={{ padding: 14, background: "#fff", color: D_INK, border: `1px solid ${D_LINE}`, borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Download receipt (PDF)</button>
            <a href="/" style={{ padding: 14, background: D_BRAND, color: "#fff", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none", textAlign: "center" }}>Return home →</a>
          </div>
          <div style={{ marginTop: 28, padding: 20, border: `1px solid ${D_LINE}`, borderRadius: 4, fontSize: 13, color: D_BODY }}>
            <div style={{ fontSize: 11, color: D_MUTED, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Employer match</div>
            Your employer (Reliant Energy) matches at 1.5×. <a href="#" style={{ color: D_BRAND, fontWeight: 600 }}>Submit a match request →</a>
          </div>
        </Card>
        <div style={{ textAlign: "center", fontSize: 12, color: D_MUTED, marginTop: 24 }}>
          Receipt #BC-2026-04821 · April 2, 2026 · 9:14 AM CT
        </div>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell step={step}>
      {step === 0 && (
        <>
          <Heading eyebrow="Step 1 of 4" title="Make a gift." blurb="Choose an amount. Every gift is tax-deductible — BAPS Charities is a 501(c)(3) public charity. EIN available upon request." />
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[50, 100, 250, 500, 1000].map((p) => (
                <button key={p} onClick={() => { setAmount(p); setCustomAmt(String(p)); }} style={{ padding: "20px 16px", background: amount === p ? "#fdeae5" : "#fff", border: `1.5px solid ${amount === p ? D_BRAND : D_LINE}`, borderRadius: 4, fontFamily: "var(--font-display)", fontSize: 24, color: D_INK, cursor: "pointer" }}>
                  ${p}
                </button>
              ))}
              <button style={{ padding: "20px 16px", background: "#fff", border: `1.5px solid ${D_LINE}`, borderRadius: 4, fontFamily: "var(--font-display)", fontSize: 24, color: D_INK, cursor: "pointer" }}>Other</button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: D_INK, letterSpacing: "0.04em" }}>Custom amount</label>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${D_LINE}`, borderRadius: 4, marginTop: 6 }}>
                <span style={{ padding: "14px 16px", fontSize: 18, color: D_MUTED, fontFamily: "var(--font-display)" }}>$</span>
                <input value={customAmt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCustomAmt(e.target.value); setAmount(Number(e.target.value) || 0); }} style={{ flex: 1, padding: "14px 0", fontSize: 22, fontFamily: "var(--font-display)", color: D_INK, border: "none", outline: "none", background: "transparent" }} />
                <span style={{ padding: "14px 16px", fontSize: 12, color: D_MUTED, fontWeight: 600, letterSpacing: "0.1em" }}>USD</span>
              </div>
            </div>
            <label style={{ display: "flex", gap: 12, padding: 16, background: D_CREAM, borderLeft: `3px solid ${D_BRAND}`, borderRadius: 2, alignItems: "flex-start", cursor: "pointer" }}>
              <input type="checkbox" checked={monthly} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthly(e.target.checked)} style={{ marginTop: 4 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: D_INK }}>Make this a monthly gift</div>
                <div style={{ fontSize: 12, color: D_MUTED, marginTop: 4, lineHeight: 1.5 }}>Recurring gifts let us plan further out and fund the hard-to-fund line items — clinician travel, equipment maintenance.</div>
              </div>
            </label>
          </Card>
          <Card padding={20}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 13, color: D_BODY }}>
              <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#dde7ec", color: "#385562", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>2×</span>
              <div>
                <div style={{ fontWeight: 600, color: D_INK }}>Reliant Energy matches at 1.5×</div>
                <div style={{ fontSize: 12, color: D_MUTED, marginTop: 2 }}>${amount} becomes ${(amount * 1.5).toFixed(0)} once your match is processed.</div>
              </div>
            </div>
          </Card>
          <CtaRow primary="Continue to designation" onPrimary={() => setStep(1)} />
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
            <label style={{ fontSize: 12, fontWeight: 600, color: D_INK, letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>Tribute (optional)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <select style={{ padding: "12px 14px", background: "#fff", border: `1px solid ${D_LINE}`, borderRadius: 4, fontSize: 14 }}>
                <option>In honor of</option>
                <option>In memory of</option>
              </select>
              <input placeholder="Name of person honored" style={{ flex: 1, padding: "12px 14px", border: `1px solid ${D_LINE}`, borderRadius: 4, fontSize: 14 }} />
            </div>
          </Card>
          <CtaRow back="Back" primary="Continue to payment" onBack={() => setStep(0)} onPrimary={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <Heading eyebrow="Step 3 of 4" title="How would you like to pay?" blurb="Card, bank account, or PayPal. Your information is encrypted and tokenized — we never see your full card number." />
          <Card padding={0}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
              {[{ k: "Credit / debit card", icon: "💳" }, { k: "Bank (ACH)", icon: "🏦" }, { k: "PayPal", icon: "P" }].map((p, i) => (
                <button key={i} onClick={() => setPayMethod(i)} style={{ padding: "20px 16px", background: payMethod === i ? "#fdeae5" : "#fff", borderRight: i < 2 ? `1px solid ${D_LINE}` : "none", borderBottom: payMethod === i ? `2px solid ${D_BRAND}` : "2px solid transparent", border: "none", fontSize: 14, fontWeight: 600, color: payMethod === i ? D_BRAND : D_BODY, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{p.icon}</span>{p.k}
                </button>
              ))}
            </div>
            <div style={{ padding: 28, borderTop: `1px solid ${D_LINE}` }}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: D_INK, letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>Card number</label>
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${D_LINE}`, borderRadius: 4 }}>
                  <input defaultValue="4242 4242 4242 4242" style={{ flex: 1, padding: "12px 14px", fontSize: 15, border: "none", outline: "none" }} />
                  <span style={{ padding: "0 14px", fontSize: 11, color: D_MUTED, fontWeight: 700 }}>VISA</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
                {[["Expiry", "12 / 27"], ["CVC", "123"], ["ZIP", "77479"]].map(([l, v]) => (
                  <div key={l}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: D_INK, display: "block", marginBottom: 6 }}>{l}</label>
                    <input defaultValue={v} style={{ ...inputStyle }} />
                  </div>
                ))}
              </div>
              <label style={{ display: "flex", gap: 10, fontSize: 13, color: D_BODY, marginBottom: 6, cursor: "pointer" }}>
                <input type="checkbox" defaultChecked />
                Save this card for future gifts
              </label>
            </div>
          </Card>
          <Card padding={20}>
            <div style={{ fontSize: 12, fontWeight: 600, color: D_INK, letterSpacing: "0.04em", marginBottom: 14 }}>Donor information</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input placeholder="First name" defaultValue="Bharat" style={inputStyle} />
              <input placeholder="Last name" defaultValue="Patel" style={inputStyle} />
              <input placeholder="Email" defaultValue="bharat.patel@example.org" style={{ ...inputStyle, gridColumn: "span 2" }} />
            </div>
            <label style={{ display: "flex", gap: 10, fontSize: 13, color: D_BODY, marginTop: 14, cursor: "pointer" }}>
              <input type="checkbox" />
              Make this gift anonymous on public donor walls
            </label>
          </Card>
          <CtaRow back="Back to designation" primary="Review your gift" onBack={() => setStep(1)} onPrimary={() => setStep(3)} />
        </>
      )}

      {step === 3 && (
        <>
          <Heading eyebrow="Step 4 of 4" title="One last look." blurb="Confirm everything is right, then we'll process your gift and email you a receipt within 60 seconds." />
          <Card padding={0}>
            <SummaryRow label="Amount" value={`$${amount.toFixed(2)} USD`} emphasis />
            <SummaryRow label="Frequency" value={monthly ? "Monthly gift" : "One-time gift"} />
            <SummaryRow label="Designation" value={PROGRAMS[designation].name} />
            <SummaryRow label="Donor" value="Bharat Patel · bharat.patel@example.org" />
            <SummaryRow label="Payment" value="Visa ending 4242 · expires 12/27" />
            <SummaryRow label="Receipt to" value="bharat.patel@example.org" />
          </Card>
          <Card padding={20}>
            <label style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 13, color: D_BODY, cursor: "pointer" }}>
              <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#dde7ec", color: "#385562", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>+</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: D_INK }}>Cover the 2.9% processing fee?</div>
                <div style={{ fontSize: 12, color: D_MUTED, marginTop: 2 }}>Add ${fee.toFixed(2)} so 100% of your ${amount} reaches the program.</div>
              </div>
              <input type="checkbox" checked={coverFee} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCoverFee(e.target.checked)} />
            </label>
          </Card>
          <div style={{ background: D_CREAM, padding: 20, borderRadius: 4, fontSize: 12, color: D_BODY, lineHeight: 1.6, marginBottom: 20 }}>
            By clicking "Give now," you authorize BAPS Charities to charge ${total.toFixed(2)} USD to your Visa ending 4242. Your gift is tax-deductible. <a href="#" style={{ color: D_BRAND }}>Refund policy</a>.
          </div>
          <button onClick={() => setStep(4)} style={{ width: "100%", padding: 18, background: D_BRAND, color: "#fff", border: "none", borderRadius: 4, fontSize: 17, fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em" }}>
            Give ${total.toFixed(2)} now →
          </button>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: D_BODY, fontSize: 13, cursor: "pointer" }}>← Edit my gift</button>
          </div>
        </>
      )}
    </CheckoutShell>
  );
}
