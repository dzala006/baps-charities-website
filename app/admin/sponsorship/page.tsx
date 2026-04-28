export const metadata = {
  title: "Sponsorship — Admin",
  robots: { index: false, follow: false },
};

export default function SponsorshipPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#CF3728",
            marginBottom: 6,
          }}
        >
          Admin
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display, serif)",
            fontWeight: 400,
            fontSize: 30,
            color: "#2a241f",
            margin: 0,
          }}
        >
          Sponsorship Inquiry Management
        </h1>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #E4DFDA",
          borderRadius: 8,
          padding: "48px 40px",
          maxWidth: 640,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            background: "#f5f0eb",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            marginBottom: 20,
          }}
        >
          📋
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display, serif)",
            fontWeight: 400,
            fontSize: 22,
            color: "#2a241f",
            margin: "0 0 12px",
          }}
        >
          Coming Soon
        </h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.65,
            color: "#4C4238",
            margin: 0,
          }}
        >
          This section will display sponsorship inquiries once the{" "}
          <code
            style={{
              fontSize: 13,
              background: "#f5f0eb",
              padding: "2px 6px",
              borderRadius: 3,
              color: "#8E191D",
            }}
          >
            sponsorship_inquiries
          </code>{" "}
          table is configured.
        </p>
      </div>
    </div>
  );
}
