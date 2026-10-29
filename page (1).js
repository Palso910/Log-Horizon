"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Ambient from "@/components/Ambient";
import Logo from "@/components/Logo";
import LoginForm from "@/components/admin/LoginForm";
import ProjectsTab from "@/components/admin/ProjectsTab";
import ContentTab from "@/components/admin/ContentTab";
import CookiesTab from "@/components/admin/CookiesTab";
import SecurityTab from "@/components/admin/SecurityTab";
import AppearanceTab from "@/components/admin/AppearanceTab";
import InfraTab from "@/components/admin/InfraTab";
import { getBrowserClient, isConfigured } from "@/lib/supabase";

const TABS = [
  ["projets", "Projets"],
  ["contenu", "Contenu"],
  ["apparence", "Apparence"],
  ["cookies", "Cookies"],
  ["securite", "Sécurité"],
  ["infra", "Infrastructure"],
];

export default function AdminPage() {
  const sb = getBrowserClient();
  const [session, setSession] = useState(undefined); // undefined = chargement
  const [recovery, setRecovery] = useState(false);   // arrivée depuis un e-mail « mot de passe oublié »
  const [tab, setTab] = useState("projets");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    if (!sb) { setSession(null); return; }
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") { setRecovery(true); setTab("securite"); }
    });
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  // Logo Log Horizon (lecture publique) : affiché dans l'admin
  useEffect(() => {
    if (!sb) return;
    sb.from("site_content").select("logo_url").eq("id", 1).maybeSingle().then(({ data }) => setLogoUrl((data && data.logo_url) || ""));
  }, [sb]);

  if (!isConfigured) {
    return (
      <>
        <Ambient />
        <div className="adm-center">
          <div className="adm-card">
            <div className="top"><span className="badge-lh">LH</span><div><b>Espace admin</b><small>Supabase n'est pas branché</small></div></div>
            <div className="notice">Renseigne NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY (fichier .env.local en local, variables d'environnement sur Vercel), puis redéploie.</div>
            <Link href="/" className="back">← Retour au site public</Link>
          </div>
        </div>
      </>
    );
  }

  if (session === undefined) {
    return (<><Ambient /><div className="adm-center"><p style={{ color: "var(--muted)" }}>Chargement…</p></div></>);
  }

  if (!session) {
    return (<><Ambient /><LoginForm sb={sb} logoUrl={logoUrl} /></>);
  }

  return (
    <>
      <Ambient />
      <div className="adm">
        <header className="adm-head">
          <div className="wrap">
            <div className="brand"><Logo url={logoUrl} /><span style={{ color: "var(--dim)", fontWeight: 500, fontSize: ".85rem" }}>· Admin</span></div>
            <div className="right">
              <span className="who">{session.user.email}</span>
              <Link href="/" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: ".82rem" }}>Voir le site</Link>
              <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: ".82rem" }} onClick={() => sb.auth.signOut()}>Se déconnecter</button>
            </div>
          </div>
          <div className="tabs" role="tablist">
            {TABS.map(([id, label]) => (
              <button key={id} role="tab" aria-selected={tab === id} className={`tab ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>
        </header>
        <main className="adm-main">
          {tab === "projets" && <ProjectsTab sb={sb} />}
          {tab === "contenu" && <ContentTab sb={sb} onLogo={setLogoUrl} />}
          {tab === "apparence" && <AppearanceTab sb={sb} />}
          {tab === "cookies" && <CookiesTab sb={sb} />}
          {tab === "infra" && <InfraTab sb={sb} session={session} />}
          {tab === "securite" && <SecurityTab sb={sb} session={session} recovery={recovery} onDone={() => setRecovery(false)} />}
        </main>
      </div>
    </>
  );
}
