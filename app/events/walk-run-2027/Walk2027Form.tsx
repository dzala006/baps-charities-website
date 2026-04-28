"use client";

import { useState, useTransition } from "react";
import { registerInterest2027 } from "./actions";

export default function Walk2027Form() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await registerInterest2027(fd);
      if (r.success) { setStatus("success"); (e.target as HTMLFormElement).reset(); }
      else { setStatus("error"); setErrorMsg(r.error); }
    });
  }

  const inp: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "13px 14px", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 14, fontFamily: "var(--font-body)", outline: "none" };
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#7a716a", display: "block", marginBottom: 8 };

  if (status === "success") return (
    <div style={{ background: "#2a241f", color: "#fff", borderRadius: 4, padding: 40, textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#4f7a3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 20px" }}>✓</div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 26, color: "#fff", margin: "0 0 12px" }}>You&apos;re on the list.</h3>
      <p style={{ fontSize: 14, color: "#b1aca7", lineHeight: 1.65 }}>We&apos;ll email you the moment 2027 registration opens in your city.</p>
    </div>
  );

  return (
    <div style={{ background: "#2a241f", borderRadius: 4, padding: 36 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 12 }}>2027 Interest Registration</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, color: "#fff", margin: "0 0 8px", lineHeight: 1.15 }}>Be first to know.</h2>
      <p style={{ fontSize: 13, color: "#b1aca7", lineHeight: 1.65, marginBottom: 28 }}>Register your interest and get early access when your city opens for 2027.</p>

      {status === "error" && <div style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(142,25,29,0.3)", borderRadius: 4, fontSize: 13, color: "#f5c6c7" }}>{errorMsg}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div><label style={lbl}>Full name</label><input name="name" required disabled={isPending} style={inp} /></div>
        <div><label style={lbl}>Email</label><input name="email" type="email" required disabled={isPending} style={inp} /></div>
        <div><label style={lbl}>Your city (optional)</label><input name="city" disabled={isPending} placeholder="e.g. Dallas, TX" style={inp} /></div>
        <button type="submit" disabled={isPending} style={{ padding: "15px 0", background: isPending ? "#5c5249" : "#8E191D", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: isPending ? "not-allowed" : "pointer", marginTop: 4 }}>
          {isPending ? "Registering…" : "Register Interest →"}
        </button>
      </form>
      <p style={{ fontSize: 11, color: "#5c5249", marginTop: 16, lineHeight: 1.5 }}>No spam. We&apos;ll only email you about Walk | Run 2027 in your city.</p>
    </div>
  );
}
