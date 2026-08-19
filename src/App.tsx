import { useEffect, useState, type FormEvent } from "react";

/* ================================================================
   ALEX MARDOCHÉE — Portfolio (landing unique)
   « L'IA et l'automatisation ne sont pas pour les grandes boîtes.
     Elles sont pour toi, dès maintenant. »
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

/* ------------------------- Horloge Abidjan ------------------------- */
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

/* ------------------------- Conversation WhatsApp ------------------------- */
type ChatMsg = { from: "user" | "bot" | "sys"; text: string };

const CHAT_SCRIPT: ChatMsg[] = [
  { from: "user", text: "Le 3 pièces à Angré est toujours dispo ?" },
  { from: "bot", text: "Oui 👌 Il est libre. Je t'envoie les photos tout de suite." },
  { from: "bot", text: "Visite possible demain — 10 h ou 16 h ?" },
  { from: "user", text: "10 h, ça marche." },
  { from: "sys", text: "Visite ajoutée · Koffi prévenu automatiquement" },
  { from: "bot", text: "C'est noté 📅 Je te rappelle la veille." },
];

function useChatLoop() {
  const [visible, setVisible] = useState(() => (reducedMotion() ? CHAT_SCRIPT.length : 1));
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reducedMotion()) return;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) =>
      timers.push(window.setTimeout(fn, ms));
    let alive = true;

    const play = () => {
      if (!alive) return;
      setVisible(1);
      setTyping(false);
      let i = 1;
      const step = () => {
        if (!alive) return;
        if (i >= CHAT_SCRIPT.length) {
          later(play, 4600);
          return;
        }
        const next = CHAT_SCRIPT[i];
        if (next.from === "bot") {
          setTyping(true);
          later(() => {
            if (!alive) return;
            setTyping(false);
            i += 1;
            setVisible(i);
            later(step, 1150);
          }, 950);
        } else {
          later(() => {
            if (!alive) return;
            i += 1;
            setVisible(i);
            later(step, next.from === "sys" ? 1300 : 1050);
          }, 1100);
        }
      };
      later(step, 1500);
    };

    play();
    return () => {
      alive = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return { visible, typing };
}

/* ------------------------- Icônes (SVG inline) ------------------------- */
const IconWhatsApp = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3.5a8.5 8.5 0 0 0-7.31 12.83L3.5 20.5l4.29-1.12A8.5 8.5 0 1 0 12 3.5Z" />
    <path
      d="M9.1 8.6c-.35 1.7.45 3.5 1.8 4.85 1.35 1.35 3.15 2.15 4.85 1.8l.6-1.55-2.05-1.05-.8.65a5.6 5.6 0 0 1-2.3-2.3l.65-.8-1.05-2.05-1.7.5Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const IconArrow = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const IconCheck = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4.5 12.5l5 5L19.5 7" />
  </svg>
);

const IconBolt = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
);

const IconChat = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
  </svg>
);

const IconDb = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
    <path d="M5 5.5v13c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-13" />
    <path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" />
  </svg>
);

const IconBell = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

/* ------------------------- Données ------------------------- */
const STORIES = [
  {
    name: "Adjoua",
    role: "Gérante de bijouterie",
    place: "Cocody · Plateau · Marcory",
    quote:
      "Chaque soir je passais 1 h 30 à compiler les ventes des 3 boutiques sur Excel. Maintenant un agent IA récupère les données WhatsApp + caisse, me sort le stock critique et m'envoie le récap à 20 h.",
    num: "+10 h",
    lbl: "récupérées chaque semaine",
    featured: true,
  },
  {
    name: "Koffi",
    role: "Agent immobilier",
    place: "Angré",
    quote:
      "Je gérais 40 biens. Les clients m'appelaient 15 fois par jour pour savoir si le 3 pièces était toujours dispo. Aujourd'hui un bot WhatsApp répond en 3 secondes et envoie les photos.",
    num: "2×",
    lbl: "plus de visites en 6 semaines",
  },
  {
    name: "Yedo",
    role: "Propriétaire de restaurant",
    place: "Riviera",
    quote:
      "Les commandes WhatsApp arrivaient en désordre. On oubliait des plats, on perdait de l'argent. Maintenant : commande → confirmation → cuisine → livraison. Tout est automatisé.",
    num: "−90 %",
    lbl: "d'erreurs de commande",
  },
  {
    name: "Aminata",
    role: "Assistante comptable",
    place: "Cocody",
    quote:
      "Chaque fin de mois c'était la guerre pour sortir les états. Alex a mis en place un flux qui lit les factures, classe tout et prépare déjà 80 % des écritures.",
    num: "−4 j",
    lbl: "sur la clôture mensuelle",
  },
  {
    name: "Bakary",
    role: "Directeur d'école primaire",
    place: "Yopougon",
    quote:
      "Les parents n'arrêtaient pas d'appeler pour les notes, les absences, les frais. Un agent IA répond maintenant 24 h/24 sur WhatsApp et envoie les rappels de paiement tout seul.",
    num: "24/7",
    lbl: "les parents gérés, sans lui",
  },
  {
    name: "Aya",
    role: "Gérante de dépôt de boissons",
    place: "Abobo",
    quote:
      "Avant je ne savais jamais exactement ce qui restait en stock. Maintenant chaque vente met à jour le stock en temps réel. L'IA me prévient 3 jours avant la rupture.",
    num: "0",
    lbl: "rupture de stock surprise",
  },
  {
    name: "Fatou",
    role: "Propriétaire de salon",
    place: "Deux-Plateaux",
    quote:
      "Les clientes réservaient, oubliaient, ou arrivaient sans prévenir. Aujourd'hui le bot gère les rendez-vous, envoie des rappels 2 h avant et me propose les créneaux libres.",
    num: "0",
    lbl: "rendez-vous oublié",
  },
  {
    name: "Kouassi",
    role: "Chef de chantier",
    place: "Bingerville",
    quote:
      "Les photos de chantier, les rapports journaliers, les demandes de matériel… tout partait dans tous les sens sur WhatsApp. Maintenant un workflow centralise tout, classé par chantier.",
    num: "1",
    lbl: "rapport clair, chaque soir",
  },
  {
    name: "Dr Yao",
    role: "Médecin clinicien",
    place: "Cocody",
    quote:
      "Les patients appelaient sans cesse pour savoir s'il restait des places. Un assistant IA gère les prises de rendez-vous et les rappels, et ne m'envoie que les cas urgents.",
    num: "+1 h 30",
    lbl: "récupérées chaque jour",
  },
  {
    name: "Mariame",
    role: "Responsable société de nettoyage",
    place: "Marcory",
    quote:
      "28 agents sur le terrain. Suivre les présences, les absences, les congés… c'était un cauchemar Excel. Aujourd'hui les agents pointent sur WhatsApp, le système calcule et m'alerte.",
    num: "28",
    lbl: "agents suivis, sans courir après personne",
  },
];

const MARQUEE = [
  { name: "Adjoua · bijouterie 3 sites", res: "+10 h/semaine récupérées" },
  { name: "Koffi · immobilier", res: "2× plus de visites en 6 semaines" },
  { name: "Yedo · restaurant", res: "−90 % d'erreurs de commande" },
  { name: "Aminata · compta", res: "clôture 4 jours plus rapide" },
  { name: "Bakary · école", res: "parents gérés 24 h/24 sans lui" },
  { name: "Aya · dépôt", res: "plus aucune rupture de stock surprise" },
];

const FLOW = [
  {
    icon: <IconChat />,
    title: "WhatsApp client",
    desc: "Le client écrit, comme d'habitude.",
    chip: "3 s",
  },
  {
    icon: <IconBolt />,
    title: "Agent IA",
    desc: "Il comprend, répond, envoie les infos.",
    chip: "auto",
  },
  {
    icon: <IconDb />,
    title: "Caisse · Stock · Sheets",
    desc: "Tout se met à jour tout seul.",
    chip: "temps réel",
  },
  {
    icon: <IconBell />,
    title: "Rapport 20 h",
    desc: "Le récap du jour arrive sur ton téléphone.",
    chip: "chaque soir",
  },
];

const STEPS = [
  {
    n: "01",
    title: "On branche",
    desc: "On connecte tes outils actuels : WhatsApp, caisse, Excel. Rien à réapprendre, rien à changer.",
  },
  {
    n: "02",
    title: "Ça tourne",
    desc: "Les workflows Make/n8n et les agents IA travaillent en continu — même quand tu dors.",
  },
  {
    n: "03",
    title: "Tu mesures",
    desc: "Un rapport clair chaque jour. Tu vois les heures gagnées, pas la technique.",
  },
];

const TOOLS = [
  "Make",
  "n8n",
  "OpenAI",
  "Claude (Anthropic)",
  "WhatsApp Business API",
  "Firebase",
  "Google Sheets",
  "Airtable",
  "Notion",
  "Python",
  "SendGrid",
];

const OFFERS = [
  {
    num: "01",
    title: "Automatisation de process métier",
    desc: "Facturation, relances, stocks, commandes : ton quotidien tourne sans toi. Tu gardes le contrôle, la machine fait le sale boulot.",
    tags: ["WhatsApp", "Make / n8n"],
    hot: null as string | null,
  },
  {
    num: "02",
    title: "Agents IA personnalisés",
    desc: "Un employé digital formé à ton business. Il répond à tes clients 24 h/24, avec tes prix, tes procédures et ton ton.",
    tags: ["OpenAI", "Claude"],
    hot: null,
  },
  {
    num: "03",
    title: "Tableaux de bord & reporting automatique",
    desc: "Tes chiffres prêts chaque matin, sans ouvrir Excel. Les décisions deviennent simples — et rapides.",
    tags: ["Sheets", "Firebase"],
    hot: null,
  },
  {
    num: "04",
    title: "Digitalisation comptable / RH",
    desc: "Écritures, bulletins, états : la paperasse se prépare toute seule. Conçu avec des comptables, pour des comptables.",
    tags: ["SYSCOHADA", "Paie"],
    hot: "RH FLOW — notre outil",
  },
];

/* ================================================================ */

export default function App() {
  const clock = useAbidjanClock();
  const { visible, typing } = useChatLoop();

  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "ok">("idle");
  const [sentTo, setSentTo] = useState("");
  const [newsStatus, setNewsStatus] = useState<"idle" | "sending" | "ok">("idle");

  /* Nav + barre de progression */
  useEffect(() => {
    const nav = document.getElementById("nav");
    const bar = document.getElementById("progress");
    const onScroll = () => {
      nav?.classList.toggle("scrolled", window.scrollY > 30);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Reveal au scroll — les éléments apparaissent un par un */
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

  /* Formulaire de contact — front prêt ; brancher FORM_ENDPOINT (Cloud Function) en prod */
  const onContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    /* Honeypot : si rempli par un bot, on simule un succès silencieux */
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
      <div className="progress" id="progress" aria-hidden="true" />

      {/* ------------------------------ NAV ------------------------------ */}
      <header className="nav" id="nav">
        <a className="brand" href="#top">
          ALEX <b>MARDOCHÉE</b>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#preuves">Preuves</a>
          <a href="#methode">Méthode</a>
          <a href="#offres">Offres</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="cta" href="#contact">
          Discutons
        </a>
      </header>

      {/* ------------------------------ HERO ------------------------------ */}
      <section className="hero" id="top">
        <div>
          <span className="eyebrow rv">Abidjan · Automatisation &amp; IA pour PME</span>
          <p className="hero-lead rv" style={{ ["--d" as string]: ".06s" }}>
            Voici ce que l'IA a déjà fait pour <span>des gens comme toi</span>.
          </p>
          <h1 className="rv" style={{ ["--d" as string]: ".14s" }}>
            L'IA et l'automatisation ne sont pas pour les grandes boîtes. Elles
            sont pour <span className="ul">toi</span>, dès maintenant.
          </h1>
          <p className="hero-sub rv" style={{ ["--d" as string]: ".22s" }}>
            Des gérants, des agents, des directeurs — ici, à Abidjan — ont
            arrêté de faire à la main ce qu'un système fait tout seul.{" "}
            <b>Le résultat : des heures récupérées, des ventes en plus, zéro
            rupture.</b>
          </p>
          <div className="hero-ctas rv" style={{ ["--d" as string]: ".3s" }}>
            <a className="btn primary" href={WA_LINK} target="_blank" rel="noreferrer">
              <IconWhatsApp /> Je veux la même chose
            </a>
            <a className="btn ghost" href="#preuves">
              Voir les preuves <IconArrow />
            </a>
          </div>
          <div className="hero-proof rv" style={{ ["--d" as string]: ".38s" }}>
            <span className="avatars" aria-hidden="true">
              <i className="a1">A</i>
              <i className="a2">K</i>
              <i className="a3">Y</i>
              <i className="a4">F</i>
              <i className="a5">B</i>
            </span>
            <p>
              <b>10 métiers déjà automatisés</b> — bijouterie, immobilier,
              resto, école, BTP…
            </p>
          </div>
        </div>

        {/* Téléphone — conversation réelle d'un système en place */}
        <div className="phone-zone rv" style={{ ["--d" as string]: ".2s" }}>
          <div className="phone" aria-label="Extrait d'une conversation WhatsApp gérée par un agent IA">
            <div className="phone-head">
              <span className="bot-av">K</span>
              <span className="who">
                Koraline — Agent IA
                <small>
                  <i /> En ligne · répond en 3 s
                </small>
              </span>
            </div>
            <div className="chat">
              {CHAT_SCRIPT.slice(0, visible).map((m, i) => (
                <div className={`msg ${m.from}`} key={i}>
                  {m.text}
                </div>
              ))}
              {typing && (
                <span className="typing" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </div>
            <div className="phone-foot">
              <span>
                Réponse moyenne — <b>3 secondes</b>
              </span>
              <span>24 h/24 · 7 j/7</span>
            </div>
          </div>
          <p className="phone-caption">
            Pendant ce temps, Koffi est en visite.{" "}
            <b>Son téléphone n'a pas sonné une fois.</b>
          </p>
        </div>

        <span className="scroll-cue" aria-hidden="true">
          Les preuves
        </span>
      </section>

      {/* ------------------------------ MARQUEE ------------------------------ */}
      <div className="marquee-wrap">
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} style={{ display: "contents" }}>
                {MARQUEE.map((m, i) => (
                  <span key={`${dup}-${i}`}>
                    {m.name} <em>→</em> <b>{m.res}</b> <em>◆</em>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------ PREUVES ------------------------------ */}
      <section className="section" id="preuves">
        <div className="sec-head rv">
          <div>
            <span className="eyebrow">01 — Les preuves</span>
            <h2 className="sec-title">
              Ils ont arrêté de perdre du temps.{" "}
              <span className="it">Leurs chiffres parlent.</span>
            </h2>
          </div>
          <p className="sec-note">
            Dix métiers différents. Un point commun : un système qui fait le
            travail répétitif à leur place. Tu vas te reconnaître.
          </p>
        </div>

        <div className="stories">
          {STORIES.map((s, i) => (
            <article
              className={`story rv ${s.featured ? "featured" : ""}`}
              key={s.name}
              style={{ ["--d" as string]: `${Math.min(i * 0.07, 0.5)}s` }}
            >
              <div className="story-top">
                <span className="monogram" aria-hidden="true">
                  {s.name.replace("Dr ", "").charAt(0)}
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

      {/* ------------------------------ MÉTHODE ------------------------------ */}
      <section className="section paper-band" id="methode">
        <div className="sec-head rv">
          <div>
            <span className="eyebrow">02 — La méthode</span>
            <h2 className="sec-title">
              Comment ça marche, <span className="mark">concrètement.</span>
            </h2>
          </div>
          <p className="sec-note">
            Pas de jargon, pas de révolution à opérer. On branche, ça tourne,
            tu mesures. Voici le circuit exact d'une journée automatisée.
          </p>
        </div>

        {/* Workflow vivant */}
        <div className="flow rv" style={{ ["--d" as string]: ".1s" }}>
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

        {/* 3 étapes */}
        <div className="steps rv" style={{ ["--d" as string]: ".12s" }}>
          {STEPS.map((s) => (
            <div className="step" key={s.n}>
              <span className="n">{s.n}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Outils maîtrisés */}
        <div className="tools rv" style={{ ["--d" as string]: ".14s" }}>
          <h4>Les outils que je maîtrise</h4>
          <div className="tool-chips">
            {TOOLS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ OFFRES ------------------------------ */}
      <section className="section" id="offres">
        <div className="sec-head rv">
          <div>
            <span className="eyebrow">03 — Les offres</span>
            <h2 className="sec-title">
              Quatre façons de <span className="it">récupérer ton temps.</span>
            </h2>
          </div>
          <p className="sec-note">
            Simple, clair, sans engagement de départ. On commence petit, on
            mesure, on étend.
          </p>
        </div>

        <div className="offers">
          {OFFERS.map((o, i) => (
            <a
              className="offer rv"
              href="#contact"
              key={o.num}
              style={{ ["--d" as string]: `${i * 0.07}s` }}
            >
              <span className="offer-num">{o.num}</span>
              <h3>{o.title}</h3>
              <p>{o.desc}</p>
              <span className="offer-tags">
                {o.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
                {o.hot && <span className="hot">{o.hot}</span>}
              </span>
              <span className="offer-arrow" aria-hidden="true">
                <IconArrow />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ------------------------------ CONVERSION ------------------------------ */}
      <section className="section" id="contact" style={{ paddingTop: 0 }}>
        <div className="sec-head rv">
          <div>
            <span className="eyebrow">04 — On y va ?</span>
            <h2 className="sec-title">
              Récupère ton temps. <span className="mark">Dès cette semaine.</span>
            </h2>
          </div>
          <p className="sec-note">
            Trois façons de commencer. Choisis la plus simple pour toi — les
            trois mènent au même endroit : du concret.
          </p>
        </div>

        <div className="conv-grid">
          {/* WhatsApp — priorité */}
          <div className="wa-card rv" style={{ ["--d" as string]: ".08s" }}>
            <div className="wa-top">
              <span className="wa-ic">
                <IconWhatsApp />
              </span>
              <div>
                <span className="kicker">Le plus rapide</span>
                <h3>Écris-moi sur WhatsApp</h3>
              </div>
              <span className="pill">Réponse &lt; 24 h</span>
            </div>
            <p className="wa-num">{WA_DISPLAY}</p>
            <a className="btn primary" href={WA_LINK} target="_blank" rel="noreferrer">
              Démarrer la conversation <IconArrow />
            </a>
            <p className="wa-note">
              Le message est pré-rempli — remplace juste [Tâche X] par la
              tienne, et envoie. On regarde ensemble si l'automatisation vaut
              le coup. Si non, je te le dis direct.
            </p>
          </div>

          {/* Calendly — juste à côté */}
          <div className="cal-card rv" style={{ ["--d" as string]: ".16s" }}>
            <div className="cal-head">
              <span className="kicker" style={{ fontSize: ".64rem", fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--blue-deep)" }}>
                Ou réserve un appel
              </span>
              <h3>
                Audit Flash 30 min, <span>offert, sans engagement</span>
              </h3>
            </div>
            <p className="cal-sub">
              On identifie ensemble la tâche qui te coûte le plus — et ce que
              tu gagnerais à l'automatiser.
            </p>
            <div className="cal-frame">
              <iframe
                src={CALENDLY_EMBED}
                title="Réserver un Audit Flash de 30 minutes avec Alex Mardochée"
                loading="lazy"
              />
            </div>
            <p className="cal-note">
              Confirmation instantanée · créneau à l'heure d'Abidjan (GMT).
            </p>
          </div>
        </div>

        {/* Astuces gratuites */}
        <div className="astuces rv" style={{ ["--d" as string]: ".1s" }}>
          <div>
            <h3>
              Reçois des astuces gratuites, <span>chaque semaine.</span>
            </h3>
            <p>
              Une automatisation qui marche, un cas réel, zéro blabla technique.
              Lu en 2 minutes, applicable le jour même.
            </p>
          </div>
          <form onSubmit={onNewsSubmit}>
            <div className="news-row">
              <input
                name="email"
                type="email"
                required
                placeholder="ton@email.ci"
                aria-label="Ton adresse email"
              />
              <button className="btn cream" type="submit" disabled={newsStatus === "sending"}>
                {newsStatus === "sending" ? "Envoi…" : "Recevoir les astuces"}
              </button>
            </div>
            {newsStatus === "ok" && (
              <p className="news-ok" role="status">
                <IconCheck /> C'est noté — première astuce dans ta boîte cette semaine.
              </p>
            )}
          </form>
        </div>

        {/* Formulaire classique — en dernier */}
        <form className="form-card rv" style={{ ["--d" as string]: ".12s" }} onSubmit={onContactSubmit}>
          <div className="form-intro">
            <span className="kicker">Plutôt email ?</span>
            <h3>Écris-moi directement.</h3>
            <p>
              Ton message arrive chez moi — <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              Réponse sous 24 h, en français, sans jargon.
            </p>
          </div>
          <div>
            <div className="f-grid">
              <label className="field">
                <span>Nom *</span>
                <input name="nom" required placeholder="Ton nom" autoComplete="name" />
              </label>
              <label className="field">
                <span>Email *</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="toi@entreprise.ci"
                  autoComplete="email"
                />
              </label>
            </div>
            <label className="field" style={{ marginTop: 16 }}>
              <span>Tâche à automatiser</span>
              <input
                name="tache"
                placeholder="Ex : facturation, réponses clients, stock, reporting…"
              />
            </label>
            <label className="field" style={{ marginTop: 16 }}>
              <span>Message *</span>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Dis-moi où tu perds du temps…"
              />
            </label>
            {/* Honeypot anti-spam */}
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="btn primary" type="submit" disabled={contactStatus === "sending"} style={{ marginTop: 20 }}>
              {contactStatus === "sending" ? "Envoi en cours…" : <>Envoyer le message <IconArrow /></>}
            </button>
            {contactStatus === "ok" && (
              <p className="form-ok" role="status" style={{ marginTop: 16 }}>
                <IconCheck />
                <span>
                  Message envoyé — je te réponds sous 24 h{sentTo ? ` à ${sentTo}` : ""}.
                </span>
              </p>
            )}
          </div>
        </form>
      </section>

      {/* ------------------------------ À PROPOS ------------------------------ */}
      <section className="section" id="a-propos" style={{ paddingTop: 0 }}>
        <div className="rv">
          <span className="eyebrow">05 — Qui je suis</span>
        </div>
        <div className="about-grid">
          <div>
            <p className="about-quote rv" style={{ ["--d" as string]: ".06s" }}>
              « Je ne vends pas de l'IA. Je vends du{" "}
              <span>temps gagné</span> et de l'argent récupéré. »
            </p>
            <div className="about-txt">
              <p className="rv" style={{ ["--d" as string]: ".14s" }}>
                Je suis <b>Alex Mardochée</b>. Comptable de formation, tombé
                dans l'automatisation en digitalisant mes propres clôtures de
                mois. J'ai vécu les fins de mois sous tension, les Excel qui
                plantent, les clients qui rappellent quinze fois.
              </p>
              <p className="rv" style={{ ["--d" as string]: ".22s" }}>
                Aujourd'hui je construis les systèmes qui font ce travail à ta
                place — <b>testés sur le terrain ivoirien, pas dans un labo.</b>{" "}
                Si tu veux voir ce que ça donnerait chez toi, le premier appel
                est offert.
              </p>
            </div>
            <div className="about-chips rv" style={{ ["--d" as string]: ".28s" }}>
              <span>
                <i /> Comptable de formation
              </span>
              <span>
                <i /> Transformation digitale
              </span>
              <span>
                <i /> Basé à Abidjan <span className="flag" aria-hidden="true"><i className="f1" /><i className="f2" /><i className="f3" /></span>
              </span>
            </div>
            <a className="about-cta rv" style={{ ["--d" as string]: ".34s" }} href={WA_LINK} target="_blank" rel="noreferrer">
              Le premier appel est offert <IconArrow />
            </a>
          </div>

          <aside className="about-side rv" style={{ ["--d" as string]: ".16s" }}>
            <div className="row">
              <span className="k">Base</span>
              <span className="v">Abidjan, Côte d'Ivoire</span>
            </div>
            <div className="row">
              <span className="k">Statut</span>
              <span className="v">
                <b>Projets ouverts</b>
              </span>
            </div>
            <div className="row">
              <span className="k">Réponse</span>
              <span className="v">Sous 24 h</span>
            </div>
            <div className="row">
              <span className="k">Heure locale</span>
              <span className="v">
                <b>{clock}</b> GMT
              </span>
            </div>
            <div className="row">
              <span className="k">WhatsApp</span>
              <span className="v">{WA_DISPLAY}</span>
            </div>
          </aside>
        </div>
      </section>

      {/* ------------------------------ FOOTER ------------------------------ */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <span className="fb">
              ALEX <b>MARDOCHÉE</b>
            </span>
            <p className="f-tag">
              Du temps gagné + de l'argent récupéré, grâce à l'automatisation
              et à l'IA appliquées aux vrais problèmes des entreprises
              ivoiriennes.
            </p>
          </div>
          <a className="f-wa" href={WA_LINK} target="_blank" rel="noreferrer">
            <IconWhatsApp /> Contact direct : {WA_DISPLAY}
          </a>
          <nav aria-label="Navigation pied de page">
            <a href="#preuves">Preuves</a>
            <a href="#methode">Méthode</a>
            <a href="#offres">Offres</a>
            <a href="#contact">Contact</a>
            <a href="#a-propos">À propos</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span className="flag" aria-hidden="true">
            <i className="f1" />
            <i className="f2" />
            <i className="f3" />
          </span>
          <span>© 2026 — Conçu et construit à Abidjan</span>
          <span>
            Il est <span className="clock">{clock}</span> à Abidjan · GMT
          </span>
        </div>
      </footer>
    </>
  );
}
