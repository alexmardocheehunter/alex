import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { BLOG_ARTICLES } from "../data/blogArticles";
import NewsletterBlock from "../components/NewsletterBlock";
import { getArticleFaqs } from "../seo";

function slugId(text: string, index: number) {
  return `section-${String(index + 1).padStart(2, "0")}`;
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // sommaire + sections parsing
  const sections = (() => {
    if (!article) return [] as Array<{ id: string; title: string; raw: string[] }>;
    const lines = article.content.trim().split("\n");
    const out: Array<{ id: string; title: string; raw: string[] }> = [];
    let current: { title: string; raw: string[] } | null = null;
    let idx = 0;
    for (const line of lines) {
      if (line.startsWith("### ")) {
        if (current) out.push({ id: slugId(current.title, idx++), title: current.title, raw: current.raw });
        current = { title: line.replace("### ", "").trim(), raw: [] };
      } else {
        if (!current) current = { title: "Introduction", raw: [] };
        current.raw.push(line);
      }
    }
    if (current) out.push({ id: slugId(current.title, idx), title: current.title, raw: current.raw });
    return out;
  })();

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    sections.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });
    const faqEl = document.getElementById("faq-anchor");
    if (faqEl) observer.observe(faqEl);
    return () => observer.disconnect();
  }, [sections]);

  if (!article) return <Navigate to="/blog" replace />;

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://alexmardochee.web.app/blog/${article.slug}`;
  const chatGptUrl = `https://chat.openai.com/?q=${encodeURIComponent(`Résume cet article : ${shareUrl}`)}`;
  const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(`Résume cet article : ${shareUrl}`)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

  // render helpers for inside sections
  const renderSectionBody = (rawLines: string[]) => {
    const elements: JSX.Element[] = [];
    let inCode = false;
    let codeBuffer: string[] = [];
    let listBuffer: string[] = [];
    let isOrdered = false;

    const flushList = (key: number) => {
      if (listBuffer.length === 0) return;
      // Decide rendering: if list has 3-4 items near "Cela inclut" -> mini grid, otherwise benefits 2-col
      const useMiniGrid = listBuffer.length >= 3 && listBuffer.length <= 4;
      if (useMiniGrid) {
        elements.push(
          <div key={`grid-${key}`} className="article-mini-grid">
            {listBuffer.map((item, i) => (
              <div key={i} className="mini-card">
                <span className="mini-icon" aria-hidden="true">{i === 0 ? "◈" : i === 1 ? "◎" : i === 2 ? "⬢" : "⬣"}</span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            ))}
          </div>
        );
      } else if (listBuffer.length === 2) {
        elements.push(
          <div key={`benefits-${key}`} className="article-benefits-grid">
            {listBuffer.map((item, i) => (
              <div key={i} className="benefit-card">
                <span className="benefit-icon" aria-hidden="true">✓</span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            ))}
          </div>
        );
      } else {
        // fallback: if we have exactly 3 items with benefits look -> also benefits grid
        if (listBuffer.length === 3) {
          elements.push(
            <div key={`benefits3-${key}`} className="article-benefits-grid cols-3">
              {listBuffer.map((item, i) => (
                <div key={i} className="benefit-card">
                  <span className="benefit-icon" aria-hidden="true">✓</span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              ))}
            </div>
          );
        } else {
          elements.push(
            <ul key={`list-${key}`} className="article-list">
              {listBuffer.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
        }
      }
      listBuffer = [];
    };

    rawLines.forEach((line, index) => {
      if (line.startsWith("```")) {
        if (inCode) {
          elements.push(
            <pre key={`code-${index}`} className="article-code"><code>{codeBuffer.join("\n")}</code></pre>
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
      if (line.startsWith("#### ")) {
        flushList(index);
        elements.push(<h3 key={index} className="article-h3">{line.replace("#### ", "")}</h3>);
      } else if (line.startsWith("> ")) {
        flushList(index);
        elements.push(<blockquote key={index} className="article-quote">{line.replace("> ", "")}</blockquote>);
      } else if (line.startsWith("- ") || /^\d+\.\s/.test(line)) {
        const itemContent = line.replace(/^(-\s+|\d+\.\s+)/, "");
        const formatted = itemContent.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // detect ordered vs unordered for later, but treat same
        if (listBuffer.length === 0) isOrdered = /^\d+\./.test(line);
        listBuffer.push(formatted);
      } else if (line.trim() === "---") {
        flushList(index);
        elements.push(<hr key={index} className="article-divider" />);
      } else if (line.trim().length > 0) {
        flushList(index);
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
        // highlight Mon rôle style
        if (formatted.includes("Mon rôle")) {
          elements.push(<div key={index} className="article-insight"><span className="insight-q">99</span><span dangerouslySetInnerHTML={{ __html: formatted }} /></div>);
        } else {
          elements.push(<p key={index} className="article-p" dangerouslySetInnerHTML={{ __html: formatted }} />);
        }
      }
    });
    flushList(rawLines.length + 1);
    return elements;
  };

  return (
    <div className="article-page-wrap">
      <div className="article-layout">
        {/* ============== SIDEBAR STICKY ============== */}
        <aside className="article-sidebar" aria-label="Navigation article">
          {/* Sommaire */}
          <div className="sidebar-card toc-card">
            <div className="toc-head">
              <span className="toc-title">Sommaire</span>
              <span className="toc-icon" aria-hidden="true">≡</span>
            </div>
            <nav className="toc-list" aria-label="Sommaire">
              {sections.map((s, i) => {
                const isActive = activeId === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`toc-item ${isActive ? "active" : ""}`}
                  >
                    <span className={`toc-num ${isActive ? "active" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="toc-label">{s.title}</span>
                  </a>
                );
              })}
              <a
                href="#faq-anchor"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("faq-anchor")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`toc-item ${activeId === "faq-anchor" ? "active" : ""}`}
              >
                <span className={`toc-num ${activeId === "faq-anchor" ? "active" : ""}`}>{String(sections.length + 1).padStart(2, "0")}</span>
                <span className="toc-label">FAQ</span>
              </a>
            </nav>
          </div>

          {/* En bref */}
          <div className="sidebar-card en-bref-card">
            <h4 className="en-bref-title">En bref</h4>
            <p className="en-bref-text">{article.answer.slice(0, 140)}{article.answer.length > 140 ? "…" : ""}</p>
            <a className="en-bref-btn primary" href={chatGptUrl} target="_blank" rel="noreferrer">
              <span className="btn-ico btn-ico-image"><img src="/chatgptai.png" alt="" width={20} height={20} aria-hidden="true" /></span> Résumé avec ChatGPT
            </a>
            <a className="en-bref-btn secondary" href={claudeUrl} target="_blank" rel="noreferrer">
              <span className="btn-ico btn-ico-image"><img src="/claudeai.png" alt="" width={20} height={20} aria-hidden="true" /></span> Résumé avec Claude
            </a>
          </div>

          {/* Partager */}
          <div className="sidebar-card share-card">
            <h4 className="share-title">Partager l'article</h4>
            <div className="share-row">
              <a
                className="share-ico"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Partager sur LinkedIn"
              >
                <img src="/linkedin.png" alt="" width={20} height={20} aria-hidden="true" />
              </a>
              <a
                className="share-ico"
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Partager sur X"
              >
                <img src="/x ( twitter).png" alt="" width={20} height={20} aria-hidden="true" />
              </a>
              <button className="share-ico copy" type="button" onClick={handleCopy} aria-label="Copier le lien">
                {copied ? "✓" : "⧉"}
              </button>
            </div>
            {copied && <span className="copy-feedback">Lien copié !</span>}
          </div>
        </aside>

        {/* ============== CONTENU PRINCIPAL ============== */}
        <article className="article-main">
          {/* Breadcrumb */}
          <nav className="article-breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/blog">Articles</Link>
            <span aria-hidden="true"> › </span>
            <span className="bc-cat">{article.category}</span>
          </nav>

          <header className="article-header-new">
            <h1 className="article-title-new">{article.title}</h1>
            <p className="article-excerpt-new">{article.excerpt}</p>
            <div className="article-author-row-new">
              <img src="/photo-alex.png" alt={article.author} width={40} height={40} className="author-avatar" loading="lazy" />
              <div className="author-meta">
                <span className="author-name-new">
                  <Link to="/a-propos"><strong>{article.author}</strong></Link>
                  <span className="author-dot"> · Entreprise IA & Automatisation</span>
                </span>
                <span className="author-sub">
                  <span>✦ {article.readTime} de lecture</span> <span>· {article.date}</span>
                </span>
              </div>
            </div>
          </header>

          {/* Hero image placeholder - accent */}
          <div className="article-hero-image" aria-hidden="true">
            <div className="hero-ai-badge">IA</div>
          </div>

          {/* Sections numérotées */}
          <div className="article-sections">
            {sections.map((sec, idx) => (
              <section
                key={sec.id}
                id={sec.id}
                ref={(el) => { sectionRefs.current[sec.id] = el; }}
                className="article-section-block"
              >
                <div className="section-head-row">
                  <span className="section-badge">{String(idx + 1).padStart(2, "0")}</span>
                  <h2 className="article-h2-new">{sec.title}</h2>
                </div>
                <div className="section-body">{renderSectionBody(sec.raw)}</div>
                {idx === 0 && (
                  <aside className="article-inline-cta-new">
                    <strong>Vous voulez appliquer ce principe à Abidjan ?</strong>
                    <a
                      href="https://wa.me/2250710073519?text=Bonjour%20Alex%2C%20je%20viens%20de%20lire%20un%20article%20et%20je%20veux%20parler%20de%20mon%20processus."
                      target="_blank"
                      rel="noreferrer"
                      data-cta="article_inline_whatsapp"
                    >
                      Décrire mon processus sur WhatsApp →
                    </a>
                  </aside>
                )}
              </section>
            ))}
          </div>

          {/* CTA noir milieu d'article */}
          <div className="article-mid-cta">
            <div className="mid-cta-left">
              <span className="mid-kicker">Un projet en tête ?</span>
              <h3>Parlons-en autour d'un appel</h3>
              <p>Réservez un créneau directement dans mon agenda. C'est simple, rapide et sans engagement.</p>
              <ul className="mid-benefits">
                <li><span className="check">✓</span> Créneau à la date qui vous convient</li>
                <li><span className="check">✓</span> Échange personnalisé</li>
                <li><span className="check">✓</span> Conseils adaptés à votre projet</li>
              </ul>
              <a className="btn primary mid-cta-btn" href="https://calendly.com/alexmardochee0/30min" target="_blank" rel="noreferrer">
                Réserver un appel →
              </a>
            </div>
            <div className="mid-cta-calendar" aria-hidden="true">
              <div className="mini-cal">
                <span className="mini-cal-title">Réservez un appel avec Alex</span>
                <span className="mini-cal-sub">30 minutes</span>
                <div className="mini-cal-grid">
                  <span className="cal-head">Mai 2026</span>
                  <div className="cal-days">
                    {Array.from({ length: 14 }, (_, i) => (
                      <span key={i} className={`cal-day ${i === 9 ? "active" : ""}`}>{i + 4}</span>
                    ))}
                  </div>
                  <span className="cal-foot">Vendredi 15 mai</span>
                  <div className="cal-slots">
                    <span>09:00</span><span>10:00</span><span>16:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <section id="faq-anchor" className="article-faq-new" aria-labelledby="faq-title-new">
            <div className="faq-head-row">
              <span className="section-badge small">99</span>
              <h2 id="faq-title-new">FAQ</h2>
            </div>
            <div className="faq-accordion">
              {getArticleFaqs(article).map((faq, i) => (
                <details key={faq.question} open={i === 0} className="faq-details">
                  <summary>
                    <span>{faq.question}</span>
                    <span className="faq-chevron" aria-hidden="true">‹</span>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Tags */}
          <div className="article-tags-new">
            {article.tags.map((t) => (
              <span key={t} className="tag-new">#{t}</span>
            ))}
          </div>

          {/* Newsletter bandeau bas */}
          <div className="article-newsletter-banner">
            <div className="nb-banner-left">
              <span className="nb-mail-icon" aria-hidden="true">✉</span>
              <div>
                <strong>Restez à jour sur l'IA et l'automatisation</strong>
                <span>Recevez mes conseils, retours d'expérience et ressources exclusives.</span>
              </div>
            </div>
            <div className="nb-banner-form-wrap">
              <NewsletterBlock sourcePage={`article_${article.slug}`} compact />
            </div>
          </div>

          <nav className="article-context-links-new" aria-label="Prochaines étapes">
            <Link to="/services">Voir les services →</Link>
            <Link to="/blog">Tous les articles →</Link>
          </nav>
        </article>
      </div>
    </div>
  );
}
