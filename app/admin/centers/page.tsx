"use client";

import { useEffect, useState, useMemo, useTransition } from "react";
import { createClient } from "@supabase/supabase-js";
import { saveCenter } from "./actions";

type Center = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  region_id: number;
  address: string | null;
  phone: string | null;
  email: string | null;
};

type EditState = {
  address: string;
  phone: string;
  email: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CentersPage() {
  const [rows, setRows] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [edits, setEdits] = useState<Record<number, EditState>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    supabase
      .from("centers")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data }) => {
        const centers = (data as Center[]) ?? [];
        setRows(centers);
        const initEdits: Record<number, EditState> = {};
        centers.forEach((c) => {
          initEdits[c.id] = {
            address: c.address ?? "",
            phone: c.phone ?? "",
            email: c.email ?? "",
          };
        });
        setEdits(initEdits);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.city.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q)
    );
  }, [rows, search]);

  function updateField(id: number, field: keyof EditState, value: string) {
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
      const result = await saveCenter(id, {
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
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
                  address: data.address || null,
                  phone: data.phone || null,
                  email: data.email || null,
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
          Centers
        </h1>
        <p style={{ fontSize: 13, color: "#7a716a", marginTop: 6 }}>
          {rows.length} centers — edit address, phone, or email inline and save per row.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="search"
          placeholder="Search by city, state, or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 16px",
            border: "1px solid #E4DFDA",
            borderRadius: 6,
            fontSize: 14,
            color: "#2a241f",
            background: "#fff",
            width: 320,
            outline: "none",
          }}
        />
        {search && (
          <span style={{ marginLeft: 12, fontSize: 13, color: "#7a716a" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
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
                <th style={thStyle}>Name</th>
                <th style={thStyle}>City</th>
                <th style={thStyle}>State</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Save</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const edit = edits[row.id];
                if (!edit) return null;
                return (
                  <tr key={row.id}>
                    <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: "nowrap" }}>
                      {row.name}
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{row.city}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{row.state}</td>
                    <td style={{ ...tdStyle, minWidth: 180 }}>
                      <input
                        style={inputStyle}
                        value={edit.address}
                        onChange={(e) =>
                          updateField(row.id, "address", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ ...tdStyle, minWidth: 130 }}>
                      <input
                        style={inputStyle}
                        value={edit.phone}
                        onChange={(e) =>
                          updateField(row.id, "phone", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ ...tdStyle, minWidth: 180 }}>
                      <input
                        style={inputStyle}
                        value={edit.email}
                        onChange={(e) =>
                          updateField(row.id, "email", e.target.value)
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
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 48,
                color: "#7a716a",
                fontSize: 14,
              }}
            >
              No centers found{search ? ` matching "${search}"` : ""}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
