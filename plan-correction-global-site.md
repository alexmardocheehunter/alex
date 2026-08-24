# Plan de correction global — Site Alex Mardochée
Synthèse au 24 août 2026 — regroupe l'audit initial (liens, cohérence) + le plan de correction V4 (bugs fonctionnels, LinkedIn, Brevo)

---

## 1. Récapitulatif des priorités

| Priorité | Problème | Impact |
|---|---|---|
| 🔴 Critique | Page Formation → écran noir | Site inutilisable sur cette section |
| 🔴 Critique | 3 liens Chariow cassés (404) sur `/formations` | Impossible d'acheter les formations — perte de vente directe | ( test les post ( pour recuperer les vrais formations qui sont sur chariow ))
| 🔴 Critique | Filtres des articles → ne fonctionnent pas | Blocage de la navigation utilisateur |
| 🔴 Critique | Inscription newsletter Brevo → échec | Perte de leads (urgence commerciale) |
| 🟠 Élevée | Formulaire newsletter → erreur d'enregistrement | Perte de leads |
| 🟡 Moyenne | Incohérence durée audit offert : "15 min" (Services, Contact) vs "30 min" (Accueil, Calendly réel) | Prospect mal informé au moment de réserver |
| 🟡 Moyenne | Titres trop gros → contenu coupé en bas | Expérience utilisateur dégradée |
| 🟡 Moyenne | Qualité des réponses FAQ trop faible | Manque de crédibilité / conversion |
| 🟢 Faible | Texte "Actualisation du catalogue…" resté visible sur `/formations` | Donne une impression de page inachevée |
| 🟢 Faible | Lien "Prendre contact" (page À propos) pointe vers `#contact` au lieu de `/contact` | Incohérence de navigation |
| 🟢 Faible | CTA newsletter → libellé à modifier | Amélioration du taux de conversion (déjà fait sur la capture) |
| 🟢 Faible | Ajout bouton LinkedIn (À propos + Footer) | Renforcement de la crédibilité et du réseau |
| 🟢 Faible | Logo introuvable à 2 endroits (Favicon + Barre de navigation) | Identité de marque absente |
| 🟢 Faible | Doublon d'articles (boucle double) | Contenu dupliqué à corriger |
| 🟢 Faible | Section "À propos" sur la page d'accueil trop longue | Déséquilibre UX |

---

## 2. Problèmes critiques

### 2.1. Page Formation → écran noir
À documenter avec le dev (repro exacte, navigateur/device concernés) — bloque totalement l'accès à la section formations.

### 2.2. Liens Chariow cassés (404) — `/formations`
Les 3 boutons "Découvrir →" renvoient une erreur 404 :
- `chariow.com/alexmardochee/maitriser-ia-automatisation-business`
- `chariow.com/alexmardochee/excel-expert-finance-syscohada`
- `chariow.com/alexmardochee/agents-whatsapp-business-intelligence`

**Action** : reconfirmer les slugs actuels dans le dashboard Chariow (produits peut-être renommés ou dépubliés) et mettre à jour les liens sur le site.

### 2.3. Filtres des articles ne fonctionnent pas
Bloque la navigation dans le blog par catégorie.

### 2.4. Inscription newsletter Brevo → échec
Message d'erreur systématique : *« Impossible d'enregistrer votre inscription pour le moment. »*

**Causes probables (par fréquence)**

| Cause | Explication |
|---|---|
| Clé API invalide ou manquante | Absente des variables d'environnement ou expirée |
| Mauvais `listIds` | ID de liste Brevo incorrect ou inexistant |
| Attributs non reconnus | Ex. `PRENOM` ne correspond pas exactement à l'attribut créé dans Brevo |
| Email déjà existant | `updateEnabled` pas à `true` |
| Erreur de format | Corps de requête non-JSON ou header `Content-Type` absent |
| CORS | Appel direct à l'API Brevo depuis le front (interdit → passer par un proxy backend) |

**Spécifications API Brevo**

| Élément | Détail |
|---|---|
| Base URL | `https://api.brevo.com/v3` |
| Authentification | header `api-key: xxxxxx` |
| Endpoint création contact | `POST /contacts` |
| Endpoint ajout à une liste | `POST /contacts/lists/{listId}/contacts/add` |
| Paramètres obligatoires | `email` (ou `ext_id` ou `SMS`) |
| Paramètres optionnels | `attributes` (ex. `{"PRENOM":"Alex"}`), `listIds` (tableau d'IDs) |
| Mise à jour si existant | `updateEnabled: true` |
| Force merge | `forceMerge: true` |
| Codes d'erreur | 400 (email invalide), 401 (clé API), 404 (liste introuvable), 409 (conflit) |

**Actions correctives**

| # | Action | Responsable |
|---|---|---|
| 1 | Récupérer l'ID de la liste (Brevo → Contacts → Listes) | Admin / Backend |
| 2 | Régénérer la clé API (Brevo → Paramètres → Clés API) | Admin |
| 3 | Créer un proxy backend `/api/subscribe` — ne jamais exposer la clé côté front | Backend |
| 4 | Vérifier que les attributs (ex. `PRENOM`) existent en MAJUSCULES dans Brevo | Backend |
| 5 | Ajouter `updateEnabled: true` (évite l'erreur 409 sur contact existant) | Backend |
| 6 | Ajouter `forceMerge: true` (évite les conflits de doublons) | Backend |
| 7 | Tester la requête en `curl` avant intégration | Backend |
| 8 | Distinguer les messages d'erreur affichés (email invalide / déjà inscrit / erreur serveur) | Frontend |

**Exemple backend (Node.js)**
```javascript
// Endpoint /api/subscribe
app.post('/api/subscribe', async (req, res) => {
  const { email, prenom } = req.body;

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        attributes: { PRENOM: prenom || '' },
        listIds: [4], // ← ID de la liste Brevo
        updateEnabled: true,
        forceMerge: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo error:', errorData);
      return res.status(response.status).json({ error: errorData });
    }

    res.json({ success: true, message: 'Inscription réussie !' });
  } catch (error) {
    console.error('Network error:', error);
    res.status(500).json({ error: 'Erreur réseau' });
  }
});
```

**Test curl**
```bash
curl -X POST https://api.brevo.com/v3/contacts \
  -H 'api-key: xxxxxx' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@exemple.com","listIds":[4],"updateEnabled":true}'
```

**Vérification post-correction**
- Le nouvel email apparaît dans Brevo → Contacts → liste concernée.
- Un email déjà existant est mis à jour, pas rejeté.

---

## 3. Priorité élevée

### 3.1. Formulaire newsletter → erreur d'enregistrement
Lié au point 2.4 — à valider avec le même correctif backend.

---

## 4. Priorité moyenne

### 4.1. Incohérence durée de l'audit offert (15 min vs 30 min)
- Accueil : "Audit Flash — 30 min, offert" ✅ (cohérent avec Calendly, configuré en "30 Minute Meeting")
- Services : bouton "Obtenir un audit offert de **15 minutes**" ❌
- Contact : meta-description "Réservez un audit automatisation de **15 minutes**" ❌

**Action** : harmoniser Services et Contact sur "30 minutes" pour correspondre au vrai créneau Calendly.

### 4.2. Titres trop gros → contenu coupé en bas
Réduire à `1.25rem` / `1.5rem` et augmenter les marges.

### 4.3. Qualité des réponses FAQ trop faible
Enrichir les réponses, notamment sur l'OCR et les délais concrets.

---

## 5. Priorité faible

### 5.1. Texte "Actualisation du catalogue…" visible sur `/formations`
Semble être un texte d'état de chargement resté affiché en dur dans le contenu final. À vérifier et retirer si non voulu.

### 5.2. Lien "Prendre contact" (page À propos) incohérent
Pointe actuellement vers `https://alexmardochee.web.app/#contact` (ancre sur la home) alors que partout ailleurs sur le site, "Contact" pointe vers la page dédiée `/contact`.

**Action** : harmoniser vers `/contact`.

### 5.3. CTA newsletter — libellé
Remplacer par : *« Chaque vendredi, je t'envoie des astuces IA et mes outils gratuits par email. »* (déjà fait sur la capture de référence).

### 5.4. Ajout bouton LinkedIn (À propos + Footer)

**Emplacements**
- Section "À propos" : bouton "Voir mon profil LinkedIn" → `https://www.linkedin.com/in/alexmardoche/`
- Footer : icône ou lien texte LinkedIn vers le même profil

**Actions correctives**

| # | Action | Responsable |
|---|---|---|
| 1 | Ajouter le bouton dans la section "À propos" (sous le texte de présentation) | Frontend |
| 2 | Ajouter le lien dans le footer (zone réseaux sociaux / liens utiles) | Frontend |
| 3 | Utiliser l'icône LinkedIn (ex. FontAwesome `fab fa-linkedin`) ou un bouton texte | Frontend |
| 4 | Vérifier l'ouverture en nouvel onglet (`target="_blank"`) | QA |

**Exemple de code**
```html
<a href="https://www.linkedin.com/in/alexmardoche/" target="_blank" rel="noopener noreferrer" class="btn-linkedin">
  <i class="fab fa-linkedin"></i> Voir mon profil LinkedIn
</a>
```

### 5.5. Logo introuvable (Favicon + Barre de navigation)
Vérifier que `logo-alex.png` est bien référencé comme favicon et affiché dans le header sur toutes les pages.

### 5.6. Doublon d'articles (boucle double)
Supprimer la boucle qui affiche les articles en double dans la liste du blog.

### 5.7. Section "À propos" sur la page d'accueil trop longue
Résumer à : Nom + Poste + bouton "En savoir plus" (renvoyant vers la page `/a-propos` complète).

---

## 6. Plan de test post-correction

| Cas de test | Critère de succès |
|---|---|
| Page Formation | S'affiche avec la liste des produits type course, plus d'écran noir |
| Liens Chariow (3 formations) | Chaque lien "Découvrir →" mène à la bonne page produit, plus de 404 |
| Filtres Articles | Cliquer sur un filtre change la liste affichée |
| Inscription newsletter | L'email est enregistré dans Brevo, message de confirmation affiché |
| Durée audit offert | "30 minutes" affiché de façon cohérente sur Accueil, Services, Contact |
| Texte "Actualisation du catalogue…" | N'apparaît plus une fois la page chargée |
| Lien "Prendre contact" (À propos) | Renvoie vers `/contact` |
| Bouton LinkedIn (À propos) | Visible, redirige vers le bon profil, nouvel onglet |
| Bouton LinkedIn (Footer) | Présent et fonctionnel |
| Page d'accueil — À propos | Affiche uniquement Nom + Poste + bouton "En savoir plus" |
| FAQ | Réponses détaillées, incluent l'OCR et des délais concrets |
| Favicon | L'onglet du navigateur affiche le logo personnalisé |
| Barre de navigation | Le header affiche `logo-alex.png` sur toutes les pages |
| Articles du blog | Plus de doublons dans la liste |
