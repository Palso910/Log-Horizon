import Link from "next/link";
import Logo from "@/components/Logo";

export default function Nav({ logoUrl }) {
  const links = [
    ["#vision", "Vision"],
    ["#projets", "Projets"],
    ["#manifeste", "Manifeste"],
    ["#strategie", "Stratégie"],
  ];
  return (
    <header className="nav">
      <div className="wrap">
        <a href="#top" className="brand" aria-label="Log Horizon — accueil">
          <Logo url={logoUrl} />
        </a>
        <nav aria-label="Navigation principale">
          <ul>
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/admin" className="btn btn-soft">
          Espace admin
        </Link>
      </div>
    </header>
  );
}
