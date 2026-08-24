import { useState } from "react";
import { Link } from "react-router-dom";
import { BLOG_ARTICLES, BLOG_CATEGORIES } from "../data/blogArticles";

export default function BlogListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  const filteredArticles =
    selectedCategory === "Tous"
      ? BLOG_ARTICLES
      : BLOG_ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div className="blog-page">
      {/* En-tête de page */}
      <section className="blog-hero">
        <div className="blog-hero-content">
          <div className="blog-badge-wrap">
            <span className="blog-count-badge">
              <i>●</i> {BLOG_ARTICLES.length} articles publiés
            </span>
            <span className="blog-location-badge">Abidjan · Pratique &amp; Concret</span>
          </div>
          <h1 className="blog-main-title">
            Tout ce que j'apprends sur l'IA et la transformation digitale des PME.
          </h1>
          <p className="blog-subtitle">
            Retours d'expérience du terrain, méthodes d'automatisation, astuces comptables et fiscalité ivoirienne.
            Zéro théorie abstraite, uniquement ce qui fonctionne en production.
          </p>
        </div>
      </section>

      {/* Barre de filtres par catégorie */}
      <div className="categories-bar-wrap">
        <div className="categories-bar">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={selectedCategory === cat}
              aria-label={cat === "Tous" ? "Tous les articles" : `Articles : ${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`cat-btn ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grille des articles */}
      <section className="blog-list-section">
        <div className="blog-grid">
          {filteredArticles.map((art, idx) => (
            <article key={art.slug} className="blog-card rv" style={{ ["--d" as string]: `${idx * 0.08}s` }}>
              <div className="bc-meta-top">
                <span className="bc-category">{art.category}</span>
                <span className="bc-readtime">✦ {art.readTime}</span>
              </div>
              <h2 className="bc-title">
                <Link to={`/blog/${art.slug}`}>{art.title}</Link>
              </h2>
              <p className="bc-excerpt">{art.excerpt}</p>
              <div className="bc-footer">
                <span className="bc-date">{art.date}</span>
                <Link to={`/blog/${art.slug}`} className="bc-link">
                  Lire l'article <span className="arrow">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="blog-empty">
            <p>Aucun article trouvé dans cette catégorie pour le moment.</p>
            <button className="btn glass" onClick={() => setSelectedCategory("Tous")}>
              Voir tous les articles
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
