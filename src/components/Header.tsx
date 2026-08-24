import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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
      <Link to="/histoires" className={location.pathname === "/histoires" ? "active" : ""}>Histoires</Link>
      <Link to="/services" className={location.pathname === "/services" ? "active" : ""}>Services</Link>
      <Link to="/formations" className={location.pathname === "/formations" ? "active" : ""}>Formations</Link>
      <Link to="/blog" className={location.pathname.startsWith("/blog") ? "active" : ""}>Blog</Link>
      <Link to="/a-propos" className={location.pathname === "/a-propos" ? "active" : ""}>À propos</Link>
      <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact</Link>
    </>
  );

  return (
    <>
      <div className="progress" ref={progressRef} aria-hidden="true" />
      <header className="nav" ref={navRef}>
        <Link className="brand" to="/">
          ALEX <b>MARDOCHÉE</b>
        </Link>
        <nav aria-label="Navigation principale">
          {navigation}
        </nav>
        <div className="nav-actions">
          <Link className="nav-newsletter-btn" to="/newsletter">
            <span className="sparkle">✦</span> Newsletter
          </Link>
          <a className="cta" href="/contact" data-cta="header_contact">
            Discutons
          </a>
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
