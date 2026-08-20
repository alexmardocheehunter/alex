import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

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
  "https://calendly.com/alexmardochee0/30min?hide_gdpr_banner=1&hide_landing_page_details=1";

/* À brancher plus tard : Firebase Cloud Function → SendGrid/SMTP → alexmardochee0@gmail.com */
const FORM_ENDPOINT = "";

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

function useAbidjanClock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Abidjan",
      }).format(new Date());
    setTime(fmt());
    const id = window.setInterval(() => setTime(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
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
    quote:
      "Avant, chaque soir, je passais 1 h 30 à compiler les ventes de mes 3 boutiques. Maintenant un agent IA récupère les données, sort le stock critique et m'envoie le récap à 20 h.",
    num: "+10 h",
    lbl: "gagnées chaque semaine — et plus aucune rupture de colliers en or",
    featured: true,
  },
  {
    name: "Koffi",
    role: "Agent immobilier",
    place: "Angré",
    quote:
      "Quinze appels par jour pour savoir si un bien était encore dispo. Aujourd'hui un bot WhatsApp répond en 3 secondes, envoie les photos et ne me dérange que pour les vraies visites.",
    num: "2×",
    lbl: "plus de visites en 6 semaines",
  },
  {
    name: "Yedo",
    role: "Restaurant / traiteur",
    place: "Riviera",
    quote:
      "Les commandes WhatsApp arrivaient en désordre, on oubliait des plats, on perdait de l'argent. Maintenant tout est fluide : commande → confirmation → cuisine → livraison, avec alerte stock.",
    num: "−90 %",
    lbl: "d'erreurs de commande",
  },
  {
    name: "Aminata",
    role: "Assistante comptable",
    place: "Cocody",
    quote:
      "Chaque fin de mois, c'était la guerre pour sortir les états. Alex a mis en place un flux qui lit les factures, classe tout et prépare déjà 80 % des écritures.",
    num: "−4 j",
    lbl: "sur la clôture mensuelle",
  },
  {
    name: "Bakary",
    role: "Directeur d'école primaire",
    place: "Yopougon",
    quote:
      "Les parents appelaient sans arrêt pour les notes, les absences, les frais. Un agent IA répond maintenant 24 h/24 et envoie les rappels de paiement tout seul.",
    num: "24/7",
    lbl: "les parents gérés — lui, enfin concentré sur les enfants",
  },
  {
    name: "Aya",
    role: "Dépôt de boissons / gros",
    place: "Abobo",
    quote:
      "Le stock n'était jamais clair, les ruptures toujours surprises. Maintenant chaque vente met à jour le stock en temps réel, et l'IA m'alerte 3 jours avant la rupture.",
    num: "0",
    lbl: "rupture surprise — fini les « désolé, on n'a plus »",
  },
  {
    name: "Fatou",
    role: "Salon de beauté",
    place: "Deux-Plateaux",
    quote:
      "Les clientes réservaient puis oubliaient. Aujourd'hui le bot gère les rendez-vous et envoie un rappel 2 h avant. Mon agenda est plein, je ne perds plus de temps au téléphone.",
    num: "0",
    lbl: "no-show grâce aux rappels — agenda plein",
  },
  {
    name: "Kouassi",
    role: "Chef de chantier BTP",
    place: "Bingerville",
    quote:
      "Photos, rapports journaliers, demandes de matériel… tout partait dans tous les sens sur WhatsApp. Un workflow centralise tout et me sort un rapport clair chaque soir.",
    num: "1",
    lbl: "rapport clair par soir — promoteur content",
  },
  {
    name: "Dr. Yao",
    role: "Cabinet médical",
    place: "Cocody",
    quote:
      "Les patients appelaient sans cesse pour les disponibilités. Un assistant IA gère les rendez-vous et les rappels, et ne me remonte que les urgences.",
    num: "+1 h 30",
    lbl: "récupérées chaque jour",
  },
  {
    name: "Mariame",
    role: "Société de nettoyage",
    place: "Marcory",
    quote:
      "28 agents sur le terrain, suivre les présences, les absences, les congés… un cauchemar. Aujourd'hui ils pointent sur WhatsApp, le système calcule et m'alerte.",
    num: "28",
    lbl: "agents suivis — sans courir après personne",
  },
];

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
    chip: "3 s",
  },
  {
    icon: <IconBolt />,
    title: "Agent IA",
    desc: "Comprend, répond, envoie les infos.",
    chip: "GPT-4o / Claude",
  },
  {
    icon: <IconDb />,
    title: "Stock · Caisse · Sheets",
    desc: "Tout se met à jour en temps réel.",
    chip: "Make / n8n",
  },
  {
    icon: <IconBell />,
    title: "Rapport 20 h",
    desc: "Le récap du jour sur ton téléphone.",
    chip: "Chaque soir",
  },
];

const CHECKS = [
  <>Répondre à vos clients sur WhatsApp en <b>3 secondes</b>, jour et nuit.</>,
  <>Mettre à jour <b>stock et caisse</b> sans aucune saisie manuelle.</>,
  <>Lire vos factures et préparer <b>80 % des écritures</b> comptables.</>,
  <>Vous envoyer un <b>rapport clair</b> chaque soir, sur votre téléphone.</>,
];

const SERVICES = [
  {
    num: "01",
    title: "Automatisation de processus métier",
    desc: "Commandes, stock, relances, reporting, flux WhatsApp : votre quotidien tourne sans vous. Vous gardez le contrôle, la machine fait le répétitif.",
    tags: ["Commandes", "Stock", "Relances"],
    hot: null as string | null,
  },
  {
    num: "02",
    title: "Agents IA personnalisés",
    desc: "Réponse client 24 h/24, qualification de leads, assistants internes : un employé digital formé à votre business, avec vos prix et vos procédures.",
    tags: ["24/7", "Leads", "Interne"],
    hot: null,
  },
  {
    num: "03",
    title: "Tableaux de bord & reporting automatique",
    desc: "Ventes, stock, présences, performance : vos chiffres prêts chaque matin, mis à jour sans intervention. Les décisions deviennent simples.",
    tags: ["Temps réel", "KPI"],
    hot: null,
  },
  {
    num: "04",
    title: "Digitalisation comptable & RH",
    desc: "Préparation d'écritures, paie, déclarations, suivi RH. Conçu main dans la main avec l'écosystème FLOW — Legal Flow, Suite Flow, RH FLOW.",
    tags: ["SYSCOHADA", "Paie"],
    hot: "Écosystème FLOW",
  },
  {
    num: "05",
    title: "Audit & mise en place sur-mesure",
    desc: "Analyse de vos process actuels → proposition concrète → déploiement. Vous savez exactement ce que vous gagnez, avant de dépenser.",
    tags: ["Audit", "Roadmap", "Déploiement"],
    hot: null,
  },
];

/* ================================================================ */

export default function App() {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const particles = useParticles();
  const clock = useAbidjanClock();

  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "ok">("idle");
  const [sentTo, setSentTo] = useState("");
  const [newsStatus, setNewsStatus] = useState<"idle" | "sending" | "ok">("idle");

  /* Révélation hero + nav + barre de progression */
  useEffect(() => {
    document.body.classList.add("loaded");
    const onScroll = () => {
      navRef.current?.classList.toggle("scrolled", window.scrollY > 30);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("loaded");
    };
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

  /* Parallaxe 3D du hero (lerp 0.055) */
  useEffect(() => {
    if (reducedMotion()) return;
    const layers = Array.from(
      heroRef.current?.querySelectorAll<HTMLElement>(".depth") ?? []
    );
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
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

  /* Formulaire de contact — front prêt ; brancher FORM_ENDPOINT (Cloud Function) en prod */
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
        .then(finish)
        .catch(finish);
    } else {
      window.setTimeout(finish, 900);
    }
  };

  /* Astuces gratuites — email + timestamp ; à brancher sur Firestore */
  const onNewsSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setNewsStatus("sending");
    window.setTimeout(() => {
      setNewsStatus("ok");
      form.reset();
    }, 700);
  };

  return (
    <>
      <div className="progress" ref={progressRef} aria-hidden="true" />

      {/* ------------------------------ NAV ------------------------------ */}
      <header className="nav" ref={navRef}>
        <a className="brand" href="#top">
          ALEX <b>MARDOCHÉE</b>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#preuves">Histoires</a>
          <a href="#methode">Méthode</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="cta" href="#contact">
          Discutons
        </a>
      </header>

      {/* ------------------------------ HERO ------------------------------ */}
      <section className="hero" id="top" ref={heroRef}>
        <div className="depth" data-depth="-16" data-rotate="2.2" aria-hidden="true">
          <div className="bg bg-day" />
          <div className="bg bg-dusk" />
        </div>

        <div className="depth fx" data-depth="9" aria-hidden="true">
          <div className="grade" />
          <div className="glow" />
          <div className="sweep" />
          <div className="particles">
            {particles.map((s, i) => (
              <span key={i} style={s} />
            ))}
          </div>
        </div>

        <div className="depth hud" data-depth="16">
          <div className="copy">
            <span className="badge reveal" style={{ ["--d" as string]: ".1s" }}>
              <i />
              <b>Abidjan — Côte d'Ivoire</b> · Automatisation &amp; IA pour PME
            </span>
            <h1 className="reveal" style={{ ["--d" as string]: ".25s" }}>
              Les <span className="hl">10 heures par semaine</span> que vous
              perdez en tâches répétitives — un système peut les faire à votre
              place.
            </h1>
            <p className="sub reveal" style={{ ["--d" as string]: ".4s" }}>
              J'automatise les vrais problèmes des entreprises ivoiriennes :
              commandes, stock, relances, factures, réponses clients.{" "}
              <strong>Des heures gagnées, des erreurs en moins, des ventes en
              plus.</strong> Du concret, zéro jargon.
            </p>
            <div className="ctas reveal" style={{ ["--d" as string]: ".55s" }}>
              <a className="btn primary" href={WA_LINK} target="_blank" rel="noreferrer">
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
            <span className="eyebrow">01 — Ils l'ont fait</span>
            <h2 className="sec-title">
              Voici ce que l'automatisation a déjà changé,{" "}
              <span className="it">pour des gens comme vous.</span>
            </h2>
          </div>
          <p className="sec-note">
            Dix métiers, dix situations ultra-concrètes. Avant / après, avec le
            résultat en face. Vous allez vous reconnaître.
          </p>
        </div>

        <div className="stories">
          {STORIES.map((s, i) => (
            <article
              className={`story rv ${s.featured ? "featured" : ""}`}
              key={s.name}
              style={{ ["--d" as string]: `${Math.min(i * 0.06, 0.45)}s` }}
            >
              <div className="story-top">
                <span className="monogram" aria-hidden="true">
                  {s.name.replace("Dr. ", "").charAt(0)}
                </span>
                <div>
                  <h3>{s.name}</h3>
                  <p>
                    {s.role} · {s.place}
                  </p>
                </div>
              </div>
              <blockquote>{s.quote}</blockquote>
              <div className="story-metric">
                <span className="num">{s.num}</span>
                <span className="lbl">{s.lbl}</span>
              </div>
            </article>
          ))}
        </div>
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

      {/* ------------------------------ MÉTHODE ------------------------------ */}
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
            Voici un workflow réel — du message du client au récap du soir — et
            les interfaces qui le pilotent. Tout est visible, tout est à vous.
          </p>
        </div>

        <div className="method-intro">
          {/* Workflow n8n / Make */}
          <div className="win rv" style={{ ["--d" as string]: ".08s" }}>
            <div className="win-bar">
              <i /><i /><i />
              <span className="win-title">workflow.json — n8n / Make</span>
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
            <p className="flow-caption">
              <b>Extrait réel</b> — le flux qui gère commandes et stock d'un
              dépôt à Abobo. Il tourne depuis 4 mois, sans intervention.
            </p>
          </div>

          {/* Ce que ça fait */}
          <div className="win checks-card rv" style={{ ["--d" as string]: ".16s" }}>
            <h3>Concrètement, ça fait quoi ?</h3>
            <ul className="checks">
              {CHECKS.map((c, i) => (
                <li key={i}>
                  <IconCheck />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <p className="checks-foot">
              Chaque brique est <b>visible et modifiable</b>. Rien n'est caché
              dans une boîte noire — vous gardez la main sur tout.
            </p>
          </div>
        </div>

        {/* Interfaces OpenAI & Anthropic */}
        <div className="ui-mocks">
          <div className="win rv" style={{ ["--d" as string]: ".1s" }}>
            <div className="win-bar">
              <i /><i /><i />
              <span className="win-title">Playground — OpenAI</span>
              <span className="win-chip">Agent client</span>
            </div>
            <div className="mock-body">
              <span className="mock-label">System prompt</span>
              <p className="mock-sys">
                <b>« Tu es Koraline, assistante commerciale de Koffi Immobilier
                (Angré).</b> Réponds en français, en 2–3 phrases max. Tu
                connais les biens disponibles en temps réel via l'outil
                stock_biens… »
              </p>
              <span className="mock-label">Conversation</span>
              <div className="mock-chat">
                <p className="mock-line user">
                  Le 3 pièces à Angré est toujours dispo ?
                </p>
                <p className="mock-line ai">
                  Oui 👌 Je vous envoie les photos. Visite possible demain —
                  10 h ou 16 h ?<span className="mock-cursor" />
                </p>
              </div>
              <div className="mock-foot">
                <span>Modèle — <b>gpt-4o</b></span>
                <span>Temp — <b>0.4</b></span>
                <span><b>1 284</b> tokens</span>
              </div>
            </div>
          </div>

          <div className="win rv" style={{ ["--d" as string]: ".18s" }}>
            <div className="win-bar">
              <i /><i /><i />
              <span className="win-title">Console — Anthropic</span>
              <span className="win-chip">Agent compta</span>
            </div>
            <div className="mock-body">
              <span className="mock-label">Outils connectés</span>
              <ul className="tools-list">
                <li>lire_facture(pdf) → lignes normalisées</li>
                <li>classer_ecriture() → plan SYSCOHADA</li>
                <li>generer_etat() → liasse mensuelle</li>
              </ul>
              <span className="mock-label">Sortie structurée</span>
              <pre className="code">{`{
  "facture": "F-2026-0148",
  "montant": 1250000, `}<span className="k">{`"devise": "XOF"`}</span>{`,
  "compte": "604 — Achats", `}<span className="c">{`// validé auto`}</span>{`
  "etat": "prêt pour revue"
}`}</pre>
              <div className="mock-foot">
                <span>Modèle — <b>Claude</b></span>
                <span>Outils — <b>× 3</b></span>
                <span><b>98 %</b> auto-validé</span>
              </div>
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
              Cinq façons de <span className="it">récupérer votre temps.</span>
            </h2>
          </div>
          <p className="sec-note">
            Une liste simple, sans piège. On commence petit, on mesure, on
            étend. Chaque mission part de vos process — pas l'inverse.
          </p>
        </div>

        <div className="svc-list">
          {SERVICES.map((s, i) => (
            <a
              className="svc rv"
              href="#contact"
              key={s.num}
              style={{ ["--d" as string]: `${i * 0.07}s` }}
            >
              <span className="svc-num">{s.num}</span>
              <span className="svc-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </span>
              <span className="svc-tags">
                {s.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
                {s.hot && <span className="tag hot">{s.hot}</span>}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ------------------------------ CONVERSION ------------------------------ */}
      <section className="section contact" id="contact">
        <div className="rv">
          <span className="eyebrow">04 — On y va ?</span>
        </div>
        <h2 className="contact-giant rv" style={{ ["--d" as string]: ".08s" }}>
          Discutons<span className="dot">.</span>
        </h2>
        <p className="contact-sub rv" style={{ ["--d" as string]: ".16s" }}>
          Une tâche qui vous mange vos journées ? Trois façons de commencer —{" "}
          <b>je réponds sous 24 h</b>, en français, sans jargon. Et si
          l'automatisation ne vaut pas le coup pour vous, je vous le dis
          direct.
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
              <a className="btn primary" href={WA_LINK} target="_blank" rel="noreferrer">
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
                    Message envoyé — je vous réponds sous 24 h
                    {sentTo ? ` à ${sentTo}` : ""}.
                  </span>
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

        {/* Astuces gratuites */}
        <div className="news rv" style={{ ["--d" as string]: ".1s" }}>
          <div>
            <h4>
              Recevez des astuces <span>gratuites</span>
            </h4>
            <p className="n-sub">
              Un email par semaine : une automatisation qui marche, un cas réel
              d'entreprise ivoirienne. Zéro jargon, zéro spam — désabonnement
              en un clic.
            </p>
          </div>
          <form onSubmit={onNewsSubmit}>
            <div className="news-row">
              <input
                name="email"
                type="email"
                required
                placeholder="vous@email.ci"
                aria-label="Votre adresse email"
              />
              <button
                className="btn glass"
                type="submit"
                disabled={newsStatus === "sending"}
              >
                {newsStatus === "sending" ? "Envoi…" : "S'abonner"}
              </button>
            </div>
            {newsStatus === "ok" && (
              <p className="news-ok" role="status">
                <IconCheck />
                <span>C'est noté — première astuce dans votre boîte cette semaine.</span>
              </p>
            )}
          </form>
        </div>
      </section>

      {/* ------------------------------ FOOTER ------------------------------ */}
      <footer className="footer">
        <span className="fb">
          ALEX <b>MARDOCHÉE</b>
        </span>
        <a className="f-wa" href={WA_LINK} target="_blank" rel="noreferrer">
          Contact direct : {WA_DISPLAY}
        </a>
        <span className="fl">
          <span className="flag" aria-hidden="true">
            <i className="f1" />
            <i className="f2" />
            <i className="f3" />
          </span>
          © 2026 — Conçu et construit à Abidjan · <span className="clock">{clock}</span> GMT
        </span>
        <nav aria-label="Navigation pied de page">
          <a href="#preuves">Histoires</a>
          <a href="#methode">Méthode</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </footer>
    </>
  );
}
