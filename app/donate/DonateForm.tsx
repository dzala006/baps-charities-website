"use client";

import { useState } from "react";
import Link from "next/link";

const PRESETS = [36, 54, 108, 251, 501, 1008];
const PROGRAMS = ["Where Most Needed", "Health", "Education", "Environment", "Humanitarian Relief", "Community Empowerment"];

export default function DonateForm() {
  const [amount, setAmount] = useState<number | string>(108);
  const [recurring, setRecurring] = useState(false);
  const [program, setProgram] = useState("Where Most Needed");

  return (
    <div style={{ background: "#fff", color: "#2a241f", padding: 36, borderRadius: 4 }}>
      <div style={{ display: "flex", marginBottom: 24, borderRadius: 4, overflow: "hidden", border: "1px solid #E4DFDA" }}>
        <button onClick={() => setRecurring(false)} style={{ flex: 1, padding: "14px 0", border: "none", background: !recurring ? "#8E191D" : "#fff", color: !recurring ? "#fff" : "#4C4238", fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          One-time
        </button>
        <button onClick={() => setRecurring(true)} style={{ flex: 1, padding: "14px 0", border: "none", background: recurring ? "#8E191D" : "#fff", color: recurring ? "#fff" : "#4C4238", fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Monthly
        </button>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 12 }}>Choose amount</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {PRESETS.map((p) => (
          <button key={p} onClick={() => setAmount(p)} style={{ padding: "14px 0", border: amount === p ? "2px solid #8E191D" : "1px solid #c9c2bb", background: amount === p ? "#f1dcdd" : "#fff", borderRadius: 4, fontFamily: "var(--font-display)", fontSize: 22, color: "#2a241f", cursor: "pointer" }}>
            ${p}
          </button>
        ))}
      </div>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px", marginTop: 12, border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 18 }}
        placeholder="Other amount"
      />
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", margin: "24px 0 12px" }}>Designate</div>
      <select value={program} onChange={(e) => setProgram(e.target.value)} style={{ width: "100%", padding: "14px 16px", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 14, background: "#fff" }}>
        {PROGRAMS.map((p) => <option key={p}>{p}</option>)}
      </select>
      <Link href={`/donate/checkout?amount=${encodeURIComponent(String(amount))}&program=${encodeURIComponent(program)}&recurring=${recurring}`} style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "18px 0", marginTop: 20, background: "#8E191D", color: "#fff", borderRadius: 4, fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", textDecoration: "none", textAlign: "center" }}>
        Continue · ${amount}{recurring ? "/mo" : ""}
      </Link>
      <div style={{ fontSize: 11, color: "#7a716a", marginTop: 14, textAlign: "center" }}>
        Secure checkout · Tax-deductible · Receipt emailed
      </div>
    </div>
  );
}
