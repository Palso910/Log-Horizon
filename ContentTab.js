"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "@/lib/defaults";
import { uploadImage } from "@/lib/upload";

// onLogo : prévient l'espace admin pour qu'il affiche le nouveau logo tout de suite.
export default function ContentTab({ sb, onLogo }) {
  const [c, setC] = useState(null);
  const [msg, setMsg] = useState({ ok: true, text: "" });
  const [logoMsg, setLogoMsg] = useState({ ok: true, text: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    sb.from("site_content").select("*").eq("id", 1).maybeSingle().then(({ data, error }) => {
      if (error) setMsg({ ok: false, text: error.message });
      setC({ ...DEFAULT_CONTENT, ...(data || {}) });
    });
  }, [sb]);

  async function save() {
    setBusy(true);
    // upsert : crée la ligne si elle n'existe pas encore, sinon la met à jour
    const { error } = await sb.from("site_content").upsert(
      { id: 1, tagline: c.tagline, vision: c.vision, manifesto: c.manifesto },
      { onConflict: "id" }
    );
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Enregistré — visible immédiatement sur le site public." });
    setBusy(false);
  }

  async function setLogo(url) {
    const { error } = await sb.from("site_content").upsert({ id: 1, logo_url: url }, { onConflict: "id" });
    if (error) throw error;
    setC((x) => ({ ...x, logo_url: url || "" }));
    if (onLogo) onLogo(url || "");
  }

  async function onLogoFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setLogoMsg({ ok: false, text: "Ce fichier n'est pas une image." });
    setBusy(true);
    setLogoMsg({ ok: true, text: "Envoi du logo…" });
    try {
      const url = await uploadImage(sb, file, "site", "logo");
      await setLogo(url);
      setLogoMsg({ ok: true, text: "Logo enregistré — affiché dans la navigation, le pied de page et l'admin." });
    } catch (err) {
      setLogoMsg({ ok: false, text: "Échec de l'envoi : " + (err.message || "erreur inconnue") });
    }
    setBusy(false);
  }

  async function removeLogo() {
    setBusy(true);
    try {
      await setLogo(null);
      setLogoMsg({ ok: true, text: "Logo retiré : le monogramme « LH » est de retour." });
    } catch (err) {
      setLogoMsg({ ok: false, text: err.message });
    }
    setBusy(false);
  }

  if (!c) return <p style={{ color: "var(--muted)" }}>Chargement…</p>;

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="panel">
        <h3>Logo Log Horizon</h3>
        <p className="sub">Affiché dans la barre de navigation, le pied de page et l'espace admin.</p>
        <div className="imgbox">
          <div className="logo-thumb">{c.logo_url ? <img src={c.logo_url} alt="Logo actuel" /> : <span className="badge-lh">LH</span>}</div>
          <div>
            <div className="acts">
              <label className="btn btn-soft">
                {c.logo_url ? "Changer le logo" : "Insérer le logo"}
                <input type="file" accept="image/*" onChange={onLogoFile} disabled={busy} />
              </label>
              {c.logo_url && <button type="button" className="btn btn-danger" onClick={removeLogo} disabled={busy}>Retirer</button>}
            </div>
            <small style={{ display: "block", marginTop: 8, color: "var(--dim)", fontSize: ".74rem" }}>PNG à fond transparent conseillé.</small>
          </div>
        </div>
        <p className={`msg ${logoMsg.ok ? "ok" : "err"}`} role="status" style={{ marginTop: 12 }}>{logoMsg.text}</p>
      </div>

      <div className="panel">
        <h3>Textes du site</h3>
        <p className="sub">Ces textes apparaissent sur la page d'accueil.</p>
        <label className="field"><span>Phrase d'accroche (haut de page)</span>
          <textarea rows={3} value={c.tagline || ""} onChange={(e) => setC({ ...c, tagline: e.target.value })} />
        </label>
        <label className="field"><span>Texte de la section Vision</span>
          <textarea rows={8} value={c.vision || ""} onChange={(e) => setC({ ...c, vision: e.target.value })} />
        </label>
        <label className="field"><span>Phrase du Manifeste</span>
          <textarea rows={3} value={c.manifesto || ""} onChange={(e) => setC({ ...c, manifesto: e.target.value })} />
        </label>
        <div className="acts-row">
          <button className="btn btn-primary" onClick={save} disabled={busy}>Enregistrer</button>
          <span className={`msg ${msg.ok ? "ok" : "err"}`} role="status">{msg.text}</span>
        </div>
      </div>
    </div>
  );
}
