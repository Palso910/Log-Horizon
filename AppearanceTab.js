"use client";
import { useEffect, useRef, useState } from "react";
import { THEMES, DEFAULT_THEME, isTheme } from "@/lib/themes";

// Choix de la palette. Un clic prévisualise tout de suite (admin + site),
// « Enregistrer » la rend définitive pour tous les visiteurs.
export default function AppearanceTab({ sb }) {
  const [saved, setSaved] = useState(null);
  const [current, setCurrent] = useState(null);
  const [msg, setMsg] = useState({ ok: true, text: "" });
  const [busy, setBusy] = useState(false);
  const savedRef = useRef(DEFAULT_THEME);

  useEffect(() => {
    sb.from("site_content").select("theme").eq("id", 1).maybeSingle().then(({ data, error }) => {
      if (error) setMsg({ ok: false, text: "Colonne « theme » introuvable : relance supabase/schema.sql dans Supabase (SQL Editor)." });
      const t = data && isTheme(data.theme) ? data.theme : DEFAULT_THEME;
      savedRef.current = t;
      setSaved(t);
      setCurrent(t);
    });
    // Si on quitte l'onglet sans enregistrer, on remet la palette enregistrée.
    return () => { document.documentElement.dataset.theme = savedRef.current; };
  }, [sb]);

  function pick(id) {
    setCurrent(id);
    document.documentElement.dataset.theme = id;
    setMsg({ ok: true, text: "" });
  }

  async function save() {
    setBusy(true);
    const { error } = await sb.from("site_content").upsert({ id: 1, theme: current }, { onConflict: "id" });
    if (error) {
      setMsg({ ok: false, text: error.message });
    } else {
      savedRef.current = current;
      setSaved(current);
      setMsg({ ok: true, text: "Palette enregistrée — elle s'applique à tous les visiteurs." });
    }
    setBusy(false);
  }

  if (!current) return <p style={{ color: "var(--muted)" }}>Chargement…</p>;

  return (
    <div className="panel" style={{ maxWidth: 820 }}>
      <h3>Palette de couleurs</h3>
      <p className="sub">Clique sur une palette pour la prévisualiser, puis enregistre pour l'appliquer au site public.</p>
      <div className="themes" role="radiogroup" aria-label="Palette de couleurs">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={current === t.id}
            className={`theme ${current === t.id ? "on" : ""}`}
            onClick={() => pick(t.id)}
          >
            <span className="sw" aria-hidden="true">
              {t.swatch.map((c) => <i key={c} style={{ background: c }} />)}
            </span>
            <b>{t.name}{saved === t.id ? " · en ligne" : ""}</b>
            <small>{t.mood}</small>
          </button>
        ))}
      </div>
      <div className="acts-row">
        <button className="btn btn-primary" onClick={save} disabled={busy || current === saved}>Enregistrer la palette</button>
        <span className={`msg ${msg.ok ? "ok" : "err"}`} role="status">{msg.text}</span>
      </div>
    </div>
  );
}
