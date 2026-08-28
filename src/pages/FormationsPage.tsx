import { Link } from "react-router-dom";
import { COURSES } from "../data/courses";

export default function FormationsPage() {
  return (
    <div className="formations-page">
      <section className="formations-hero">
        <div className="formations-hero-content formations-hero-grid">
          <div className="formations-hero-copy">
            <span className="eyebrow">05 — Apprendre &amp; déployer</span>
            <h1 className="formations-title">
              Des formations conçues pour <span className="hl">les réalités des PME ivoiriennes</span>.
            </h1>
            <p className="formations-subtitle">
              Des méthodes concrètes pour automatiser vos ventes, vos opérations et votre pilotage — sans jargon inutile.
            </p>
          </div>

          <a className="formation-video-frame" href={COURSES[0].chariowUrl} target="_blank" rel="noreferrer" aria-label="Voir un extrait de la formation EXCEL & IA">
            <div className="video-topbar" aria-hidden="true">
              <span />
              <span />
              <span />
              <b>APERÇU DU CONTENU</b>
              <small>01:24</small>
            </div>
            <div className="video-poster">
              <img src={COURSES[0].cover} alt={`Couverture de la formation ${COURSES[0].name}`} loading="lazy" />
              <div className="video-poster-overlay" />
              <span className="video-play" aria-hidden="true">▶</span>
              <span className="video-caption">Voir un extrait — des cas concrets, des outils, une méthode.</span>
            </div>
            <div className="video-progress" aria-hidden="true"><span /></div>
          </a>
        </div>
      </section>

      <section className="formations-list-section">
        <div className="formations-section-head">
          <div>
            <span className="eyebrow">Catalogue</span>
            <h2>Apprendre une compétence. Repartir avec un système.</h2>
          </div>
          <p>
            Trois offres disponibles sur Chariow, avec leurs contenus, tarifs et supports présentés clairement avant l'achat.
          </p>
        </div>

        <div className="courses-grid">
          {COURSES.map((course, index) => (
            <article key={course.id || course.slug} className="course-card rv" style={{ ["--d" as string]: `${index * 0.08}s` }}>
              <div className="course-cover">
                <img src={course.cover} alt={`Couverture ${course.name}`} loading="lazy" />
                <div className="course-cover-overlay" />
                <span className="course-number">{String(index + 1).padStart(2, "0")}</span>
                <strong>{course.discountLabel || course.category}</strong>
              </div>
              <div className="course-content">
                <div className="course-meta">
                  <span>{course.level}</span>
                  {course.isPopular && <b>Très demandée</b>}
                </div>
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <ul>
                  <li>{course.lessonsLabel}</li>
                  <li>{course.duration}</li>
                  {course.benefits.slice(0, 2).map((benefit) => <li key={benefit}>{benefit}</li>)}
                </ul>
                <div className="course-footer">
                  <div className="course-price">
                    {course.originalPriceFormatted && <del>{course.originalPriceFormatted}</del>}
                    <strong>{course.priceFormatted}</strong>
                  </div>
                  {course.chariowUrl ? (
                    <a className="btn primary" href={course.chariowUrl} target="_blank" rel="noreferrer">
                      Découvrir <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <span className="btn primary" aria-disabled="true" style={{ opacity: .6, cursor: "not-allowed" }}>
                      Lien bientôt disponible
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
