# Plan de développement — Blog, À propos & Newsletter

**Pour :** Williams
**De :** Alex
**Source d'inspiration :** analyse de shubham-sharma.fr (structure et UX, pas le contenu)
**Objectif :** ajouter 4 chantiers au site — un blog, une refonte de la page À propos, une stratégie newsletter intégrée à tout le site, et une page Formations connectée à l'API Chariow

---

## Vue d'ensemble

| Chantier | Ce qu'on ajoute | Pourquoi |
|---|---|---|
| Blog | Nouvelle section /blog avec liste filtrable | Positionner Alex comme référence IA/digital pour PME ivoiriennes, capter du trafic SEO |
| À propos | Refonte en timeline narrative | Transformer un CV statique en histoire qui crée de la connexion |
| Newsletter | Boutons, blocs répétés, page dédiée | Capter des leads même chez les visiteurs pas encore prêts à "discuter" |
| Formations | Page `/formations` connectée à l'API Chariow | Vendre les formations directement, sans double saisie manuelle |

---

## Chantier 1 — Le Blog

### Arborescence
```
/blog                    → liste des articles avec filtres
/blog/[slug]              → fiche article
```

### Page liste `/blog`

**En-tête**
- Compteur type "X articles publiés" (petit, discret, au-dessus du H1)
- H1 : une phrase d'intention, ex. *"Tout ce que j'apprends sur l'IA et la transformation digitale des PME."*
- Sous-titre : une ligne qui pose le ton (concret, sans jargon, ancré Abidjan/Côte d'Ivoire)

**Filtres par catégorie** (boutons horizontaux, un seul actif à la fois)
Catégories proposées, à ajuster avec Alex :
- Tous
- Comptabilité & SYSCOHADA
- Fiscalité ivoirienne
- Droit des affaires / OHADA
- Automatisation & IA
- Outils (Notion, Sage, Firebase...)
- Retours d'expérience (Koraline, Legal Flow, Suite Flow...)
- Formations internes (recaps sessions du vendredi)

**Carte article** (répétée dans la liste)
- Numéro d'ordre ou juste la position (optionnel, ex. site source)
- Catégorie · temps de lecture (ex. "Fiscalité ivoirienne · 8 min")
- Titre
- Chapô (1-2 phrases, reprend la meta-description)
- Date de publication
- Lien "Lire"

### Fiche article `/blog/[slug]`
- Fil d'ariane (catégorie > titre)
- Titre + métadonnées (date, temps de lecture, catégorie)
- Corps de l'article (Markdown → HTML, cohérent avec le workflow de handoff existant)
- **CTA newsletter en fin d'article** (voir Chantier 3 — bloc identique partout)
- Bloc "Articles liés" (2-3 articles de la même catégorie)

### Pourquoi ce format
Sur shubham-sharma.fr, la force du blog vient de la structure répétée (catégorie, temps de lecture, date) qui donne une impression de rigueur et de volume, même avec peu d'articles au départ. Le filtre par catégorie permet à un visiteur pressé de trouver directement ce qui le concerne (ex. un comptable cherche "Fiscalité ivoirienne", pas "Automatisation").

### Contenu de départ suggéré
Pour lancer avec de la matière réelle et déjà écrite :
- Recap de la session 7 "L'IA à l'ère agentique" → transformable en article
- Retour d'expérience Koraline (audit technique, choix SYSCOHADA)
- Un article "Pourquoi automatiser sa comptabilité SYSCOHADA en 2026"

---

## Chantier 2 — Refonte "À propos"

### Structure actuelle vs proposée

**Actuelle :** photo + paragraphe + citation + grille de certifications
**Proposée :** photo + paragraphe court + **timeline narrative** + citation + certifications

### Timeline — "Le parcours"
✅ **Contenu final rédigé** — voir le fichier séparé `A-propos-Copy-Finale.md`, écrit à partir de l'histoire fournie par Alex (le stage aux Impôts à 19 ans, l'écart de caisse de 600 000 FCFA, les nuits de formation, aujourd'hui Responsable Transformation Digitale). Williams doit intégrer ce texte tel quel dans la structure timeline ci-dessous — un seul point reste à trancher avant publication : l'âge (23 ans dans le texte, 22 ans sur d'autres supports, à harmoniser).

Structure d'intégration (4 étapes, format répété : période courte + titre 2-3 mots + 2-3 phrases) :

| Période | Titre | Contenu (version finale, voir fichier dédié) |
|---|---|---|
| 19 ans | Le déclic | Stage à la Direction des Impôts. On me juge sur mon âge, pas sur mon dossier. Je décide de devenir irréprochable. |
| Terrain | L'erreur qui a tout changé | Un écart de caisse de 600 000 FCFA. Trois jours à tout recompter. Le coupable : un reçu papier oublié. Plus jamais je ne dépendrai de l'erreur humaine. |
| Nuits | L'autoformation | Entre 22h et 3h du matin, j'apprends. Excel, puis l'IA (Cisco, OpenAI, Anthropic). TOSA Excel : 95/100. |
| Aujourd'hui | Le pont | Responsable de la Transformation Digitale et Chef de Projet IA. Je construis Suite FLOW. Je forme des cadres deux fois plus âgés que moi. |

**Note :** ce contenu est final, pas un squelette — Williams peut l'intégrer directement.

### Citation / conviction
Garder un encadré type "Ma conviction" avec une phrase forte — le contenu mentionné dans la mémoire de nos échanges ("Même depuis l'Afrique, on peut construire des systèmes aussi efficaces que ceux de l'Occident") fonctionne déjà bien dans ce rôle, à conserver et mettre en valeur visuellement (fond distinct, citation en grand).

### Stats bar (optionnelle, si chiffres disponibles)
Un bandeau court avec 2-4 chiffres clés (ex. années d'expérience, PME accompagnées, sessions de formation animées, certifications obtenues) — juste sous le H1 ou sous la photo. Simple, scannable, construit la crédibilité en quelques secondes.

### Certifications
Garder le format actuel en grille 2×2 (Excel TOSA, Anthropic Certified, Cisco, Google Cloud) — c'est déjà bien fait, ne pas y toucher.

---

## Chantier 3 — Stratégie Newsletter

### Outil retenu : Brevo (ex-Sendinblue)

**Pourquoi pas du 100% Firebase custom**
Une extension type "Trigger Email" sur Firestore est faite pour des emails transactionnels ponctuels (un email = un événement), pas pour gérer une vraie liste de diffusion : désinscription conforme RGPD, gestion des rebonds, statistiques d'ouverture, programmation de campagnes récurrentes. Tout reconstruire à la main serait du temps perdu sur un problème déjà résolu.

**Pourquoi Brevo précisément**
- Plan gratuit : contacts illimités, 300 emails/jour — largement suffisant pour un envoi hebdomadaire, même avec plusieurs milliers d'abonnés
- Éditeur drag-and-drop intégré : Alex rédige et programme sa newsletter lui-même chaque semaine, sans dépendre de Williams pour l'envoi
- Campagnes programmées en natif : "tous les vendredis 8h" se configure directement dans le dashboard Brevo, aucun cron job à coder côté serveur
- Conformité RGPD native (lien de désinscription automatique, gestion des consentements)

**Architecture technique**
1. Le formulaire du site (bloc répété + page `/newsletter`) envoie prénom/email à une Cloud Function Firebase
2. La Cloud Function appelle l'API Brevo pour ajouter le contact à la liste "Newsletter"
3. En parallèle, la Cloud Function enregistre aussi le lead dans Firestore — Alex garde une copie de ses données, indépendamment de Brevo
4. La rédaction, la programmation et l'envoi se font entièrement dans le dashboard Brevo — zéro code à toucher une fois le formulaire branché

⚠️ Même règle que pour Chariow : la clé API Brevo va en variable d'environnement (`.env`), jamais exposée côté client.

**Fréquence retenue :** chaque vendredi matin

### Ce qui a été repéré chez Shubham
- Un lien "Newsletter" **séparé visuellement** des autres items du menu (mis en avant, souvent avec un style différent du reste de la nav)
- Un **bloc identique répété en bas de chaque page** (avant le footer) : titre accrocheur + phrase de valeur + nombre d'abonnés + formulaire à 2 champs (prénom + email) + mention "Gratuit · Désinscription en un clic"
- Une **page dédiée `/newsletter`** avec une proposition de valeur plus développée que le bloc répété
- Le CTA principal du hero pointe directement vers la newsletter (avant même les formations) — signal que c'est la priorité n°1 de capture de leads

*(Note : je n'ai pas pu récupérer le contenu exact de la page `/newsletter` de Shubham — un souci technique de redirection en boucle a bloqué l'accès. La structure ci-dessous est déduite du bloc répété présent sur toutes les autres pages.)*

### Application au site d'Alex

**1. Navigation**
Ajouter "Newsletter" comme item de menu distinct, avec un traitement visuel différent (ex. souligné, couleur crème, ou bouton discret) — pas juste un lien texte comme les autres.

**2. Bloc répété en bas de chaque page**
Créer un composant réutilisable, injecté avant le footer sur toutes les pages (Accueil, Services, À propos, Blog, Histoires) :
- Titre : reprendre/adapter la tagline du site
- Phrase de valeur : ex. *"Un conseil concret, un outil testé ou un cas réel pour automatiser votre PME."*
- Fréquence : à définir avec Alex (hebdo, bimensuel...)
- Formulaire minimal : prénom + email, un seul bouton
- Mention rassurance : "Gratuit · Désinscription en un clic"

**3. Page dédiée `/newsletter`**
- H1 reprenant la promesse
- 2-3 bénéfices concrets de l'abonnement (à quoi ça ressemble, exemples de sujets traités)
- Nombre d'abonnés si disponible (même faible, un chiffre réel rassure plus qu'une absence de chiffre)
- Formulaire identique au bloc répété
- Éventuellement un aperçu d'un email déjà envoyé (capture d'écran) pour montrer le format concret

**4. Pré-requis avant implémentation**
- Outil : **Brevo** (voir ci-dessus) — Alex crée le compte et génère la clé API
- Fréquence : **chaque vendredi matin** (validé)
- Reste à faire : premier lot de 3-4 sujets pour lancer sans page vide

---

## Chantier 4 — Page Formations (connectée à l'API Chariow)

### Objectif
Lister automatiquement les formations vendues sur Chariow — sans double saisie. Chariow reste la source de vérité (création/édition des formations, prix, contenu), le site affiche en temps quasi-réel ce qui y est publié.

### Arborescence
```
/formations             → liste des formations (produits Chariow, type=course)
/formations/[slug]      → fiche formation détaillée (optionnel en v1)
```

### Comment fonctionne l'API Chariow (doc complète : chariow.dev)

**Authentification**
- API par clé (`Authorization: Bearer sk_live_...`), générée depuis app.chariow.com → Settings → API Keys
- ⚠️ **Règle impérative de sécurité** : la clé API ne doit **jamais** être exposée côté client (pas de fetch direct depuis le navigateur). L'appel doit passer par une route serveur du site (API route Next.js ou équivalent) qui interroge Chariow et ne renvoie au frontend que les données nécessaires.
- Limite : 100 requêtes/minute par clé

**Endpoint liste — `GET /v1/products`**
Paramètres utiles :
- `type=course` (ou `coaching` si Alex vend aussi du coaching individuel)
- `per_page` (jusqu'à 100, pagination par curseur au-delà)
- `search`, `category` (filtres optionnels)

Retourne pour chaque formation : `id`, `name`, `slug`, `type`, `category`, `is_free`, `pictures` (thumbnail/cover), `pricing` (prix formaté + devise).

**Endpoint détail — `GET /v1/products/{slug ou id}`** (si fiche détail en v1)
Retourne en plus : `description` complète, `rating` (note moyenne + nombre d'avis), `sales_count` (preuve sociale), `on_sale_until` (si promo en cours).

### Carte formation (liste `/formations`)
- Image (cover ou thumbnail)
- Catégorie
- Nom
- Prix (utiliser `pricing.current_price.formatted` — gère automatiquement les promos)
- Bouton "Découvrir" ou "S'inscrire"

### Bouton d'inscription — 2 options

**Option A (recommandée pour la v1)** — Redirection simple vers la fiche produit sur Chariow. Zéro logique de paiement à développer côté site, livraison rapide.

**Option B (avancée)** — Utiliser `POST /v1/checkout` pour initier le paiement depuis le site et rediriger vers le `checkout_url` retourné. Plus intégré (le client ne quitte jamais visuellement le site avant le paiement), mais demande un formulaire (email, prénom, nom, téléphone) et **ne fonctionne pas** pour les produits de type `service`, `coaching`, ou à prix libre ("pay what you want") — pour ceux-là, Chariow impose une redirection vers sa propre boutique ou l'usage du **Snap Widget** (embed).

→ **Démarrer en option A.** Passer en option B seulement si Alex veut suivre les ventes directement dans les analytics du site.

### Cache / rafraîchissement
Les formations ne changent pas d'une minute à l'autre. Mettre en cache côté serveur (revalidation toutes les quelques heures) plutôt que d'appeler l'API à chaque visite — reste sous la limite de requêtes et accélère le chargement de la page.

### Lien avec la newsletter (Chantier 3)
Ajouter le même bloc newsletter répété en bas de `/formations` — un visiteur pas encore prêt à payer une formation peut au moins s'abonner.

---

## Navigation — un choix à faire avec soin

Avec ces 4 chantiers, le site passe de ~5 pages à potentiellement 8-9 (Accueil, Histoires, Méthode, Services, Blog, Formations, À propos, Newsletter, Contact). Empiler tout ça dans le menu principal le rendrait illisible. Chez Shubham, la nav reste à 6 items maximum — la newsletter n'y est pas un lien comme les autres, c'est un bouton visuellement distinct.

### Proposition de structure

**Nav principale (5 items — fusion actée, voir ci-dessous)**
Histoires · Services · Formations · Blog · À propos · Contact

**Traité à part (bouton, pas un lien classique)**
Newsletter — même logique que Shubham : mis en avant visuellement (couleur différente, bouton plein), pas noyé dans la liste

**Footer (comme chez Shubham : colonnes thématiques)**
Regrouper les liens secondaires par colonnes (ex. "Contenu" : Blog, Formations, Newsletter — "Services" : les 3 formules — "Suivre" : LinkedIn, WhatsApp, contact direct)

### Point validé
✅ **"Méthode" et "Services" fusionnent en une seule page**, avec des contenus clairement différenciés par section (ex. section "Ce qu'on propose" pour l'offre, section "Comment ça marche" pour le process) — supprime un item de la nav et évite la redondance sur le fond.

---

## Priorisation suggérée

| Ordre | Tâche | Dépendance |
|---|---|---|
| 1 | Refonte navigation (nav principale + footer) | Décision sur fusion Méthode/Services |
| 2 | Composant newsletter réutilisable (bloc bas de page) | Aucune — copie/adapte le pattern, contenu peut être finalisé après |
| 3 | Page `/newsletter` dédiée | Choix de l'outil d'envoi |
| 4 | Page `/formations` (liste, option A redirection simple) | Clé API Chariow générée par Alex |
| 5 | Refonte À propos (timeline) | Contenu à écrire avec Alex |
| 6 | Structure blog `/blog` (liste + fiche article) | Aucune |
| 7 | Premiers articles publiés | Rédaction du contenu |
| 8 | Fiche formation détaillée `/formations/[slug]` (optionnel) | Après validation de l'option A |

---

## Décisions validées avec Alex
- ✅ Newsletter : Brevo, envoi chaque vendredi matin
- ✅ Timeline "Le parcours" : contenu final rédigé, voir `A-propos-Copy-Finale.md`
- ✅ Clé API Chariow : générée par Alex, transmise à Williams via `.env`, jamais en dur dans le code
- ✅ "Méthode" + "Services" : fusionnées en une seule page, contenus différenciés par section

## Questions encore ouvertes
- Catégories du blog définitives ?
- Les formations sont-elles toutes de type `course`, ou certaines sont-elles en `coaching`/prix libre ? (ces types ne supportent pas le checkout via API, uniquement la redirection vers Chariow)
- Âge d'Alex à harmoniser sur le site : 23 ans (texte de la timeline) vs 22 ans (autres supports)
