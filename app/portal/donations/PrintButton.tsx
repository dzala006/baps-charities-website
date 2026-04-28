"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        padding: "10px 22px",
        background: "transparent",
        color: "#8E191D",
        border: "1.5px solid #8E191D",
        borderRadius: 4,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      Download Receipt
    </button>
  );
}
