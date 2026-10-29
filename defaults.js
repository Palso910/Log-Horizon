// Données de secours : affichées si Supabase n'est pas encore branché ou injoignable.
// Elles reprennent exactement les données de départ de supabase/schema.sql.

export const STATUSES = ["En cours", "Standby", "En réflexion", "Lancement"];

export const STATUS_CLASS = {
  "En cours": "s-green",
  Standby: "s-amber",
  "En réflexion": "s-blue",
  Lancement: "s-pink",
};

export const DEFAULT_PROJECTS = [
  {
    id: "sneaker",
    name: "Sneaker Wash 28",
    status: "En cours",
    tag: "Services locaux · Cash-flow",
    icon: "👟",
    desc: "Nettoyage, désinfection, rénovation et déjaunissement UV de sneakers sur Chartres et Courville-sur-Eure. Le moteur de cash-flow immédiat et le laboratoire grandeur nature.",
    details: [
      "Pack Fresh — 15 €",
      "Pack Deep Clean — 25 €",
      "Pack Premium — 40 €",
      "Offre Starter : 3 premiers clients gratuits, puis de 1 € à 9 €",
    ],
    image: "",
    site: "",
    position: 1,
  },
  {
    id: "silicon",
    name: "Silicon Harvest",
    status: "Standby",
    tag: "Écologie · Tech",
    icon: "♻️",
    desc: "Récupération d'appareils électroniques obsolètes ou cassés par démarchage et porte-à-porte, démontage de précision et revente des composants clés (GPU, RAM, puces) et des métaux précieux.",
    details: [
      "Valorisation matérielle intelligente",
      "Démarche écoresponsable",
      "Sourcing terrain : porte-à-porte",
    ],
    image: "",
    site: "",
    position: 2,
  },
  {
    id: "black",
    name: "Black Silk",
    status: "En réflexion",
    tag: "E-commerce · Arbitrage",
    icon: "🛒",
    desc: "Arbitrage commercial automatisé à forte marge : sourcing et importation de produits à forte valeur perçue auprès de grossistes en Chine, revente sur le marché européen.",
    details: [
      "Marges visées : x3 à x5",
      "Financé par la trésorerie des premiers business",
      "Import Chine → Europe",
    ],
    image: "",
    site: "",
    position: 3,
  },
  {
    id: "clout",
    name: "Clout Lab",
    status: "En réflexion",
    tag: "SaaS · Créateurs de contenu",
    icon: "🚀",
    desc: "Application SaaS et plateforme de croissance pour créateurs de contenu et streamers (Twitch, TikTok, Kick). L'actif numérique hautement scalable du portefeuille.",
    details: [
      "Boost d'audience et de visibilité",
      "Outils pour streamers",
      "Scalabilité long terme",
    ],
    image: "",
    site: "",
    position: 4,
  },
];

export const DEFAULT_CONTENT = {
  logo_url: "",
  theme: "cyber",
  tagline:
    "L'entreprise polyvalente qui évolue avec les tendances. Chaque projet d'aujourd'hui est une brique de l'architecture de demain.",
  vision:
    "Log Horizon est la destination finale d'un parcours entrepreneurial construit étape par étape. Polyvalente dans tous les secteurs, l'entreprise crée de nouvelles sections en fonction des tendances, en mobilisant plusieurs corps de métier. Les projets actuels ne sont pas des fins en soi : ce sont des bains d'entraînement où chaque euro gagné, chaque ligne de code écrite et chaque compétence commerciale acquise posent directement les fondations de Log Horizon.",
  manifesto:
    "Chaque euro gagné, chaque ligne de code, chaque client conquis : une brique de plus vers l'horizon.",
  cookie_policy:
    "Log Horizon utilise des cookies essentiels au fonctionnement du site (préférences, sécurité). Avec ton accord, des cookies de mesure d'audience permettent d'améliorer l'expérience. Tu peux changer ton choix à tout moment via « Gestion des cookies » en bas de page.",
};

// Ligne Supabase -> objet utilisé par l'interface
export function fromRow(r) {
  return {
    id: r.id,
    name: r.name,
    status: r.status,
    tag: r.tag || "",
    icon: r.icon || "✨",
    desc: r.description || "",
    details: r.details || [],
    image: r.image_url || "",
    logo: r.logo_url || "",
    site: r.site_url || "",
    position: r.position ?? 0,
  };
}

// Ajoute https:// si l'URL saisie n'en a pas
export function normalizeUrl(raw) {
  const v = typeof raw === "string" ? raw.trim() : "";
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : "https://" + v;
}

// Visuels par défaut des cartes (fichiers dans public/images). Dès que tu envoies
// ta propre image de couverture dans l'admin, elle remplace celui-ci.
const slug = (v) => String(v || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export const DEFAULT_COVERS = {
  "silicon-harvest": "/images/engrenages.jpg",
  "black-silk": "/images/documents.jpg",
  "clout-lab": "/images/presentation.jpg",
};
export const coverFor = (name) => DEFAULT_COVERS[slug(name)] || "";
