const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://log-horizon.vercel.app";

export default function sitemap() {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/mentions`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
