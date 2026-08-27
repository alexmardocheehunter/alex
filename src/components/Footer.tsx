import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const WA_DISPLAY = "+225 07 10 07 35 19";
const WA_MESSAGE = "Bonjour Alex, j'ai vu ton site. Je souhaite discuter d'un projet d'automatisation pour mon entreprise.";
const WA_LINK = `https://wa.me/2250710073519?text=${encodeURIComponent(WA_MESSAGE)}`;

export default function Footer() {
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Abidjan",
      }).format(new Date());
    setClock(fmt());
    const id = window.setInterval(() => setClock(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="footer-v2">
      <div className="footer-grid">
        {/* Colonne 1 : Alex Mardochée */}
        <div className="footer-col brand-col">
          <span className="fb">
            ALEX <b>MARDOCHÉE</b>
          </span>
          <p className="footer-bio">
            Comptable de formation &amp; Responsable Transformation Digitale à Abidjan.
            Le pont entre la rigueur du chiffre et la puissance de la machine.
          </p>
          <a className="f-wa" href={WA_LINK} target="_blank" rel="noreferrer" data-cta="footer_whatsapp">
            <img className="footer-wa-logo" src="/whatsapp.jpg" alt="" width={22} height={22} aria-hidden="true" />
            <span>WhatsApp direct : <b>{WA_DISPLAY}</b></span>
          </a>
          <a
            className="footer-linkedin"
            href="https://www.linkedin.com/in/alexmardoche/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="footer-linkedin-logo" src="/linkedin.png" alt="" width={20} height={20} aria-hidden="true" />
            <span>LinkedIn : voir mon profil</span>
          </a>
        </div>

        {/* Colonne 2 : Contenu & Savoir */}
        <div className="footer-col">
          <h4>Contenu &amp; Savoir</h4>
          <nav aria-label="Liens contenu">
            <Link to="/blog">Le Blog IA &amp; PME</Link>
            <Link to="/formations">Formations &amp; Ateliers</Link>
            <Link to="/newsletter">Newsletter du vendredi</Link>
            <Link to="/a-propos">Mon Parcours</Link>
          </nav>
        </div>

        {/* Colonne 3 : Solutions PME */}
        <div className="footer-col">
          <h4>Solutions PME</h4>
          <nav aria-label="Liens solutions">
            <Link to="/services">Ventes &amp; Stock WhatsApp</Link>
            <Link to="/services">Assistants IA 24/7</Link>
            <Link to="/services">Clôture SYSCOHADA</Link>
            <Link to="/services">Audit Flash &amp; Déploiement</Link>
          </nav>
        </div>

        {/* Colonne 4 : Contact & Rendez-vous */}
        <div className="footer-col">
          <h4>Prendre Contact</h4>
          <nav aria-label="Liens contact">
            <Link to="/contact">Formulaire de contact</Link>
            <a href="https://calendly.com/alexmardochee0/30min" target="_blank" rel="noreferrer">
              Réserver un Audit Flash
            </a>
            <a href="mailto:alexmardochee0@gmail.com">alexmardochee0@gmail.com</a>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="fl">
          <span className="flag" aria-hidden="true">
            <i className="f1" />
            <i className="f2" />
            <i className="f3" />
          </span>
          © 2026 — Conçu et déployé à Abidjan · <span className="clock">{clock}</span> GMT
        </span>
        <span className="footer-sign">Même depuis l'Afrique, bâtir des systèmes d'excellence.</span>
      </div>
    </footer>
  );
}
