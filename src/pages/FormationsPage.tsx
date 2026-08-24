import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COURSES, type Course } from "../data/courses";

interface CourseApiResponse {
  courses?: unknown[];
}

function normalizeCourse(value: unknown, index: number): Course | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<Course>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!name) return null;

  return {
    id: String(raw.id || raw.slug || `course-${index}`),
    slug: String(raw.slug || raw.id || `course-${index}`),
    name,
    category: String(raw.category || "Formation"),
    description: String(raw.description || "Formation pratique orientée résultats."),
    priceFormatted: String(raw.priceFormatted || "Voir le tarif sur Chariow"),
    priceAmount: Number(raw.priceAmount || 0),
    currency: String(raw.currency || "XOF"),
    isPopular: Boolean(raw.isPopular),
    lessonsCount: Number(raw.lessonsCount || 0),
    duration: String(raw.duration || "À votre rythme"),
    level: String(raw.level || "Tous niveaux"),
    chariowUrl: typeof raw.chariowUrl === "string" ? raw.chariowUrl : "",
    benefits: Array.isArray(raw.benefits)
      ? raw.benefits.filter((benefit): benefit is string => typeof benefit === "string")
      : [],
  };
}

export default function FormationsPage() {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch("/api/proxy/products?type=course&per_page=20", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Catalogue indisponible");
        const payload = (await response.json()) as CourseApiResponse;
        const liveCourses = Array.isArray(payload.courses)
          ? payload.courses.map(normalizeCourse).filter((course): course is Course => course !== null)
          : [];
        if (liveCourses.length) {
          setCourses(liveCourses);
          setUsingFallback(false);
        } else {
          setUsingFallback(true);
        }
      })
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") {
          setUsingFallback(true);
          setError("Impossible de charger les formations. Veuillez réessayer plus tard.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [retryKey]);

  return (
    <div className="formations-page">
      <section className="formations-hero">
        <div className="formations-hero-content">
          <span className="eyebrow">05 — Apprendre &amp; déployer</span>
          <h1 className="formations-title">
            Des formations conçues pour <span className="hl">les réalités des PME ivoiriennes</span>.
          </h1>
          <p className="formations-subtitle">
            Des méthodes concrètes pour automatiser vos ventes, vos opérations et votre pilotage — sans jargon inutile.
          </p>
        </div>
      </section>

      <section className="formations-list-section">
        <div className="formations-section-head">
          <div>
            <span className="eyebrow">Catalogue</span>
            <h2>Apprendre une compétence. Repartir avec un système.</h2>
          </div>
          <p>
            Paiement et accès gérés par Chariow. Les produits publiés sont synchronisés automatiquement.
          </p>
        </div>

        {loading && <p className="catalog-status" role="status" aria-live="polite">Chargement des formations…</p>}
        {usingFallback && !loading && (
          <div className="catalog-status muted" role="status">
            <p>{error || "Les liens de vente sont en cours d'actualisation. Demandez le lien actuel d'une formation avant achat."}</p>
            <button className="btn glass" type="button" onClick={() => setRetryKey((value) => value + 1)}>
              Réessayer
            </button>
          </div>
        )}

        <div className="courses-grid">
          {courses.map((course, index) => (
            <article key={course.id || course.slug} className="course-card rv" style={{ ["--d" as string]: `${index * 0.08}s` }}>
              <div className="course-cover" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{course.category}</strong>
              </div>
              <div className="course-content">
                <div className="course-meta">
                  <span>{course.level}</span>
                  {course.isPopular && <b>Très demandée</b>}
                </div>
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <ul>
                  <li>{course.lessonsCount} modules pratiques</li>
                  <li>{course.duration}</li>
                  {course.benefits.slice(0, 2).map((benefit) => <li key={benefit}>{benefit}</li>)}
                </ul>
                <div className="course-footer">
                  <strong>{course.priceFormatted}</strong>
                  {course.chariowUrl && !usingFallback ? (
                    <a className="btn primary" href={course.chariowUrl} target="_blank" rel="noreferrer">
                      Découvrir <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link className="btn primary" to="/contact" data-cta="course_link_request">
                      Demander le lien <span aria-hidden="true">→</span>
                    </Link>
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
