"use client";
import { useCallback, useEffect, useState } from "react";
import { isConfigured } from "@/lib/supabase";

// État réel de la connexion Supabase : chaque ligne est un vrai test, pas un texte statique.
export default function InfraTab({ sb, session }) {
  const [items, setItems] = useState(null);

  const run = useCallback(async () => {
    setItems(null);
    const out = [];
    const add = (ok, title, detail) => out.push({ ok, title, detail });

    add(isConfigured, "Variables Supabase", isConfigured ? "URL et clé anon détectées." : "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY manquantes.");
    add(Boolean(session), "Authentification admin", session ? `Connecté : ${session.user.email}` : "Aucune session.");

    const p = await sb.from("projects").select("id", { count: "exact", head: true });
    add(!p.error, "Table projects", p.error ? `${p.error.message} — relance schema.sql.` : `${p.count ?? 0} projet(s).`);

    const c = await sb.from("site_content").select("id, logo_url, theme").eq("id", 1).maybeSingle();
    if (c.error) add(false, "Table site_content (textes, logo, palette)", `${c.error.message} — relance schema.sql.`);
    else add(Boolean(c.data), "Table site_content (textes, logo, palette)", c.data ? "Ligne présente, colonnes logo_url et theme OK." : "Aucune ligne : enregistre l'onglet Contenu ou relance schema.sql.");

    const k = await sb.from("consents").select("id", { count: "exact", head: true });
    add(!k.error, "Journal des cookies (consents)", k.error ? `${k.error.message} — relance schema.sql.` : `${k.count ?? 0} choix enregistré(s).`);

    const st = await sb.storage.from("project-images").list("", { limit: 1 });
    add(!st.error, "Stockage d'images (project-images)", st.error ? `${st.error.message} — relance schema.sql.` : "Bucket accessible.");

    const url = process.env.NEXT_PUBLIC_SITE_URL;
    add(Boolean(url), "Adresse du site (NEXT_PUBLIC_SITE_URL)", url || "Non renseignée : le sitemap et les aperçus de partage utilisent l'adresse par défaut.");

    setItems(out);
  }, [sb, session]);

  useEffect(() => { run(); }, [run]);

  return (
    <div className="panel" style={{ maxWidth: 820 }}>
      <h3>Infrastructure Supabase × Vercel</h3>
      <p className="sub">Vérifications en direct de la connexion entre le site, Supabase et Vercel.</p>
      {!items ? (
        <p style={{ color: "var(--muted)", marginTop: 18 }}>Vérification en cours…</p>
      ) : (
        <ul className="checks">
          {items.map((it) => (
            <li key={it.title} className={it.ok ? "ok" : "ko"}>
              <span className="ic" aria-hidden="true">{it.ok ? "✓" : "✕"}</span>
              <div><b>{it.title}</b><small>{it.detail}</small></div>
            </li>
          ))}
        </ul>
      )}
      <div className="acts-row"><button className="btn btn-ghost" onClick={run}>Relancer les vérifications</button></div>
    </div>
  );
}
