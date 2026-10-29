"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm({ sb, logoUrl }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ ok: false, text: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ ok: false, text: "" });
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setMsg({ ok: false, text: "E-mail ou mot de passe incorrect." });
    setBusy(false);
  }

  async function forgot() {
    if (!email.trim()) return setMsg({ ok: false, text: "Saisis d'abord ton e-mail." });
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin` });
    setMsg(error ? { ok: false, text: "Envoi impossible pour le moment." } : { ok: true, text: "Si ce compte existe, un lien de réinitialisation vient d'être envoyé." });
  }

  return (
    <div className="adm-center">
      <div className="adm-card">
        <div className="top">
          {logoUrl ? <img className="logo-img" src={logoUrl} alt="" /> : <span className="badge-lh">LH</span>}
          <div><b>Espace admin</b><small>Accès restreint — Log Horizon</small></div>
        </div>
        <form onSubmit={submit}>
          <label className="field"><span>E-mail</span>
            <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field"><span>Mot de passe</span>
            <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <p className={`msg ${msg.ok ? "ok" : "err"}`} role="status" style={{ marginTop: 12 }}>{msg.text}</p>
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
        </form>
        <button className="back" type="button" onClick={forgot}>Mot de passe oublié ?</button>
        <Link href="/" className="back">← Retour au site public</Link>
      </div>
    </div>
  );
}
