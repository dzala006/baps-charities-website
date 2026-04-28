"use client";

import { useState, useTransition } from "react";
import { submitContactForm } from "./actions";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setErrorMsg(result.error);
      }
    });
  }

  if (status === "success") {
    return (
      <div style={{ background: "#fff", padding: 40, borderRadius: 4, border: "1px solid #E4DFDA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 380 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#4f7a3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff", marginBottom: 20 }}>✓</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 26, color: "#2a241f", margin: "0 0 12px", textAlign: "center" }}>Message sent</h3>
        <p style={{ fontSize: 15, color: "#4C4238", textAlign: "center", maxWidth: 320, lineHeight: 1.65 }}>
          Thank you for reaching out. We&apos;ll be in touch soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          style={{ marginTop: 24, padding: "12px 28px", background: "#fff", color: "#8E191D", border: "1px solid #8E191D", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 40, borderRadius: 4, border: "1px solid #E4DFDA" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 24, color: "#2a241f", margin: 0 }}>Send us a message</h3>

      {status === "error" && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, fontSize: 13, color: "#8E191D" }}>
          {errorMsg}
        </div>
      )}

      {[
        { label: "Full name", name: "name", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Subject", name: "subject", type: "text" },
      ].map(({ label, name, type }) => (
        <div key={name} style={{ marginTop: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a716a", display: "block", marginBottom: 8 }}>{label}</label>
          <input
            type={type}
            name={name}
            required={name !== "subject"}
            disabled={isPending}
            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 14, fontFamily: "var(--font-body)", outline: "none" }}
          />
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a716a", display: "block", marginBottom: 8 }}>Message</label>
        <textarea
          name="message"
          rows={6}
          required
          disabled={isPending}
          style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 14, fontFamily: "var(--font-body)", resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        style={{ marginTop: 24, padding: "14px 32px", background: isPending ? "#c9c2bb" : "#8E191D", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: isPending ? "not-allowed" : "pointer", transition: "background 200ms" }}
      >
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
