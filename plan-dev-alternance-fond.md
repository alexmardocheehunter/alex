# Plan dev — Alternance de fond beige / noir sur la page d'accueil

Objectif : remplacer le fond noir dominant actuel par une alternance beige/noir par section, pour créer un rythme de lecture (respiration claire ↔ impact sombre) sur `alexmardochee.web.app`.

## 1. Palette à utiliser

Réutiliser les couleurs déjà définies sur le site (visibles notamment dans les paramètres du widget Calendly) :

- **Noir** : `#0a0a0a` (fond des sections sombres)
- **Beige** : `#e4d9be` (fond des sections claires — à ajuster si besoin en une teinte un peu plus claire pour rester lisible avec du texte noir dessus, ex. `#f0e9d8`, à valider visuellement)
- **Texte sur fond noir** : `#f5f3ef` (blanc cassé / beige clair actuel)
- **Texte sur fond beige** : noir ou gris très foncé (à définir — probablement `#1a1a1a`, ne pas réutiliser le beige clair comme texte ici, contraste insuffisant)

## 2. Séquence des sections (page d'accueil, dans l'ordre du scroll)

| # | Section | Fond | Note |
|---|---|---|---|
| 1 | Hero ("Faites travailler l'intelligence artificielle...") | **Noir** | Reste inchangé, impact d'entrée |
| 2 | Histoires clients (Adjoua, Koffi, Yedo, etc. — "01 — Ils l'ont fait") | **Beige** | Changement demandé |
| 3 | Comment ça marche (workflow + Playground/system prompt — "02") | **Noir** | Reste en noir : renforce l'univers "tech/IA" |
| 4 | Services ("03 — Services") | **Beige** | |
| 5 | À propos, bloc teaser home ("04 — À propos") | **Noir** | Court bloc avant la conversion finale |
| 6 | Contact / FAQ ("05 — On y va ?" + questions fréquentes) | **Beige** | |
| 7 | Newsletter CTA + Footer | **Noir** | Déjà en noir, ne change pas |

Résultat visuel : **noir → beige → noir → beige → noir → beige → noir**, jamais deux fonds identiques consécutifs (sauf newsletter + footer qui restent collés comme un seul bloc de clôture volontaire).

## 3. Points d'implémentation à vérifier par le dev

1. **Contraste texte/fond** : recalculer tous les contrastes (WCAG AA minimum) pour chaque section qui passe en beige — titres, texte courant, liens, boutons.
2. **Boutons et CTA** : les styles de bouton actuellement pensés pour ressortir sur noir (bordures, hover, ombres) doivent être adaptés ou dupliqués en version "sur fond clair" pour les sections beige.
3. **Icônes et visuels** : vérifier les icônes/illustrations (emoji, pictos SVG) dans les sections Histoires et Services — s'assurer qu'elles restent lisibles sur beige (certaines pouvaient avoir un fond ou une ombre pensés pour du noir).
4. **Transitions entre sections** : éviter un changement de fond trop brutal — prévoir soit une transition douce (dégradé léger sur 20-40px), soit une bordure/séparateur discret entre chaque section.
5. **Cohérence sur les autres pages** : ce plan concerne la page d'accueil. Décider si les pages Histoires, Services, Formations, Blog, À propos, Contact, Newsletter (actuellement chacune sur un fond uniforme) doivent suivre la même logique d'alternance ou rester en un seul fond dominant — **à trancher séparément, hors scope de cette page**.
6. **Widget Calendly intégré** : ses couleurs (`background_color=0a0a0a`, `text_color=f5f3ef`, `primary_color=e4d9be`) sont indépendantes du fond de la page — vérifier qu'il reste bien lisible s'il est affiché dans une section qui passe en beige.

## 4. Hors scope pour cette itération

- Le contenu texte et la structure des sections ne changent pas, uniquement les fonds.
- Pas de changement sur la palette globale (beige/noir/blanc reste la direction validée).
