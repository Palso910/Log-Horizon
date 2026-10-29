import "./globals.css";
import { getTheme } from "@/lib/data";

// Le thème est lu à chaque requête : changer de palette dans l'admin s'applique tout de suite.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://log-horizon.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Log Horizon — L'entreprise polyvalente qui évolue avec les tendances",
  description:
    "Log Horizon est une entreprise en construction, pensée pour intervenir dans tous les secteurs et créer de nouvelles sections au fil des tendances. Découvrez les projets tremplins qui la préparent : Sneaker Wash 28, Silicon Harvest, Black Silk, Clout Lab.",
  openGraph: {
    title: "Log Horizon",
    description: "Une entreprise polyvalente, construite projet après projet.",
    type: "website",
    locale: "fr_FR",
    siteName: "Log Horizon",
  },
  twitter: { card: "summary_large_image", title: "Log Horizon", description: "Une entreprise polyvalente, construite projet après projet." },
  alternates: { canonical: "/" },
};

export const viewport = { themeColor: "#050816", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }) {
  const theme = await getTheme();
  return (
    <html lang="fr" data-theme={theme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
