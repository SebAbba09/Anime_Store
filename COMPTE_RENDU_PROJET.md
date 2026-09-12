# Compte rendu global - Anime Store Dakar

Ce document est le point de reprise officiel du projet. Il peut être copié-collé intégralement dans une autre conversation (ChatGPT, Claude, Codex, etc.) pour reprendre le travail exactement là où il s'est arrêté, sans rien perdre ni repartir de zéro.

Dernière mise à jour : 12 septembre 2026

---

## 1. Contexte global du projet

**Anime Store Dakar** est une boutique e-commerce vitrine moderne pour une enseigne basée à Dakar (Sénégal), spécialisée dans la pop culture japonaise, les mangas et l\'univers Otaku.

### Objectifs du projet
- **Positionnement :** Crédible commercialement, chaleureux, haut de gamme, pensé pour le marché sénégalais (prix en FCFA, contact direct WhatsApp, communauté Instagram).
- **Produits vendus :** Figurines collector, vêtements (haoris, t-shirts oversize), tomes & éditions spéciales de mangas, accessoires (colliers, bagues, porte-clés, goodies).

### Coordonnées et réseaux intégrés
- **Numéro WhatsApp de contact / commande :** +221 77 176 86 90
- **Lien chaîne / canal WhatsApp :** https://whatsapp.com/channel/0029VbAhcRxISTkSzdlbYE1z
- **Compte Instagram officiel :** https://www.instagram.com/anime_store_dakar (@anime_store_dakar)
- **Dépôt GitHub public :** https://github.com/SebAbba09/Anime_Store

---

## 2. Emplacement et environnement local

- **Chemin local :** D:\\Download\\Anime_Store
- **Système d\'exploitation :** Windows 11
- **Shell recommandé :** PowerShell
- **Environnement virtuel Python actif :** .\\venv\\Scripts\\python.exe
- **Dépôt Git :** Branche main synchronisée avec origin/main

### Stack technique
- **Backend :** Python 3.14.4, Django 5.2.17
- **Frontend CSS :** Tailwind CSS v4.3.3 (compilé via @tailwindcss/cli), Vanilla CSS design system
- **Frontend JS :** JavaScript natif ES6+ (module cart.js pour le panier et l'envoi API, main.js pour thème & animations)
- **Base de données actuelle :** PostgreSQL distant hébergé sur **Supabase** via psycopg 3.2.13 (avec fallback SQLite en local sans .env), 4 catégories et 23 produits peuplés
- **Gestion des statiques :** WhiteNoise avec compression (CompressedStaticFilesStorage)
- **Déploiement cible :** Vercel (ercel.json, uild_files.sh, 
equirements.txt)

---

## 3. État technique actuel

Le projet est stable, fonctionnel, connecté à la base PostgreSQL Supabase via l\'ORM Django, et passe tous les contrôles d\'intégrité sans aucune erreur.

### Routes fonctionnelles
| Route | Vue (shop/views.py) | Template / Type | Description |
|---|---|---|---|
| / | home | 	emplates/home.html | Accueil immersive (Hero, Stats, Vision, Parallax, Nouveautés, CTA) |
| /boutique/ | catalog | 	emplates/catalog.html | Catalogue dynamique branché à PostgreSQL (recherche multi-critères, catégories, tri, stock, ajout direct panier) |
| /boutique/<slug>/ | product_detail | 	emplates/product.html | Fiche produit dynamique (galerie, détails, stock, tags, sélecteur quantité, ajout panier, commande directe WhatsApp) |
| /a-propos/ | bout | 	emplates/about.html | Histoire de la boutique, engagements qualité, chiffres clés, valeurs |
| /contact/ | contact | 	emplates/contact.html | Hub de contact (WhatsApp direct, chaîne WhatsApp, Instagram, FAQ accordéon) |
| /api/orders/ | create_order | API JSON (POST) | Enregistrement automatique des commandes en base avant ouverture de WhatsApp |
| /admin/ | Admin Django | Interface Django | Administration complète pour Category, Product, Order et OrderItem |

---

## 4. Fichiers importants de l\'arborescence

`	ext
Anime_Store/
├── COMPTE_RENDU_PROJET.md    # Le présent document de référence
├── manage.py                 # Point d'entrée Django
├── package.json              # Scripts npm (build:css, watch:css)
├── requirements.txt          # Dépendances Python (Django, whitenoise, python-dotenv, dj-database-url, psycopg)
├── vercel.json               # Configuration de déploiement Vercel (WSGI + static build)
├── build_files.sh            # Script de build Vercel (pip install, collectstatic, migrate)
├── .env                      # Variables d'environnement locales (SECRET_KEY, DATABASE_URL, etc.)
├── .gitattributes            # Normalisation des fins de ligne (LF pour scripts .sh)
├── .editorconfig             # Configuration de l'éditeur
├── db.sqlite3                # Base SQLite locale de fallback
├── seed_product.py           # Script d'injection initiale des produits en base
├── config/                   # Configuration principale Django
│   ├── settings.py           # Settings (WhiteNoise, Supabase/dj_database_url, TEMPLATES, etc.)
│   ├── urls.py               # URLs principales (shop + admin)
│   └── wsgi.py               # Entrée WSGI avec alias app pour Vercel
├── shop/                     # Application principale
│   ├── admin.py              # Interface d'administration pour Category, Product, Order, OrderItem
│   ├── models.py             # Modèles Django Category, Product, Order, OrderItem
│   ├── migrations/           # Migrations Django appliquées (0001_initial.py, 0002_order_orderitem.py)
│   ├── urls.py               # Définition des routes frontend et API (/api/orders/)
│   └── views.py              # Vues dynamiques Django ORM et endpoint create_order
├── static/
│   ├── src/
│   │   └── input.css         # Source CSS Tailwind v4 avec tokens, @theme et classes utilitaires
│   ├── dist/
│   │   └── output.css        # CSS compilé injecté dans base.html
│   ├── images/products/      # Images réelles des produits (haoris, figurines, porte-clés)
│   └── js/
│       ├── main.js           # Dark mode, menu mobile, parallax fluide, FAQ accordéon
│       └── cart.js           # Panier (localStorage, tiroir drawer, synchro API orders, WhatsApp, toasts)
└── templates/
    ├── base.html             # Layout principal (header avec badge panier, drawer panier, footer complet)
    ├── home.html             # Homepage immersive
    ├── catalog.html          # Catalogue de produits filtrable avec boutons d'ajout direct
    ├── product.html          # Fiche produit avec sélecteur de quantité (+/-) et ajout panier
    ├── about.html            # Page À propos
    └── contact.html          # Page Contact & FAQ
`

---

## 5. Commandes PowerShell utiles

Toutes les commandes se lancent depuis la racine du projet (D:\\Download\\Anime_Store) :

`powershell
# 1. Se placer dans le dossier
cd D:\\Download\\Anime_Store

# 2. Compiler Tailwind CSS (One-shot)
npm run build:css

# 3. Compiler Tailwind CSS en continu (Watcher)
npm run watch:css

# 4. Vérifier l'intégrité de Django
.\\venv\\Scripts\\python.exe manage.py check

# 5. Tester la collecte des statiques WhiteNoise
.\\venv\\Scripts\\python.exe manage.py collectstatic --noinput

# 6. Vérifier la syntaxe des scripts JavaScript
node --check .\\static\\js\\main.js
node --check .\\static\\js\\cart.js

# 7. Lancer le serveur local Django
.\\venv\\Scripts\\python.exe manage.py runserver

# 8. Créer de nouvelles migrations / appliquer les migrations
.\\venv\\Scripts\\python.exe manage.py makemigrations
.\\venv\\Scripts\\python.exe manage.py migrate

# 9. Re-peupler les produits et catégories en base si besoin
.\\venv\\Scripts\\python.exe seed_product.py
`

URLs de test local :
- **Accueil :** http://127.0.0.1:8000/
- **Catalogue :** http://127.0.0.1:8000/boutique/
- **Fiche produit exemple :** http://127.0.0.1:8000/boutique/figurine-naruto-hokage/
- **À propos :** http://127.0.0.1:8000/a-propos/
- **Contact & FAQ :** http://127.0.0.1:8000/contact/
- **Administration Django :** http://127.0.0.1:8000/admin/

---

## 6. État d\'avancement des phases

| Phase | Intitulé | Statut | Détails |
|---|---|---|---|
| **Phase 0** | Cadrage et identité | **Terminée** | Palette #6491A6 / #1F2235, univers Otaku élégant. |
| **Phase 1** | Initialisation Django | **Terminée** | Projet configuré, application shop, settings prêts. |
| **Phase 2** | Design system Tailwind v4 | **Terminée** | input.css avec design tokens, mode sombre/clair, classes utilitaires. |
| **Phase 3** | Layout global | **Terminée** | ase.html avec navigation responsive, footer, drawer panier, dark mode. |
| **Phase 4** | Homepage | **Terminée** | home.html avec sections complètes, parallax natif, micro-interactions. |
| **Phase 5** | Catalogue frontend | **Terminée** | catalog.html avec filtres recherche, catégorie, tri, stock et ajout panier. |
| **Phase 6** | Fiche produit | **Terminée** | product.html avec sélecteur quantité, ajout panier, commande directe, suggestions. |
| **Phase 7** | Pages secondaires | **Terminée** | bout.html et contact.html (liens réels WhatsApp/Instagram + FAQ accordéon). |
| **Phase 8** | Panier frontend & WhatsApp | **Terminée** | Module cart.js, tiroir latéral animé, localStorage, badges, commande WhatsApp groupée. |
| **Phase 9** | Modèles Django & Base de données | **Terminée** | Modèles Category et Product créés, migrés et peuplés sur PostgreSQL Supabase (23 produits, 4 catégories). |
| **Phase 10** | Administration Django | **Terminée** | CategoryAdmin, ProductAdmin et OrderAdmin configurés, superuser ash opérationnel sur Supabase. |
| **Phase 11** | Commandes & notifications WhatsApp | **Terminée** | Modèles Order et OrderItem, endpoint /api/orders/, historisation automatique lors du clic WhatsApp. |
| **Phase 12** | Sécurité production | **Terminée** | Secrets dans .env, DEBUG configurable, ALLOWED_HOSTS, WhiteNoise pour les statiques, psycopg configuré. |
| **Phase 13** | SEO & Métadonnées | **À faire (Prochaine priorité)** | Balises OpenGraph (titre, image de partage, description), Twitter Cards, balises meta canonical, robots.txt et sitemap.xml. |
| **Phase 14** | Déploiement Vercel / Cloud | **Prête pour mise en ligne** | Fichiers ercel.json, uild_files.sh, 
equirements.txt, .gitattributes en place. |

---

## 7. Suite des phases à respecter

### 🎯 Prochaine priorité : Phase 13 — SEO, Réseaux Sociaux & Métadonnées
1. **Balises OpenGraph et Twitter Cards dans 	emplates/base.html :**
   - og:title, og:description, og:image (visuel de partage WhatsApp / Facebook / Instagram), og:url.
   - Permet d'avoir un aperçu élégant et professionnel quand on partage le lien du site sur WhatsApp ou les réseaux.
2. **Métadonnées dynamiques par produit dans 	emplates/product.html :**
   - Remplacer le titre et la description par le nom et l'image du produit spécifique lors du partage.
3. **Fichiers 
obots.txt et sitemap.xml :**
   - Permettre l'indexation par Google et les moteurs de recherche.

### 🎯 Étape suivante : Phase 14 — Déploiement final sur Vercel
1. Pousser la branche sur GitHub.
2. Connecter le dépôt sur Vercel.
3. Configurer les variables d'environnement sur Vercel (SECRET_KEY, DEBUG=False, DATABASE_URL).
4. Vérifier le déploiement en direct.

---

## 8. Message court de reprise à copier-coller ailleurs

> **Message de reprise de session :**
>
> « Tu reprends le développement du projet Django **Anime Store Dakar**, situé localement dans D:\\Download\\Anime_Store.
>
> **Contexte :** Boutique e-commerce vitrine pour le Sénégal (Dakar), univers Otaku/manga haut de gamme.
> **Stack :** Django 5.2.17, Python 3.14.4 (.\\venv\\Scripts\\python.exe), Tailwind CSS v4.3.3, JS natif, PostgreSQL Supabase (avec fallback SQLite), WhiteNoise.
> **État d'avancement :** Les Phases 1 à 12 et 14 sont terminées :
> - Frontend complet et responsive avec Tailwind v4 et Vanilla JS.
> - Panier client complet (static/js/cart.js) avec drawer latéral, localStorage et génération de commande WhatsApp.
> - Backend Django ORM (shop/models.py, shop/views.py) : Category, Product, Order, OrderItem.
> - Base de données PostgreSQL **Supabase** connectée, migrée et peuplée (23 produits, 4 catégories, superuser ash).
> - API /api/orders/ pour enregistrer automatiquement chaque commande en base de données lors du clic de validation WhatsApp.
> - Administration Django complète avec inlines d'articles commandés.
> - Configuration de production et déploiement prête (ercel.json, uild_files.sh, 
equirements.txt, WhiteNoise).
> - Dépôt GitHub public synchronisé : https://github.com/SebAbba09/Anime_Store.
>
> **Tâche prioritaire actuelle :** Passer à la **Phase 13 (SEO & Métadonnées OpenGraph)** :
> 1. Ajouter les balises OpenGraph et Twitter Card dans ase.html et product.html pour des aperçus riches lors des partages sur WhatsApp et les réseaux sociaux.
> 2. Mettre en place 
obots.txt et le sitemap.xml.
> 3. Lancer le premier déploiement Vercel.
>
> **Rappel commandes de build & test :**
> 
pm run build:css ; .\\venv\\Scripts\\python.exe manage.py check ; .\\venv\\Scripts\\python.exe manage.py runserver
> Ne pas toucher aux directives @theme dans static/src/input.css (Tailwind v4 fonctionne parfaitement). Consulte COMPTE_RENDU_PROJET.md pour tous les détails. »
