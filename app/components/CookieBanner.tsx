"use client";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) setShow(true);
  }, []);

  if (!show) return null;

  const dismiss = (choice: "accepted" | "declined") => {
    localStorage.setItem("cookie_consent", choice);
    setShow(false);
  };

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999, background: "#2a241f", color: "#E4DFDA", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderTop: "1px solid #4C4238", fontSize: 13 }}>
      <p style={{ margin: 0, flex: 1, minWidth: 200, lineHeight: 1.5 }}>
        We use cookies for authentication and to improve your experience. See our{" "}
        <a href="/privacy" style={{ color: "#CF3728", textDecoration: "underline" }}>Privacy Policy</a>.
      </p>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={() => dismiss("declined")} style={{ padding: "8px 16px", background: "transparent", color: "#b1aca7", border: "1px solid #5a4e47", borderRadius: 4, cursor: "pointer", fontSize: 13 }}>
          Decline
        </button>
        <button onClick={() => dismiss("accepted")} style={{ padding: "8px 16px", background: "#8E191D", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          Accept
        </button>
      </div>
    </div>
  );
}
