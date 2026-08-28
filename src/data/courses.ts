export interface Course {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceFormatted: string;
  originalPriceFormatted?: string;
  discountLabel?: string;
  priceAmount: number;
  currency: string;
  isPopular?: boolean;
  lessonsCount: number;
  lessonsLabel: string;
  duration: string;
  level: string;
  chariowUrl?: string;
  cover: string;
  benefits: string[];
}

export const COURSES: Course[] = [
  {
    id: "excel-ia-finance-data-mastery",
    slug: "excel-ia-finance-data-mastery",
    name: "EXCEL & IA : The Finance Data Mastery",
    category: "Excel & IA",
    description:
      "Une formation pratique pour exploiter Excel et l'IA dans vos analyses financières, vos reportings et vos décisions quotidiennes.",
    priceFormatted: "5 999 F CFA",
    originalPriceFormatted: "20 000 F CFA",
    discountLabel: "70% OFF",
    priceAmount: 5999,
    currency: "XOF",
    isPopular: true,
    lessonsCount: 20,
    lessonsLabel: "20 leçons",
    duration: "3 modules · 100% pratique",
    level: "Tous niveaux",
    chariowUrl: "https://alexmardoche.mychariow.shop/excelandia",
    cover: "/EXCEL & IA  The Finance Data Mastery.webp",
    benefits: [
      "+10 fichiers Excel d'exercice",
      "1 guide Claude AI",
      "Des ressources IA gratuites",
      "Accès à vie à la formation",
    ],
  },
  {
    id: "reponses-incroyables-gpt",
    slug: "reponses-incroyables-gpt",
    name: "OBTENEZ DES REPONSES INCROYABLES DE GPT",
    category: "Prompts & ChatGPT",
    description:
      "Un guide complet pour obtenir des réponses plus précises avec GPT et exploiter une bibliothèque de prompts prêts à l'emploi.",
    priceFormatted: "2 500 F CFA",
    originalPriceFormatted: "4 500 F CFA",
    discountLabel: "44% OFF",
    priceAmount: 2500,
    currency: "XOF",
    lessonsCount: 100,
    lessonsLabel: "+100 modèles de prompts",
    duration: "Modèles de prompts prêts à l'emploi",
    level: "Débutant · Intermédiaire",
    chariowUrl: "https://alexmardoche.mychariow.shop/prd_idub54",
    cover: "/OBTENEZ DES REPONSES INCROYABLES DE GPT.avif",
    benefits: [
      "+100 modèles de prompts",
      "Guide complet des prompts ChatGPT",
      "Accès instantané",
      "Exemples prêts à copier",
    ],
  },
  {
    id: "pack-money-reset",
    slug: "pack-money-reset",
    name: "PACK MONEY RESET ( EBOOK, Fichier Excel + Guide )",
    category: "Ebook & outils",
    description:
      "Le pack pratique pour reprendre le contrôle de votre argent avec un ebook, un fichier Excel et un guide d'utilisation.",
    priceFormatted: "2 850 F CFA",
    originalPriceFormatted: "8 850 F CFA",
    discountLabel: "68% OFF",
    priceAmount: 2850,
    currency: "XOF",
    lessonsCount: 0,
    lessonsLabel: "Pack de ressources pratiques",
    duration: "Ebook de 50 pages + outils",
    level: "Débutant · Intermédiaire",
    chariowUrl: "",
    cover: "/PACK MONEY RESET ( EBOOK, Ficher Excel + Guide ).avif",
    benefits: [
      "Ebook de 50 pages",
      "1 fichier Excel",
      "Guide d'utilisation du fichier",
      "Accès instantané",
    ],
  },
];
