import { useEffect } from "react";
import { BLOG_ARTICLES, type BlogArticle } from "./data/blogArticles";

export const SITE_URL = "https://alexmardochee.web.app";
export const SITE_NAME = "Alex Mardochée — Automatisation & IA";
export const SITE_IMAGE = `${SITE_URL}/photo-alex.png`;
export const WHATSAPP_URL = "https://wa.me/2250710073519";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  type: "website" | "article";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData: Record<string, unknown>;
}

export const SITE_FAQS: FaqItem[] = [
  {
    question: "Que peut-on automatiser dans une PME à Abidjan ?",
    answer:
      "Les possibilités sont immenses : commandes WhatsApp avec accusé de réception et suivi, saisie comptable et factures via OCR (montant, TVA, date et numéro de pièce), relances clients à J-7, J-3 et J+1, stocks synchronisés, tableaux de bord actualisés et rendez-vous avec confirmations SMS ou email. Tout ce qui est répétitif et chronophage peut être confié à des agents IA, avec validation humaine pour les décisions sensibles.",
  },
  {
    question: "Combien de temps faut-il pour lancer une première automatisation ?",
    answer:
      "Une automatisation simple, comme le classement des emails ou l'envoi de relances, peut être opérationnelle en 48 à 72 heures. Pour un processus plus complexe avec OCR ou flux comptables, comptez 1 à 2 semaines, incluant l'analyse, le développement, les tests et la mise en production.",
  },
  {
    question: "Travaillez-vous avec les entreprises situées hors d'Abidjan ?",
    answer:
      "Oui. L'accompagnement est basé à Abidjan et peut être réalisé à distance partout en Côte d'Ivoire et en Afrique francophone.",
  },
];

export function getArticleFaqs(article: BlogArticle): FaqItem[] {
  return [
    {
      question: `Quel est le résultat principal de l'article « ${article.title} » ?`,
      answer: article.answer,
    },
    {
      question: "Par où commencer une automatisation pour une PME ivoirienne ?",
      answer:
        "Commencez par une tâche répétitive mesurable, comme les demandes WhatsApp, le stock ou la compilation des ventes, puis testez un flux ciblé pendant 7 jours.",
    },
    {
      question: "L'automatisation remplace-t-elle la validation humaine ?",
      answer:
        "Non. Les flux sont conçus pour préparer, notifier et exécuter les tâches répétitives, tandis que la validation humaine reste prévue pour les décisions sensibles.",
    },
  ];
}

const PERSON = {
  "@type": "Person",
  name: "Yao Alex Mardochée KOFFI",
  url: `${SITE_URL}/a-propos`,
  jobTitle: "Responsable de la Transformation Digitale",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abidjan",
    addressCountry: "CI",
  },
};

const PROFESSIONAL_SERVICE = {
  "@type": "ProfessionalService",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description: "Automatisation de processus et agents IA pour PME à Abidjan, Côte d'Ivoire.",
  telephone: "+2250710073519",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abidjan",
    addressCountry: "CI",
  },
  areaServed: ["Abidjan", "Cocody", "Plateau", "Marcory", "Yopougon", "Abobo", "Riviera", "Angré", "Bingerville"],
  founder: { "@id": `${SITE_URL}/a-propos#alex-mardochee` },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+2250710073519",
    areaServed: "CI",
    availableLanguage: ["fr"],
  },
};

function breadcrumbData(items: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function faqData(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function baseData(title: string, description: string, pathname: string, type: SeoData["type"] = "website"): SeoData {
  const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
  return {
    title,
    description,
    canonical,
    type,
    image: SITE_IMAGE,
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        { ...PROFESSIONAL_SERVICE, "@id": `${SITE_URL}/#business` },
        { ...PERSON, "@id": `${SITE_URL}/a-propos#alex-mardochee` },
      ],
    },
  };
}

export function getSeoForPath(pathname: string): SeoData {
  const cleanPath = pathname.split("?")[0].split("#")[0] || "/";
  const article = BLOG_ARTICLES.find((item) => cleanPath === `/blog/${item.slug}`);

  if (article) {
    const breadcrumbs = breadcrumbData([
      { name: "Accueil", url: `${SITE_URL}/` },
      { name: "Blog", url: `${SITE_URL}/blog` },
      { name: article.title, url: `${SITE_URL}/blog/${article.slug}` },
    ]);
    const modifiedTime = article.dateModified ?? article.datePublished;
    return {
      ...baseData(article.title, article.answer, cleanPath, "article"),
      publishedTime: article.datePublished,
      modifiedTime,
      structuredData: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BlogPosting",
            headline: article.title,
            description: article.answer,
            author: { "@id": `${SITE_URL}/a-propos#alex-mardochee` },
            datePublished: article.datePublished,
            dateModified: modifiedTime,
            image: [SITE_IMAGE],
            inLanguage: "fr-FR",
            mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${article.slug}` },
            articleSection: article.category,
            keywords: article.tags.join(", "),
          },
          breadcrumbs,
          faqData(getArticleFaqs(article)),
        ],
      },
    };
  }

  const pages: Record<string, { title: string; description: string; label: string }> = {
    "/histoires": {
      title: "Histoires clients : automatisation PME à Abidjan | Alex Mardochée",
      description: "Découvrez 10 cas concrets à Abidjan : jusqu'à 15 heures gagnées par semaine, moins d'erreurs et des réponses clients en 3 secondes.",
      label: "Histoires clients",
    },
    "/methode": {
      title: "Méthode d'automatisation IA pour PME à Abidjan | Alex Mardochée",
      description: "Une méthode en 3 étapes pour automatiser un processus PME à Abidjan en 7 jours, le mesurer et garder la main sur chaque flux.",
      label: "Méthode",
    },
    "/services": {
      title: "Services d'automatisation et agents IA à Abidjan | Alex Mardochée",
      description: "Automatisez ventes, stock, WhatsApp, factures et reporting avec des flux IA conçus pour les PME ivoiriennes, dès 7 jours de prototype.",
      label: "Services",
    },
    "/a-propos": {
      title: "À propos d'Alex Mardochée — Automatisation IA à Abidjan",
      description: "Découvrez le parcours de Yao Alex Mardochée KOFFI, comptable et responsable transformation digitale qui accompagne les PME depuis Abidjan.",
      label: "À propos",
    },
    "/contact": {
      title: "Contact — Audit automatisation PME offert à Abidjan | Alex Mardochée",
      description: "Réservez un audit automatisation de 15 minutes à Abidjan sur WhatsApp. Identifions le processus qui vous fait perdre le plus de temps.",
      label: "Contact",
    },
    "/blog": {
      title: "Blog IA, automatisation et PME ivoiriennes | Alex Mardochée",
      description: "Des méthodes concrètes sur l'IA, l'automatisation, SYSCOHADA et la fiscalité ivoirienne pour gagner du temps à Abidjan.",
      label: "Blog",
    },
    "/formations": {
      title: "Formations IA et automatisation pour PME ivoiriennes | Alex Mardochée",
      description: "Apprenez à construire des agents WhatsApp et des automatisations utiles en 6 heures, avec des méthodes adaptées aux entreprises ivoiriennes.",
      label: "Formations",
    },
    "/newsletter": {
      title: "Newsletter IA et automatisation PME à Abidjan | Alex Mardochée",
      description: "Chaque vendredi à 08h, recevez 1 cas concret, 1 outil testé et 1 méthode pour gagner du temps dans votre entreprise ivoirienne.",
      label: "Newsletter",
    },
  };

  const page = pages[cleanPath] ?? {
    title: "Automatisation & IA pour PME à Abidjan | Alex Mardochée",
    description: "J'automatise les commandes, stocks, relances, factures et réponses clients des entreprises ivoiriennes : des heures gagnées, zéro jargon.",
    label: "Accueil",
  };
  const data = baseData(page.title, page.description, cleanPath);
  if (cleanPath === "/") {
    data.structuredData = {
      ...data.structuredData,
      "@graph": [
        ...(data.structuredData["@graph"] as unknown[]),
        faqData(SITE_FAQS),
      ],
    };
  } else {
    data.structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        ...(data.structuredData["@graph"] as unknown[]),
        breadcrumbData([
          { name: "Accueil", url: `${SITE_URL}/` },
          { name: page.label, url: `${SITE_URL}${cleanPath}` },
        ]),
      ],
    };
  }
  return data;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function Seo() {
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;
  const data = getSeoForPath(pathname);

  useEffect(() => {
    document.title = data.title;
    setMeta("name", "description", data.description);
    setMeta("name", "robots", "index, follow, max-image-preview:large");
    setMeta("property", "og:type", data.type);
    setMeta("property", "og:title", data.title);
    setMeta("property", "og:description", data.description);
    setMeta("property", "og:url", data.canonical);
    setMeta("property", "og:image", data.image ?? SITE_IMAGE);
    setMeta("property", "og:locale", "fr_FR");
    setMeta("name", "twitter:card", "summary_large_image");
    if (data.publishedTime) setMeta("property", "article:published_time", data.publishedTime);
    if (data.modifiedTime) setMeta("property", "article:modified_time", data.modifiedTime);

    let canonical = document.head.querySelector<HTMLLinkElement>("link[rel=canonical]");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = data.canonical;

    document.getElementById("seo-jsonld")?.remove();
    const script = document.createElement("script");
    script.id = "seo-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data.structuredData);
    document.head.appendChild(script);
  }, [data]);

  return null;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export function renderSeoHead(pathname: string) {
  const data = getSeoForPath(pathname);
  const meta = [
    `<title>${escapeHtml(data.title)}</title>`,
    `<meta name="description" content="${escapeHtml(data.description)}">`,
    `<link rel="canonical" href="${escapeHtml(data.canonical)}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<meta property="og:type" content="${data.type}">`,
    `<meta property="og:title" content="${escapeHtml(data.title)}">`,
    `<meta property="og:description" content="${escapeHtml(data.description)}">`,
    `<meta property="og:url" content="${escapeHtml(data.canonical)}">`,
    `<meta property="og:image" content="${escapeHtml(data.image ?? SITE_IMAGE)}">`,
    `<meta property="og:locale" content="fr_FR">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ];
  if (data.publishedTime) meta.push(`<meta property="article:published_time" content="${data.publishedTime}">`);
  if (data.modifiedTime) meta.push(`<meta property="article:modified_time" content="${data.modifiedTime}">`);
  meta.push(`<script id="seo-jsonld" type="application/ld+json">${JSON.stringify(data.structuredData).replace(/</g, "\\u003c")}</script>`);
  return meta.join("\n    ");
}
