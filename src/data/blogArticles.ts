export interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
}

export const BLOG_CATEGORIES = [
  "Tous",
  "Automatisation & IA",
  "Comptabilité & SYSCOHADA",
  "Fiscalité ivoirienne",
  "Droit des affaires / OHADA",
  "Outils & Tech",
  "Retours d'expérience",
  "Formations internes",
] as const;

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "ia-agentique-pme-abidjan-2026",
    title: "L'IA à l'ère agentique : comment les PME ivoiriennes gagnent 15 heures par semaine",
    category: "Automatisation & IA",
    readTime: "6 min",
    date: "20 Février 2026",
    author: "Alex Mardochée",
    tags: ["IA", "Agents", "WhatsApp", "PME"],
    excerpt:
      "Fini les simples chatbots qui répètent un script. Les agents IA autonomes savent désormais lire vos stocks, qualifier un prospect et envoyer un récapitulatif comptable sans intervention.",
    content: `
### Le passage du chatbot passif à l'agent IA autonome

Pendant longtemps, quand une entreprise à Abidjan installait un "bot" sur WhatsApp ou Facebook, il s'agissait simplement d'un arbre de décision rigide : *« Tapez 1 pour le service client, tapez 2 pour nos tarifs »*. Résultat ? Les clients étaient frustrés et les gérants finissaient par reprendre le téléphone manuellement.

En 2026, l'IA a franchi un cap majeur avec l'avènement des **agents autonomes (IA agentique)**. Un agent n'est pas un formulaire. C'est un collaborateur digital doté de trois capacités clés :

1. **La compréhension contextuelle en langage naturel** : il comprend le nouchi, les abréviations ivoiriennes et les demandes formulées en audio.
2. **L'accès à vos outils en temps réel** : il est directement connecté à votre base de données, vos feuilles Google Sheets, votre logiciel de caisse ou votre CRM.
3. **Le pouvoir d'action encadré** : il ne se contente pas de répondre, il réserve un créneau, bloque un article en stock, émet un reçu et notifie le responsable.

---

### Un cas concret : 3 boutiques de mode entre Cocody et Marcory

Prenons l'exemple d'Adjoua, gérante d'un réseau de prêt-à-porter :
- **Avant l'agent IA** : 3 vendeuses passaient 2 heures chaque soir à compter les ventes sur des calepins WhatsApp, entraînant des ruptures de stock fréquentes et des erreurs de caisse.
- **Avec l'agent IA** : chaque vente validée sur WhatsApp est immédiatement déduite du stock centralisé. À 20h00, l'agent envoie un rapport complet sur le téléphone de la gérante avec le chiffre d'affaires consolidé et les réapprovisionnements à prévoir.

> **Le résultat chiffré :** Plus de 10 heures économisées par semaine pour la direction, zéro rupture surprise sur les articles vedettes, et un gain de réactivité client immédiat.

---

### Comment démarrer sans refondre toute son entreprise ?

L'erreur classique est de vouloir tout automatiser d'un coup avec des logiciels complexes à plusieurs millions de FCFA. La bonne méthode pour une PME ivoirienne est toujours progressive :

1. **Identifier la tâche la plus chronophage** (souvent : réponses aux demandes de prix sur WhatsApp ou compilation des ventes du soir).
2. **Créer un prototype ciblé en 7 jours** avec un flux simple (ex. n8n / Make + modèle de langage sécurisé).
3. **Mesurer le retour sur investissement** avant d'étendre le système à la comptabilité et aux stocks.

*Même depuis Abidjan, nos entreprises ont aujourd'hui accès aux technologies les plus puissantes du monde pour scaler sans alourdir leur masse salariale.*
    `,
  },
  {
    slug: "automatiser-comptabilite-syscohada-2026",
    title: "Pourquoi et comment automatiser sa comptabilité SYSCOHADA en 2026",
    category: "Comptabilité & SYSCOHADA",
    readTime: "8 min",
    date: "14 Février 2026",
    author: "Alex Mardochée",
    tags: ["SYSCOHADA", "Comptabilité", "Factures", "Automatisation"],
    excerpt:
      "La saisie manuelle des factures et la préparation des clôtures mensuelles coûtent des journées entières aux cabinets et entreprises. Voici le circuit exact pour automatiser 80% des écritures.",
    content: `
### Le fardeau de la saisie manuelle en Afrique de l'Ouest

Dans l'espace OHADA, le plan comptable SYSCOHADA révisé exige une rigueur documentaire exemplaire. Pourtant, dans la grande majorité des cabinets comptables et des PME à Abidjan, la réalité opérationnelle est la suivante :

- Des dizaines de classeurs remplis de factures papier ou de reçus scannés en vrac.
- Des assistants comptables qui passent 70% de leur temps à ressaisir des montants, des dates et des tiers dans leur logiciel (Sage, Saari, etc.).
- Un pic de stress infernal entre le 10 et le 15 de chaque mois pour sortir les déclarations fiscales et les états financiers.

---

### La chaîne d'automatisation intelligente

Grâce à la vision par ordinateur et aux modèles IA spécialisés, il est désormais possible de transformer une facture PDF ou photo en une écriture comptable pré-remplie et conforme au SYSCOHADA :

\`\`\`
[ Facture PDF / Photo ]
        ↓
[ Extraction OCR & IA ] → (Date, Fournisseur, HT, TVA 18%, TTC)
        ↓
[ Mappage SYSCOHADA ]   → Débit Compte 601/604 / Débit TVA 445 / Crédit 401
        ↓
[ Préparation Écriture ] → Validation humaine en 1 clic → Export logiciel comptable
\`\`\`

#### Les 3 avantages immédiats :
1. **Élimination des erreurs de saisie** : le modèle vérifie que l'équilibre Débit = Crédit est respecté à 100%.
2. **Gain de temps de clôture** : la clôture mensuelle passe de 6 jours à moins de 48 heures.
3. **Valorisation du rôle comptable** : les équipes ne sont plus des saisisseurs de données, mais de véritables analystes financiers au service du chef d'entreprise.

---

### Règle d'or : L'humain garde toujours la validation finale

Automatiser ne signifie pas laisser la machine déclarer seule. Le système génère un tableau de revue où le responsable comptable valide les lignes d'un simple coup d'œil. La machine prépare 80% du travail répétitif, l'expert comptable apporte la certification et le conseil.
    `,
  },
  {
    slug: "retour-experience-koraline-agent-whatsapp",
    title: "Retour d'expérience Koraline : concevoir un agent commercial WhatsApp infaillible",
    category: "Retours d'expérience",
    readTime: "7 min",
    date: "05 Février 2026",
    author: "Alex Mardochée",
    tags: ["Koraline", "WhatsApp", "Immobilier", "Cas Réel"],
    excerpt:
      "Comment nous avons conçu Koraline pour une agence immobilière à Angré : gestion des disponibilités, envoi de fiches de biens et doublement des visites qualifiées.",
    content: `
### Le problème de départ de l'agence immobilière

Une agence immobilière basée à Angré recevait entre 30 et 50 messages WhatsApp par jour. La majorité posait les mêmes questions :
- *« Le studio est toujours disponible ? »*
- *« Quelles sont les conditions (caution + avance) ? »*
- *« Envoyez-moi les photos et la localisation. »*

L'agent immobilier passait ses journées au téléphone à répéter les mêmes informations, au lieu d'être sur le terrain pour faire signer des baux ou négocier des mandats. Pis encore : les messages arrivant le soir ou le week-end restaient sans réponse pendant 12 heures, et le prospect finissait par louer ailleurs.

---

### La solution : L'agent Koraline

Nous avons conçu et déployé **Koraline**, une assistante virtuelle WhatsApp spécialement entraînée pour l'immobilier ivoirien :

- **Disponibilité en temps réel** : Koraline est connectée à la base de données des biens vacants. Dès qu'un bien est loué, elle le sait instantanément.
- **Qualification du budget** : Elle pose poliment les questions clés (zone souhaitée, budget mensuel, profession) avant de proposer les logements adaptés.
- **Prise de rendez-vous de visite** : Elle propose des créneaux synchronisés avec le calendrier de l'agent immobilier.

\`\`\`
Exemple de conversation réelle :
Prospect : "Je cherche un 3 pièces à Angré 8ème tranche avec parking."
Koraline : "Bonjour ! Nous avons actuellement 2 appartements disponibles correspondant exactement à vos critères (Loyer : 280 000 et 350 000 FCFA).
Voici les photos du premier bien. Souhaitez-vous une visite demain à 11h ou 16h ?"
\`\`\`

---

### Le bilan après 6 semaines
- **Temps de réponse moyen** : 3 secondes (auparavant 4 heures en moyenne).
- **Nombre de visites programmées** : Multiplié par 2,2.
- **Taux de satisfaction client** : 98% des prospects ont apprécié la rapidité sans même réaliser immédiatement qu'ils échangeaient avec une IA.
    `,
  },
  {
    slug: "fiscalite-ivoirienne-pme-pieges-declarations",
    title: "Fiscalité d'entreprise en Côte d'Ivoire : les pièges à éviter lors des déclarations",
    category: "Fiscalité ivoirienne",
    readTime: "9 min",
    date: "28 Janvier 2026",
    author: "Alex Mardochée",
    tags: ["Fiscalité", "DGI", "TVA", "Impôts", "Abidjan"],
    excerpt:
      "Retards de déclaration, déductibilité de la TVA, retenues à la source : tour d'horizon des erreurs les plus fréquentes des PME ivoiriennes et comment les prévenir.",
    content: `
### La rigueur fiscale, condition de survie des PME à Abidjan

En Côte d'Ivoire, les contrôles de la Direction Générale des Impôts (DGI) et les pénalités de retard peuvent rapidement asphyxier la trésorerie d'une jeune entreprise ou d'une PME en croissance. Ayant fait mes premiers pas en stage au sein même de l'administration fiscale à 19 ans, j'ai vu de l'intérieur les erreurs récurrentes commises par les dirigeants.

---

### Les 4 pièges fiscaux les plus coûteux

#### 1. Le non-respect de l'échéance du 15 du mois
Toutes les déclarations mensuelles (TVA, ITS, FDFP, etc.) doivent être impérativement déposées et payées avant le 15 de chaque mois. Un seul jour de retard entraîne des majorations automatiques de 10% à 25% qui s'accumulent.

#### 2. Les erreurs sur les retenues à la source
Les prestataires non immatriculés au régime réel font l'objet de retenues à la source spécifiques (ex. BNC, retenue TVA). Beaucoup d'entreprises oublient de reverser ces retenues ou les calculent sur une mauvaise assiette.

#### 3. Les factures non normalisées
Depuis la généralisation de la facture normalisée avec sticker ou QR code DGI, aucune facture d'achat non conforme ne peut être passée en charge déductible ni donner droit à récupération de TVA.

#### 4. Le décalage entre stock physique et stock comptable
Lors d'un contrôle fiscal, les inspecteurs comparent systématiquement vos achats déclarés et vos ventes. Une mauvaise tenue de stock est rapidement requalifiée en ventes dissimulées.

---

### Comment se prémunir grâce aux flux automatisés ?

1. **Mettre en place des alertes automatiques à J-5 (le 10 du mois)** pour récapituler tous les montants à déclarer.
2. **Scanner et valider l'authenticité des factures fournisseurs dès réception** grâce à un contrôle automatique.
3. **Consolider le journal des ventes et des encaissements en continu** plutôt que d'attendre la veille de l'échéance fiscale.
    `,
  },
];
