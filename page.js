import Ambient from "@/components/Ambient";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import CookieBanner from "@/components/CookieBanner";
import CookieLink from "@/components/CookieLink";
import Link from "next/link";
import Logo from "@/components/Logo";
import { getSiteData } from "@/lib/data";
import { normalizeUrl } from "@/lib/defaults";

// Toujours lire les données fraîches : ce que tu modifies en admin apparaît tout de suite.
export const dynamic = "force-dynamic";

const PILLARS = [
  ["Polyvalence", "Présente dans tous les secteurs, sans exception."],
  ["Tendances", "De nouvelles sections créées au fil des mouvements de marché."],
  ["Corps de métier", "Plusieurs expertises mobilisées pour chaque section."],
];

const STEPS = [
  ["01", "Entraînement terrain", "Sneaker Wash 28 et les autres projets servent de bains d'entraînement : gestion de clients, encaissement, communication, rigueur quotidienne.", "/images/planification.jpg"],
  ["02", "Financement", "Chaque euro gagné finance le matériel et propulse les projets suivants, comme Black Silk.", "/images/reunion.jpg"],
  ["03", "Compétences", "Coder de vrais outils, résoudre des bugs sous pression, tenir une discipline de travail : les briques techniques et humaines de Log Horizon.", "/images/objectif.jpg"],
  ["04", "Lancement de Log Horizon", "L'entreprise naît avec une architecture logicielle solide, de la R&D, une communauté et des systèmes autonomes.", "/images/lancement.jpg"],
];

export default async function Home() {
  const { projects, content } = await getSiteData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Log Horizon",
    description: "Entreprise polyvalente en construction, active dans tous les secteurs.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Ambient />
      <a className="skip" href="#projets">Aller au contenu</a>
      <div className="page">
        <Nav logoUrl={content.logo_url} />

        <main id="top">
          {/* HERO */}
          <div className="hero">
            <div className="wrap">
              <div className="pill"><span className="dot" /> Construction en cours — les projets s'activent</div>
              <h1>LOG <span className="grad">HORIZON</span></h1>
              <p className="lead">{content.tagline}</p>
              <div className="cta">
                <a className="btn btn-primary" href="#projets">Découvrir les projets →</a>
                <a className="btn btn-ghost" href="#vision">Notre vision</a>
              </div>
              <div className="stats">
                {[
                  [String(projects.length), "Projets tremplins"],
                  ["360°", "Secteurs visés"],
                  ["∞", "Sections futures"],
                  ["1", "Destination finale"],
                ].map(([n, l]) => (
                  <div className="stat" key={l}><b>{n}</b><span>{l}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* VISION */}
          <section id="vision">
            <div className="wrap">
              <Reveal>
                <div className="sec-head">
                  <div className="eyebrow c-cyan">La finalité</div>
                  <h2>Une entreprise, <span className="grad">tous les horizons</span></h2>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="vision-card">
                  <div className="q" aria-hidden="true">“</div>
                  <p className="txt">{content.vision}</p>
                  <div className="pillars">
                    {PILLARS.map(([t, d]) => (
                      <div className="pillar" key={t}><b>{t}</b><span>{d}</span></div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* PROJETS */}
          <section id="projets">
            <div className="wrap">
              <Reveal>
                <div className="sec-head">
                  <div className="eyebrow c-indigo">Le portefeuille</div>
                  <h2>Les projets tremplins</h2>
                  <p>Chaque projet tourne en parallèle pour gagner de l'expérience pendant les études, générer du cash-flow et lancer Log Horizon plus facilement demain.</p>
                </div>
              </Reveal>
              {projects.length === 0 ? (
                <p className="empty">De nouveaux projets arrivent bientôt.</p>
              ) : (
                <div className="projects">
                  {projects.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 2) * 120}>
                      <ProjectCard p={p} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* MANIFESTE */}
          <section id="manifeste">
            <div className="wrap">
              <Reveal>
                <div className="manifesto">
                  <div className="eyebrow c-pink">Le manifeste</div>
                  <p>{content.manifesto}</p>
                  <div className="rule" />
                </div>
              </Reveal>
            </div>
          </section>

          {/* STRATÉGIE */}
          <section id="strategie">
            <div className="wrap">
              <Reveal>
                <div className="sec-head">
                  <div className="eyebrow c-pink">La méthode</div>
                  <h2>Des bains d'entraînement vers l'horizon</h2>
                </div>
              </Reveal>
              <div className="timeline">
                {STEPS.map(([n, t, d, img], i) => (
                  <Reveal key={n} delay={i * 60}>
                    <div className={`step ${i % 2 === 0 ? "left" : "right"}`}>
                      <div className="num">{n}</div>
                      <div className="box">
                        {img && <div className="simg"><img src={img} alt="" loading="lazy" /></div>}
                        <h3>{t}</h3><p>{d}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="footer" id="contact">
          <div className="wrap">
            <a href="#top" className="brand">
              <Logo url={content.logo_url} />
            </a>
            <p className="about">Le site officiel du projet final. Les projets tremplins évoluent en parallèle — suis l'horizon.</p>
            <div className="chips">
              {projects.map((p) => {
                const url = normalizeUrl(p.site);
                return url ? (
                  <a key={p.id} className="chip" href={url} target="_blank" rel="noopener noreferrer">{p.name} ↗</a>
                ) : (
                  <a key={p.id} className="chip" href="#projets">{p.name}</a>
                );
              })}
            </div>
            <div className="flinks">
              <Link href="/mentions">Mentions légales &amp; confidentialité</Link>
              <CookieLink />
            </div>
            <div className="copy">© {new Date().getFullYear()} Log Horizon — Tous droits réservés.</div>
          </div>
        </footer>
      </div>
      <CookieBanner policy={content.cookie_policy} />
    </>
  );
}
