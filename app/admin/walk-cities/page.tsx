"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@supabase/supabase-js";
import { saveWalkCity } from "./actions";

type WalkCity = {
  id: number;
  city: string;
  state: string;
  slug: string;
  date_display: string | null;
  venue: string | null;
  beneficiary: string | null;
  confirmed: boolean;
  registration_url: string | null;
};

type EditState = {
  city: string;
  state: string;
  date_display: string;
  venue: string;
  beneficiary: string;
  confirmed: boolean;
  registration_url: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WalkCitiesPage() {
  const [rows, setRows] = useState<WalkCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<number, EditState>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    supabase
      .from("walk_cities")
      .select("*")
      .order("city", { ascending: true })
      .then(({ data }) => {
        const cities = (data as WalkCity[]) ?? [];
        setRows(cities);
        const initEdits: Record<number, EditState> = {};
        cities.forEach((c) => {
          initEdits[c.id] = {
            city: c.city,
            state: c.state,
            date_display: c.date_display ?? "",
            venue: c.venue ?? "",
            beneficiary: c.beneficiary ?? "",
            confirmed: c.confirmed,
            registration_url: c.registration_url ?? "",
          };
        });
        setEdits(initEdits);
        setLoading(false);
      });
  }, []);

  function updateField(id: number, field: keyof EditState, value: string | boolean) {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  function handleSave(id: number) {
    const data = edits[id];
    if (!data) return;
    setSavingId(id);
    startTransition(async () => {
      const result = await saveWalkCity(id, {
        city: data.city,
        state: data.state,
        date_display: data.date_display || null,
        venue: data.venue || null,
        beneficiary: data.beneficiary || null,
        confirmed: data.confirmed,
        registration_url: data.registration_url || null,
      });
      setSavingId(null);
      if (!result.error) {
        setSavedId(id);
        setTimeout(() => setSavedId(null), 2000);
        setRows((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  city: data.city,
                  state: data.state,
                  date_display: data.date_display || null,
                  venue: data.venue || null,
                  beneficiary: data.beneficiary || null,
                  confirmed: data.confirmed,
                  registration_url: data.registration_url || null,
                }
              : r
          )
        );
      }
    });
  }

  const inputStyle: React.CSSProperties = {
    padding: "4px 8px",
    border: "1px solid #E4DFDA",
    borderRadius: 4,
    fontSize: 12,
    color: "#2a241f",
    background: "#faf7f3",
    width: "100%",
    boxSizing: "border-box",
  };

  const thStyle: React.CSSProperties = {
    padding: "10px 10px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#7a716a",
    borderBottom: "1px solid #E4DFDA",
    background: "#f5f0eb",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "6px 10px",
    fontSize: 13,
    color: "#2a241f",
    borderBottom: "1px solid #E4DFDA",
    verticalAlign: "middle",
  };

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
          Walk Cities
        </h1>
        <p style={{ fontSize: 13, color: "#7a716a", marginTop: 6 }}>
          {rows.length} cities — edit fields inline and click Save per row.
        </p>
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
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr>
                <th style={thStyle}>City</th>
                <th style={thStyle}>State</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Venue</th>
                <th style={thStyle}>Beneficiary</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Confirmed</th>
                <th style={thStyle}>Reg. URL</th>
                <th style={thStyle}>Save</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const edit = edits[row.id];
                if (!edit) return null;
                return (
                  <tr key={row.id}>
                    <td style={tdStyle}>
                      <input
                        style={inputStyle}
                        value={edit.city}
                        onChange={(e) => updateField(row.id, "city", e.target.value)}
                      />
                    </td>
                    <td style={{ ...tdStyle, width: 60 }}>
                      <input
                        style={inputStyle}
                        value={edit.state}
                        onChange={(e) => updateField(row.id, "state", e.target.value)}
                      />
                    </td>
                    <td style={{ ...tdStyle, minWidth: 120 }}>
                      <input
                        style={inputStyle}
                        value={edit.date_display}
                        onChange={(e) =>
                          updateField(row.id, "date_display", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ ...tdStyle, minWidth: 140 }}>
                      <input
                        style={inputStyle}
                        value={edit.venue}
                        onChange={(e) => updateField(row.id, "venue", e.target.value)}
                      />
                    </td>
                    <td style={{ ...tdStyle, minWidth: 140 }}>
                      <input
                        style={inputStyle}
                        value={edit.beneficiary}
                        onChange={(e) =>
                          updateField(row.id, "beneficiary", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={edit.confirmed}
                        onChange={(e) =>
                          updateField(row.id, "confirmed", e.target.checked)
                        }
                        style={{ width: 16, height: 16, accentColor: "#CF3728" }}
                      />
                    </td>
                    <td style={{ ...tdStyle, minWidth: 160 }}>
                      <input
                        style={inputStyle}
                        value={edit.registration_url}
                        onChange={(e) =>
                          updateField(row.id, "registration_url", e.target.value)
                        }
                      />
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleSave(row.id)}
                        disabled={savingId === row.id}
                        style={{
                          padding: "5px 14px",
                          background:
                            savedId === row.id ? "#4C4238" : "#8E191D",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          opacity: savingId === row.id ? 0.6 : 1,
                        }}
                      >
                        {savingId === row.id
                          ? "Saving…"
                          : savedId === row.id
                          ? "Saved!"
                          : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
