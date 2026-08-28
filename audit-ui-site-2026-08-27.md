# Audit UI/UX et fonctionnement du site

Date : 27 août 2026  
Périmètre : Accueil, Services, Formations, Blog (liste et article), À propos, Newsletter, Contact, Histoires, Méthode et composants partagés.

## Synthèse

L’audit révèle deux groupes de problèmes bloquants : les cartes du Blog et plusieurs contenus de la page À propos utilisent encore des couleurs prévues pour un fond sombre alors que le thème rendu est clair. Le bouton de thème est également affiché mais ne déclenche aucun changement.

Le rendu responsive ne présente pas de débordement horizontal global aux dimensions testées, mais la barre des filtres du Blog déborde volontairement dans son propre conteneur sans indication claire de défilement. Le sommaire des articles est supprimé sur mobile sans alternative.

## Méthode et vérifications

- Lecture statique des composants React/TypeScript, des données, de `src/index.css`, de la configuration Firebase et du HTML d’entrée.
- Rendu local vérifié sur `http://127.0.0.1:3000` à 1280 px puis à 390×844 px.
- Routes principales parcourues : `/`, `/services`, `/formations`, `/blog`, `/a-propos`, `/contact`, `/newsletter`, `/histoires` et `/methode`. Un article a été rendu sur `/blog/ia-agentique-pme-abidjan-2026`.
- Contrôle de dimensions, couleurs calculées, images non chargées et état des contrôles dans le navigateur intégré.
- `npm run typecheck` : réussi.
- Aucun fichier applicatif n’a été corrigé pendant cet audit. Le seul livrable ajouté est ce rapport.
- Le bouton de thème a été testé : la classe HTML, la classe du body et la couleur de fond restent inchangées. Aucun sélecteur `.dark`, `data-theme` ou logique `prefers-color-scheme` n’a été trouvé ; le mode sombre n’est donc pas réellement implémenté.

## P0 — Bloquant / contenu invisible

### P0-01 — Titres, badges et liens des cartes Blog invisibles en thème clair

- Fichier / composant : `src/pages/BlogListPage.tsx`, cartes rendues aux lignes 59–75 ; `src/index.css` lignes 2696–2706.
- Problème : `.bc-title a` est blanc (`var(--white)`) sur une carte claire (`var(--card)`). Les catégories, temps de lecture et liens « Lire l’article » sont beige clair (`var(--beige)`) sur le même fond clair.
- Preuve de rendu : à 1280 px, la carte mesurée est `rgb(245, 241, 232)`, le titre `rgb(255, 255, 255)` et les badges/liens `rgb(250, 247, 240)`. Le texte est donc pratiquement indiscernable.
- Sélecteurs concernés : `.bc-category`, `.bc-readtime`, `.bc-title a`, `.bc-link`.
- Correction proposée : définir explicitement la palette du thème clair pour ces éléments (`var(--black)` ou `var(--muted)`), puis réserver les couleurs claires aux variantes de carte sombre. Ajouter un état hover/focus contrasté.

### P0-02 — Plusieurs blocs de la page À propos sont invisibles sur fond clair

- Fichier / composant : `src/pages/AboutPage.tsx`, statistiques lignes 36–60, timeline lignes 120–134 et certifications lignes 143–171 ; `src/index.css` lignes 2667–2686 et 2078–2171.
- Problème : les libellés des statistiques utilisent `var(--muted)` sur un fond noir alors que cette variable est un noir translucide ; le contraste est insuffisant. Les titres « Le Parcours », les âges, badges de timeline, le kicker des certifications, les titres de certifications et la conviction utilisent `var(--beige)`/`var(--white)` sur des fonds clairs.
- Preuve de rendu : `.stat-lbl` est `rgba(26,26,26,.72)` sur `rgb(10,10,10)` ; `.tm-badge` est blanc sur `rgb(245,241,232)` ; `.timeline-title`, `.tm-age` et `.cert-kicker` sont `rgb(250,247,240)` sur le fond de page clair.
- Sélecteurs concernés : `.stat-lbl`, `.timeline-title`, `.tm-age`, `.tm-badge`, `.cert-kicker`, `.cert h3`, `.conviction`.
- Correction proposée : établir une palette claire complète pour la page À propos et l’appliquer à tous les descendants, avec des exceptions documentées uniquement pour les cartes volontairement noires. Vérifier les quatre états statistiques et chaque carte de timeline/certification.

## P1 — Gênant / risque fonctionnel ou responsive

### P1-01 — Le bouton de thème est inerte

- Fichier / composant : `src/components/Header.tsx` lignes 48–65 ; styles `src/index.css` lignes 153–172.
- Problème : le bouton `.theme-toggle-btn` possède `type`, `aria-label` et `title`, mais aucun `onClick`, aucun état et aucun mécanisme d’application ou de mémorisation du thème.
- Vérification : après clic, le rendu reste en fond clair et les classes `html`/`body` ne changent pas.
- Correction proposée : soit implémenter réellement les deux thèmes avec un attribut/classe documenté, persistance et mise à jour de `aria-label`/`title`, soit retirer le contrôle tant que le mode sombre n’est pas disponible.

### P1-02 — Les labels du formulaire Contact sont invisibles

- Fichier / composant : `src/pages/BusinessPages.tsx` lignes 140–145 ; `src/index.css` lignes 3520–3535.
- Problème : `.contact-form label` est beige clair sur le fond beige de la page. Les champs eux-mêmes sont noirs, mais leurs intitulés placés au-dessus ne sont pas lisibles.
- Preuve de rendu : couleur calculée des trois labels `rgb(250,247,240)` sur fond de page `rgb(250,247,240)`.
- Correction proposée : utiliser `var(--black)` ou `var(--muted)` pour les labels en thème clair, et conserver la variante claire uniquement si le formulaire est placé sur une carte sombre.

### P1-03 — Les en-têtes du tableau de Méthode sont invisibles

- Fichier / composant : `src/pages/BusinessPages.tsx` ligne 89 ; `src/index.css` lignes 3499–3514.
- Problème : le caption et les cellules `th` utilisent `var(--beige)` alors que le tableau est rendu sur le fond clair.
- Preuve de rendu : `.landing-table caption` et `.landing-table th` sont `rgb(250,247,240)` sur un body `rgb(250,247,240)`.
- Correction proposée : passer le caption et les `th` en `var(--black)`/`var(--accent)` avec une bordure et un fond de tête suffisamment contrastés.

### P1-04 — Le widget « Processus métier » mélange des variantes de thème entre étapes

- Fichier / composant : `src/App.tsx` lignes 247–272 et 780–790 ; `src/index.css` lignes 1052–1085 puis 3149–3164.
- Problème : les règles `.flow-node:nth-child(2) .dot`, `.flow-node:nth-child(3) .dot` et `.flow-node:nth-child(4) .dot` imposent encore des couleurs et bordures prévues pour le thème sombre. Elles prennent le dessus sur la règle uniforme du thème clair.
- Preuve de rendu : les quatre étapes ont le même composant mais les couleurs calculées des icônes sont respectivement noir, blanc, beige et blanc ; certaines bordures sont également blanches et peu visibles. L’icône de la première étape n’a donc pas la même lisibilité que les trois suivantes.
- Correction proposée : supprimer les overrides `nth-child` hérités ou les scoper explicitement à une variante sombre. Définir un style de base unique pour les quatre dots, puis une classe d’état si une étape doit être mise en avant.

### P1-05 — Filtres du Blog coupés et défilement horizontal peu découvrable

- Fichier / composant : `src/pages/BlogListPage.tsx` lignes 34–50 ; `src/index.css` lignes 2689–2692.
- Problème : `.categories-bar` impose `width: max-content` et les boutons `white-space: nowrap`. Le conteneur autorise le scroll, mais aucun fondu, chevron, texte d’aide ou autre indicateur n’annonce la présence de contenu hors écran.
- Mesures : à 1280 px, le conteneur fait 1265 px et son contenu 1277 px ; le dernier filtre est partiellement coupé. À 390×844 px, le contenu interne fait environ 1200 px pour 375 px visibles.
- Correction proposée : garder un scroll horizontal mobile, mais limiter le contenu desktop à `max-width: 100%`, éviter le dépassement artificiel et ajouter un indicateur visuel non intrusif (fondu latéral/chevron) ou une instruction accessible. Vérifier aussi le scroll clavier.

### P1-06 — La troisième formation n’a pas de lien Chariow

- Fichier / composant : `src/data/courses.ts` lignes 75–91 ; `src/pages/FormationsPage.tsx` lignes 75–82.
- Problème : `pack-money-reset` a `chariowUrl: ""`. Son bouton ne redirige pas vers le produit comme les deux autres ; il bascule vers `/contact` avec « Demander le lien ».
- Correction proposée : renseigner l’URL Chariow complète et vérifiée. Le lien communiqué précédemment était tronqué (`prd_d9irfc...`) : il ne faut pas deviner la fin. À défaut, afficher explicitement « Lien bientôt disponible » plutôt qu’une CTA d’achat incohérente.

### P1-07 — Le sommaire des articles disparaît entièrement sur mobile

- Fichier / composant : `src/pages/BlogDetailPage.tsx` lignes 187–214 ; `src/index.css` lignes 3739–3748.
- Problème : à `max-width: 1024px`, `.article-sidebar { display:none; }`. Le sommaire, les boutons de résumé et le partage sont tous dans cette colonne ; aucune version inline du sommaire n’est rendue dans le contenu.
- Vérification : à 390×844 px, `.article-sidebar` est effectivement masqué.
- Correction proposée : transformer le sommaire en `<details>` ou bloc inline au-dessus de l’article sur mobile. Déplacer ou dupliquer uniquement les actions utiles (résumé/partage) dans une zone adaptée.

### P1-08 — Le formulaire Contact dépend de `mailto:` et n’a pas de retour fiable

- Fichier / composant : `src/App.tsx` lignes 24–25 et 443–450 ; `src/pages/BusinessPages.tsx` lignes 140–145.
- Problème : le formulaire de la page `/contact` est un formulaire HTML `action="mailto:..."`, dépendant du logiciel mail installé et sans état succès/erreur. Le formulaire d’accueil utilise un endpoint optionnel puis retombe sur `mailto:` si `VITE_CONTACT_ENDPOINT` est absent. Les deux parcours ne sont donc pas homogènes.
- Correction proposée : utiliser un endpoint serveur unique avec validation, état d’envoi et message de résultat. Si `mailto:` doit rester un mode de secours, le présenter comme tel et empêcher d’afficher un succès tant que l’ouverture du client mail n’est pas confirmée.

### P1-09 — La newsletter peut afficher un succès sur une réponse HTTP non conforme

- Fichier / composant : `src/lib/newsletter.ts` lignes 7–28 ; réécriture `firebase.json` lignes 32–40.
- Problème : le client ne vérifie que `response.ok`. Une réponse 200 provenant d’un fallback HTML ou d’une route mal configurée est parsée en `{}` puis considérée comme une inscription réussie par `NewsletterBlock` et `NewsletterPage`.
- Correction proposée : vérifier le type de contenu et `payload.success === true`, traiter toute réponse JSON non conforme comme une erreur et tester séparément la réécriture Firebase en préproduction.

### P1-10 — Le cadre présenté comme une vidéo n’est pas une vidéo ni un lien

- Fichier / composant : `src/pages/FormationsPage.tsx` lignes 19–34.
- Problème : `.formation-video-frame` est un `<div role="img">`. Le pictogramme lecture est un `<span aria-hidden="true">` sans interaction, sans `<video>`, sans iframe et sans lien vers une bande-annonce.
- Correction proposée : intégrer une vraie vidéo avec contrôles et poster, ou remplacer le pictogramme par un lien clairement libellé « Voir un extrait » vers une ressource existante. Ne pas présenter une maquette statique comme une vidéo fonctionnelle.

### P1-11 — L’indicateur de focus clavier est presque invisible sur le thème clair

- Fichier / composant : `src/index.css` lignes 54–57.
- Problème : `:focus-visible` utilise `outline: 2px solid var(--beige)` alors que le fond principal est lui-même `var(--beige)`. Les utilisateurs clavier peuvent ne pas voir le focus sur les liens et boutons posés sur fond clair.
- Correction proposée : utiliser une couleur de focus contrastée, par exemple `var(--black)` avec un second anneau accentué, et vérifier les contrôles sur fond noir et clair.

## P2 — Mineur / esthétique, maintenance ou accessibilité

### P2-01 — Le hero d’article est explicitement un placeholder générique

- Fichier / composant : `src/pages/BlogDetailPage.tsx` lignes 294–297 ; styles `src/index.css` lignes 3671–3672.
- Problème : chaque article affiche le même bloc décoratif « IA » au lieu d’une image ou d’un visuel propre à l’article. Le commentaire source le décrit lui-même comme un placeholder.
- Correction proposée : ajouter une image/illustration par article avec `alt` pertinent, ou assumer un composant décoratif sans le présenter comme une image éditoriale.

### P2-02 — Les badges du hero Blog sont collés sans espacement visuel

- Fichier / composant : `src/pages/BlogListPage.tsx` lignes 18–23.
- Problème : `.blog-badge-wrap`, `.blog-count-badge` et `.blog-location-badge` ne possèdent pas de règle dédiée dans `src/index.css`. Les deux `<span>` se suivent visuellement, ce qui produit notamment « articles publiésAbidjan ».
- Correction proposée : ajouter un wrapper flex avec `gap`, permettre le wrap sur mobile et donner aux deux badges une bordure/fond cohérents.

### P2-03 — Cascade CSS dupliquée et source d’incohérences

- Fichier / composant : `src/index.css`, notamment anciennes règles du widget autour des lignes 1013–1128, règles des pages routées autour de 2642–2733 et bloc « UNIFORM LIGHT THEME » autour de 3048–3379.
- Problème : plusieurs sélecteurs importants (`.flow-node`, `.article-quote`, `.course-meta`, etc.) sont redéfinis à des endroits éloignés. Les règles `nth-child` héritées ont précisément contredit la correction uniforme du thème clair.
- Correction proposée : regrouper les tokens, éliminer les règles mortes et organiser les styles par composant avec une seule variante claire/sombre explicitement nommée. Ajouter une vérification de non-régression visuelle.

### P2-04 — Coquille dans le nom du troisième produit

- Fichier / composant : `src/data/courses.ts` ligne 77 et nom de l’asset ligne 91.
- Problème : le texte utilisateur affiche « Ficher Excel » au lieu de « Fichier Excel ».
- Correction proposée : corriger le libellé visible ; conserver ou renommer l’asset séparément selon la stratégie de compatibilité des fichiers statiques.

### P2-05 — Dates et année codées en dur

- Fichier / composant : `src/pages/BlogDetailPage.tsx` lignes 350–358 (`Mai 2026`, `Vendredi 15 mai`) ; `src/components/Footer.tsx` ligne 92 (`© 2026`).
- Problème : le mini-calendrier est une maquette qui deviendra rapidement obsolète et l’année du copyright devra être maintenue manuellement.
- Correction proposée : dériver l’année du copyright de la date courante et utiliser les disponibilités Calendly réelles, ou indiquer clairement qu’il s’agit d’une illustration non interactive.

### P2-06 — Liens internes rendus avec `<a href>` au lieu de `Link`

- Fichier / composant : `src/App.tsx` ligne 886, `src/pages/AboutPage.tsx` ligne 96 et `src/pages/BusinessPages.tsx` lignes 70 et 137–138.
- Problème : plusieurs liens internes déclenchent un rechargement complet alors que les autres navigations utilisent React Router. Cela ralentit la navigation et peut réinitialiser l’état de page.
- Correction proposée : remplacer les chemins internes par `Link` ; conserver `<a>` pour WhatsApp, LinkedIn, Calendly et les adresses email externes.

### P2-07 — Alternatives textuelles vides sur les visuels de formation

- Fichier / composant : `src/pages/FormationsPage.tsx` lignes 24 et 52.
- Problème : les images de couverture ont `alt=""`, alors qu’elles contiennent du texte utile. Les titres sont répétés dans la carte, ce qui réduit l’impact du problème mais ne décrit pas correctement le visuel.
- Correction proposée : soit fournir un `alt` court et utile, soit documenter que la couverture est purement décorative et garantir que toutes les informations importantes figurent bien dans le HTML adjacent.

### P2-08 — Liens de résumé IA à comportement non garanti

- Fichier / composant : `src/pages/BlogDetailPage.tsx` lignes 63–65 et 230–233.
- Problème : les liens ouvrent `chat.openai.com/?q=...` et `claude.ai/new?q=...` avec une URL publique ou locale dans le paramètre. Le paramètre `q` ne garantit ni l’exécution automatique ni la lecture de l’article, particulièrement en environnement local.
- Correction proposée : libeller l’action comme « Ouvrir avec une consigne à copier », utiliser une URL/intent officiellement supportée si disponible, ou proposer un bouton de copie de la consigne avec confirmation.

### P2-09 — Parsing Markdown via `dangerouslySetInnerHTML`

- Fichier / composant : `src/pages/BlogDetailPage.tsx` lignes 75–181.
- Problème : le contenu local est transformé en HTML par remplacements regex puis injecté directement. C’est acceptable pour les chaînes statiques actuelles, mais fragile si le contenu devient administrable ou distant et insuffisant pour un vrai parseur Markdown.
- Correction proposée : utiliser un parseur Markdown avec sanitation contrôlée, ou produire les nœuds React sans HTML brut. Documenter l’hypothèse « contenu local de confiance » si elle est conservée.

### P2-10 — Fond noir transitoire incohérent avec le thème applicatif

- Fichier / composant : `index.html` lignes 30–37, comparé aux variables et au `body` de `src/index.css` lignes 11–48.
- Problème : le HTML initial force `html, body` à `#000000`, puis le CSS applicatif bascule vers `var(--beige)`. Sur une connexion lente ou un chargement différé, l’utilisateur peut voir un flash noir avant le rendu clair.
- Correction proposée : utiliser dès l’entrée la couleur de fond du thème clair, ou supprimer ce style inline et prévoir une stratégie de préchargement cohérente avec le thème réellement disponible.

## Points contrôlés sans anomalie bloquante

- Aucune image cassée n’a été détectée sur les routes principales contrôlées.
- Le document et le body ne présentent pas de débordement horizontal global à 1280 px ni à 390×844 px ; le problème est localisé à la barre de catégories du Blog.
- Les quatre cartes Services et les trois cartes Formations ont une structure répétée cohérente dans le rendu courant ; l’anomalie d’incohérence la plus nette reste le widget « Processus métier ».
- Les CTA WhatsApp, LinkedIn et Calendly possèdent des URLs externes explicites ; leur disponibilité réelle côté fournisseur n’a pas été validée depuis l’environnement local.
- Le flash noir initial de `index.html` est documenté en P2-10 ; il n’apparaît pas dans l’état stabilisé après rendu local.
