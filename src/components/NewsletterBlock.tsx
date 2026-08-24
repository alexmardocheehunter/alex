import { useState, type FormEvent } from "react";
import { subscribeToNewsletter } from "../lib/newsletter";

interface NewsletterBlockProps {
  sourcePage?: string;
  compact?: boolean;
}

export default function NewsletterBlock({ sourcePage = "global", compact = false }: NewsletterBlockProps) {
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
        sourcePage: `newsletter_block_${sourcePage}`,
      });
      setStatus("ok");
      setEmail("");
      setFirstName("");
    } catch (err) {
      console.error("Erreur enregistrement newsletter:", err);
      setStatus("error");
    }
  };

  return (
    <section className={`newsletter-banner ${compact ? "compact" : ""} rv`} style={{ ["--d" as string]: ".1s" }}>
      <div className="nb-inner">
        <div className="nb-copy">
          <span className="nb-eyebrow">
            <i>✦</i> Chaque vendredi matin · 08:00 GMT
          </span>
          <h3 className="nb-title">
            Recevez les clés de l'automatisation <span>sans jargon</span>.
          </h3>
          <p className="nb-sub">
            Un conseil concret, un outil testé ou un cas réel d'entreprise ivoirienne.
            Gratuit · Zéro spam · Désinscription en 1 clic.
          </p>
        </div>

        <div className="nb-form-wrap">
          <form className="nb-form" onSubmit={handleSubmit} data-track-form="newsletter">
            <div className="nb-inputs">
              <input
                type="text"
                placeholder="Votre prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-label="Votre prénom"
                className="nb-input"
              />
              <input
                type="email"
                required
                placeholder="vous@entreprise.ci"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Votre adresse email"
                className="nb-input"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn primary nb-btn"
            >
              {status === "sending" ? "Inscription..." : "Rejoindre la liste du vendredi"}
            </button>
          </form>

          {status === "ok" && (
            <p className="nb-feedback ok" role="status">
              ✓ C'est validé ! Votre première astuce arrive ce vendredi à 08h00.
            </p>
          )}
          {status === "error" && (
            <p className="nb-feedback error" role="status">
              Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
