import { useState, type FormEvent } from "react";
import { subscribeToNewsletter } from "../lib/newsletter";

export default function NewsletterPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanFirst = firstName.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return;

    setStatus("sending");
    try {
      await subscribeToNewsletter({
        firstName: cleanFirst,
        email: cleanEmail,
        sourcePage: "newsletter_dedicated_page",
      });
      setStatus("ok");
      setEmail("");
      setFirstName("");
    } catch (err) {
      console.error("Erreur newsletter:", err);
      setStatus("error");
    }
  };

  return (
    <div className="newsletter-page-view">
      <section className="nl-hero">
        <div className="nl-hero-content">
          <span className="eyebrow">03 — La Lettre Hebdomadaire</span>
          <h1 className="nl-title">
            L'automatisation et l'IA dans votre boîte mail, <span className="hl">chaque vendredi à 08h00</span>.
          </h1>
          <p className="nl-sub">
            Rejoignez les dirigeants, comptables et professionnels ivoiriens qui reçoivent chaque semaine un cas concret,
            un outil testé et une méthode applicable immédiatement pour gagner du temps.
          </p>
        </div>
      </section>

      <section className="nl-main-section">
        <div className="nl-container">
          {/* Carte formulaire */}
          <div className="nl-card rv">
            <div className="nl-card-header">
              <h3>Rejoindre gratuitement</h3>
              <p>Zéro spam. Pas de théorie vide. Juste du concret.</p>
            </div>

            <form className="nl-page-form" onSubmit={handleSubmit}>
              <div className="field">
                <span>Prénom</span>
                <input
                  type="text"
                  placeholder="Votre prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  aria-label="Votre prénom"
                />
              </div>

              <div className="field">
                <span>Email professionnel ou personnel *</span>
                <input
                  type="email"
                  required
                  placeholder="vous@entreprise.ci"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Votre adresse email"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn primary nl-submit-btn"
              >
                {status === "sending" ? "Inscription en cours..." : "S'abonner pour vendredi 08h →"}
              </button>

              {status === "ok" && (
                <div className="form-ok">
                  ✓ Inscription validée ! Rendez-vous ce vendredi matin à 08h00.
                </div>
              )}
              {status === "error" && (
                <div className="form-error">
                  Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.
                </div>
              )}

              <p className="nl-disclaimer">
                🔒 Vos informations restent strictement confidentielles. Désabonnement possible en 1 clic au bas de chaque email.
              </p>
            </form>
          </div>

          {/* Ce que vous allez recevoir */}
          <div className="nl-benefits rv" style={{ ["--d" as string]: ".15s" }}>
            <h2>Ce que contient chaque édition :</h2>
            <div className="nl-benefit-item">
              <span className="nb-icon">💡</span>
              <div>
                <h4>Un cas réel d'automatisation PME</h4>
                <p>Décortiqué de A à Z : le problème initial, la solution mise en place et le gain mesuré en heures ou en FCFA.</p>
              </div>
            </div>

            <div className="nl-benefit-item">
              <span className="nb-icon">⚙️</span>
              <div>
                <h4>Un outil ou workflow prêt à cloner</h4>
                <p>Templates n8n, Make, invites GPT-4o ou formules Excel complexes commentées pas à pas.</p>
              </div>
            </div>

            <div className="nl-benefit-item">
              <span className="nb-icon">📊</span>
              <div>
                <h4>Point SYSCOHADA &amp; Fiscalité ivoirienne</h4>
                <p>Les nouveautés DGI, les bonnes pratiques de clôture comptable et les erreurs à éviter absolument.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
