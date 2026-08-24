import { Link, useLocation } from "react-router-dom";
import { BLOG_ARTICLES } from "../data/blogArticles";

const LABELS: Record<string, string> = {
  histoires: "Histoires clients",
  methode: "Méthode",
  services: "Services",
  "a-propos": "À propos",
  contact: "Contact",
  blog: "Blog",
  formations: "Formations",
  newsletter: "Newsletter",
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const items = [{ name: "Accueil", href: "/" }];
  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const article = BLOG_ARTICLES.find((item) => item.slug === segment);
    items.push({
      name: article?.title ?? LABELS[segment] ?? decodeURIComponent(segment),
      href: currentPath,
    });
  });

  return (
    <nav className="breadcrumbs site-breadcrumbs" aria-label="Fil d'Ariane">
      {items.map((item, index) => (
        <span key={item.href}>
          {index > 0 && <span aria-hidden="true"> / </span>}
          {index === items.length - 1 ? (
            <span className="current" aria-current="page">{item.name}</span>
          ) : (
            <Link to={item.href}>{item.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
