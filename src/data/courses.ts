export interface Course {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceFormatted: string;
  priceAmount: number;
  currency: string;
  isPopular?: boolean;
  lessonsCount: number;
  duration: string;
  level: string;
  chariowUrl?: string;
  benefits: string[];
}

export const COURSES: Course[] = [
  {
    id: "course_ia_pme",
    slug: "maitriser-ia-automatisation-business",
    name: "L'IA & l'Automatisation au service des PME",
    category: "Automatisation & IA",
    description:
      "La formation complète pour concevoir, déployer et piloter des flux d'automatisation (n8n, Make, OpenAI) sans coder, adaptés aux réalités du marché ivoirien.",
    priceFormatted: "35 000 FCFA",
    priceAmount: 35000,
    currency: "XOF",
    isPopular: true,
    lessonsCount: 14,
    duration: "6 heures de vidéo + templates",
    level: "Tous niveaux",
    chariowUrl: "",
    benefits: [
      "Création de votre premier agent WhatsApp pas à pas",
      "Connexion Google Sheets, CRM et outils de caisse",
      "Templates de workflows n8n & Make prêts à l'emploi",
      "Accès au groupe privé d'entraide & sessions mensuelles",
    ],
  },
  {
    id: "course_excel_expert",
    slug: "excel-expert-finance-syscohada",
    name: "Excel Expert & Automatisation Financière SYSCOHADA",
    category: "Comptabilité & Finance",
    description:
      "Passez au niveau supérieur sur Excel (TOSA Expert 95/100) : tableaux de bord dynamiques, formules matricielles, Power Query et clôtures SYSCOHADA sans friction.",
    priceFormatted: "25 000 FCFA",
    priceAmount: 25000,
    currency: "XOF",
    lessonsCount: 18,
    duration: "8 heures d'ateliers pratiques",
    level: "Intermédiaire à Avancé",
    chariowUrl: "",
    benefits: [
      "Modèles de clôture mensuelle pré-paramétrés",
      "Automatisation des rapprochements bancaires",
      "Création de tableaux de bord financiers automatisés",
      "Techniques de validation et d'audit des formules",
    ],
  },
  {
    id: "course_whatsapp_agents",
    slug: "agents-whatsapp-business-intelligence",
    name: "Construire des Agents WhatsApp IA pour son Entreprise",
    category: "Agents IA",
    description:
      "Guide pratique pour brancher l'IA sur le numéro WhatsApp de votre business : qualification de leads, gestion du catalogue, relances et support 24/7.",
    priceFormatted: "45 000 FCFA",
    priceAmount: 45000,
    currency: "XOF",
    lessonsCount: 12,
    duration: "5 heures intensives",
    level: "Débutant & Intermédiaire",
    chariowUrl: "",
    benefits: [
      "Configuration de l'API Cloud WhatsApp officielle",
      "Prompt engineering adapté au langage commercial local",
      "Gestion des stocks et alertes en direct",
      "Système de notification en cas de reprise en main humaine",
    ],
  },
];
