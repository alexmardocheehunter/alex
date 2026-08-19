import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Alex M. — Solutions IA pour Abidjan
 * Phase 1 : vue d'accueil. Scène « flythrough » du pont à haubans :
 *  - Couche A (data-depth -16) : double rendu jour / crépuscule → timelapse 26 s + Ken Burns 34 s
 *  - Couche B (data-depth  9) : étalonnage, lueur respirante, balayage, particules
 *  - Couche C (data-depth 16) : texte (reveal échelonné)
 *  Parallaxe souris : lerp 0.055 + rotateX/rotateY par couche.
 */

const d = (delay: string) => ({ "--d": delay }) as CSSProperties;

export default function App() {
  const navRef = useRef<HTMLElement | null>(null);
  const particlesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /* ---------- Révélation à l'arrivée (fallback inclus) ---------- */
    const markLoaded = () => document.body.classList.add("loaded");
    if (document.readyState === "complete") {
      markLoaded();
    } else {
      window.addEventListener("load", markLoaded);
    }
    const fallback = window.setTimeout(markLoaded, 2600);

    /* ---------- Nav : blur après 30 px de scroll ---------- */
    const onScroll = () =>
      navRef.current?.classList.toggle("scrolled", window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ---------- 32 particules lumineuses (JS) ---------- */
    const pk = particlesRef.current;
    if (pk && !reduced) {
      for (let i = 0; i < 32; i++) {
        const s = document.createElement("span");
        const size = Math.random() * 3 + 1.5; // 1.5 → 4.5 px
        s.style.width = s.style.height = `${size}px`;
        s.style.left = `${Math.random() * 100}%`;
        s.style.opacity = `${Math.random() * 0.5 + 0.2}`; // .2 → .7
        s.style.animationDuration = `${Math.random() * 14 + 9}s`; // 9 → 23 s
        s.style.animationDelay = `${-Math.random() * 20}s`;
        pk.appendChild(s);
      }
    }

    /* ---------- Parallaxe 3D souris (lerp .055) ---------- */
    const depths = Array.from(document.querySelectorAll<HTMLElement>(".depth"));
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
      depths.forEach((el) => {
        const dp = Number(el.dataset.depth ?? 0);
        const r = Number(el.dataset.rotate ?? 0);
        el.style.transform =
          `translate3d(${(cx * dp).toFixed(2)}px, ${(cy * dp).toFixed(2)}px, 0) ` +
          `rotateY(${(cx * r).toFixed(3)}deg) rotateX(${(-cy * r).toFixed(3)}deg)`;
      });
      raf = requestAnimationFrame(loop);
    };

    if (!reduced) {
      window.addEventListener("mousemove", onMove);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("load", markLoaded);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      window.clearTimeout(fallback);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <header className="nav" id="nav" ref={navRef}>
        <a className="brand" href="#">
          ALEX <b>M.</b>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#">Services</a>
          <a href="#">Réalisations</a>
          <a href="#">À propos</a>
          <a href="#">Contact</a>
        </nav>
        <a className="cta" href="#">
          Discutons
        </a>
      </header>

      <section className="hero" aria-label="Accueil">
        {/* Couche A : le pont — rendu 3D jour + crépuscule (timelapse) */}
        <div className="depth" data-depth="-16" data-rotate="2.2">
          <div className="bg bg-day" role="img" aria-label="Rendu 3D du pont à haubans d'Abidjan sur la lagune Ébrié, plein jour" />
          <div className="bg bg-dusk" aria-hidden="true" />
        </div>

        {/* Couche B : étalonnage, lueur, balayage, particules */}
        <div className="depth fx" data-depth="9" aria-hidden="true">
          <div className="grade" />
          <div className="glow" />
          <div className="sweep" />
          <div className="particles" ref={particlesRef} />
        </div>

        {/* Couche C : le texte */}
        <div className="depth hud" data-depth="16">
          <div className="copy">
            <span className="badge reveal" style={d(".1s")}>
              <i />
              <b>Abidjan — Côte d'Ivoire</b> · Conseil &amp; ingénierie IA
            </span>
            <h1 className="reveal" style={d(".25s")}>
              Des solutions IA pensées pour les entreprises{" "}
              <span className="hl">d'Abidjan</span>.
            </h1>
            <p className="sub reveal" style={d(".4s")}>
              Automatisation, conformité SYSCOHADA, outils sur-mesure — je
              conçois des systèmes IA ancrés dans le contexte ivoirien.{" "}
              <strong>Pas des solutions importées, adaptées.</strong>
            </p>
            <div className="ctas reveal" style={d(".55s")}>
              <a className="btn primary" href="#">
                Discuter de mon projet
              </a>
              <a className="btn ghost" href="#">
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
          <div className="scroll" aria-hidden="true">
            Scroll
            <span className="line" />
          </div>
        </div>
      </section>
    </>
  );
}
