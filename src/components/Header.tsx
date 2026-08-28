import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "alex-theme";

export default function Header() {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme: Theme = storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : root.dataset.theme === "dark"
        ? "dark"
        : "light";

    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle("scrolled", window.scrollY > 30);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);

  const navigation = (
    <>
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>Accueil</Link>
      <Link to="/services" className={location.pathname === "/services" ? "active" : ""}>Services</Link>
      <Link to="/formations" className={location.pathname === "/formations" ? "active" : ""}>Formations</Link>
      <Link to="/blog" className={location.pathname.startsWith("/blog") ? "active" : ""}>Blog</Link>
      <Link to="/a-propos" className={location.pathname === "/a-propos" ? "active" : ""}>À propos</Link>
    </>
  );

  return (
    <>
      <div className="progress" ref={progressRef} aria-hidden="true" />
      <header className="nav" ref={navRef}>
        <Link className="brand" to="/">
          <img className="brand-logo" src="/logo-alex.png?v=2" alt="Logo Alex Mardochée" width="45" height="45" loading="eager" decoding="async" />
          <span className="brand-name">ALEX MARDOCHÉE</span>
        </Link>
        <nav aria-label="Navigation principale">
          {navigation}
        </nav>
        <div className="nav-actions">
          <button
            className="theme-toggle-btn"
            type="button"
            aria-label={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
            aria-pressed={theme === "dark"}
            title={theme === "dark" ? "Thème clair" : "Thème sombre"}
            onClick={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" />
              </svg>
            )}
          </button>
          <Link className="nav-pill-btn" to="/contact" data-cta="header_rendezvous">
            Rendez-vous
          </Link>
          <button
            className="nav-menu-toggle"
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      {menuOpen && <nav className="mobile-nav" aria-label="Navigation mobile">{navigation}</nav>}
    </>
  );
}
