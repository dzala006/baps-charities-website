"use client";
import { useState } from "react";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import Link from "next/link";

const PRESETS = [36, 54, 108, 251, 501, 1008];
const PROGRAMS = ["Where Most Needed", "Health", "Education", "Environment", "Humanitarian Relief", "Community Empowerment"];

export default function DonatePage() {
  const [amount, setAmount] = useState<number | string>(108);
  const [recurring, setRecurring] = useState(false);
  const [program, setProgram] = useState("Where Most Needed");
  return (
    <PageShell>
      <section style={{ background: "#2a241f", color: "#E4DFDA", padding: "64px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb tone="light" items={[{ label: "Home", href: "/" }, { label: "Donate" }]} />
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 16 }}>Donate</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(36px,4vw,56px)", lineHeight: 1.1, margin: 0, color: "#fff" }}>
                Every dollar serves. <em style={{ color: "#CF3728", fontStyle: "italic" }}>Zero overhead.</em>
              </h1>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "#b1aca7", marginTop: 24 }}>BAPS Charities is 100% volunteer‑run. Your donation goes directly to programs — not to fundraising consultants, executive salaries, or office leases.</p>
              <div style={{ marginTop: 40, padding: 28, background: "#3d3530", borderLeft: "3px solid #CF3728" }}>
                <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 20, lineHeight: 1.5, color: "#fff" }}>"$108 funds a free health screening for one family of four — including labs and a primary‑care consult."</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 32 }}>
                {[{ n: "95¢", l: "of every $1 to programs" }, { n: "4‑Star", l: "Charity Navigator rating" }, { n: "501(c)(3)", l: "Tax‑deductible gifts" }].map(b => (
                  <div key={b.l}><div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#CF3728" }}>{b.n}</div><div style={{ fontSize: 12, color: "#b1aca7", marginTop: 4 }}>{b.l}</div></div>
                ))}
              </div>
            </div>
            <div style={{ background: "#fff", color: "#2a241f", padding: 36, borderRadius: 4 }}>
              <div style={{ display: "flex", marginBottom: 24, borderRadius: 4, overflow: "hidden", border: "1px solid #E4DFDA" }}>
                <button onClick={() => setRecurring(false)} style={{ flex: 1, padding: "14px 0", border: "none", background: !recurring ? "#8E191D" : "#fff", color: !recurring ? "#fff" : "#4C4238", fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}>One‑time</button>
                <button onClick={() => setRecurring(true)} style={{ flex: 1, padding: "14px 0", border: "none", background: recurring ? "#8E191D" : "#fff", color: recurring ? "#fff" : "#4C4238", fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}>Monthly</button>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 12 }}>Choose amount</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {PRESETS.map(p => (
                  <button key={p} onClick={() => setAmount(p)} style={{ padding: "14px 0", border: amount === p ? "2px solid #8E191D" : "1px solid #c9c2bb", background: amount === p ? "#f1dcdd" : "#fff", borderRadius: 4, fontFamily: "var(--font-display)", fontSize: 22, color: "#2a241f", cursor: "pointer" }}>${p}</button>
                ))}
              </div>
              <input value={amount} onChange={e => setAmount(e.target.value)} type="number" style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px", marginTop: 12, border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 18 }} placeholder="Other amount" />
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", margin: "24px 0 12px" }}>Designate</div>
              <select value={program} onChange={e => setProgram(e.target.value)} style={{ width: "100%", padding: "14px 16px", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 14, background: "#fff" }}>
                {PROGRAMS.map(p => <option key={p}>{p}</option>)}
              </select>
              <Link href="/donate/checkout" style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "18px 0", marginTop: 20, background: "#8E191D", color: "#fff", borderRadius: 4, fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", textDecoration: "none", textAlign: "center" }}>Continue · ${amount}{recurring ? "/mo" : ""}</Link>
              <div style={{ fontSize: 11, color: "#7a716a", marginTop: 14, textAlign: "center" }}>🔒 Secure checkout · Tax‑deductible · Receipt emailed</div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
