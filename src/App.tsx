import { useEffect, useMemo, useRef, useState } from "react";

/* ================================================================
   ALEX M. — Solutions IA pour Abidjan
   Hero "flythrough" (duotone noir/beige) + sections Phase 2
   ================================================================ */

const IMG = {
  day: "https://image.qwenlm.ai/generated-images/160aeefa-b88e-4841-a83c-f5072f184604/_result.png",
  dusk: "https://image.qwenlm.ai/generated-images/ddce6ad5-d332-4d7b-a4b1-195b212b9654/_result.png",
  legal: "https://image.qwenlm.ai/generated-images/3610cab8-7e8b-42a7-a011-5b01fa9978c0/_result.png",
  koraline:
    "https://image.qwenlm.ai/generated-images/c62ede5b-777d-483b-b9f6-2d9eba2e4469/_result.png",
  suite: "https://image.qwenlm.ai/generated-images/55d9fb13-42c7-418f-9ee4-52a762f5e56d/_result.png",
  portrait:
    "https://image.qwenlm.ai/generated-images/b4a78b2b-5a7d-4484-8798-8925307306bf/_result.png",
};

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------- Particules (32) ------------------------- */
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

/* ------------------------- Compteur de stats ------------------------- */
function StatNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        if (reducedMotion()) {
          setDisplay(value);
          return;
        }
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="stat-num">
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------- Données ------------------------- */
const SERVICES = [
  {
    num: "01",
    title: "Automatisation des opérations",
    desc: "Facturation, relances, saisie, reporting : vos processus répétitifs tournent en continu, sans intervention humaine.",
    tags: ["Workflows", "RPA", "Extraction"],
  },
  {
    num: "02",
    title: "Conformité SYSCOHADA & pilotage financier",
    desc: "Des outils qui parlent le langage OHADA : liasses, états financiers et contrôles générés — puis vérifiés — automatiquement.",
    tags: ["Legal Flow", "OHADA", "Reporting"],
  },
  {
    num: "03",
    title: "Assistants & agents IA sur-mesure",
    desc: "Un copilote entraîné sur vos données, qui répond à vos équipes — et à vos clients — en français, 24/7.",
    tags: ["Koraline", "LLM", "WhatsApp"],
  },
  {
    num: "04",
    title: "Intégrations & données",
    desc: "Mobile Money, ERP, CRM, API locales : je branche l'IA sur votre existant. Pas l'inverse.",
    tags: ["API", "Mobile Money", "Dashboards"],
  },
];

const WORKS = [
  {
    img: IMG.legal,
    alt: "Rendu duotone noir et beige : code juridique et tableau de bord holographique pour Legal Flow",
    status: "En construction",
    kicker: "LegalTech · Abidjan · 2026",
    title: (
      <>
        Legal <span>Flow</span>
      </>
    ),
    desc: "La conformité SYSCOHADA en pilote automatique : veille réglementaire, génération d'états financiers et alertes avant échéance.",
    chips: ["SYSCOHADA", "Génération auto", "Alertes"],
    featured: true,
  },
  {
    img: IMG.koraline,
    alt: "Rendu duotone noir et beige : assistant IA lumineux au-dessus d'un smartphone pour Koraline",
    status: "En construction",
    kicker: "Agent IA · Abidjan · 2026",
    title: (
      <>
        Kora<span>line</span>
      </>
    ),
    desc: "L'assistante IA qui répond à vos clients en français, sur WhatsApp, avec vos tarifs et vos procédures.",
    chips: ["WhatsApp", "Français", "24/7"],
    featured: false,
  },
  {
    img: IMG.suite,
    alt: "Rendu duotone noir et beige : pipeline de nœuds connectés et flux lumineux pour Suite Flow",
    status: "En construction",
    kicker: "Ops · Abidjan · 2026",
    title: (
      <>
        Suite <span>Flow</span>
      </>
    ),
    desc: "Facturation, stocks, reporting — vos opérations orchestrées dans un seul flux, branché sur Mobile Money.",
    chips: ["Orchestration", "Mobile Money", "KPI"],
    featured: false,
  },
];

const STATS = [
  { value: 3, suffix: "", label: "produits en construction — Legal Flow, Koraline, Suite Flow" },
  { value: 100, suffix: " %", label: "pensés et construits depuis Abidjan, pour le terrain ivoirien" },
  { value: 24, suffix: "/7", label: "des agents IA qui ne ferment jamais boutique" },
  { value: 1, suffix: "", label: "interlocuteur unique, du cadrage au déploiement" },
];

const MARQUEE = [
  "Automatisation",
  "SYSCOHADA",
  "Agents IA",
  "Abidjan",
  "Côte d'Ivoire",
  "Mobile Money",
  "Sur-mesure",
  "Données",
];

/* ================================================================ */

export default function App() {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const particles = useParticles();
  const clock = useAbidjanClock();

  /* Révélation hero + nav + barre de progression */
  useEffect(() => {
    document.body.classList.add("loaded");

    const onScroll = () => {
      navRef.current?.classList.toggle("scrolled", window.scrollY > 30);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width = `${
          max > 0 ? (window.scrollY / max) * 100 : 0
        }%`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("loaded");
    };
  }, []);

  /* Reveal au scroll (sections) */
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
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
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0;

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

  return (
    <>
      <div className="progress" ref={progressRef} aria-hidden="true" />

      {/* ------------------------------ NAV ------------------------------ */}
      <header className="nav" ref={navRef}>
        <a className="brand" href="#top">
          ALEX <b>M.</b>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#services">Services</a>
          <a href="#realisations">Réalisations</a>
          <a href="#a-propos">À propos</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="cta" href="#contact">
          Discutons
        </a>
      </header>

      {/* ------------------------------ HERO ------------------------------ */}
      <section className="hero" id="top" ref={heroRef}>
        {/* Couche A — le pont, rendu jour + crépuscule (timelapse) */}
        <div className="depth" data-depth="-16" data-rotate="2.2" aria-hidden="true">
          <div className="bg bg-day" />
          <div className="bg bg-dusk" />
        </div>

        {/* Couche B — étalonnage, lueur, balayage, particules */}
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

        {/* Couche C — le texte */}
        <div className="depth hud" data-depth="16">
          <div className="copy">
            <span className="badge reveal" style={{ ["--d" as string]: ".1s" }}>
              <i />
              <b>Abidjan — Côte d'Ivoire</b> · Conseil &amp; ingénierie IA
            </span>
            <h1 className="reveal" style={{ ["--d" as string]: ".25s" }}>
              Des solutions IA pensées pour les entreprises{" "}
              <span className="hl">d'Abidjan</span>.
            </h1>
            <p className="sub reveal" style={{ ["--d" as string]: ".4s" }}>
              Automatisation, conformité SYSCOHADA, outils sur-mesure — je
              conçois des systèmes IA ancrés dans le contexte ivoirien.{" "}
              <strong>Pas des solutions importées, adaptées.</strong>
            </p>
            <div className="ctas reveal" style={{ ["--d" as string]: ".55s" }}>
              <a className="btn primary" href="#contact">
                Discuter de mon projet
              </a>
              <a className="btn glass" href="#realisations">
                Voir mes réalisations
              </a>
            </div>
          </div>
        </div>

        {/* Bandeau bas */}
        <div className="foot">
          <div className="builds">
            <i />
            Legal Flow · Koraline · Suite Flow — déjà en construction à Abidjan
          </div>
          <div className="scroll-hint" aria-hidden="true">
            Scroll
            <span className="line" />
          </div>
        </div>
      </section>

      {/* ------------------------------ MARQUEE ------------------------------ */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: "contents" }}>
              {MARQUEE.map((m, i) => (
                <span key={`${dup}-${i}`} className={i % 2 === 1 ? "o" : ""}>
                  {m} <em>◆</em>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------ SERVICES ------------------------------ */}
      <section className="section" id="services">
        <div className="sec-head">
          <div className="rv">
            <span className="eyebrow">01 — Services</span>
            <h2 className="sec-title">
              Des systèmes qui travaillent, <span className="it">pas des promesses.</span>
            </h2>
          </div>
          <p className="sec-note rv" style={{ ["--d" as string]: ".12s" }}>
            Chaque mission part du terrain : vos processus, vos contraintes
            SYSCOHADA, vos outils. Puis je construis — et je reste jusqu'à ce
            que ça tourne.
          </p>
        </div>

        <div className="svc-list">
          {SERVICES.map((s, i) => (
            <a
              className="svc rv"
              href="#contact"
              key={s.num}
              style={{ ["--d" as string]: `${i * 0.08}s` }}
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
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ------------------------------ RÉALISATIONS ------------------------------ */}
      <section className="section" id="realisations">
        <div className="sec-head">
          <div className="rv">
            <span className="eyebrow">02 — Réalisations</span>
            <h2 className="sec-title">
              Trois produits, déjà en chantier <span className="it">à Abidjan.</span>
            </h2>
          </div>
          <p className="sec-note rv" style={{ ["--d" as string]: ".12s" }}>
            Pas des démos jetables : des produits pensés ici, pour des
            entreprises d'ici — et construits pour durer.
          </p>
        </div>

        <div className="work-grid">
          {WORKS.map((w, i) => (
            <article
              className={`card ${w.featured ? "featured" : ""} rv`}
              key={w.kicker}
              style={{ ["--d" as string]: `${i * 0.1}s` }}
            >
              <div className="card-img">
                <span className="status">
                  <i />
                  {w.status}
                </span>
                <img src={w.img} alt={w.alt} loading="lazy" />
              </div>
              <div className="card-body">
                <span className="card-kicker">{w.kicker}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
                <div className="card-chips">
                  {w.chips.map((c) => (
                    <span className="chip" key={c}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="stats rv">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <StatNumber value={s.value} suffix={s.suffix} />
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ À PROPOS ------------------------------ */}
      <section className="section" id="a-propos">
        <div className="rv">
          <span className="eyebrow">03 — À propos</span>
        </div>

        <div className="about-grid">
          <div>
            <blockquote className="quote rv" style={{ ["--d" as string]: ".08s" }}>
              « L'IA ne remplacera pas les entreprises ivoiriennes. Elle
              récompensera <span>celles qui s'en saisissent les premières.</span> »
            </blockquote>

            <div className="about-txt">
              <p className="rv" style={{ ["--d" as string]: ".16s" }}>
                Je m'appelle <b>Alex M.</b> — consultant et ingénieur IA basé à
                Abidjan. J'ai vu trop d'entreprises acheter des logiciels
                pensés ailleurs, pour des réalités ailleurs. Mon travail,
                c'est l'inverse : partir de vos contraintes locales —
                SYSCOHADA, Mobile Money, connexions, équipes — et construire
                des systèmes qui tiennent la route ici.
              </p>
              <p className="rv" style={{ ["--d" as string]: ".24s" }}>
                Un seul interlocuteur, du cadrage au déploiement.{" "}
                <b>Pas de comité, pas de sous-traitance, pas de surprise.</b>{" "}
                Vous me parlez, je construis, on mesure ensemble.
              </p>
            </div>

            <div className="method rv" style={{ ["--d" as string]: ".3s" }}>
              <div className="method-row">
                <span className="n">S1</span>
                <span className="t">Cadrage terrain</span>
                <span className="d">Audit de vos processus, quick wins identifiés</span>
              </div>
              <div className="method-row">
                <span className="n">S2</span>
                <span className="t">Prototype rapide</span>
                <span className="d">Une première version testable en semaines</span>
              </div>
              <div className="method-row">
                <span className="n">S3</span>
                <span className="t">Déploiement & suivi</span>
                <span className="d">Mise en production, formation, amélioration continue</span>
              </div>
            </div>
          </div>

          <div className="portrait-card rv" style={{ ["--d" as string]: ".15s" }}>
            <img src={IMG.portrait} alt="Portrait duotone noir et beige d'Alex M." loading="lazy" />
            <div className="portrait-meta">
              <span className="who">
                Alex M.
                <small>Conseil &amp; ingénierie IA</small>
              </span>
              <span className="flag" aria-hidden="true" title="Côte d'Ivoire">
                <i className="f1" />
                <i className="f2" />
                <i className="f3" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ CONTACT ------------------------------ */}
      <section className="section contact" id="contact">
        <div className="rv">
          <span className="eyebrow">04 — Contact</span>
        </div>
        <h2 className="contact-giant rv" style={{ ["--d" as string]: ".08s" }}>
          Discutons<span className="dot">.</span>
        </h2>
        <p className="contact-sub rv" style={{ ["--d" as string]: ".16s" }}>
          Un projet, une question, une intuition ? Racontez-moi —{" "}
          <b>je réponds sous 24 h</b>, en français, sans jargon.
        </p>

        <div className="contact-ctas rv" style={{ ["--d" as string]: ".24s" }}>
          <a className="btn primary" href="mailto:contact@alexm.ci">
            Discuter de mon projet
          </a>
          <a
            className="btn glass"
            href="https://wa.me/2250700000000"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp direct
          </a>
        </div>

        <div className="contact-lines">
          <div className="cline rv" style={{ ["--d" as string]: ".1s" }}>
            <span className="k">Email</span>
            <br />
            <a href="mailto:contact@alexm.ci">contact@alexm.ci</a>
          </div>
          <div className="cline rv" style={{ ["--d" as string]: ".18s" }}>
            <span className="k">WhatsApp</span>
            <br />
            <a href="https://wa.me/2250700000000" target="_blank" rel="noreferrer">
              +225 07 00 00 00 00
            </a>
          </div>
          <div className="cline rv" style={{ ["--d" as string]: ".26s" }}>
            <span className="k">Basé à</span>
            <br />
            <span className="v">
              Abidjan · <span className="clock">{clock}</span> GMT
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------ FOOTER ------------------------------ */}
      <footer className="footer">
        <span className="fb">
          ALEX <b>M.</b>
        </span>
        <span className="fl">
          <span className="flag" aria-hidden="true">
            <i className="f1" />
            <i className="f2" />
            <i className="f3" />
          </span>
          © 2026 — Conçu et construit à Abidjan
        </span>
        <nav aria-label="Navigation pied de page">
          <a href="#services">Services</a>
          <a href="#realisations">Réalisations</a>
          <a href="#a-propos">À propos</a>
          <a href="#contact">Contact</a>
        </nav>
      </footer>
    </>
  );
}
