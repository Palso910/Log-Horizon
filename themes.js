// Les 4 palettes du site. Les couleurs réelles sont dans app/globals.css
// (blocs :root[data-theme="…"]) ; ici on garde seulement le nom et l'aperçu.
export const DEFAULT_THEME = "cyber";

export const THEMES = [
  {
    id: "cyber",
    name: "Cyber stratégique",
    mood: "Futuriste, tech — cohérent avec l'esprit « nouvelles sections selon les tendances ».",
    swatch: ["#020617", "#0F172A", "#22D3EE", "#6366F1"],
  },
  {
    id: "gold",
    name: "Or noir luxueux",
    mood: "Premium, haute valeur — parfait pour une entreprise polyvalente dans tous les secteurs.",
    swatch: ["#0A0A0A", "#171717", "#F5C518", "#E5E7EB"],
  },
  {
    id: "emerald",
    name: "Émeraude performance",
    mood: "Croissance, énergie — chaque projet est une brique.",
    swatch: ["#04140D", "#0B2118", "#10B981", "#06B6D4"],
  },
  {
    id: "sunset",
    name: "Sunset ambition",
    mood: "Passionnée, jeune entrepreneur — très punchy.",
    swatch: ["#150906", "#241209", "#F97316", "#EF4444"],
  },
];

export const isTheme = (t) => THEMES.some((x) => x.id === t);
