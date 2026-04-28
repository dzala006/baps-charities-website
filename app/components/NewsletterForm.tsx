"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Please try again.");
      }
      setStatus("success");
      setMessage(
        data?.message === "Already subscribed"
          ? "You're already subscribed!"
          : "Thank you for subscribing!"
      );
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Please try again.");
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#fff",
          marginBottom: 10,
        }}
      >
        Sign up for our newsletter
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", maxWidth: 320 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") {
              setStatus("idle");
              setMessage("");
            }
          }}
          placeholder="your@email.com"
          disabled={status === "loading"}
          style={{
            flex: 1,
            padding: "10px 14px",
            background: "#3d3530",
            border: "1px solid #5c5249",
            borderRadius: "4px 0 0 4px",
            color: "#E4DFDA",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            padding: "0 16px",
            background: "#8E191D",
            color: "#fff",
            border: "none",
            borderRadius: "0 4px 4px 0",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            fontSize: 16,
            opacity: status === "loading" ? 0.7 : 1,
          }}
          aria-label="Subscribe"
        >
          →
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: status === "success" ? "#CF3728" : "#e05252",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
