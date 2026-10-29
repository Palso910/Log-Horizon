"use client";
import { useCallback, useEffect, useState } from "react";
import { STATUSES, STATUS_CLASS } from "@/lib/defaults";
import { uploadImage } from "@/lib/upload";

function ProjectEditor({ sb, row, index, total, onMove, onChanged }) {
  const [d, setD] = useState({
    name: row.name,
    status: row.status,
    tag: row.tag || "",
    icon: row.icon || "✨",
    description: row.description || "",
    detailsText: (row.details || []).join("\n"),
    site_url: row.site_url || "",
    visible: row.visible,
    image_url: row.image_url || "",
    logo_url: row.logo_url || "",
  });
  const [msg, setMsg] = useState({ ok: true, text: "" });
  const [busy, setBusy] = useState(false);
  const set = (patch) => setD((x) => ({ ...x, ...patch }));

  async function save() {
    setBusy(true);
    const details = d.detailsText.split("\n").map((s) => s.trim()).filter(Boolean);
    const { error } = await sb.from("projects").update({
      name: d.name.trim() || "Sans titre",
      status: d.status,
      tag: d.tag.trim(),
      icon: d.icon.trim() || "✨",
      description: d.description,
      details,
      site_url: d.site_url.trim() || null,
      visible: d.visible,
    }).eq("id", row.id);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Enregistré — visible sur le site public." });
    setBusy(false);
    if (!error) onChanged();
  }

  // kind = "cover" (image de couverture) ou "logo" (logo du sous-projet)
  async function onFile(e, kind) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const col = kind === "logo" ? "logo_url" : "image_url";
    setBusy(true);
    setMsg({ ok: true, text: "Envoi de l'image…" });
    try {
      const url = await uploadImage(sb, file, row.id, kind);
      const { error } = await sb.from("projects").update({ [col]: url }).eq("id", row.id);
      if (error) throw error;
      set({ [col]: url });
      setMsg({ ok: true, text: kind === "logo" ? "Logo enregistré." : "Image enregistrée." });
      onChanged();
    } catch (err) {
      setMsg({ ok: false, text: "Échec de l'envoi : " + (err.message || "erreur inconnue") });
    }
    setBusy(false);
  }

  async function removeImage(kind) {
    const col = kind === "logo" ? "logo_url" : "image_url";
    setBusy(true);
    const { error } = await sb.from("projects").update({ [col]: null }).eq("id", row.id);
    if (!error) set({ [col]: "" });
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Image retirée." });
    setBusy(false);
    if (!error) onChanged();
  }

  async function remove() {
    if (!window.confirm(`Supprimer définitivement « ${row.name} » ?`)) return;
    const { error } = await sb.from("projects").delete().eq("id", row.id);
    if (error) setMsg({ ok: false, text: error.message });
    else onChanged();
  }

  return (
    <div className="panel">
      <div className="prow">
        <div className="name">
          <div className="ic">{d.icon}</div>
          <div><b>{row.name}</b><small>{d.visible ? "Visible sur le site" : "Masqué du site public"}</small></div>
        </div>
        <div className="mini">
          <span className={`status ${STATUS_CLASS[d.status]}`} style={{ position: "static" }}>{d.status}</span>
          <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="Monter">↑</button>
          <button type="button" onClick={() => onMove(index, 1)} disabled={index === total - 1} aria-label="Descendre">↓</button>
        </div>
      </div>

      <div className="three">
        <label className="field" style={{ marginTop: 0 }}><span>Icône</span><input type="text" value={d.icon} onChange={(e) => set({ icon: e.target.value })} maxLength={4} /></label>
        <label className="field" style={{ marginTop: 0 }}><span>Nom</span><input type="text" value={d.name} onChange={(e) => set({ name: e.target.value })} /></label>
        <label className="field" style={{ marginTop: 0 }}><span>Statut</span>
          <select value={d.status} onChange={(e) => set({ status: e.target.value })}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <label className="field"><span>Étiquette (ex : SaaS · Créateurs)</span><input type="text" value={d.tag} onChange={(e) => set({ tag: e.target.value })} /></label>
      <label className="field"><span>Description publique</span><textarea rows={3} value={d.description} onChange={(e) => set({ description: e.target.value })} /></label>
      <label className="field"><span>Détails « En savoir plus » (un par ligne)</span><textarea rows={4} value={d.detailsText} onChange={(e) => set({ detailsText: e.target.value })} /></label>

      <div className="imgbox">
        <div className="logo-thumb">{d.logo_url ? <img src={d.logo_url} alt="Logo" /> : <span style={{ color: "var(--dim)", fontSize: ".7rem" }}>Logo</span>}</div>
        <div>
          <span className="lbl">Logo du sous-projet</span>
          <div className="acts">
            <label className="btn btn-soft">
              {d.logo_url ? "Changer le logo" : "Insérer le logo"}
              <input type="file" accept="image/*" onChange={(e) => onFile(e, "logo")} disabled={busy} />
            </label>
            {d.logo_url && <button type="button" className="btn btn-danger" onClick={() => removeImage("logo")} disabled={busy}>Retirer</button>}
          </div>
          <small style={{ display: "block", marginTop: 8, color: "var(--dim)", fontSize: ".74rem" }}>PNG transparent conseillé. Affiché à côté du nom sur la carte.</small>
        </div>
      </div>

      <div className="imgbox">
        <div className="thumb">{d.image_url ? <img src={d.image_url} alt="Aperçu" /> : <span>{d.icon}</span>}</div>
        <div>
          <span className="lbl">Image de couverture</span>
          <div className="acts">
            <label className="btn btn-soft">
              {d.image_url ? "Changer l'image" : "Insérer une image"}
              <input type="file" accept="image/*" onChange={(e) => onFile(e, "cover")} disabled={busy} />
            </label>
            {d.image_url && <button type="button" className="btn btn-danger" onClick={() => removeImage("cover")} disabled={busy}>Retirer</button>}
          </div>
          <small style={{ display: "block", marginTop: 8, color: "var(--dim)", fontSize: ".74rem" }}>JPG ou PNG, redimensionnée automatiquement puis stockée dans Supabase Storage.</small>
        </div>
      </div>

      <label className="field"><span>Site internet lié</span>
        <input type="url" placeholder="https://sneaker-wash-28.netlify.app" value={d.site_url} onChange={(e) => set({ site_url: e.target.value })} />
        <small>Un bouton « Visiter le site ↗ » apparaît sur la carte publique.</small>
      </label>

      <label className="check"><input type="checkbox" checked={d.visible} onChange={(e) => set({ visible: e.target.checked })} /> Visible sur le site public</label>

      <div className="acts-row">
        <button className="btn btn-primary" onClick={save} disabled={busy}>Enregistrer</button>
        <button className="btn btn-danger" onClick={remove} disabled={busy}>Supprimer</button>
        <span className={`msg ${msg.ok ? "ok" : "err"}`} role="status">{msg.text}</span>
      </div>
    </div>
  );
}

export default function ProjectsTab({ sb }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await sb.from("projects").select("*").order("position").order("created_at");
    if (error) setErr(error.message);
    else { setErr(""); setRows(data); }
  }, [sb]);

  useEffect(() => { load(); }, [load]);

  async function add() {
    const pos = (rows || []).reduce((m, r) => Math.max(m, r.position), 0) + 1;
    const { error } = await sb.from("projects").insert({ name: "Nouveau projet", status: "En réflexion", icon: "✨", position: pos, visible: false });
    if (error) setErr(error.message); else load();
  }

  async function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    await Promise.all(next.map((r, idx) => (r.position !== idx + 1 ? sb.from("projects").update({ position: idx + 1 }).eq("id", r.id) : null)));
    load();
  }

  if (err) return <p className="msg err">{err}</p>;
  if (!rows) return <p style={{ color: "var(--muted)" }}>Chargement…</p>;

  return (
    <div>
      <div className="kpis">
        <div className="kpi"><b>{rows.length}</b><span>Projets</span></div>
        <div className="kpi"><b>{rows.filter((r) => r.status === "En cours").length}</b><span>En cours</span></div>
        <div className="kpi"><b>{rows.filter((r) => r.site_url).length}</b><span>Sites liés</span></div>
        <div className="kpi"><b>{rows.filter((r) => r.image_url || r.logo_url).length}</b><span>Avec visuel</span></div>
      </div>
      {rows.map((r, i) => (
        <ProjectEditor key={r.id} sb={sb} row={r} index={i} total={rows.length} onMove={move} onChanged={load} />
      ))}
      <button className="btn btn-primary" onClick={add}>+ Nouveau projet</button>
    </div>
  );
}
