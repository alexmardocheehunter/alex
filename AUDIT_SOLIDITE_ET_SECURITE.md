# Audit de Solidité, Sécurité et Affichage (Codebase & Production)

**Projet :** Site Web Alex Mardochée — Automatisation & IA PME (Abidjan)
**Date :** Octobre 2024
**Statut du build :** ✅ Conforme (`npm run build` : 0 erreur TypeScript, bundle Vite optimisé)

---

## 1. Synthèse Exécutive

La codebase présente un excellent niveau de qualité globale, une architecture moderne (Vite, React 18, React Router v6, TypeScript, Firebase Functions v2), un référencement SEO très poussé (données structurées JSON-LD, Open Graph, Sitemap) ainsi qu'une charte graphique retravaillée avec succès en thème clair "full-beige".

L'objet de cet audit est de faire ressortir les **éléments de fragilité potentiels**, les **risques de sécurité/vulnérabilités**, les **incohérences d'affichage UI** et les **angles morts de gestion d'erreurs** avant passage en production intensive.

### Répartition des Constats
- 🔴 **Priorité Élevée (P1) :** 0
- 🟠 **Priorité Moyenne (P2) :** 3
- 🟢 **Priorité Faible / Amélioration (P3) :** 4

---

## 2. Robustesse & Gestion des Erreurs Runtime

### 🟠 2.1. Injection HTML possible dans le parser Markdown maison du Blog
* **Fichier impacté :** `src/pages/BlogDetailPage.tsx` (fonction `renderContent`)
* **Constat :**
  Pour afficher le contenu des articles de blog, le code découpe le Markdown et réinjecte le HTML mis en forme avec `dangerouslySetInnerHTML` :
  ```tsx
  const itemContent = line.replace(/^(-\s+|\d+\.\s+)/, "");
  const formatted = itemContent.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  listBuffer.push(formatted);
  ```
  Si un article contient des caractères HTML non échappés ou des balises provenant d'un contributeur externe, ils sont directement injectés dans le DOM sans étape de nettoyage (sanitization).
* **Impact :**
  Risque potentiel de XSS (Cross-Site Scripting) si le contenu Markdown provient un jour d'une source dynamique ou d'une base de données externe sans filtrage préalable.
* **Recommandation :**
  Échapper systématiquement les caractères spéciaux HTML (`<`, `>`, `&`, `"`) avant d'effectuer les remplacements par regex de mise en forme (`**bold**`, `*italic*`), ou utiliser un sanitizer d'éléments.

---

### 🟠 2.2. Absence d'un composant de secours pour les erreurs React (`ErrorBoundary`)
* **Fichiers impactés :** `src/main.tsx`, `src/AppRouter.tsx`
* **Constat :**
  L'application ne comporte aucun composant React `<ErrorBoundary>`.
* **Impact :**
  En cas d'exception non interceptée dans l'arbre de composants React (ex: un champ manquant inattendu dans un objet JS lors du rendu dynamique d'un article ou d'un cours), l'ensemble du DOM React se démonte, entraînant une "page blanche" sans message pour l'utilisateur ni bouton de rechargement.
* **Recommandation :**
  Rendre l'application résiliente en englobant `<AppContent />` dans un `ErrorBoundary` global qui affiche une interface d'erreur élégante en cas de crash imprévu.

---

### 🟢 2.3. Réponse d'erreur muette de la Cloud Function Chariow
* **Fichier impacté :** `functions/index.js` (fonction `listCourses`)
* **Constat :**
  Si la clé API Chariow n'est pas définie ou échoue, la fonction renvoie un statut `200 OK` avec un tableau vide `{ courses: [] }` :
  ```javascript
  if (!apiKey) return response.status(200).json({ courses: [] });
  ```
* **Impact :**
  Côté client (`src/pages/FormationsPage.tsx`), il est impossible de faire la différence entre une panne d'API Chariow et un catalogue qui ne contient réellement aucune formation. La page affiche "Aucune formation trouvée" alors qu'il s'agit d'une indisponibilité technique.
* **Recommandation :**
  Renvoyer un statut `503 Service Unavailable` ou un indicateur de statut de dégradation pour permettre au front-end d'afficher un message approprié ("Catalogue temporairement indisponible").

---

## 3. Sécurité, Sécrets & Protection des Données

### 🟠 3.1. Absence de limitation de débit (Rate Limiting) sur les Cloud Functions
* **Fichier impacté :** `functions/index.js` (`subscribeNewsletter`)
* **Constat :**
  La fonction `subscribeNewsletter` accepte toute requête `POST` sans contrôle de fréquence/IP ou jeton Firebase App Check.
* **Impact :**
  Un script malveillant pourrait soumettre des milliers de requêtes `POST` par minute pour spammer l'API Brevo, épuiser les quotas d'exécution des Firebase Cloud Functions ou polluer la collection Firestore `newsletter`.
* **Recommandation :**
  - Mettre en place **Firebase App Check** pour vérifier l'authenticité des requêtes émises depuis le domaine du site web.
  - Implémenter une vérification de fréquence basée sur l'adresse IP ou un captcha invisible.
  - S'assurer que les règles de sécurité Firestore (`firestore.rules`) bloquent les écritures directes du client Web vers la collection `newsletter` (`allow write: if false;`).

---

## 4. Affichage UI, Ergonomie & Expérience Utilisateur

### 🟢 4.1. Bouton de bascule de thème inactif dans l'en-tête
* **Fichier impacté :** `src/components/Header.tsx`
* **Constat :**
  Un bouton d'icône soleil (`.theme-toggle-btn`) est présent à côté du bouton "Newsletter", mais il ne possède aucun événement `onClick` ni gestionnaire d'état.
* **Impact :**
  L'utilisateur clique sur l'icône en s'attendant à basculer vers un mode sombre ou changer le thème, mais rien ne se produit.
* **Recommandation :**
  Soit connecter le bouton à un sélecteur de mode ou un message d'information, soit le masquer en attendant l'implémentation complète du toggle dynamique.

---

### 🟢 4.2. Léger saut visuel lors de la navigation par ancres d'URL
* **Fichier impacté :** `src/AppRouter.tsx` (`PageEffects`)
* **Constat :**
  Lors d'un changement de page avec une ancre (ex: `/services#pack`), `PageEffects` exécute immédiatement `window.scrollTo({ top: 0, behavior: "auto" })`, puis déclenche un `scrollIntoView` au bout de 80 millisecondes.
* **Impact :**
  Un saut visuel bref se produit : la page défile tout en haut une fraction de seconde avant de sauter directement vers l'ancre demandée.
* **Recommandation :**
  Bypass le `window.scrollTo(0, 0)` lorsque `location.hash` est présent et correspond à un élément existant dans le DOM.

---

## 5. SEO, Accessibilité (a11y) & Performance

### 🟢 5.1. Labels de formulaires dépendant uniquement des `placeholder`
* **Fichiers impactés :** `src/components/NewsletterBlock.tsx`, `src/pages/NewsletterPage.tsx`
* **Constat :**
  Les champs d'inscription (Prénom, Email) possèdent des attributs `placeholder` mais n'ont pas toujours d'élément `<label>` explicite ni d'attribut `aria-label`.
* **Impact :**
  Les logiciels de lecture d'écran pour déficients visuels peuvent rencontrer des difficultés à restituer le rôle exact de ces champs de saisie.
* **Recommandation :**
  Ajouter un attribut `aria-label` descriptif sur chaque balise `<input>` (ex: `aria-label="Votre prénom"`, `aria-label="Votre adresse email"`).

---

## 6. Plan d'Action Récapitulatif

| Ref | Catégorie | Description | Priorité |
|---|---|---|---|
| **2.1** | Robustesse | Échapper le HTML dans le parser Markdown maison du Blog | 🟠 P2 |
| **2.2** | Robustesse | Implémenter un `ErrorBoundary` React global | 🟠 P2 |
| **3.1** | Sécurité | Ajouter un Rate Limiting / App Check sur les Cloud Functions | 🟠 P2 |
| **2.3** | Architecture | Standardiser les codes d'erreur HTTP de la Cloud Function Chariow | 🟢 P3 |
| **4.1** | UI/UX | Rendre le bouton Theme Toggle fonctionnel ou le masquer | 🟢 P3 |
| **4.2** | UI/UX | Optimiser la transition de défilement vers les ancres `#hash` | 🟢 P3 |
| **5.1** | Accessibilité | Ajouter des attributs `aria-label` aux inputs de formulaires | 🟢 P3 |

---

### Conclusion
Le site est dans un état de fonctionnement **très solide et prêt pour la production**. La mise en œuvre des correctifs P2 recommandés ci-dessus permettra de garantir une sécurité maximale et une résilience parfaite face aux aléas réseau ou aux tentatives d'utilisation abusive.
