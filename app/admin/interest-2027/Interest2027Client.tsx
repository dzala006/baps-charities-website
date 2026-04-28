"use client";

type InterestRow = {
  id: string;
  full_name: string;
  email: string;
  city: string | null;
  registered_at: string;
};

type CityBreakdown = { city: string; count: number };

type Props = {
  rows: InterestRow[];
  cityBreakdown: CityBreakdown[];
  mailgunConfigured: boolean;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function exportCSV(rows: InterestRow[]) {
  const headers = ["Name", "Email", "City", "Registered At"];
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [
        `"${(r.full_name ?? "").replace(/"/g, '""')}"`,
        `"${(r.email ?? "").replace(/"/g, '""')}"`,
        `"${(r.city ?? "").replace(/"/g, '""')}"`,
        `"${r.registered_at}"`,
      ].join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "walkathon_interest_2027.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Interest2027Client({
  rows,
  cityBreakdown,
  mailgunConfigured,
}: Props) {
  const thStyle: React.CSSProperties = {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#7a716a",
    borderBottom: "1px solid #E4DFDA",
    background: "#f5f0eb",
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: 13,
    color: "#2a241f",
    borderBottom: "1px solid #E4DFDA",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
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
            2027 Walkathon Interest
          </h1>
          <p style={{ fontSize: 13, color: "#7a716a", marginTop: 6 }}>
            {rows.length} registrations
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              disabled={!mailgunConfigured}
              title={
                mailgunConfigured
                  ? "Send announcement email to all registrants"
                  : "Configure Mailgun to enable"
              }
              style={{
                padding: "10px 20px",
                background: mailgunConfigured ? "#8E191D" : "#E4DFDA",
                color: mailgunConfigured ? "#fff" : "#b1aca7",
                border: "none",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600,
                cursor: mailgunConfigured ? "pointer" : "not-allowed",
                letterSpacing: "0.04em",
              }}
            >
              Send Announcement
            </button>
            {!mailgunConfigured && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
                  right: 0,
                  background: "#2a241f",
                  color: "#faf7f3",
                  fontSize: 11,
                  padding: "6px 10px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              >
                Configure Mailgun to enable
              </div>
            )}
          </div>
          <button
            onClick={() => exportCSV(rows)}
            style={{
              padding: "10px 20px",
              background: "#2a241f",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* City breakdown */}
      {cityBreakdown.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#7a716a",
              marginBottom: 12,
            }}
          >
            By City
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {cityBreakdown.map(({ city, count }) => (
              <div
                key={city}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  background: "#fff",
                  border: "1px solid #E4DFDA",
                  borderRadius: 20,
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#2a241f", fontWeight: 500 }}>{city}</span>
                <span
                  style={{
                    background: "#CF3728",
                    color: "#fff",
                    borderRadius: 10,
                    padding: "1px 7px",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          border: "1px solid #E4DFDA",
          borderRadius: 8,
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>City</th>
              <th style={thStyle}>Registered</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={tdStyle}>{row.full_name}</td>
                <td style={tdStyle}>
                  <a
                    href={`mailto:${row.email}`}
                    style={{ color: "#8E191D", textDecoration: "none" }}
                  >
                    {row.email}
                  </a>
                </td>
                <td style={{ ...tdStyle, color: "#4C4238" }}>
                  {row.city ?? "—"}
                </td>
                <td style={{ ...tdStyle, color: "#7a716a", whiteSpace: "nowrap" }}>
                  {formatDate(row.registered_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 48,
              color: "#7a716a",
              fontSize: 14,
            }}
          >
            No registrations yet.
          </div>
        )}
      </div>
    </div>
  );
}
