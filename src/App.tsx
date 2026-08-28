import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { trackEvent } from "./components/Analytics";
import { SITE_FAQS } from "./seo";

/* ================================================================
   ALEX MARDOCHÉE — Automatisation & IA pour les entreprises d'Abidjan
   Structure : Hero → Mini-histoires → Méthode → Services → Conversion
   ================================================================ */

/* ------------------------- Intégrations ------------------------- */
const WA_DISPLAY = "+225 07 10 07 35 19";
const WA_MESSAGE =
  "Bonjour Alex, j'ai vu ton site. Je perds trop de temps sur [Tâche X]. Montre-moi comment l'IA peut tuer ce problème.";
const WA_LINK = `https://wa.me/2250710073519?text=${encodeURIComponent(WA_MESSAGE)}`;
const CONTACT_EMAIL = "alexmardochee0@gmail.com";
/* Widget inline public — aucune authentification requise côté client.
   (Ne jamais exposer de Personal Access Token dans ce fichier.) */
const CALENDLY_EMBED =
  "https://calendly.com/alexmardochee0/30min?hide_gdpr_banner=1&hide_landing_page_details=1" +
  /* Thème officiel Calendly — aligné sur la palette du site */
  "&background_color=0a0a0a&text_color=f5f3ef&primary_color=e4d9be";

/* Endpoint serveur optionnel pour le contact ; mailto utilisé en local. */
const FORM_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? "";

const HERO_STAGES = ["golden-hour", "sunset", "night"] as const;

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------- Hooks ------------------------- */
function useParticles() {
  return useMemo(
    () =>
      Array.from({ length: 32 }, () => {
        const size = (Math.random() * 3 + 1.5).toFixed(2);
        return {
          width: `${size}px`,
          height: `${size}px`,
          left: `${(Math.random() * 100).toFixed(2)}%`,
          opacity: (Math.random() * 0.5 + 0.2).toFixed(2),
          animationDuration: `${(Math.random() * 14 + 9).toFixed(2)}s`,
          animationDelay: `${(-Math.random() * 23).toFixed(2)}s`,
        };
      }),
    []
  );
}

/* ------------------------- Icônes (SVG inline) ------------------------- */
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3.5a8.5 8.5 0 0 0-7.31 12.83L3.5 20.5l4.29-1.12A8.5 8.5 0 1 0 12 3.5Z" />
    <path d="M9.1 8.6c-.35 1.7.45 3.5 1.8 4.85 1.35 1.35 3.15 2.15 4.85 1.8l.6-1.55-2.05-1.05-.8.65a5.6 5.6 0 0 1-2.3-2.3l.65-.8-1.05-2.05-1.7.5Z" fill="currentColor" stroke="none" />
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 12.5l5 5L19.5 7" />
  </svg>
);

const IconChat = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
  </svg>
);

const IconBolt = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
);

const IconDb = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
    <path d="M5 5.5v13c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-13" />
    <path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" />
  </svg>
);

const IconBell = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

/* ------------------------- Données ------------------------- */
const STORIES = [
  {
    name: "Adjoua",
    role: "Gérante de bijouterie",
    place: "3 magasins · Cocody, Plateau, Marcory",
    shortPlace: "Bijouterie, 3 magasins",
    cat: "commerce" as const,
    quote:
      "Avant, chaque soir, je passais 1 h 30 à compiler les ventes de mes 3 boutiques. Maintenant un agent IA récupère les données, sort le stock critique et m'envoie le récap à 20 h.",
    num: "+10h",
    lbl: "gagnées chaque semaine",
  },
  {
    name: "Koffi",
    role: "Agent immobilier",
    place: "Angré",
    shortPlace: "Agent immobilier",
    cat: "immobilier" as const,
    quote:
      "Quinze appels par jour pour savoir si un bien était encore dispo. Aujourd'hui un bot WhatsApp répond en 3 secondes, envoie les photos et ne me dérange que pour les vraies visites.",
    num: "2x",
    lbl: "plus de visites en 6 semaines",
  },
  {
    name: "Yedo",
    role: "Restaurant / traiteur",
    place: "Riviera",
    shortPlace: "Restaurant, traiteur",
    cat: "restauration" as const,
    quote:
      "Les commandes WhatsApp arrivaient en désordre, on oubliait des plats, on perdait de l'argent. Maintenant tout est fluide : commande → confirmation → cuisine → livraison, avec alerte stock.",
    num: "-90%",
    lbl: "d'erreurs de commande",
  },
  {
    name: "Aminata",
    role: "Assistante comptable",
    place: "Cocody",
    shortPlace: "Assistante comptable",
    cat: "services" as const,
    quote:
      "Chaque fin de mois, c'était la guerre pour sortir les états. Alex a mis en place un flux qui lit les factures, classe tout et prépare déjà 80 % des écritures.",
    num: "−4 j",
    lbl: "sur la clôture mensuelle",
  },
  {
    name: "Bakary",
    role: "Directeur d'école primaire",
    place: "Yopougon",
    shortPlace: "École primaire",
    cat: "services" as const,
    quote:
      "Les parents appelaient sans arrêt pour les notes, les absences, les frais. Un agent IA répond maintenant 24 h/24 et envoie les rappels de paiement tout seul.",
    num: "24/7",
    lbl: "les parents gérés — lui, enfin concentré sur les enfants",
  },
  {
    name: "Aya",
    role: "Dépôt de boissons / gros",
    place: "Abobo",
    shortPlace: "Dépôt de boissons",
    cat: "commerce" as const,
    quote:
      "Le stock n'était jamais clair, les ruptures toujours surprises. Maintenant chaque vente met à jour le stock en temps réel, et l'IA m'alerte 3 jours avant la rupture.",
    num: "0",
    lbl: "rupture surprise — fini les « désolé, on n'a plus »",
  },
  {
    name: "Fatou",
    role: "Salon de beauté",
    place: "Deux-Plateaux",
    shortPlace: "Salon de beauté",
    cat: "services" as const,
    quote:
      "Les clientes réservaient puis oubliaient. Aujourd'hui le bot gère les rendez-vous et envoie un rappel 2 h avant. Mon agenda est plein, je ne perds plus de temps au téléphone.",
    num: "0",
    lbl: "no-show grâce aux rappels — agenda plein",
  },
  {
    name: "Kouassi",
    role: "Chef de chantier BTP",
    place: "Bingerville",
    shortPlace: "Chef de chantier",
    cat: "services" as const,
    quote:
      "Photos, rapports journaliers, demandes de matériel… tout partait dans tous les sens sur WhatsApp. Un workflow centralise tout et me sort un rapport clair chaque soir.",
    num: "1",
    lbl: "rapport clair par soir — promoteur content",
  },
  {
    name: "Dr. Yao",
    role: "Cabinet médical",
    place: "Cocody",
    shortPlace: "Cabinet médical",
    cat: "services" as const,
    quote:
      "Les patients appelaient sans cesse pour les disponibilités. Un assistant IA gère les rendez-vous et les rappels, et ne me remonte que les urgences.",
    num: "+1 h 30",
    lbl: "récupérées chaque jour",
  },
  {
    name: "Mariame",
    role: "Société de nettoyage",
    place: "Marcory",
    shortPlace: "Société de nettoyage",
    cat: "services" as const,
    quote:
      "28 agents sur le terrain, suivre les présences, les absences, les congés… un cauchemar. Aujourd'hui ils pointent sur WhatsApp, le système calcule et m'alerte.",
    num: "28",
    lbl: "agents suivis — sans courir après personne",
  },
];

const STORY_CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "commerce", label: "Commerce" },
  { id: "immobilier", label: "Immobilier" },
  { id: "restauration", label: "Restauration" },
  { id: "services", label: "Services" },
] as const;

function splitAvantApres(quote: string): { avant: string; apres: string } {
  const markers = ["Maintenant", "Aujourd'hui", "Aujourd’hui"];
  for (const m of markers) {
    const idx = quote.indexOf(m);
    if (idx > 10) {
      const avant = quote.slice(0, idx).replace(/^\s*Avant,?\s*—?\s*/i, "").replace(/\s+$/, "");
      const apres = quote.slice(idx).replace(/\s+$/, "");
      return { avant: avant.charAt(0).toUpperCase() + avant.slice(1), apres };
    }
  }
  const mid = Math.floor(quote.length / 2);
  const cut = quote.lastIndexOf(".", mid);
  const splitAt = cut > 20 ? cut + 1 : mid;
  return { avant: quote.slice(0, splitAt).trim(), apres: quote.slice(splitAt).trim() };
}

const MARQUEE = [
  { name: "Adjoua · bijouterie", res: "+10 h/semaine" },
  { name: "Koffi · immobilier", res: "2× plus de visites" },
  { name: "Yedo · restaurant", res: "−90 % d'erreurs" },
  { name: "Aminata · compta", res: "clôture −4 jours" },
  { name: "Bakary · école", res: "parents gérés 24/7" },
  { name: "Aya · dépôt", res: "0 rupture surprise" },
];

const FLOW = [
  {
    icon: <IconChat />,
    title: "Client sur WhatsApp",
    desc: "Il écrit, comme d'habitude.",
    chip: "3 s chrono",
  },
  {
    icon: <IconBolt />,
    title: "Agent IA & Traitement",
    desc: "Comprend, répond et envoie les infos précises.",
    chip: "IA Métier",
  },
  {
    icon: <IconDb />,
    title: "Stock · Caisse · Sheets",
    desc: "Tout se met à jour en temps réel et sans erreur.",
    chip: "Synchro auto",
  },
  {
    icon: <IconBell />,
    title: "Rapport de clôture",
    desc: "Le récap du jour directement sur votre téléphone.",
    chip: "Chaque soir",
  },
];

const CHECKS = [
  <>Répondre à vos clients sur WhatsApp en <b>3 secondes</b>, jour et nuit.</>,
  <>Mettre à jour <b>stock et caisse</b> sans aucune saisie manuelle.</>,
  <>Lire vos factures et préparer <b>80 % des écritures</b> comptables.</>,
  <>Vous envoyer un <b>rapport clair</b> chaque soir, sur votre téléphone.</>,
];

const FEATURES = [
  {
    badge: "Chat IA",
    title: "Conversations naturelles,\nen temps réel",
    desc: "Kacy répond comme un membre de votre équipe : commandes, réservations, questions — en français comme en nouchi, 24/7.",
  },
  {
    badge: "Cerveau central",
    title: "Un seul cerveau,\ntous vos canaux",
    desc: "Vos clients écrivent là où ils sont déjà. Kacy centralise les messages, les commandes et les paiements.",
  },
];

const SERVICES = [
  {
    num: "01",
    cat: "Automatisation & Gain de Temps",
    title: "Zéro Tâche Répétitive",
    desc: "Ne perdez plus des heures à faire les choses à la main. L'IA s'occupe de vos suivis, de vos messages et de vos classements en arrière-plan pendant que vous vous concentrez sur votre cœur de métier.",
    benefit: "Un gain de temps massif et zéro erreur de saisie.",
  },
  {
    num: "02",
    cat: "Ventes & Relation Client",
    title: "Des Ventes Assurées 24h/24",
    desc: "Ne ratez plus jamais un client. Vos outils répondent instantanément aux messages, conseillent vos visiteurs et enregistrent les demandes, même en dehors de vos horaires de travail.",
    benefit: "Un taux de vente maximisé et des clients toujours satisfaits.",
  },
  {
    num: "03",
    cat: "Pilotage & Visibilité",
    title: "Pilotage Clair et Sans Prise de Tête",
    desc: "Pilotez votre activité avec une vision nette. Fini le pilotage à l'aveugle : l'IA analyse vos chiffres et vos performances pour vous dire clairement ce qui marche et où agir.",
    benefit: "Des décisions rapides et éclairées, sans jargon incompréhensible.",
  },
  {
    num: "04",
    cat: "Solutions Adaptées",
    title: "Des Outils Façonnés pour Vous",
    desc: "Une technologie qui s'adapte à votre réalité. Que vous gériez un commerce, un service ou une entreprise, nous concevons l'outil IA simple et direct qui correspond exactement à votre façon de travailler.",
    benefit: "Une solution sur mesure qui grandit avec votre activité.",
  },
];

const PROJECTS = [
  {
    name: "AXDress",
    subtitle: "La couture sur-mesure africaine à portée de main",
    image: "/axdress.png",
    vitrine: "AXDress est une application mobile qui connecte les amateurs de mode africaine aux meilleurs couturiers d'Abidjan. Wax, bogolan, bazin : trouvez l'artisan vérifié près de chez vous, enregistrez vos mesures, explorez un catalogue de +120 modèles et suivez votre commande en temps réel. Essayez même vos vêtements virtuellement grâce à l'IA. Paiement sécurisé via Mobile Money, livraison incluse. +150 bêta-testeurs lui font déjà confiance.",
    features: ["Couturiers vérifiés · identité & atelier", "Carnet de mesures personnel", "Géolocalisation ateliers proches", "Catalogue +120 modèles", "Paiement Mobile Money sécurisé", "Suivi temps réel + essai virtuel IA"],
    stats: "4.9/5 · +150 bêta-testeurs",
    tech: "Mobile App · IA · Géolocalisation · Mobile Money",
  },
  {
    name: "RH Flow",
    subtitle: "La solution RH 100% ivoirienne",
    image: "/rhflow.png",
    vitrine: "RH Flow est la solution RH 100% ivoirienne conçue par DC-KNOWING. Elle centralise et automatise l'ensemble de la gestion du personnel : contrats, dossiers, affectations, paie et déclarations fiscales (CNPS). Chaque collaborateur dispose d'un espace individuel pour suivre son historique, ses entretiens et ses objectifs. Finies les feuilles Excel : RH Flow digitalise toute la chaîne RH pour plus d'efficacité et de conformité.",
    features: ["Contrats & dossiers centralisés", "Paie & déclarations CNPS automatisées", "Espace collaborateur individuel", "Demandes & validations temps réel"],
    stats: "Web + Mobile · DC-KNOWING",
    tech: "Web App · Mobile App · Automatisation · Paie",
  },
  {
    name: "Koraline AI",
    subtitle: "L'analyse intelligente de factures",
    image: "/koraline.png",
    vitrine: "Fini la saisie manuelle des factures. Koraline AI analyse automatiquement vos factures grâce à l'OCR et à l'IA (Némotron-3-Nano-Omni-30B). Déposez vos documents (PDF, PNG, JPG, WebP, HEIC — 30 Mo max) et l'IA extrait montant, TVA, date, fournisseur. Tri par statut et date, suivi des analyses. Un gain de temps considérable né de ma conviction que même depuis l'Afrique, on peut bâtir des systèmes aussi efficaces que ceux de l'Occident.",
    features: ["Dépôt multi-formats 30 Mo", "OCR + Némotron-3-Nano-Omni-30B", "Tri par statut & date", "Suivi des analyses"],
    stats: "OCR · Temps réel",
    tech: "IA · OCR · Automatisation comptable",
  },
];

/* ================================================================ */

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const particles = useParticles();

  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [sentTo, setSentTo] = useState("");
  const [heroStage, setHeroStage] = useState({ index: 0, direction: 1 });
  const [storyFilter, setStoryFilter] = useState<(typeof STORY_CATEGORIES)[number]["id"]>("all");
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set());

  /* Révélation de la page */
  useEffect(() => {
    document.body.classList.add("loaded");
    return () => document.body.classList.remove("loaded");
  }, []);

  /* Reveal au scroll — les blocs apparaissent un par un */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    if (reducedMotion()) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Parallaxe 3D du hero : mouvement local, lissé et borné dans le hero */
  useEffect(() => {
    if (reducedMotion()) return;
    const hero = heroRef.current;
    const layers = Array.from(
      hero?.querySelectorAll<HTMLElement>(".image-depth") ?? []
    );
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      tx = x - 0.5;
      ty = y - 0.5;
    };
    const loop = () => {
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;
      layers.forEach((d) => {
        const dp = Number(d.dataset.depth) || 0;
        const r = Number(d.dataset.rotate) || 0;
        d.style.transform =
          `translate3d(${(cx * dp).toFixed(2)}px, ${(cy * dp).toFixed(2)}px, 0) ` +
          `rotateY(${(cx * r).toFixed(3)}deg) rotateX(${(-cy * r).toFixed(3)}deg)`;
      });
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Cycle jour → nuit → jour : un seul fondu croisé toutes les 3 secondes */
  useEffect(() => {
    if (reducedMotion()) return;
    const lastStage = HERO_STAGES.length - 1;
    const timer = window.setInterval(() => {
      setHeroStage((current) => {
        const direction =
          current.index === lastStage ? -1 : current.index === 0 ? 1 : current.direction;
        return { index: current.index + direction, direction };
      });
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  /* Formulaire de contact — endpoint serveur en production, mailto en local */
  const onContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (String(data.get("website") ?? "").trim()) {
      form.reset();
      setContactStatus("ok");
      return;
    }
    const email = String(data.get("email") ?? "").trim();
    trackEvent("submit_form", { form_name: "contact" });
    setContactStatus("sending");
    const finish = () => {
      setSentTo(email);
      setContactStatus("ok");
      form.reset();
    };
    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Contact endpoint failed");
          finish();
        })
        .catch(() => setContactStatus("error"));
    } else {
      const subject = encodeURIComponent("Projet d'automatisation PME");
      const body = encodeURIComponent(
        `Nom : ${data.get("nom") ?? ""}\nEmail : ${email}\nTâche : ${data.get("tache") ?? ""}\n\n${data.get("message") ?? ""}`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      finish();
    }
  };

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-grade" aria-hidden="true" />

        <div className="depth image-depth" data-depth="-26" data-rotate="5.4" aria-hidden="true">
          {HERO_STAGES.map((stage, index) => (
            <div
              key={stage}
              className={`bg bg-stage bg-${stage}`}
              style={{
                opacity: heroStage.index === index ? 1 : 0,
                zIndex: heroStage.index === index ? 2 : 1,
              }}
            />
          ))}
        </div>

        <div className="depth fx" aria-hidden="true">
          <div className="glow" />
          <div className="sweep" />
          <div className="particles">
            {particles.map((s, i) => (
              <span key={i} style={s} />
            ))}
          </div>
        </div>

        <div className="depth hud">
          <div className="copy">
            <span className="badge reveal" style={{ ["--d" as string]: ".1s" }}>
              <i />
              <b>Abidjan — Côte d'Ivoire</b> · Automatisation &amp; IA pour PME
            </span>
            <h1 className="reveal" style={{ ["--d" as string]: ".25s" }}>
              Faites travailler l'intelligence artificielle dans{" "}
              <span className="hl">votre business.</span>
            </h1>
            <p className="sub reveal" style={{ ["--d" as string]: ".4s" }}>
              J'automatise les vrais problèmes des entreprises ivoiriennes :
              commandes, stock, relances, factures, réponses clients.{" "}
              <strong>Des heures gagnées, des erreurs en moins, des ventes en
              plus.</strong> Du concret, zéro jargon.
            </p>
            <div className="ctas reveal" style={{ ["--d" as string]: ".55s" }}>
              <a className="btn primary" href={WA_LINK} target="_blank" rel="noreferrer" data-cta="hero_whatsapp">
                Je veux du concret
              </a>
              <a className="btn glass" href="#preuves">
                Voir les histoires
              </a>
            </div>
          </div>
        </div>

        <div className="foot">
          <div className="builds">
            <i />
            Legal Flow · Koraline · Suite Flow · RH FLOW — l'écosystème FLOW en
            construction à Abidjan
          </div>
          <div className="scroll-hint" aria-hidden="true">
            Scroll
            <span className="line" />
          </div>
        </div>
      </section>

      {/* ------------------------------ MINI-HISTOIRES ------------------------------ */}
      <section className="section" id="preuves">
        <div className="sec-head rv">
          <div>
            <span className="eyebrow">— 01 — ILS L'ONT FAIT</span>
            <h2 className="sec-title">
              Voici ce que l'automatisation a déjà changé, pour des gens comme vous.
            </h2>
          </div>
          <p className="sec-note">
            Dix métiers, dix situations ultra-concrètes. Avant / après, avec le résultat en face. Vous allez vous reconnaître.
          </p>
        </div>

        {/* Filtres */}
        <div className="story-filters" role="tablist" aria-label="Filtrer par métier">
          {STORY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${storyFilter === cat.id ? "active" : ""}`}
              data-cat={cat.id}
              aria-pressed={storyFilter === cat.id}
              onClick={() => setStoryFilter(cat.id)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="tgrid">
          {(storyFilter === "all" ? STORIES : STORIES.filter((s) => s.cat === storyFilter)).map((s) => {
            const expanded = expandedStories.has(s.name);
            const { avant, apres } = splitAvantApres(s.quote);
            return (
              <div
                key={s.name}
                className={`tcard ${expanded ? "expanded" : ""}`}
                data-cat={s.cat}
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                onClick={() => {
                  setExpandedStories((prev) => {
                    const n = new Set(prev);
                    if (n.has(s.name)) n.delete(s.name);
                    else n.add(s.name);
                    return n;
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpandedStories((prev) => {
                      const n = new Set(prev);
                      if (n.has(s.name)) n.delete(s.name);
                      else n.add(s.name);
                      return n;
                    });
                  }
                }}
              >
                <div className="tcard-head">
                  <div className="tcard-avatar" aria-hidden="true">
                    {s.name.replace("Dr. ", "").charAt(0)}
                  </div>
                  <div className="tcard-id">
                    <p className="tcard-name">{s.name}</p>
                    <p className="tcard-place">{s.shortPlace}</p>
                  </div>
                </div>
                <div className="tcard-stat">{s.num}</div>
                <div className="tcard-lbl">{s.lbl}</div>
                <div className="tcard-detail" style={{ display: expanded ? "block" : "none" }}>
                  <p>
                    <span className="tcard-aa">Avant —</span> {avant}
                  </p>
                  <p>
                    <span className="tcard-aa">Après —</span> {apres}
                  </p>
                </div>
                <div className="tcard-toggle">
                  <span className="toggle-label">{expanded ? "réduire" : "avant / après"}</span>
                  <span className="toggle-icon" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} aria-hidden="true">
                    ⌄
                  </span>
                </div>
              </div>
            );
          })}
          {storyFilter === "all" && (
            <div className="ghost-tile" aria-hidden="true">
              <span className="ghost-plus">+</span>
              <p>5 autres témoignages</p>
            </div>
          )}
        </div>
        <p className="stories-disclaimer rv">
          Cas d'usage réels et scénarios d'automatisation déployés pour des PME à Abidjan.
        </p>
      </section>

      {/* ------------------------------ MARQUEE ------------------------------ */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: "contents" }}>
              {MARQUEE.map((m, i) => (
                <span key={`${dup}-${i}`} className={i % 2 === 1 ? "o" : ""}>
                  {m.name} <em>→</em> {m.res} <em>◆</em>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------ FEATURES — L'IA QUI TRAVAILLE ------------------------------ */}
      <section className="section features-new" id="features">
        <div className="features-new-head rv">
          <h2 className="sec-title">L'IA qui travaille vraiment pour vous</h2>
          <p className="sec-note">Des solutions concrètes pour optimiser chaque aspect de votre entreprise.</p>
        </div>

        <div className="features-two-col">
          {/* Bloc gauche — Chat IA */}
          <article className="feature-big-card rv" style={{ ["--d" as string]: "0.06s" }}>
            <span className="feature-pill"><i className="fp-icon" aria-hidden="true">⌖</i> {FEATURES[0].badge}</span>
            <h3 className="feature-big-title">{FEATURES[0].title.split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}</h3>
            <p className="feature-big-desc">{FEATURES[0].desc}</p>
            <div className="chat-mock">
              <div className="chat-bubble client rv" style={{ ["--d" as string]: "0.2s" }}>Une table pour 4 samedi<br />vers 20h ?</div>
              <div className="chat-line ai-row rv" style={{ ["--d" as string]: "0.35s" }}>
                <span className="chat-avatar">A</span>
                <span className="chat-bubble ai">C'est noté !</span>
              </div>
              <div className="typing-dots rv" style={{ ["--d" as string]: "0.28s" }} aria-hidden="true"><span /><span /><span /></div>
            </div>
          </article>

          {/* Bloc droit — Cerveau central */}
          <article className="feature-big-card rv" style={{ ["--d" as string]: "0.14s" }}>
            <span className="feature-pill"><i className="fp-icon" aria-hidden="true">◎</i> {FEATURES[1].badge}</span>
            <h3 className="feature-big-title">{FEATURES[1].title.split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}</h3>
            <p className="feature-big-desc">{FEATURES[1].desc}</p>
            <div className="brain-orbit" aria-hidden="true">
              <div className="orbit-ring ring-1" />
              <div className="orbit-ring ring-2" />
              <div className="orbit-center">A</div>
              <span className="orbit-icon oi-whatsapp" style={{ ["--i" as string]: "0", ["--start" as string]: "-90deg" }}>
                <img src="/whatsapp.jpg" alt="" width={24} height={24} />
              </span>
              <span className="orbit-icon oi-email" style={{ ["--i" as string]: "1", ["--start" as string]: "-18deg" }}>
                <img src="/gmail.png" alt="" width={24} height={24} />
              </span>
              <span className="orbit-icon oi-telegram" style={{ ["--i" as string]: "2", ["--start" as string]: "54deg" }}>
                <img src="/telegram.png" alt="" width={24} height={24} />
              </span>
              <span className="orbit-icon oi-instagram" style={{ ["--i" as string]: "3", ["--start" as string]: "126deg" }}>
                <img src="/instagram.jpg" alt="" width={24} height={24} />
              </span>
              <span className="orbit-icon oi-messenger" style={{ ["--i" as string]: "4", ["--start" as string]: "198deg" }}>
                <img src="/facebook ( a utiliser à la place de messanger ).png" alt="" width={24} height={24} />
              </span>
            </div>
          </article>
        </div>

        {/* Bloc bas — mise en situation d'une orchestration multi-agents */}
        <article className="feature-orchestra-card rv" style={{ ["--d" as string]: "0.22s" }}>
          <div className="orchestra-copy">
            <div>
              <span className="feature-pill hermes-pill">
                <img className="hermes-mark" src="/Hermes Agent Logo - Black - zonalogo.com.svg" alt="" width={20} height={20} />
                Hermes Agent
              </span>
              <h3 className="feature-big-title">Trois IA qui travaillent ensemble</h3>
              <p className="feature-big-desc">Hermes récupère un fichier, lance l'analyse et consulte le web en parallèle avant de vous remettre un brief clair.</p>
            </div>
            <span className="orchestra-live"><i /> Processus en cours</span>
          </div>

          <div className="orchestra-stage" aria-label="Simulation d'un fichier traité par trois agents IA">
            <div className="orchestra-panel orchestra-source">
              <span className="orchestra-step">01 · Récupération</span>
              <div className="orchestra-file">
                <span className="file-type">PDF</span>
                <span className="file-copy"><strong>rapport_ventes.pdf</strong><small>Fichier récupéré</small></span>
                <span className="node-check">✓</span>
              </div>
              <span className="orchestra-caption">Hermes a trouvé le document.</span>
            </div>

            <div className="orchestra-bridge bridge-in" aria-hidden="true"><span /></div>

            <div className="orchestra-core">
              <div className="orchestra-core-head">
                <span className="orchestra-step">02 · Travail en parallèle</span>
                <span className="agent-count"><i /> 3 agents actifs</span>
              </div>
              <div className="agent-grid">
                <div className="orchestra-agent agent-hermes">
                  <span className="agent-logo"><img src="/Hermes Agent Logo - Black - zonalogo.com.svg" alt="" width={28} height={28} /></span>
                  <strong>Hermes</strong>
                  <small>coordonne</small>
                  <span className="agent-state">actif</span>
                </div>
                <div className="orchestra-agent agent-chatgpt">
                  <span className="agent-logo"><img src="/chatgptai.png" alt="" width={28} height={28} /></span>
                  <strong>ChatGPT</strong>
                  <small>analyse le fichier</small>
                  <span className="agent-state">analyse</span>
                </div>
                <div className="orchestra-agent agent-claude">
                  <span className="agent-logo"><img src="/claudeai.png" alt="" width={28} height={28} /></span>
                  <strong>Claude</strong>
                  <small>recherche en ligne</small>
                  <span className="agent-state">recherche</span>
                </div>
              </div>
              <div className="agent-progress" aria-hidden="true"><span /><span /><span /><em>les agents se répondent</em></div>
            </div>

            <div className="orchestra-bridge bridge-out" aria-hidden="true"><span /></div>

            <div className="orchestra-panel orchestra-result">
              <span className="orchestra-step">03 · Synthèse</span>
              <div className="result-icon">✦</div>
              <strong>Brief prêt à lire</strong>
              <span className="result-lines" aria-hidden="true"><i /><i /><i /></span>
              <span className="orchestra-caption">Une réponse claire, sans aller-retour.</span>
            </div>
          </div>
        </article>
      </section>

      {/* ------------------------------ MÉTHODE (workflow) — conservée ------------------------------ */}
      <section className="section" id="methode">
        <div className="sec-head rv">
          <div>
            <span className="eyebrow">02 — Comment ça marche, en pratique</span>
            <h2 className="sec-title">
              Le circuit exact d'une journée automatisée.{" "}
              <span className="it">Sans jargon.</span>
            </h2>
          </div>
          <p className="sec-note">
            Voici un workflow réel — du message du client au récap du soir — et l'interface qui le pilote. Tout est visible, tout est à vous.
          </p>
        </div>
        <div className="win flow-full rv" style={{ ["--d" as string]: ".08s" }}>
          <div className="win-bar">
            <i /><i /><i />
            <span className="win-title">Votre processus métier — Automatisé</span>
            <span className="win-chip">En production</span>
          </div>
          <div className="flow-canvas">
            <div className="flow-nodes">
              {FLOW.map((f) => (
                <div className="flow-node" key={f.title}>
                  <span className="dot">{f.icon}</span>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                  <span className="chip-mini">{f.chip}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flow-caption">
            <span><b>Extrait réel</b> — le flux qui gère commandes et stock d'un dépôt à Abobo. Il tourne depuis 4 mois, sans intervention.</span>
            <span className="flow-tech">Make / n8n · GPT-4o / Claude</span>
          </div>
        </div>
        <div className="method-details">
          <div className="win rv" style={{ ["--d" as string]: ".12s" }}>
            <div className="win-bar">
              <i /><i /><i />
              <span className="win-title">Playground — OpenAI</span>
              <span className="win-chip">Agent client</span>
            </div>
            <div className="mock-body">
              <span className="mock-label">System prompt</span>
              <p className="mock-sys">
                <b>« Tu es Koraline, assistante commerciale de Koffi Immobilier (Angré).</b> Réponds en français, en 2–3 phrases max. Tu connais les biens disponibles en temps réel via l'outil stock_biens… »
              </p>
              <span className="mock-label">Conversation</span>
              <div className="mock-chat">
                <p className="mock-line user">Le 3 pièces à Angré est toujours dispo ?</p>
                <p className="mock-line ai">Oui 👌 Je vous envoie les photos. Visite possible demain — 10 h ou 16 h ?<span className="mock-cursor" /></p>
              </div>
              <div className="mock-foot">
                <span>Modèle — <b>gpt-4o</b></span>
                <span>Temp — <b>0.4</b></span>
                <span><b>1 284</b> tokens</span>
              </div>
            </div>
          </div>
          <div className="win checks-card rv" style={{ ["--d" as string]: ".18s" }}>
            <div className="win-bar">
              <i /><i /><i />
              <span className="win-title">Bénéfices directs</span>
              <span className="win-chip">Sans boîte noire</span>
            </div>
            <div className="checks-content">
              <h3>Concrètement, ça fait quoi ?</h3>
              <ul className="checks">
                {CHECKS.map((c, i) => (
                  <li key={i}>
                    <IconCheck />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <p className="checks-foot">Chaque brique est <b>visible et modifiable</b>. Rien n'est caché dans une boîte noire — vous gardez la main sur tout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ SERVICES ------------------------------ */}
      <section className="section" id="services">
        <div className="sec-head rv">
          <div>
            <span className="eyebrow">03 — Services</span>
            <h2 className="sec-title">
              Quatre façons de récupérer votre temps et votre argent.
            </h2>
          </div>
          <p className="sec-note">
            Une liste simple, sans piège. On commence petit, on mesure, on étend. Chaque mission part de vos process — pas l'inverse.
          </p>
        </div>

        <div className="svc-list">
          {SERVICES.map((s, i) => (
            <a
              className="svc svc-detailed rv"
              href="#contact"
              key={s.num}
              style={{ ["--d" as string]: `${i * 0.07}s` }}
            >
              <span className="svc-num">{s.num}</span>
              <span className="svc-body">
                <span className="svc-cat">{s.cat}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="svc-benefit"><i aria-hidden="true">→</i> {s.benefit}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ------------------------------ MES PROJETS ------------------------------ */}
      <section className="section projects-section" id="projets">
        <div className="sec-head rv">
          <div>
            <span className="eyebrow">— 04 — MES PROJETS</span>
            <h2 className="sec-title">Trois projets qui incarnent ma vision :<br /><span className="it">utile, local, ambitieux.</span></h2>
          </div>
          <p className="sec-note">De la couture à la paie en passant par la compta : des outils pensés à Abidjan, pour l’Afrique — et construits pour durer.</p>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <article key={p.name} className="project-card rv" style={{ ["--d" as string]: `${i * 0.1}s` }}>
              <div className="project-cover">
                <img src={p.image} alt={`Aperçu ${p.name}`} loading="lazy" />
                <span className="project-stats">{p.stats}</span>
              </div>
              <div className="project-body">
                <span className="project-tech">{p.tech}</span>
                <h3>{p.name}</h3>
                <p className="project-sub">{p.subtitle}</p>
                <p className="project-desc">{p.vitrine}</p>
                <ul className="project-features">
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------ À PROPOS ------------------------------ */}
      <section className="section" id="a-propos">
        <div className="home-about-summary rv">
          <span className="eyebrow">— 05 — LE BUILDER</span>
          <h2 className="sec-title">
            Comptable de formation. Architecte IA par obsession.
          </h2>
          <p className="home-about-text">J'ai vu, de l'intérieur, ce que les tâches répétitives font à une entreprise. Des journées entières perdues. Des erreurs humaines à 600 000 FCFA. Aujourd'hui, je ne théorise pas l'IA : je la déploie chez vous pour éliminer le travail manuel administratif.</p>
          <Link className="btn primary" to="/a-propos">Lire mon histoire <IconArrow /></Link>
        </div>
      </section>

      {/* ------------------------------ CONVERSION ------------------------------ */}
      <section className="section contact" id="contact">
        <div className="rv">
          <span className="eyebrow">06 — On y va ?</span>
        </div>
        <h2 className="contact-giant rv" style={{ ["--d" as string]: ".08s" }}>
          Discutons de vos besoins en automatisation<span className="dot">.</span>
        </h2>
        <p className="contact-sub rv" style={{ ["--d" as string]: ".16s" }}>
          15 à 30 minutes d'échange sans engagement pour analyser vos goulots d'étranglement et voir si un accompagnement est pertinent.
        </p>
        <p className="contact-reassurance rv" style={{ ["--d" as string]: ".18s" }}>
          Pas de blabla théorique. Un échange direct pour évaluer votre ROI potentiel.
        </p>

        <div className="contact-grid">
          <div className="contact-col">
            {/* WhatsApp — priorité visuelle */}
            <div className="wa-card rv" style={{ ["--d" as string]: ".1s" }}>
              <div className="wa-top">
                <span className="wa-ic">
                  <IconWhatsApp />
                </span>
                <div>
                  <span className="card-kicker">Le plus rapide</span>
                  <h3>
                    WhatsApp <span>direct</span>
                  </h3>
                </div>
                <span className="chip">Réponse sous 24 h</span>
              </div>
              <p className="wa-num">{WA_DISPLAY}</p>
              <a className="btn primary" href={WA_LINK} target="_blank" rel="noreferrer" data-cta="contact_whatsapp">
                Écrire sur WhatsApp <IconArrow />
              </a>
              <p className="wa-note">
                Le message est pré-rempli — remplacez juste [Tâche X] par la
                vôtre, et envoyez. On regarde ensemble ce que vous y gagnez.
              </p>
            </div>

            {/* Formulaire email */}
            <form
              className="form-card rv"
              style={{ ["--d" as string]: ".18s" }}
              onSubmit={onContactSubmit}
            >
              <span className="card-kicker">
                Ou par email —{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </span>
              <div className="f-grid">
                <label className="field">
                  <span>Nom *</span>
                  <input name="nom" required placeholder="Votre nom" autoComplete="name" />
                </label>
                <label className="field">
                  <span>Email *</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="vous@entreprise.ci"
                    autoComplete="email"
                  />
                </label>
              </div>
              <label className="field">
                <span>Tâche à automatiser</span>
                <input
                  name="tache"
                  placeholder="Ex : facturation, réponses clients, stock, reporting…"
                />
              </label>
              <label className="field">
                <span>Message *</span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Dites-moi où vous perdez du temps…"
                />
              </label>
              {/* Honeypot anti-spam */}
              <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button
                className="btn primary"
                type="submit"
                disabled={contactStatus === "sending"}
              >
                {contactStatus === "sending" ? (
                  "Envoi en cours…"
                ) : (
                  <>
                    Envoyer <IconArrow />
                  </>
                )}
              </button>
              {contactStatus === "ok" && (
                <p className="form-ok" role="status">
                  <IconCheck />
                  <span>
                    Votre message est prêt — je vous réponds sous 24 h
                    {sentTo ? ` à ${sentTo}` : ""}.
                  </span>
                </p>
              )}
              {contactStatus === "error" && (
                <p className="news-error" role="alert">
                  L'envoi a échoué. Vérifiez votre connexion ou écrivez directement à {CONTACT_EMAIL}.
                </p>
              )}
            </form>
          </div>

          {/* Calendly — Audit Flash (inline widget) */}
          <div className="cal-card rv" style={{ ["--d" as string]: ".14s" }}>
            <div className="cal-head">
              <div>
                <span className="card-kicker">Audit Flash</span>
                <h3>
                  30 min, offert, <span>sans engagement</span>
                </h3>
              </div>
              <span className="chip">GMT · Abidjan</span>
            </div>
            <p className="cal-sub">
              Réservez un créneau — on identifie ensemble la tâche qui vous
              coûte le plus, et ce que vous gagneriez à l'automatiser.
            </p>
            <div className="cal-frame">
              <iframe
                src={CALENDLY_EMBED}
                title="Réserver un Audit Flash de 30 minutes avec Alex Mardochée"
                loading="lazy"
              />
            </div>
            <p className="cal-note">
              Confirmation instantanée — le créneau arrive directement dans
              votre agenda.
            </p>
          </div>
        </div>

      </section>

      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Questions fréquentes</span>
            <h2 className="sec-title" id="faq-title">L'essentiel avant de commencer.</h2>
          </div>
          <p className="sec-note">Des réponses directes sur l'automatisation des PME à Abidjan.</p>
        </div>
        <div className="faq-list">
          {SITE_FAQS.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
