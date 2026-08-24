import { Link } from "react-router-dom";

const WA_LINK = "https://wa.me/2250710073519?text=Bonjour%20Alex%2C%20je%20souhaite%20un%20audit%20de%20mon%20entreprise%20%C3%A0%20Abidjan.";

const STORIES = [
  ["Bijouterie à Cocody, Plateau et Marcory", "+10 h/semaine", "Rapport ventes et stock automatisé chaque soir."],
  ["Agence immobilière à Angré", "2,2× plus de visites", "Agent WhatsApp qui qualifie et propose les créneaux."],
  ["Restaurant à Riviera", "−90 % d'erreurs", "Commande, confirmation, cuisine et livraison reliées."],
  ["PME comptable à Cocody", "−4 jours", "Factures classées et clôture mensuelle préparée."],
  ["École à Yopougon", "24/7", "Réponses parents et rappels de paiement automatisés."],
  ["Dépôt à Abobo", "0 rupture surprise", "Stock mis à jour et alerte avant réapprovisionnement."],
  ["Salon aux Deux-Plateaux", "0 no-show", "Rappels de rendez-vous envoyés automatiquement."],
  ["Chantier à Bingerville", "1 rapport/jour", "Photos et demandes terrain centralisées."],
  ["Cabinet médical à Cocody", "+1 h 30/jour", "Rendez-vous et rappels pris en charge."],
  ["Société de nettoyage à Marcory", "28 agents suivis", "Présences et absences remontées sur WhatsApp."],
];

const SERVICES = [
  ["01", "Ventes & stock WhatsApp", "Commandes, catalogue, stock et alertes de rupture sans double saisie."],
  ["02", "Employé digital 24/7", "Réponses clients, qualification de prospects et prise de rendez-vous."],
  ["03", "Tableaux de bord", "Chiffre d'affaires, marges, stocks critiques et rapports quotidiens."],
  ["04", "Factures & RH SYSCOHADA", "Lecture des factures, préparation des écritures et pointage terrain."],
  ["05", "Audit Flash sur mesure", "Un diagnostic court, un prototype en 7 jours et une équipe formée."],
];

export function StoriesPage() {
  return (
    <div className="section landing-page">
      <header className="landing-hero">
        <span className="eyebrow">Résultats terrain à Abidjan</span>
        <h1>10 histoires d'automatisation pour des PME ivoiriennes.</h1>
        <p>Des cas concrets, des chiffres visibles et des process qui restent compréhensibles par les équipes.</p>
      </header>
      <div className="landing-grid">
        {STORIES.map(([business, result, detail]) => (
          <article className="landing-card" key={business}>
            <p className="eyebrow">{business}</p>
            <h2>{result}</h2>
            <p>{detail}</p>
          </article>
        ))}
      </div>
      <p className="landing-cta"><a className="btn primary" href={WA_LINK} target="_blank" rel="noreferrer" data-cta="stories_whatsapp">Discuter de mon cas sur WhatsApp</a></p>
    </div>
  );
}

export function MethodPage() {
  return (
    <div className="section landing-page">
      <header className="landing-hero">
        <span className="eyebrow">Méthode en 3 étapes</span>
        <h1>Automatiser une PME à Abidjan sans boîte noire.</h1>
        <p>Un premier flux utile peut être prototypé en 7 jours, mesuré avec l'équipe et modifié sans dépendre d'un jargon technique.</p>
      </header>
      <ol className="method-steps">
        <li><strong>Diagnostiquer.</strong><span>On observe une tâche répétitive, son volume et son coût en heures ou en erreurs.</span></li>
        <li><strong>Prototyper.</strong><span>On relie WhatsApp, Sheets, n8n ou Make à vos règles métier avec une validation humaine.</span></li>
        <li><strong>Mesurer puis déployer.</strong><span>On compare le résultat avant/après, forme l'équipe et étend seulement ce qui fonctionne.</span></li>
      </ol>
      <div className="landing-table-wrap">
        <table className="landing-table"><caption>Exemple de workflow quotidien</caption><thead><tr><th>Entrée</th><th>Traitement</th><th>Résultat</th></tr></thead><tbody><tr><td>Message WhatsApp</td><td>Agent IA + règles métier</td><td>Réponse en 3 secondes</td></tr><tr><td>Vente ou facture</td><td>Synchronisation stock / Sheets</td><td>Rapport sans ressaisie</td></tr></tbody></table>
      </div>
      <p className="landing-cta"><Link className="btn primary" to="/contact" data-cta="method_contact">Faire l'audit de mon processus</Link></p>
    </div>
  );
}

export function ServicesPage() {
  return (
    <div className="section landing-page">
      <header className="landing-hero">
        <span className="eyebrow">Services à Abidjan · PME ivoiriennes</span>
        <h1>Cinq services d'automatisation et d'IA pour récupérer votre temps.</h1>
        <p>On commence par un problème mesurable : commandes, stock, relances, factures ou reporting.</p>
      </header>
      <div className="service-cards">
        {SERVICES.map(([number, title, description]) => <article className="landing-card" key={number}><span className="eyebrow">{number}</span><h2>{title}</h2><p>{description}</p></article>)}
      </div>
      <p className="landing-cta"><Link className="btn primary" to="/contact" data-cta="services_contact">Obtenir un audit offert de 15 minutes</Link></p>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="section landing-page contact-landing">
      <header className="landing-hero">
        <span className="eyebrow">Contact · Abidjan, Côte d'Ivoire</span>
        <h1>Parlons du processus qui vous fait perdre du temps.</h1>
        <p>Décrivez votre situation en 2 minutes. Je vous réponds sous 24 heures, sans jargon et sans engagement.</p>
      </header>
      <div className="contact-landing-grid">
        <div className="landing-card">
          <h2>Le plus rapide : WhatsApp</h2>
          <p>Envoyez votre tâche, votre volume approximatif et le résultat que vous aimeriez obtenir.</p>
          <a className="btn primary" href={WA_LINK} target="_blank" rel="noreferrer" data-cta="contact_whatsapp">Écrire sur WhatsApp</a>
          <p><a href="mailto:alexmardochee0@gmail.com">alexmardochee0@gmail.com</a></p>
        </div>
        <form className="landing-card contact-form" action="mailto:alexmardochee0@gmail.com" method="post" encType="text/plain" data-track-form="contact">
          <h2>Décrire mon besoin</h2>
          <label>Nom<input name="nom" required autoComplete="name" /></label>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Processus à automatiser<textarea name="message" required rows={5} /></label>
          <button className="btn primary" type="submit" data-cta="contact_form">Envoyer ma demande</button>
        </form>
      </div>
    </div>
  );
}
