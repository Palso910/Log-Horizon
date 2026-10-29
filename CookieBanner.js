"use client";
import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase";

const KEY = "lh_cookies";
const VISITOR = "lh_visitor";

// Lit/écrit le localStorage sans jamais planter (navigation privée, stockage bloqué…)
const read = (k) => { try { return window.localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { window.localStorage.setItem(k, v); } catch { /* ignoré */ } };

export default function CookieBanner({ policy }) {
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState(null);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    setChoice(read(KEY));
    setReady(true);
    const open = () => { setForceOpen(true); setPolicyOpen(true); setChoice(read(KEY)); };
    const reset = () => { setChoice(read(KEY)); };
    window.addEventListener("lh-open-cookies", open);
    window.addEventListener("lh-consent-reset", reset);
    return () => {
      window.removeEventListener("lh-open-cookies", open);
      window.removeEventListener("lh-consent-reset", reset);
    };
  }, []);

  async function decide(value) {
    write(KEY, value);
    setChoice(value);
    setPolicyOpen(false);
    setForceOpen(false);

    // Journal RGPD : on enregistre le choix (sans IP, avec un identifiant anonyme aléatoire)
    const sb = getBrowserClient();
    if (!sb) return;
    let vid = read(VISITOR);
    if (!vid) {
      vid = (window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) || String(Date.now()) + Math.random();
      write(VISITOR, vid);
    }
    try {
      await sb.from("consents").insert({ visitor_id: vid, choice: value });
    } catch { /* le journal ne doit jamais bloquer le visiteur */ }
  }

  if (!ready) return null;
  if (choice && !forceOpen) return null;

  return (
    <div className="cookie" role="dialog" aria-label="Gestion des cookies">
      <div className="cookie-box">
        <div className="cookie-row">
          <div className="cookie-txt">
            <div className="cookie-ico" aria-hidden="true">🍪</div>
            <div>
              <b>Log Horizon respecte ta vie privée</b>
              <p>
                Nous utilisons des cookies essentiels au site et, avec ton accord, des cookies de mesure d'audience.{" "}
                <button className="link-btn" style={{ fontSize: "inherit" }} onClick={() => setPolicyOpen(!policyOpen)}>
                  Politique des cookies
                </button>
              </p>
            </div>
          </div>
          <div className="cookie-btns">
            <button className="btn btn-ghost" onClick={() => decide("essential")}>Essentiels uniquement</button>
            <button className="btn btn-primary" onClick={() => decide("all")}>Tout accepter</button>
          </div>
        </div>
        {policyOpen && (
          <div className="cookie-policy">
            <b>Politique des cookies</b>
            <p>{policy}</p>
            {choice && (
              <button className="btn btn-ghost" onClick={() => { setPolicyOpen(false); setForceOpen(false); }}>
                Fermer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
