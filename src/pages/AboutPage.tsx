import { Link } from "react-router-dom";

const TIMELINE_STEPS = [
  {
    age: "Début",
    badge: "Le déclic",
    text: "Le déclic est venu très tôt dans ma carrière en comptabilité. Je remarquais à quel point les tâches administratives — les imputations, les déclarations, le suivi de trésorerie — étaient truffées d'inefficacités qu'on acceptait par simple habitude. J'avais déjà des solutions en tête, mais je n'avais pas encore le déclencheur.",
  },
  {
    age: "Terrain",
    badge: "L'erreur qui a tout changé",
    text: "Ce déclencheur est arrivé sur le terrain, avec une erreur qui a tout changé. Un écart de caisse de 600 000 FCFA m'a obligé à tout recompter pendant trois jours entiers. Le coupable s'est avéré être un simple reçu papier oublié. Ce jour-là, j'ai juré que plus jamais une entreprise ne dépendrait de l'erreur humaine sous ma responsabilité.",
  },
  {
    age: "22h–3h",
    badge: "L'autoformation",
    text: "J'ai alors commencé une autoformation intensive, souvent entre 22h et 3h du matin. J'ai d'abord poussé Excel jusqu'au niveau Expert International TOSA avec 95/100, en maîtrisant les formules complexes, les macros VBA et les automatisations que je construisais pour des inconnus sur LinkedIn, des collègues, ou n'importe qui qui galérait sur un fichier. Ensuite, je me suis formé à l'IA générative et aux architectures d'automatisation (Cisco, Anthropic, PMI).",
  },
  {
    age: "Après 3 ans",
    badge: "Le saut",
    text: "Après trois ans en comptabilité, dont un poste chez KSF Immobilier, j'ai décidé de faire le saut. J'ai démissionné pour me jeter dans la tech, avec un pari clair : construire depuis le terrain que je connais — la comptabilité — plutôt que d'en sortir complètement.",
  },
  {
    age: "Aujourd'hui",
    badge: "Le présent",
    text: "Aujourd'hui, je suis Responsable de la Transformation Digitale et Chef de Projet IA chez DC-Knowing CGA. Je pilote la Suite Flow (Compta Flow, RH Flow, Sell Flow, Task Flow, ATS Flow, Legal Flow), je développe Koraline, un OCR qui transforme des factures scannées en écritures SYSCOHADA, et je forme chaque vendredi les équipes du cabinet à l'IA appliquée.",
  },
];

const CERTIFICATIONS = [
  {
    name: "Practical Application of Generative AI for Project Managers",
    provider: "Project Management Institute",
    logo: "/projectmanagementinstitute_logo.jpg",
    alt: "Logo Project Management Institute",
  },
  {
    name: "Cisco Apply AI",
    provider: "Cisco Networking Academy",
    logo: "/cisco_logo.jpg",
    alt: "Logo Cisco",
  },
  {
    name: "Anthropic Claude 101",
    provider: "Anthropic",
    logo: "/anthropicresearch_logo.jpg",
    alt: "Logo Anthropic",
  },
  {
    name: "TOSA Excel · 95/100",
    provider: "Expert International",
    logo: null,
    alt: "Badge TOSA Excel",
  },
  {
    name: "Google Cloud AI & ML",
    provider: "Google Cloud",
    logo: "/google cloud project.png",
    alt: "Logo Google Cloud",
    status: "En cours",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page-view">
      {/* En-tête de page */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="eyebrow">04 — Mon Histoire</span>
          <h1 className="about-title">EN CE QUI ME CONCERNE…</h1>
          <p className="about-sub">
            Je suis <b>Yao Alex Mardochée KOFFI</b>, comptable de formation devenu architecte de systèmes IA à Abidjan.
            Ma botte secrète, c’est de combiner une forte automatisation Excel avec l’IA générative pour transformer les irritants métier des PME et cabinets ivoiriens en outils qui font réellement gagner des heures.
          </p>
        </div>
      </section>

      {/* Stats rapides */}
      <section className="about-stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-num">95/100</span>
            <span className="stat-lbl">TOSA Excel — Expert International</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">+15 h</span>
            <span className="stat-lbl">Économisées par PME accompagnée</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">5</span>
            <span className="stat-lbl">Certifications IA &amp; outils de pointe</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">100%</span>
            <span className="stat-lbl">Ancré &amp; Déployé à Abidjan</span>
          </div>
        </div>
      </section>

      {/* Section principale : Photo + Timeline */}
      <section className="about-main-section">
        <div className="about-layout-grid">
          {/* Colonne gauche : Photo & Identité */}
          <div className="about-left-col">
            <figure className="photo-frame">
              <span className="tick t1" aria-hidden="true" />
              <span className="tick t2" aria-hidden="true" />
              <span className="tick t3" aria-hidden="true" />
              <span className="tick t4" aria-hidden="true" />
              <div className="pf-inner">
                <picture>
                  <source srcSet="/photo-alex.webp" type="image/webp" />
                  <img src="/photo-alex.png" alt="Yao Alex Mardochée KOFFI" width="1122" height="1402" loading="lazy" />
                </picture>
              </div>
              <figcaption className="pf-meta">
                <span className="pf-name">
                  Yao Alex Mardochée KOFFI
                  <small>Responsable Transformation Digitale · DC-KNOWING CGA</small>
                </span>
                <span className="flag" aria-hidden="true" title="Côte d'Ivoire">
                  <i className="f1" />
                  <i className="f2" />
                  <i className="f3" />
                </span>
              </figcaption>
            </figure>

          </div>

          {/* Colonne droite : Timeline narrative & contact */}
          <div className="about-right-col">
            <div className="timeline-block">
              <h2 className="timeline-title">Le Parcours</h2>
              <div className="timeline-list">
                {TIMELINE_STEPS.map((step, idx) => (
                  <div key={idx} className="timeline-item rv" style={{ ["--d" as string]: `${idx * 0.1}s` }}>
                    <div className="timeline-marker">
                      <span className="tm-dot" />
                      <span className="tm-age">{step.age}</span>
                    </div>
                    <div className="timeline-card">
                      <span className="tm-badge">{step.badge}</span>
                      <p className="tm-text">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-cta-card">
              <h3>Un projet d'automatisation ?</h3>
              <p>Échangeons directement en 30 minutes sans engagement.</p>
              <Link to="/contact" className="btn primary">
                Prendre contact →
              </Link>
              <a
                className="btn glass linkedin-link"
                href="https://www.linkedin.com/in/alexmardoche/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir mon profil LinkedIn →
              </a>
            </div>
          </div>

        </div>

        {/* Certifications pleine largeur : le bandeau ne dépend plus de la colonne de droite. */}
        <div className="cert-section">
          <p className="cert-kicker">Certifications</p>
          <div className="cert-marquee" role="region" aria-label="Certifications d'Alex Mardochée">
            <div className="cert-track">
              {[false, true].map((duplicate) => (
                <div className="cert-set" key={duplicate ? "duplicate" : "original"} aria-hidden={duplicate}>
                  {CERTIFICATIONS.map((cert) => (
                    <article className="cert-marquee-card" key={`${duplicate ? "copy-" : ""}${cert.name}`}>
                      <div className={`cert-logo-frame${cert.logo ? "" : " cert-logo-tosa"}`}>
                        {cert.logo ? (
                          <img src={cert.logo} alt={cert.alt} width={64} height={64} />
                        ) : (
                          <span aria-label={cert.alt}>TOSA<small>EXCEL</small></span>
                        )}
                      </div>
                      <div className="cert-marquee-copy">
                        <p>{cert.provider}</p>
                        <h3>{cert.name}</h3>
                        {cert.status && <span className="cert-status">{cert.status}</span>}
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
