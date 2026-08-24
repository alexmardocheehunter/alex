import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { BLOG_ARTICLES } from "../data/blogArticles";
import NewsletterBlock from "../components/NewsletterBlock";
import { getArticleFaqs } from "../seo";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const relatedArticles = BLOG_ARTICLES
    .filter((a) => a.slug !== article.slug)
    .map((candidate) => ({
      candidate,
      score: (candidate.category === article.category ? 3 : 0) + candidate.tags.filter((tag) => article.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ candidate }) => candidate);

  // Rendu simple du markdown en blocs HTML structurés
  const renderContent = (rawText: string) => {
    const lines = rawText.trim().split("\n");
    const elements: JSX.Element[] = [];
    let inCode = false;
    let codeBuffer: string[] = [];
    let listBuffer: string[] = [];

    const flushList = (key: number) => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="article-list">
            {listBuffer.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    lines.forEach((line, index) => {
      if (line.startsWith("```")) {
        if (inCode) {
          elements.push(
            <pre key={`code-${index}`} className="article-code">
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          );
          codeBuffer = [];
          inCode = false;
        } else {
          flushList(index);
          inCode = true;
        }
        return;
      }

      if (inCode) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith("### ")) {
        flushList(index);
        elements.push(
          <h2 key={index} className="article-h2">
            {line.replace("### ", "")}
          </h2>
        );
      } else if (line.startsWith("#### ")) {
        flushList(index);
        elements.push(
          <h3 key={index} className="article-h3">
            {line.replace("#### ", "")}
          </h3>
        );
      } else if (line.startsWith("> ")) {
        flushList(index);
        elements.push(
          <blockquote key={index} className="article-quote">
            {line.replace("> ", "")}
          </blockquote>
        );
      } else if (line.startsWith("- ") || line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
        const itemContent = line.replace(/^(-\s+|\d+\.\s+)/, "");
        const formatted = itemContent.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        listBuffer.push(formatted);
      } else if (line.trim() === "---") {
        flushList(index);
        elements.push(<hr key={index} className="article-divider" />);
      } else if (line.trim().length > 0) {
        flushList(index);
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
        elements.push(
          <p key={index} className="article-p" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
    });

    flushList(lines.length);
    elements.splice(2, 0, (
      <aside className="article-inline-cta" key="inline-cta">
        <strong>Vous voulez appliquer ce principe à Abidjan ?</strong>
        <a href="https://wa.me/2250710073519?text=Bonjour%20Alex%2C%20je%20viens%20de%20lire%20un%20article%20et%20je%20veux%20parler%20de%20mon%20processus." target="_blank" rel="noreferrer" data-cta="article_inline_whatsapp">Décrire mon processus sur WhatsApp →</a>
      </aside>
    ));
    return elements;
  };

  return (
    <article className="article-detail-page">
      {/* En-tête de l'article */}
      <header className="article-header">
        <div className="article-meta-badges">
          <span className="badge-cat">{article.category}</span>
          <span className="badge-time">✦ {article.readTime} de lecture</span>
          <span className="badge-date">{article.date}</span>
        </div>
        <h1 className="article-title">{article.title}</h1>
        <p className="article-lead">{article.answer}</p>
        <div className="article-author-row">
          <div className="author-monogram">A</div>
          <div>
            <span className="author-name">Écrit par <Link to="/a-propos"><b>{article.author}</b></Link></span>
            <span className="author-role">Responsable Transformation Digitale · Abidjan</span>
            <span className="author-role"><time dateTime={article.datePublished}>Publié le {article.date}</time>{article.dateModified && article.dateModified !== article.datePublished && ` · Mis à jour le ${article.dateModified}`}</span>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <section className="article-body-wrapper" aria-label="Contenu de l'article">
        <div className="article-body">{renderContent(article.content)}</div>

        {/* Tags */}
        <div className="article-tags">
          {article.tags.map((t) => (
            <span key={t} className="tag">
              #{t}
            </span>
          ))}
        </div>
      </section>

      <nav className="article-context-links" aria-label="Prochaines étapes">
        <Link to="/services">Voir les services d'automatisation</Link>
        <Link to="/contact">Demander un audit à Abidjan</Link>
        <Link to="/blog">Lire les autres articles</Link>
      </nav>

      <section className="article-faq" aria-labelledby="article-faq-title">
        <h2 id="article-faq-title">Questions fréquentes sur ce sujet</h2>
        {getArticleFaqs(article).map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>

      <p className="article-final-cta">
        <a className="btn primary" href="https://wa.me/2250710073519?text=Bonjour%20Alex%2C%20je%20souhaite%20un%20audit%20automatisation%20%C3%A0%20Abidjan." target="_blank" rel="noreferrer" data-cta="article_final_whatsapp">Parler de mon projet sur WhatsApp</a>
      </p>

      {/* CTA Newsletter fin d'article */}
      <div className="article-newsletter-cta">
        <NewsletterBlock sourcePage={`article_${article.slug}`} compact />
      </div>

      {/* Articles liés */}
      {relatedArticles.length > 0 && (
        <section className="related-articles-section">
          <div className="related-head">
            <span className="eyebrow">Poursuivre la lecture</span>
            <h2>Articles recommandés</h2>
          </div>
          <div className="related-grid">
            {relatedArticles.map((rel) => (
              <article key={rel.slug} className="blog-card">
                <div className="bc-meta-top">
                  <span className="bc-category">{rel.category}</span>
                  <span className="bc-readtime">✦ {rel.readTime}</span>
                </div>
                <h3 className="bc-title">
                  <Link to={`/blog/${rel.slug}`}>{rel.title}</Link>
                </h3>
                <p className="bc-excerpt">{rel.excerpt}</p>
                <div className="bc-footer">
                  <Link to={`/blog/${rel.slug}`} className="bc-link">
                    Lire l'article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
