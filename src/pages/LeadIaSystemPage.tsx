import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { subscribeToNewsletter } from "../lib/newsletter";

export default function LeadIaSystemPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanName = name.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Vérifie ton adresse email.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      await subscribeToNewsletter({
        firstName: cleanName,
        email: cleanEmail,
        sourcePage: "ia_system_blueprint_waitlist",
      });
      setStatus("ok");
      setName("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible pour le moment.");
      setStatus("error");
    }
  };

  return (
    <div className="lead-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
        .lead-page{
          --beige: #faf7f0;
          --beige-2: #f5f1e8;
          --ink: #0a0a0a;
          --ink-soft: #4a4338;
          --gold: #d9a441;
          --line: rgba(10,10,10,0.12);
          background: var(--beige);
          color: var(--ink);
          font-family: 'Inter', sans-serif;
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }
        .lead-wrap{ max-width: 900px; margin: 0 auto; padding: 0 28px; }
        .lead-nav{ display:flex; align-items:center; gap:12px; padding: 28px 0 0; }
        .lead-mark{
          width: 40px; height: 40px; border-radius: 8px;
          background: var(--ink); color: var(--beige);
          display:flex; align-items:center; justify-content:center;
          font-family:'Fraunces', serif; font-weight:700; font-size: 16px; flex-shrink:0;
          letter-spacing: -0.02em;
        }
        .lead-brand{ font-size: 13px; color: var(--ink-soft); font-weight: 500; }
        .lead-hero{ padding: 48px 0 0; }
        .lead-kicker{ font-size: 13px; color: var(--gold); font-weight: 700; letter-spacing:0.08em; text-transform:uppercase; margin-bottom: 18px; }
        .lead-hero h1{
          font-family:'Fraunces', serif; font-weight: 600;
          font-size: clamp(32px, 5.2vw, 52px);
          line-height: 1.1; letter-spacing: -0.02em; max-width: 16ch;
          color: var(--ink);
        }
        .lead-lede{ margin-top: 22px; font-size: 17px; color: var(--ink); max-width: 62ch; }
        .lead-lede p + p{ margin-top: 14px; }
        .lead-lede .soft{ color: var(--ink-soft); }
        .lead-visual{ margin-top: 32px; border:1px solid var(--line); border-radius:16px; overflow:hidden; background: #fff; box-shadow: 0 12px 32px rgba(10,10,10,.08); }
        .lead-visual img{ display:block; width:100%; height:auto; }
        .lead-visual-caption{ padding:10px 16px; font-size:12px; color: var(--ink-soft); background: var(--beige-2); border-top:1px solid var(--line); text-align:center; }
        .promise-block{ margin-top: 40px; }
        .promise-block h3{ font-family:'Fraunces', serif; font-size: 20px; margin-bottom: 16px; color:var(--ink); }
        .promise-list{ display:flex; flex-direction:column; gap: 14px; }
        .promise-item{ display:flex; gap: 12px; align-items:flex-start; font-size: 16px; color: var(--ink); }
        .promise-item::before{ content:"—"; color: var(--gold); flex-shrink:0; padding-top: 1px; font-weight:700; }
        .format-block{ margin-top: 36px; background: var(--beige-2); border:1px solid var(--line); border-radius:16px; padding:24px 22px; }
        .format-block h3{ font-family:'Fraunces', serif; font-size: 20px; margin-bottom: 10px; color:var(--ink); }
        .format-intro{ font-size: 15px; color: var(--ink-soft); line-height:1.6; margin-bottom: 16px; }
        .format-intro strong{ color: var(--ink); }
        .format-list{ display:flex; flex-direction:column; gap: 12px; }
        .format-item{ font-size: 15px; color: var(--ink); line-height:1.6; background:#fff; border:1px solid var(--line); border-radius:12px; padding:12px 14px; }
        .format-item strong{ color: var(--ink); }
        .lead-card{
          background: var(--ink); color: var(--beige);
          border-radius: 16px; padding: 32px 28px;
          margin-top: 44px;
          border:1px solid rgba(255,255,255,.08);
        }
        .lead-card h3{ font-family:'Fraunces', serif; font-weight: 600; font-size: 22px; line-height: 1.25; margin-bottom: 8px; color: var(--beige); }
        .lead-card p.note{ font-size: 13.5px; color: #d6cfbc; margin-bottom: 22px; line-height:1.5; }
        .lead-form{ display:grid; grid-template-columns: 1fr 1fr auto; gap: 12px; align-items:end; }
        @media (max-width: 640px){ .lead-form{ grid-template-columns: 1fr; } }
        .lead-form label{ font-size: 12px; color: #d6cfbc; margin-bottom: 6px; display:block; font-weight:600; letter-spacing:.04em; text-transform:uppercase; }
        .lead-form input{
          width: 100%; padding: 13px 14px; border-radius: 8px; border: 1px solid rgba(241,234,221,0.22);
          background: rgba(255,255,255,0.06); color: var(--beige); font-size: 14px; font-family:'Inter', sans-serif;
        }
        .lead-form input::placeholder{ color: #9a958a; }
        .lead-form input:focus{ outline: none; border-color: var(--gold); background: rgba(255,255,255,0.09); }
        .lead-btn{
          padding: 13px 22px; border: none; border-radius: 999px;
          background: var(--gold); color: var(--ink); font-weight: 700; font-size: 14px;
          cursor: pointer; font-family:'Inter', sans-serif; white-space: nowrap; transition: background .2s, transform .2s;
        }
        .lead-btn:hover{ background: #e0b05a; transform: translateY(-1px); }
        .lead-btn:disabled{ opacity:.6; cursor:wait; transform:none; }
        .lead-fineprint{ font-size: 11.5px; color: #9a958a; margin-top: 14px; }
        .lead-confirm{ display:none; text-align:left; }
        .lead-confirm.show{ display:block; }
        .lead-confirm h4{ font-family:'Fraunces', serif; font-size: 20px; margin-bottom: 8px; color: var(--beige); }
        .lead-confirm p{ font-size: 14px; color: #d6cfbc; line-height:1.6; }
        .lead-error{ margin-top:12px; background: rgba(255,107,107,.12); border:1px solid rgba(255,107,107,.28); color:#ffd1d1; padding:10px 14px; border-radius:8px; font-size:13px; }
        .lead-ok{ margin-top:12px; background: rgba(217,164,65,.12); border:1px solid rgba(217,164,65,.28); color:#fff7e8; padding:10px 14px; border-radius:8px; font-size:13px; }
        .lead-section{ padding: 56px 0; border-top: 1px solid var(--line); }
        .lead-author{ display:grid; grid-template-columns: 56px 1fr; gap: 18px; align-items:flex-start; }
        .lead-author p{ font-size: 15.5px; color: var(--ink); max-width: 62ch; line-height:1.65; }
        .lead-author p + p{ margin-top: 12px; }
        .lead-author .soft{ color: var(--ink-soft); }
        .lead-signature{ margin-top: 14px; font-size: 13px; color: var(--ink-soft); font-style:italic; }
        .lead-closing{ text-align:left; padding: 48px 0 80px; }
        .lead-closing h2{
          font-family:'Fraunces', serif; font-weight: 600; font-size: clamp(26px, 3.6vw, 36px);
          max-width: 20ch; margin-bottom: 14px; color: var(--ink); line-height:1.15;
        }
        .lead-closing p{ color: var(--ink-soft); font-size: 16px; margin-bottom: 24px; max-width: 52ch; line-height:1.6; }
        .lead-btn-inline{
          display:inline-block; background: var(--ink); color: var(--beige);
          padding: 14px 28px; border-radius: 999px; font-weight: 700; font-size: 14px;
          text-decoration:none; cursor:pointer; border:none; font-family:'Inter', sans-serif;
        }
        .lead-btn-inline:hover{ background: #2a2620; }
        .lead-footer{ border-top: 1px solid var(--line); padding: 22px 0; }
        .lead-footer .lead-wrap{ display:flex; justify-content:space-between; font-size: 12px; color: var(--ink-soft); flex-wrap:wrap; gap:8px; }
        .lead-footer a{ color: var(--ink); text-decoration:none; font-weight:600; }
        .lead-footer a:hover{ color: var(--gold); }
      `}</style>

      <header>
        <div className="lead-wrap lead-nav">
          <div className="lead-mark">A</div>
          <div className="lead-brand">Alex Mardochée — Intégrateur IA &amp; Automatisation</div>
        </div>
      </header>

      <section className="lead-hero">
        <div className="lead-wrap">
          <div className="lead-kicker">Liste d’attente ouverte — formation pas encore publique</div>
          <h1>Rejoins la liste pour recevoir toute ma formation.</h1>

          <div className="lead-lede">
            <p>Je suis comptable de formation. Autodidacte en IA. Et pendant longtemps, mon fichier Excel était mon meilleur collègue et mon pire ennemi en même temps.</p>
            <p className="soft">2026 a changé la donne. Pas parce que l’IA est arrivée — elle est là depuis un moment — mais parce que ceux qui savent construire un vrai système avec, prennent une avance qu’on ne rattrape plus. “IA System Blueprint” c’est ce que j’aurais voulu qu’on me montre il y a deux ans.</p>
          </div>

          <div className="lead-visual">
            <picture>
              <source srcSet="/ia-system-blueprint.webp" type="image/webp" />
              <img src="/ia-system-blueprint.png" alt="Blueprint IA System : du chaos Excel à l'automatisation pilotée" width="1200" height="800" loading="eager" fetchPriority="high" />
            </picture>
            <div className="lead-visual-caption">Du chaos Excel → au système qui tourne seul · LLM · Prompt · MCP · Excel · Automatisation</div>
          </div>

          <div className="promise-block">
            <h3>Ce que tu vas repartir avec :</h3>
            <div className="promise-list">
              <div className="promise-item">Arrêter de deviner quel outil IA utiliser — et enfin savoir pourquoi tu le choisis.</div>
              <div className="promise-item">Un système qui tourne sans toi, pendant que tu dors, hein — pas juste un prompt qui fait joli.</div>
              <div className="promise-item">La méthode que j’utilise moi-même pour mes clients à Abidjan, pas de la théorie recopiée d’un blog américain.</div>
            </div>
          </div>

          <div className="format-block">
            <h3>Comment tu vas apprendre : en vidéo, avec moi.</h3>
            <p className="format-intro">Pas un PDF à lire seul dans ton coin. Ce sont des vidéos où <strong>je parle, je montre, et on teste ensemble</strong> — je te donne vraiment tout mon savoir, sans rien garder.</p>
            <div className="format-list">
              <div className="format-item"><strong>🎙️ Je parle :</strong> j’explique chaque notion simplement, comme si on était côte à côte.</div>
              <div className="format-item"><strong>🖥️ Je montre :</strong> écran partagé, pas à pas — tu vois exactement où cliquer, quoi écrire, quoi vérifier.</div>
              <div className="format-item"><strong>🧪 On teste ensemble :</strong> tu reproduis avec moi et tu repars avec un système qui tourne vraiment chez toi.</div>
            </div>
          </div>

          <div className="lead-card">
            <div id="form-state" style={{ display: status === "ok" ? "none" : "block" }}>
              <h3>Inscris-toi maintenant</h3>
              <p className="note">La formation est en finalisation. Seules les personnes inscrites ici la recevront en entier, dès qu’elle sort — pas de deuxième vague.</p>
              <form className="lead-form" onSubmit={onSubmit} noValidate>
                <div>
                  <label htmlFor="lead-name">Prénom</label>
                  <input id="lead-name" type="text" placeholder="Ton prénom" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="given-name" />
                </div>
                <div>
                  <label htmlFor="lead-email">Email</label>
                  <input id="lead-email" type="email" placeholder="ton@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <button type="submit" className="lead-btn" disabled={status === "sending"}>
                  {status === "sending" ? "Inscription…" : "Je m’inscris"}
                </button>
              </form>
              {status === "error" && <div className="lead-error" role="alert">{error}</div>}
              {status === "ok" && <div className="lead-ok" role="status">✓ C’est noté ! Tu recevras la formation dès qu’elle sort.</div>}
              <p className="lead-fineprint">Aucun spam. Un seul mail : celui avec la formation. Désinscription 1 clic.</p>
            </div>
            <div className={`lead-confirm ${status === "ok" ? "show" : ""}`}>
              <h4>C’est noté.</h4>
              <p>Tu recevras “IA System Blueprint” dès qu’elle sera prête. Directement dans ta boîte mail.</p>
              <p style={{ marginTop: 12 }}>
                <Link to="/formations" style={{ color: "#d9a441", fontWeight: 700, textDecoration: "underline" }}>Découvrir les formations actuelles →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lead-section">
        <div className="lead-wrap lead-author">
          <div className="lead-mark">A</div>
          <div>
            <p><strong>Je suis Alex Mardochée.</strong> Comptable de formation, hunter de nouvelles technologies depuis. J’ai démissionné d’un poste stable pour me lancer dans la tech — sans diplôme d’ingénieur, juste YouTube, Discord, et beaucoup de nuits blanches.</p>
            <p className="soft">Aujourd’hui je construis des systèmes IA pour des PME et des cabinets à Abidjan. Pas des démos. Des outils qui tournent au quotidien. Cette formation, c’est la synthèse de tout ce que j’ai testé, cassé, et fini par faire marcher.</p>
            <div className="lead-signature">Je suis Alex Mardochée | Comptable | Hunter de nouvelles technologies 👨‍💻</div>
          </div>
        </div>
      </section>

      <section className="lead-closing">
        <div className="lead-wrap">
          <h2>La liste se ferme dès que la formation sort</h2>
          <p>Après le lancement, l’accès complet ne sera plus garanti aux nouveaux arrivants de la même façon. Si tu veux être dans le premier lot, c’est maintenant.</p>
          <a href="#lead-name" className="lead-btn-inline" onClick={(e) => { e.preventDefault(); document.getElementById("lead-name")?.focus(); }}>
            Réserver ma place
          </a>
        </div>
      </section>

      <footer className="lead-footer">
        <div className="lead-wrap">
          <span>Alex Mardochée</span>
          <span>Abidjan, Côte d’Ivoire</span>
        </div>
      </footer>
    </div>
  );
}
