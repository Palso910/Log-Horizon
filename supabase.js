import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Faux si les variables sont absentes ou si on a gardé les valeurs de .env.example
export const isConfigured = Boolean(URL && KEY && !URL.includes("xxxxxxxx") && !KEY.includes("..."));

let browserClient = null;

// Client navigateur (admin + journal des cookies). Une seule instance.
export function getBrowserClient() {
  if (!isConfigured) return null;
  if (!browserClient) browserClient = createClient(URL, KEY);
  return browserClient;
}

// Client serveur (lecture publique pour afficher le site). Aucune session.
export function getServerClient() {
  if (!isConfigured) return null;
  return createClient(URL, KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Next.js met les requêtes en cache par défaut : on veut toujours les données fraîches.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
