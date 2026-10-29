import Link from "next/link";
import Ambient from "@/components/Ambient";
import CookieLink from "@/components/CookieLink";
import Logo from "@/components/Logo";
import { LEGAL } from "@/lib/legal";
import { getSiteData } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mentions légales & confidentialité — Log Horizon",
  description: "Mentions légales, politique de confidentialité et gestion des cookies du site Log Horizon.",
};

export default async function Mentions() {
  const { content } = await getSiteData();
  return (
    <>
      <Ambient />
      <div className="page">
        <div className="legal">
          <Link href="/" className="brand">
            <Logo url={content.logo_url} />
          </Link>
          <h1>Mentions légales &amp; confidentialité</h1>

          <h2>Éditeur du site</h2>
          <p>
            {LEGAL.publisher}, {LEGAL.status}, {LEGAL.location}.<br />
            Contact : {LEGAL.email}
            {LEGAL.siret ? <><br />SIRET : {LEGAL.siret}</> : null}
          </p>
          <p>Directeur de la publication : {LEGAL.publisher}.</p>

          <h2>Hébergement et données</h2>
          <p>Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Les contenus et le journal des choix de cookies sont stockés chez Supabase.</p>

          <h2>Données personnelles (RGPD)</h2>
          <p>Ce site ne collecte aucune donnée personnelle nominative sur ses visiteurs. Le seul traitement est le journal de ton choix de cookies : ce choix (« tout accepter » ou « essentiels uniquement »), la date et un identifiant aléatoire anonyme. Aucune adresse IP n'est enregistrée par le site.</p>
          <p>Base légale : obligation de pouvoir prouver ton consentement. Durée de conservation : 13 mois maximum.</p>
          <p>Tu disposes d'un droit d'accès, de rectification et de suppression. Pour l'exercer, écris à {LEGAL.email}. Tu peux aussi introduire une réclamation auprès de la CNIL (cnil.fr).</p>

          <h2>Cookies</h2>
          <p>Le site utilise uniquement des cookies et un stockage local essentiels (mémorisation de ton choix de cookies, session de l'administrateur). Tu peux modifier ton choix à tout moment : <CookieLink />.</p>

          <h2>Propriété intellectuelle</h2>
          <p>Les textes, visuels et noms de projets (Log Horizon, Silicon Harvest, Sneaker Wash 28, Black Silk, Clout Lab) sont la propriété de l'éditeur, sauf mention contraire. Toute reproduction sans autorisation est interdite.</p>
        </div>
      </div>
    </>
  );
}
