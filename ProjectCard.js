"use client";
import { useState } from "react";
import { STATUS_CLASS, normalizeUrl, coverFor } from "@/lib/defaults";

export default function ProjectCard({ p }) {
  const [open, setOpen] = useState(false);
  const siteUrl = normalizeUrl(p.site);
  const cover = p.image || coverFor(p.name);
  const stock = !p.image && Boolean(cover); // visuel par défaut : teinté aux couleurs du thème

  return (
    <article className="pcard">
      <div className={`pmedia${stock ? " stock" : ""}`}>
        {cover ? (
          <img src={cover} alt={p.image ? `Visuel du projet ${p.name}` : ""} loading="lazy" />
        ) : (
          <div className="ico" aria-hidden="true">
            {p.icon}
          </div>
        )}
        <span className={`status ${STATUS_CLASS[p.status] || "s-amber"}`}>{p.status}</span>
      </div>
      <div className="pbody">
        <div className="phead">
          {p.logo && <img className="plogo" src={p.logo} alt={`Logo ${p.name}`} loading="lazy" />}
          <div>
            <h3>{p.name}</h3>
            {p.tag && <div className="ptag">{p.tag}</div>}
          </div>
        </div>
        <p>{p.desc}</p>
        {open && p.details?.length > 0 && (
          <ul className="details">
            {p.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
        <div className="pactions">
          {p.details?.length > 0 && (
            <button className="link-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
              {open ? "Réduire −" : "En savoir plus +"}
            </button>
          )}
          {siteUrl && (
            <a className="btn btn-soft" href={siteUrl} target="_blank" rel="noopener noreferrer">
              Visiter le site ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
