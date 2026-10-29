"use client";
import { useState } from "react";

const MIN = 6;

export default function SecurityTab({ sb, session, recovery, onDone }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState({ ok: true, text: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg({ ok: true, text: "" });
    if (next.length < MIN) return setMsg({ ok: false, text: `Le nouveau mot de passe doit contenir au moins ${MIN} caractères.` });
    if (next !== confirm) return setMsg({ ok: false, text: "La confirmation ne correspond pas." });
    setBusy(true);

    // Vérification de l'ancien mot de passe (sauf si on arrive d'un lien « mot de passe oublié »)
    if (!recovery) {
      const check = await sb.auth.signInWithPassword({ email: session.user.email, password: current });
      if (check.error) {
        setBusy(false);
        return setMsg({ ok: false, text: "Mot de passe actuel incorrect." });
      }
    }

    const { error } = await sb.auth.updateUser({ password: next });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setCurrent(""); setNext(""); setConfirm("");
    setMsg({ ok: true, text: "Mot de passe modifié avec succès." });
    onDone();
  }

  return (
    <form onSubmit={submit} className="panel" style={{ maxWidth: 480 }}>
      <h3>Modifier le mot de passe admin</h3>
      <p className="sub">{recovery ? "Choisis ton nouveau mot de passe." : "Ton ancien mot de passe est demandé par sécurité."} Authentification gérée par Supabase Auth.</p>
      {!recovery && (
        <label className="field"><span>Mot de passe actuel</span>
          <input type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
        </label>
      )}
      <label className="field"><span>Nouveau mot de passe ({MIN} caractères minimum)</span>
        <input type="password" autoComplete="new-password" required value={next} onChange={(e) => setNext(e.target.value)} />
      </label>
      <label className="field"><span>Confirmer le nouveau mot de passe</span>
        <input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </label>
      <p className={`msg ${msg.ok ? "ok" : "err"}`} role="status" style={{ marginTop: 14 }}>{msg.text}</p>
      <div className="acts-row"><button className="btn btn-primary" type="submit" disabled={busy}>Enregistrer le nouveau mot de passe</button></div>
    </form>
  );
}
