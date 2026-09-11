# Compte rendu global - Anime Store Dakar

Ce document est le point de reprise officiel du projet. Il peut être copié-collé intégralement dans une autre conversation (ChatGPT, Claude, Codex, etc.) pour reprendre le travail exactement là où il s'est arrêté, sans rien perdre ni repartir de zéro.

Dernière mise à jour : 11 septembre 2026

---

## 1. Contexte global du projet

**Anime Store Dakar** est un projet de boutique e-commerce / vitrine pour une enseigne basée à Dakar (Sénégal), spécialisée dans la pop culture japonaise, les mangas et l'univers Otaku.

### Objectifs du projet
- **V1 :** Site vitrine et catalogue interactif, mobile-first, moderne, ultra-rapide et professionnel.
- **Positionnement :** Crédible commercialement, chaleureux, haut de gamme (éviter l'effet « site amateur de fans »), pensé pour le marché sénégalais (prix en FCFA, contact direct WhatsApp, communauté Instagram).
- **Produits vendus :** Figurines collector, vêtements (hoodies, t-shirts), tomes & éditions spéciales de mangas, accessoires (colliers, bagues, porte-clés, posters néon, goodies).

### Coordonnées et réseaux intégrés
- **Numéro WhatsApp de contact / commande :** `+221 77 176 86 90` *(Note : numéro provisoire, un autre numéro +221 77 595 81 79 a été relevé sur Instagram et pourra être basculé si besoin)*
- **Lien chaîne / canal WhatsApp :** `https://whatsapp.com/channel/0029VbAhcRxISTkSzdlbYE1z`
- **Compte Instagram officiel :** `https://www.instagram.com/anime_store_dakar?stkn=d2w0bzBldWs3cWQ2` (`@anime_store_dakar`)

---

## 2. Emplacement et environnement local

- **Chemin local :** `D:\Download\Anime_Store`
- **Système d'exploitation :** Windows 11
- **Shell recommandé :** PowerShell (ou terminal PyCharm / VS Code)
- **Environnement virtuel Python actif :** `.\venv\Scripts\python.exe` (un dossier `.venv` existe également, mais `venv` est celui utilisé)

### Stack technique
- **Backend :** Python 3.14.4, Django 5.2.17
- **Frontend CSS :** Tailwind CSS v4.3.3 (compilé via `@tailwindcss/cli`), Vanilla CSS design system
- **Frontend JS :** JavaScript natif ES6+ (zéro dépendance lourde, animations au scroll & parallax fluides)
- **Base de données actuelle :** SQLite (`db.sqlite3` pour la phase de prototypage frontend)
- **Base de données cible (Phase 9) :** PostgreSQL

---

## 3. État technique actuel

Le projet est stable, fonctionnel et passe tous les contrôles sans avertissement bloquant.

### Routes fonctionnelles
| Route | Vue (`shop/views.py`) | Template | Description |
|---|---|---|---|
| `/` | `home` | `templates/home.html` | Page d'accueil complète (Hero, Stats, Vision, Parallax, Nouveautés, CTA) |
| `/boutique/` | `catalog` | `templates/catalog.html` | Catalogue avec filtres (recherche, catégories avec compteurs, tri prix/popularité, disponibilité en stock) |
| `/boutique/<slug>/` | `product_detail` | `templates/product.html` | Fiche produit complète (galerie, prix, stock, badges, bouton WhatsApp prérempli, garanties, suggestions) |
| `/a-propos/` | `about` | `templates/about.html` | Histoire de la boutique, engagements qualité, chiffres clés, valeurs |
| `/contact/` | `contact` | `templates/contact.html` | Hub de contact (WhatsApp direct, chaîne WhatsApp, Instagram, FAQ accordéon interactive) |
| `/admin/` | Admin Django | Par défaut | Administration Django (prête pour la Phase 10) |

---

## 4. Fichiers importants de l'arborescence

```text
Anime_Store/
├── COMPTE_RENDU_PROJET.md    # Le présent document de référence
├── manage.py                 # Point d'entrée Django
├── package.json              # Scripts npm (build:css, watch:css)
├── db.sqlite3                # Base SQLite de développement
├── config/                   # Configuration principale Django
│   ├── settings.py           # Configuration (STATICFILES_DIRS, TEMPLATES, etc.)
│   ├── urls.py               # Inclusion des URLs de shop et admin
│   └── wsgi.py
├── shop/                     # Application principale
│   ├── urls.py               # Définition des routes frontend
│   └── views.py              # Logique des vues (home, catalog, product_detail, about, contact) + catalogue PRODUCTS
├── static/
│   ├── src/
│   │   └── input.css         # Source CSS Tailwind v4 avec tokens, @theme et classes utilitaires
│   ├── dist/
│   │   └── output.css        # CSS compilé injecté dans base.html
│   └── js/
│       └── main.js           # Dark mode, menu mobile, parallax fluide, accordéon FAQ, effets scroll
└── templates/
    ├── base.html             # Layout principal (header sticky, navigation desktop/mobile, footer complet)
    ├── home.html             # Homepage immersive
    ├── catalog.html          # Catalogue de produits filtrable
    ├── product.html          # Fiche produit détaillée avec CTA commande
    ├── about.html            # Page À propos
    └── contact.html          # Page Contact & FAQ
```

---

## 5. Commandes PowerShell utiles

Toutes les commandes se lancent depuis la racine du projet (`D:\Download\Anime_Store`) :

```powershell
# 1. Se placer dans le dossier
cd D:\Download\Anime_Store

# 2. Compiler Tailwind CSS (One-shot)
npm run build:css

# 3. Compiler Tailwind CSS en continu (Watcher)
npm run watch:css

# 4. Vérifier l'intégrité de Django
.\venv\Scripts\python.exe manage.py check

# 5. Vérifier la syntaxe du fichier JavaScript
node --check .\static\js\main.js

# 6. Lancer le serveur local Django
.\venv\Scripts\python.exe manage.py runserver

# 7. Créer de nouvelles migrations (quand les modèles seront créés en Phase 9)
.\venv\Scripts\python.exe manage.py makemigrations
.\venv\Scripts\python.exe manage.py migrate
```

URLs de test local :
- **Accueil :** `http://127.0.0.1:8000/`
- **Catalogue :** `http://127.0.0.1:8000/boutique/`
- **Exemple fiche produit :** `http://127.0.0.1:8000/boutique/figurine-naruto-hokage/`
- **À propos :** `http://127.0.0.1:8000/a-propos/`
- **Contact & FAQ :** `http://127.0.0.1:8000/contact/`

---

## 6. Points d’attention Tailwind CSS (v4)

1. **Version Tailwind :** Le projet utilise Tailwind CSS **v4.3.3**. La syntaxe de configuration se trouve directement dans `static/src/input.css` via les directives `@theme` et `@custom-variant`.
2. **Fausses alertes de l'IDE :** Des messages du type `Unknown at-rule @theme`, `@layer`, ou `@custom-variant` peuvent apparaître dans PyCharm ou VS Code. **Ces avertissements ne sont pas des erreurs réelles.**
3. **Règle d'or de vérification :** Tant que la commande `npm run build:css` se termine avec succès (`Done in ...ms`), le CSS est valide. Ne supprimez jamais les directives Tailwind pour faire disparaître un avertissement cosmétique de l'éditeur.
4. **Recompilation obligatoire :** Après chaque modification d'un template HTML ajoutant de nouvelles classes utilitaires Tailwind, pensez à lancer `npm run build:css` (ou à laisser tourner `npm run watch:css`).

---

## 7. Classes du Design System

Le fichier `static/src/input.css` définit les classes réutilisables du projet :

### Palette de couleurs
- `brand` (`#6491A6`) : Bleu signature doux et élégant
- `brand-dark` (`#1F2235`) : Bleu nuit profond pour le contraste et le mode sombre
- `brand-soft` (`#D2DDF1` / versions opacifiées) : Teinte d'accent clair et fonds doux

### Typographie
- Titres expressifs : `font-heading` (`Dancing Script`)
- Texte courant : `font-sans` (`Poppins`)

### Classes utilitaires métier
- **Conteneurs et sections :**
  - `.container-page` : Conteneur centré avec marges responsives et max-width maîtrisé.
  - `.section-page` : Padding vertical standardisé pour les sections.
  - `.section-title`, `.section-subtitle`, `.eyebrow` : Titrages harmonisés.
- **Boutons :**
  - `.btn` : Base interactive avec transitions douces.
  - `.btn-primary` : Bouton d'action principal (teinte brand / accentuation).
  - `.btn-secondary` : Bouton secondaire avec bordure fine et fond translucide.
  - `.btn-light` : Bouton contrasté pour zones sombres.
  - `.icon-button` : Boutons ronds pour actions rapides (dark mode toggle, etc.).
- **Composants d'affichage :**
  - `.card`, `.card-soft` : Cartes de contenu avec bordure subtile et fond adaptatif light/dark.
  - `.product-card` : Carte produit complète avec effet hover, badge et image responsive.
  - `.badge`, `.badge-primary`, `.badge-soft` : Badges d'état (Disponibilité, Nouveauté, Édition, Promo).
  - `.hero-shell`, `.commerce-panel`, `.media-frame` : Panneaux visuels premium.
  - `.stat-card` : Tuiles statistiques pour la réassurance client.
- **Composants interactifs :**
  - `.nav-link`, `.nav-link-active` : Liens de navigation avec animations de survol.
  - `.form-label`, `.form-field` : Champs de formulaire standardisés.
  - `.parallax-product-section`, `.parallax-product-column`, `.parallax-product-tile` : Effets de parallaxe scroll.
  - `.scroll-stroke-section` : Effet de tracé au défilement.

---

## 8. État des phases

| Phase | Intitulé | Statut | Détails |
|---|---|---|---|
| **Phase 0** | Cadrage et identité | **Terminée** | Palette `#6491A6` / `#1F2235`, univers Otaku élégant. |
| **Phase 1** | Initialisation Django | **Terminée** | Projet configuré, application `shop`, settings prêts. |
| **Phase 2** | Design system Tailwind v4 | **Terminée** | `input.css` avec design tokens, mode sombre/clair, classes utilitaires. |
| **Phase 3** | Layout global | **Terminée** | `base.html` avec navigation responsive, footer complet, toggle dark mode. |
| **Phase 4** | Homepage | **Terminée** | `home.html` avec sections complètes, parallax natif, micro-interactions. |
| **Phase 5** | Catalogue frontend | **Terminée** | `catalog.html` avec 18 produits, recherche, filtres par catégorie, tri, stock. |
| **Phase 6** | Fiche produit | **Terminée** | `product.html` avec galerie, détails, stock, commande WhatsApp personnalisée, suggestions. |
| **Phase 7** | Pages secondaires | **Terminée** | `about.html` (histoire/valeurs) et `contact.html` (liens réels + FAQ accordéon). |
| **Phase 8** | Panier frontend & commande WhatsApp | **À faire (Prochaine étape)** | Panier en JavaScript/localStorage, récapitulatif, génération du message WhatsApp. |
| **Phase 9** | Backend PostgreSQL & Modèles Django | **À faire** | Modèles `Product`, `Category`, `Order`, migrations. |
| **Phase 10** | Administration Django | **À faire** | Gestion des stocks, images multiples, catégories dans l'admin. |
| **Phase 11** | Commandes & notifications WhatsApp | **À faire** | Suivi et historisation des commandes. |
| **Phase 12** | Sécurité production | **À faire** | `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, HTTPS. |
| **Phase 13** | SEO & Métadonnées | **À faire** | OpenGraph tags, sitemap, balises Twitter Card. |
| **Phase 14** | Déploiement | **À faire** | Hébergement (VPS/PaaS), Gunicorn, Nginx/Caddy. |

---

## 9. Suite des phases à respecter

Pour conserver une progression propre et sans bugs, respecter scrupuleusement l'ordre suivant :

### 🎯 Prochaine priorité : Phase 8 — Panier frontend & finalisation WhatsApp
1. **Système de panier côté client (`static/js/cart.js` ou dans `main.js`) :**
   - Stockage du panier dans `localStorage` (persistance hors rechargement).
   - Bouton « Ajouter au panier » sur la fiche produit (`product.html`) et sur les cartes du catalogue (`catalog.html`).
   - Tiroir latéral (drawer) ou modale pour afficher les articles sélectionnés, ajuster les quantités, voir le total en FCFA.
2. **Génération du message WhatsApp groupé :**
   - Regrouper tous les articles du panier en un message WhatsApp clair et formaté :
     ```text
     Bonjour Anime Store Dakar 👋
     Je souhaite commander les articles suivants :
     - 1x Figurine Naruto Hokage (18 500 FCFA)
     - 2x Collier L Death Note (5 000 FCFA)
     Total : 23 500 FCFA
     Pouvez-vous me confirmer la disponibilité et les modalités de livraison à Dakar ?
     ```
   - Bouton de validation qui redirige directement vers l'API WhatsApp (`https://wa.me/221771768690?text=...`).

### 🎯 Étape suivante : Phase 9 — Modèles de données Django & Base de données
1. Passer des données fictives de `shop/views.py` (`PRODUCTS`) à de vrais modèles Django dans `shop/models.py` :
   - `Category` (nom, slug, description, image)
   - `Product` (nom, slug, catégorie, description, prix, stock, disponible, populaire, badge, tags)
   - `ProductImage` (relation 1-n pour les galeries de photos réelles)
2. Exécuter les migrations et configurer PostgreSQL (ou SQLite pour les tests intermédiaires).

### 🎯 Étape suivante : Phase 10 — Interface d'administration
1. Personnaliser `shop/admin.py` avec `list_display`, filtres, recherche, inlines d'images pour faciliter la saisie par le gérant de la boutique.

---

## 10. Règles de développement à conserver

- **Ne jamais repartir de zéro :** Le code existant est validé, structuré et modulaire.
- **Inspecter avant de modifier :** Toujours vérifier le contenu actuel des fichiers avec les outils d'inspection avant toute modification.
- **Pas de sur-architecture prématurée :** Garder le JavaScript natif sans frameworks lourds (React/Vue ne sont pas nécessaires ici).
- **Conserver la compatibilité PowerShell :** Séparateurs de commandes avec `;` (et non `&&` qui peut échouer sur certaines versions de PowerShell).
- **Vérification systématique après chaque ajout :**
  ```powershell
  npm run build:css ; .\venv\Scripts\python.exe manage.py check ; node --check .\static\js\main.js
  ```

---

## 11. Message court de reprise à copier-coller ailleurs

> **Message de reprise de session :**
>
> « Tu reprends le développement du projet Django **Anime Store Dakar**, situé localement dans `D:\Download\Anime_Store`.
>
> **Contexte :** Boutique e-commerce vitrine pour le Sénégal (Dakar), univers Otaku/manga haut de gamme.
> **Stack :** Django 5.2.17, Python 3.14.4 (`.\venv\Scripts\python.exe`), Tailwind CSS v4.3.3, JS natif, SQLite/PostgreSQL.
> **État d'avancement :** Les Phases 1 à 7 sont terminées et vérifiées :
> - Layout global (`templates/base.html`), dark/light mode fonctionnel.
> - Homepage immersive (`templates/home.html`) avec parallax et animations.
> - Catalogue interactif complet (`templates/catalog.html`) avec filtres, recherche et tri.
> - Fiche produit complète (`templates/product.html`) avec bouton de commande WhatsApp direct.
> - Pages À propos (`templates/about.html`) et Contact/FAQ (`templates/contact.html`).
> - Vrais liens réseaux intégrés : WhatsApp `+221 77 176 86 90`, canal WhatsApp et Instagram `@anime_store_dakar`.
>
> **Tâche prioritaire actuelle :** Réaliser la **Phase 8 (Panier frontend interactif & commande groupée WhatsApp)** :
> 1. Gestion d'un panier en JavaScript natif avec `localStorage`.
> 2. Boutons d'ajout au panier sur le catalogue et la fiche produit.
> 3. Tiroir latéral (drawer) récapitulatif avec quantités, suppression et total en FCFA.
> 4. Bouton de finalisation générant un message WhatsApp pré-formaté avec tous les articles du panier envoyé au `+221 77 176 86 90`.
>
> **Rappel commandes de build & test :**
> `npm run build:css ; .\venv\Scripts\python.exe manage.py check ; .\venv\Scripts\python.exe manage.py runserver`
> Ne pas toucher aux directives `@theme` dans `static/src/input.css` (Tailwind v4 fonctionne parfaitement). Consulte `COMPTE_RENDU_PROJET.md` pour tous les détails. »
