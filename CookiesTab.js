"use client";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "@/lib/defaults";

export default function CookiesTab({ sb }) {
  const [policy, setPolicy] = useState(null);
  const [stats, setStats] = useState({ all: 0, essential: 0, last: null });
  const [msg, setMsg] = useState({ ok: true, text: "" });
  const [busy, setBusy] = useState(false);

  const loadStats = useCallback(async () => {
    const count = (choice) => sb.from("consents").select("id", { count: "exact", head: true }).eq("choice", choice);
    const [a, e, l] = await Promise.all([
      count("all"),
      count("essential"),
      sb.from("consents").select("created_at").order("created_at", { ascending: false }).limit(1),
    ]);
    setStats({ all: a.count || 0, essential: e.count || 0, last: l.data && l.data[0] ? l.data[0].created_at : null });
  }, [sb]);

  useEffect(() => {
    sb.from("site_content").select("cookie_policy").eq("id", 1).maybeSingle().then(({ data }) => {
      setPolicy((data && data.cookie_policy) || DEFAULT_CONTENT.cookie_policy);
    });
    loadStats();
  }, [sb, loadStats]);

  async function save() {
    setBusy(true);
    const { error } = await sb.from("site_content").upsert({ id: 1, cookie_policy: policy }, { onConflict: "id" });
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Politique enregistrée." });
    setBusy(false);
  }

  function resetLocal() {
    try { window.localStorage.removeItem("lh_cookies"); } catch { /* ignoré */ }
    window.dispatchEvent(new Event("lh-consent-reset"));
    setMsg({ ok: true, text: "Consentement réinitialisé sur ce navigateur : la bannière réapparaîtra sur le site public." });
  }

  if (policy === null) return <p style={{ color: "var(--muted)" }}>Chargement…</p>;
  const total = stats.all + stats.essential;

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="panel">
        <h3>Journal des consentements</h3>
        <p className="sub">Chaque choix fait par un visiteur est enregistré dans la table « consents » (sans IP).</p>
        <div className="consent-stat">
          <div className="kpi"><b>{total}</b><span>Choix enregistrés</span></div>
          <div className="kpi"><b>{stats.all}</b><span>Tout accepté</span></div>
          <div className="kpi"><b>{stats.essential}</b><span>Essentiels</span></div>
        </div>
        {stats.last && <p className="sub" style={{ marginTop: 14 }}>Dernier choix : {new Date(stats.last).toLocaleString("fr-FR")}</p>}
        <div className="acts-row">
          <button className="btn btn-ghost" onClick={loadStats}>Actualiser</button>
          <button className="btn btn-ghost" onClick={resetLocal}>Réinitialiser mon consentement (re-tester la bannière)</button>
        </div>
      </div>

      <div className="panel">
        <h3>Texte de la politique des cookies</h3>
        <p className="sub">Affiché dans la bannière et via « Gestion des cookies » en pied de page.</p>
        <label className="field"><span>Texte</span>
          <textarea rows={6} value={policy} onChange={(e) => setPolicy(e.target.value)} />
        </label>
        <div className="acts-row">
          <button className="btn btn-primary" onClick={save} disabled={busy}>Enregistrer</button>
          <span className={`msg ${msg.ok ? "ok" : "err"}`} role="status">{msg.text}</span>
        </div>
      </div>
    </div>
  );
}
