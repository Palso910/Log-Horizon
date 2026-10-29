import { getServerClient } from "@/lib/supabase";
import { DEFAULT_PROJECTS, DEFAULT_CONTENT, fromRow } from "@/lib/defaults";
import { DEFAULT_THEME, isTheme } from "@/lib/themes";

// Lit les projets visibles et les textes du site dans Supabase.
// Si Supabase n'est pas branché (ou en erreur), on affiche les données par défaut : le site ne casse jamais.
export async function getSiteData() {
  const sb = getServerClient();
  const fallback = { projects: DEFAULT_PROJECTS, content: DEFAULT_CONTENT, live: false };
  if (!sb) return fallback;

  try {
    const [p, c] = await Promise.all([
      sb.from("projects").select("*").eq("visible", true).order("position"),
      sb.from("site_content").select("*").eq("id", 1).maybeSingle(),
    ]);

    const projects = p.error || !p.data ? DEFAULT_PROJECTS : p.data.map(fromRow);

    const content = { ...DEFAULT_CONTENT };
    if (!c.error && c.data) {
      for (const k of Object.keys(DEFAULT_CONTENT)) {
        if (typeof c.data[k] === "string" && c.data[k].trim()) content[k] = c.data[k];
      }
    }
    if (!isTheme(content.theme)) content.theme = DEFAULT_THEME;
    return { projects, content, live: !p.error };
  } catch {
    return fallback;
  }
}

// Lecture légère de la palette choisie (utilisée par le layout, sur toutes les pages).
export async function getTheme() {
  const sb = getServerClient();
  if (!sb) return DEFAULT_THEME;
  try {
    const { data, error } = await sb.from("site_content").select("theme").eq("id", 1).maybeSingle();
    return !error && data && isTheme(data.theme) ? data.theme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}
