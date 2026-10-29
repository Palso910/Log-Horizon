"use client";

// Bouton « Gestion des cookies » du footer : rouvre la bannière.
export default function CookieLink() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("lh-open-cookies"))}>
      Gestion des cookies
    </button>
  );
}
