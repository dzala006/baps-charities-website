"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@supabase/supabase-js";
import { saveEvent, deleteEvent } from "./actions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EVENT_TYPES = ["walk-run","health","education","humanitarian","environmental","food-drive","community","other"];

type Center = { id: string; city: string; state: string; name: string };
type EventRow = {
  id: string; center_id: string; title: string; event_type: string;
  event_date: string | null; description: string | null; body: string | null;
  photo_url: string | null; external_url: string | null; is_published: boolean;
};

const EMPTY: Omit<EventRow, "id"> = {
  center_id: "", title: "", event_type: "other", event_date: "",
  description: "", body: "", photo_url: "", external_url: "", is_published: true,
};

const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" };
const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, color: "#7a716a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 };

export default function CenterEventsPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [filterCenter, setFilterCenter] = useState("");
  const [form, setForm] = useState<Omit<EventRow, "id"> & { id?: string }>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    supabase.from("centers").select("id,city,state,name").order("city").then(({ data }) => setCenters((data as Center[]) ?? []));
  }, []);

  useEffect(() => {
    const q = supabase.from("center_events").select("*").order("event_date", { ascending: false });
    (filterCenter ? q.eq("center_id", filterCenter) : q).then(({ data }) => setEvents((data as EventRow[]) ?? []));
  }, [filterCenter, success]);

  function startNew() { setForm({ ...EMPTY, center_id: filterCenter }); setEditing(true); setError(""); setSuccess(""); }
  function startEdit(ev: EventRow) { setForm(ev); setEditing(true); setError(""); setSuccess(""); }
  function cancel() { setEditing(false); setError(""); }

  function handleSave() {
    if (!form.center_id || !form.title) { setError("Center and title are required."); return; }
    startTransition(async () => {
      const res = await saveEvent(form as Parameters<typeof saveEvent>[0]);
      if (res.error) { setError(res.error); } else { setSuccess(Date.now().toString()); setEditing(false); }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    startTransition(async () => {
      const res = await deleteEvent(id);
      if (res.error) setError(res.error);
      else setSuccess(Date.now().toString());
    });
  }

  const centerMap = Object.fromEntries(centers.map((c) => [c.id, `${c.city}, ${c.state}`]));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "#2a241f", margin: 0 }}>Center Events</h1>
        <button onClick={startNew} style={{ padding: "10px 20px", background: "#8E191D", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Event</button>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 20 }}>
        <select value={filterCenter} onChange={(e) => setFilterCenter(e.target.value)} style={{ ...inp, maxWidth: 320 }}>
          <option value="">All centers</option>
          {centers.map((c) => <option key={c.id} value={c.id}>{c.city}, {c.state}</option>)}
        </select>
      </div>

      {error && <div role="alert" style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, color: "#8E191D", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {/* Form */}
      {editing && (
        <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 28, marginBottom: 28 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 600, color: "#2a241f" }}>{form.id ? "Edit Event" : "New Event"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Center *</label>
              <select value={form.center_id} onChange={(e) => setForm((f) => ({ ...f, center_id: e.target.value }))} style={inp}>
                <option value="">Select center…</option>
                {centers.map((c) => <option key={c.id} value={c.id}>{c.city}, {c.state}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Title *</label>
              <input style={inp} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Event Type</label>
              <select value={form.event_type} onChange={(e) => setForm((f) => ({ ...f, event_type: e.target.value }))} style={inp}>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Date</label>
              <input type="date" style={inp} value={form.event_date ?? ""} onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Short description</label>
              <input style={inp} value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Body (full text)</label>
              <textarea rows={6} style={{ ...inp, resize: "vertical" }} value={form.body ?? ""} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Photo URL</label>
              <input style={inp} value={form.photo_url ?? ""} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))} placeholder="https://media.bapscharities.org/..." />
            </div>
            <div>
              <label style={lbl}>External Link</label>
              <input style={inp} value={form.external_url ?? ""} onChange={(e) => setForm((f) => ({ ...f, external_url: e.target.value }))} />
            </div>
            <div>
              <label style={{ ...lbl, display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} />
                Published
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={handleSave} style={{ padding: "10px 24px", background: "#8E191D", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save</button>
            <button onClick={cancel} style={{ padding: "10px 20px", background: "#fff", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 13, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, overflow: "hidden" }}>
        {events.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#7a716a", fontSize: 14 }}>No events yet. Add one above or run the migration script.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#faf7f3", borderBottom: "1px solid #E4DFDA" }}>
                {["Center","Title","Type","Date","Published",""].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#7a716a", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} style={{ borderBottom: "1px solid #F0EBE6" }}>
                  <td style={{ padding: "10px 14px", color: "#4C4238" }}>{centerMap[ev.center_id] ?? ev.center_id.slice(0, 8)}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 500, color: "#2a241f", maxWidth: 280 }}>{ev.title}</td>
                  <td style={{ padding: "10px 14px", color: "#7a716a" }}>{ev.event_type}</td>
                  <td style={{ padding: "10px 14px", color: "#7a716a" }}>{ev.event_date ?? "—"}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: ev.is_published ? "#dceac9" : "#f0ebe6", color: ev.is_published ? "#3d6029" : "#7a716a" }}>
                      {ev.is_published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => startEdit(ev)} style={{ fontSize: 12, color: "#8E191D", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Edit</button>
                      <button onClick={() => handleDelete(ev.id)} style={{ fontSize: 12, color: "#7a716a", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
