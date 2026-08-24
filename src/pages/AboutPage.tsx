
const TIMELINE_STEPS = [
  {
    age: "19 ans",
    badge: "Le déclic",
    text: "Stage à la Direction des Impôts. On me juge sur mon âge, pas sur mon dossier. Je décide de devenir irréprochable et de maîtriser ce que personne ne prend le temps d'apprendre.",
  },
  {
    age: "Terrain",
    badge: "L'erreur qui a tout changé",
    text: "Un écart de caisse de 600 000 FCFA. Trois jours entiers passés à tout recompter jusqu'à la nuit. Le coupable : un simple reçu papier oublié. C'est le jour où j'ai juré : plus jamais mon entreprise ne dépendra de l'erreur humaine.",
  },
  {
    age: "Nuits",
    badge: "L'autoformation",
    text: "Entre 22h et 3h du matin, j'apprends sans relâche. D'abord Excel jusqu'au niveau Expert International TOSA (95/100), puis l'IA générative et les architectures d'automatisation (Cisco, OpenAI, Anthropic).",
  },
  {
    age: "Aujourd'hui",
    badge: "Le pont",
    text: "Responsable de la Transformation Digitale et Chef de Projet IA chez DC-KNOWING CGA. Je conçois Suite FLOW et j'accompagne des dirigeants et des équipes pour tuer le travail répétitif.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page-view">
      {/* En-tête de page */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="eyebrow">04 — Mon Histoire</span>
          <h1 className="about-title">
            Le pont entre la rigueur du chiffre <span className="hl">et la puissance de la machine</span>.
          </h1>
          <p className="about-sub">
            Je suis <b>Yao Alex Mardochée KOFFI</b> — comptable de formation, devenu architecte de systèmes digitaux à Abidjan.
            Voici pourquoi et comment je construis les outils qui libèrent les PME ivoiriennes.
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
            <span className="stat-num">4</span>
            <span className="stat-lbl">Certifications IA &amp; Réseaux de pointe</span>
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
                <img
                  src="/photo-alex.png"
                  alt="Yao Alex Mardochée KOFFI"
                  loading="lazy"
                />
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

            <div className="about-cta-card">
              <h3>Un projet d'automatisation ?</h3>
              <p>Échangeons directement en 30 minutes sans engagement.</p>
              <a href="/#contact" className="btn primary">
                Prendre contact →
              </a>
            </div>
          </div>

          {/* Colonne droite : Timeline narrative & Certifications */}
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

            {/* Conviction */}
            <blockquote className="conviction rv" style={{ ["--d" as string]: ".35s" }}>
              <span className="conviction-k">Ma conviction</span>
              Même depuis l'Afrique, on peut construire des systèmes aussi efficaces et rigoureux que ceux de l'Occident !
            </blockquote>

            {/* Certifications */}
            <div className="cert-section">
              <p className="cert-kicker">Certifié, pas juste convaincu :</p>
              <div className="cert-grid">
                <div className="cert">
                  <span className="cert-ic" aria-hidden="true">🏆</span>
                  <div>
                    <h3>Excel TOSA</h3>
                    <p>95/100 — niveau Expert International</p>
                  </div>
                </div>
                <div className="cert">
                  <span className="cert-ic" aria-hidden="true">🤖</span>
                  <div>
                    <h3>Anthropic Certified</h3>
                    <p>Claude 101</p>
                  </div>
                </div>
                <div className="cert">
                  <span className="cert-ic" aria-hidden="true">🌐</span>
                  <div>
                    <h3>Cisco Certified</h3>
                    <p>Apply AI</p>
                  </div>
                </div>
                <div className="cert">
                  <span className="cert-ic" aria-hidden="true">☁️</span>
                  <div>
                    <h3>Google Cloud AI &amp; ML</h3>
                    <p><span className="cert-wip">En cours</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
