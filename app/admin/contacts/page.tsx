"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@supabase/supabase-js";
import { markContactRead } from "./actions";

type ContactSubmission = {
  id: string;
  full_name: string;
  email: string;
  subject: string | null;
  message: string | null;
  submitted_at: string;
  read: boolean;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncate(str: string | null, len: number) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

function exportCSV(rows: ContactSubmission[]) {
  const headers = ["Name", "Email", "Subject", "Date", "Message", "Read"];
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [
        `"${(r.full_name ?? "").replace(/"/g, '""')}"`,
        `"${(r.email ?? "").replace(/"/g, '""')}"`,
        `"${(r.subject ?? "").replace(/"/g, '""')}"`,
        `"${r.submitted_at}"`,
        `"${(r.message ?? "").replace(/"/g, '""')}"`,
        r.read ? "Yes" : "No",
      ].join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "contact_submissions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function ContactsPage() {
  const [rows, setRows] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [markingId, setMarkingId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("contact_submissions")
      .select("*")
      .order("submitted_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as ContactSubmission[]) ?? []);
        setLoading(false);
      });
  }, []);

  function handleMarkRead(id: string) {
    setMarkingId(id);
    startTransition(async () => {
      await markContactRead(id);
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, read: true } : r))
      );
      setMarkingId(null);
    });
  }

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
    verticalAlign: "top",
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
            Contact Submissions
          </h1>
          <p style={{ fontSize: 13, color: "#7a716a", marginTop: 6 }}>
            {rows.length} submissions &mdash; {rows.filter((r) => !r.read).length} unread
          </p>
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
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Message</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    background: row.read ? "#fff" : "#fffbf9",
                  }}
                >
                  <td style={{ ...tdStyle, fontWeight: row.read ? 400 : 600 }}>
                    {row.full_name}
                  </td>
                  <td style={tdStyle}>
                    <a
                      href={`mailto:${row.email}`}
                      style={{ color: "#8E191D", textDecoration: "none" }}
                    >
                      {row.email}
                    </a>
                  </td>
                  <td style={tdStyle}>{row.subject ?? "—"}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "#7a716a" }}>
                    {formatDate(row.submitted_at)}
                  </td>
                  <td style={{ ...tdStyle, maxWidth: 260, color: "#4C4238" }}>
                    {truncate(row.message, 80)}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 600,
                        background: row.read ? "#E4DFDA" : "#CF3728",
                        color: row.read ? "#4C4238" : "#fff",
                      }}
                    >
                      {row.read ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {!row.read && (
                        <button
                          onClick={() => handleMarkRead(row.id)}
                          disabled={markingId === row.id || isPending}
                          style={{
                            padding: "5px 12px",
                            background: "#8E191D",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            opacity: markingId === row.id ? 0.6 : 1,
                          }}
                        >
                          {markingId === row.id ? "…" : "Mark Read"}
                        </button>
                      )}
                      <a
                        href={`mailto:${row.email}?subject=Re: ${encodeURIComponent(row.subject ?? "Your message")}`}
                        style={{
                          padding: "5px 12px",
                          background: "#f5f0eb",
                          color: "#2a241f",
                          border: "1px solid #E4DFDA",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Reply
                      </a>
                    </div>
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
              No submissions yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
