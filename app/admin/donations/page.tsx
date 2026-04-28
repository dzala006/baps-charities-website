"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

type Donation = {
  id: string;
  stripe_payment_id: string | null;
  amount_cents: number | null;
  amount_usd: number | null;
  currency: string | null;
  designation: string | null;
  donor_email: string | null;
  donor_name: string | null;
  created_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatUSD(val: number | null) {
  if (val == null) return "—";
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function exportCSV(rows: Donation[]) {
  const headers = [
    "Donor Name",
    "Email",
    "Amount",
    "Designation",
    "Date",
    "Stripe ID",
  ];
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [
        `"${(r.donor_name ?? "").replace(/"/g, '""')}"`,
        `"${(r.donor_email ?? "").replace(/"/g, '""')}"`,
        `"${formatUSD(r.amount_usd)}"`,
        `"${(r.designation ?? "").replace(/"/g, '""')}"`,
        `"${r.created_at}"`,
        `"${(r.stripe_payment_id ?? "").replace(/"/g, '""')}"`,
      ].join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "donations.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function DonationsPage() {
  const [rows, setRows] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [designationFilter, setDesignationFilter] = useState("all");

  useEffect(() => {
    supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as Donation[]) ?? []);
        setLoading(false);
      });
  }, []);

  const designations = useMemo(() => {
    const set = new Set(rows.map((r) => r.designation ?? "Unspecified"));
    return ["all", ...Array.from(set).sort()];
  }, [rows]);

  const filtered = useMemo(() => {
    if (designationFilter === "all") return rows;
    return rows.filter(
      (r) => (r.designation ?? "Unspecified") === designationFilter
    );
  }, [rows, designationFilter]);

  const total = useMemo(
    () => filtered.reduce((sum, r) => sum + (r.amount_usd ?? 0), 0),
    [filtered]
  );

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
            Donations
          </h1>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
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

      {/* Filters + summary */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 20,
          padding: "16px 20px",
          background: "#fff",
          border: "1px solid #E4DFDA",
          borderRadius: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#7a716a",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Designation
          </label>
          <select
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            style={{
              padding: "6px 10px",
              border: "1px solid #E4DFDA",
              borderRadius: 4,
              fontSize: 13,
              color: "#2a241f",
              background: "#faf7f3",
            }}
          >
            {designations.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "All designations" : d}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#7a716a", marginBottom: 2 }}>
            {filtered.length} donations
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#CF3728",
              letterSpacing: "-0.02em",
            }}
          >
            {formatUSD(total)}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "#7a716a", fontSize: 14 }}>Loading…</div>
      ) : (
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
                <th style={thStyle}>Donor Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Designation</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Stripe ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td style={tdStyle}>{row.donor_name ?? "Anonymous"}</td>
                  <td style={tdStyle}>
                    {row.donor_email ? (
                      <a
                        href={`mailto:${row.donor_email}`}
                        style={{ color: "#8E191D", textDecoration: "none" }}
                      >
                        {row.donor_email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: 600,
                      color: "#2a241f",
                    }}
                  >
                    {formatUSD(row.amount_usd)}
                  </td>
                  <td style={{ ...tdStyle, color: "#4C4238" }}>
                    {row.designation ?? "Unspecified"}
                  </td>
                  <td style={{ ...tdStyle, color: "#7a716a", whiteSpace: "nowrap" }}>
                    {formatDate(row.created_at)}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      color: "#7a716a",
                      fontFamily: "monospace",
                      fontSize: 11,
                    }}
                  >
                    {row.stripe_payment_id
                      ? row.stripe_payment_id.slice(0, 20) + "…"
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 48,
                color: "#7a716a",
                fontSize: 14,
              }}
            >
              No donations found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
