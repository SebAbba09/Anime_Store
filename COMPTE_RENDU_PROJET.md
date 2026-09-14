# Compte Rendu Global & Rapport d'Audit — Anime Store Dakar

Ce document est le document de référence et le point de reprise officiel du projet **Anime Store Dakar**. Il consigne l'état des lieux complet, les nettoyages, les corrections de bugs, les mesures de sécurité appliquées, les instructions de déploiement et la feuille de route d'évolution.

**Dernière mise à jour :** 14 septembre 2026  
**Statut global :** Production-Ready (Phases 0 à 14 complètes)

---

## 1. Contexte Global du Projet

**Anime Store Dakar** est une boutique e-commerce vitrine moderne et haut de gamme dédiée à la pop culture japonaise, aux mangas et à l'univers Otaku, spécialement conçue pour le marché sénégalais (Dakar).

### Positionnement & Objectifs
- **Crédibilité commerciale :** Tarification transparente en Francs CFA (XOF), service client réactif via WhatsApp, communauté engagée sur Instagram.
- **Catalogue produits :** Figurines collector officielles, vêtements streetwear Otaku (haoris, t-shirts oversize), mangas et éditions collector, accessoires japonais (colliers, bagues, porte-clés).
- **Parcours d'achat adapté :** Panier fluide avec constitution de commande groupée et finalisation directe sur WhatsApp (canal d'achat n°1 au Sénégal).

### Coordonnées et Liens Officiels
- **Numéro WhatsApp officiel de commande :** `+221 77 595 81 79` (lien direct : [https://wa.me/221775958179](https://wa.me/221775958179))
- **Canal WhatsApp officiel :** [https://whatsapp.com/channel/0029VbAhcRxISTkSzdlbYE1z](https://whatsapp.com/channel/0029VbAhcRxISTkSzdlbYE1z)
- **Compte Instagram :** [https://www.instagram.com/anime_store_dakar](https://www.instagram.com/anime_store_dakar) (`@anime_store_dakar`)
- **Dépôt GitHub :** [https://github.com/SebAbba09/Anime_Store](https://github.com/SebAbba09/Anime_Store)
- **Déploiement Vercel :** [https://anime-store-dakar.vercel.app](https://anime-store-dakar.vercel.app) *(ou alias du projet)*

---

## 2. Stack Technique & Environnement

- **Système d'exploitation :** Windows 11 / Linux (production Vercel)
- **Backend :** Python 3.14 (local) / Python 3.12 (Vercel runtime), Django 5.2.17
- **Base de données :** PostgreSQL hébergé sur **Supabase** (avec fallback automatique SQLite en local), piloté via `psycopg 3` (`psycopg[binary]>=3.1.18`) et `dj-database-url`.
- **Frontend CSS :** Tailwind CSS v4.3.3 compilé via `@tailwindcss/cli`, tokens de design personnalisés (`brand`, `brand-dark`, `brand-soft`).
- **Frontend JS :** JavaScript natif ES6+ modulaire :
  - `static/js/cart.js` : gestion complète du panier (`localStorage`), drawer latéral, badge dynamique, envoi asynchrone `/api/orders/`, intégration WhatsApp.
  - `static/js/main.js` : Dark mode, navigation spotlight, scroll reveal, accords FAQ, parallaxe, tilt 3D, flip-fade text et coverflow 3D.
- **Fichiers Statiques :** WhiteNoise avec compression et hachage (`CompressedStaticFilesStorage`).
- **Déploiement :** Vercel Serverless WSGI (`@vercel/python`) avec pipeline de build automatisé (`build_files.sh`).

---

## 3. État des Lieux & Synthèse des Actions Entreprises

### État Initial
- Projet fonctionnel en local et connecté à Supabase, mais comportant des anomalies bloquantes pour la production :
  - Un bug d'imbrication de balise template cassant le HTML et les métadonnées SEO Schema.org.
  - Une mauvaise déclaration de l'option de désactivation des curseurs Supabase au niveau du module `settings.py`.
  - Des commandes "fantômes" (total 0 FCFA) pouvant être persistées lors de requêtes avec articles invalides.
  - Absence de script de build pour la collecte des statiques sur Vercel.
  - Ancien numéro de téléphone non uniforme dispersé dans les templates et les scripts.

### Actions Entreprises
1. **Correction des bugs bloquants** (SEO, base de données, concurrence, validation).
2. **Nettoyage complet** des fichiers résiduels (`main.py`, `.backup`).
3. **Remplacement systématique du numéro de contact** par `+221 77 595 81 79` (`221775958179`) dans l'ensemble des fichiers (Python, templates HTML, JavaScript).
4. **Renforcement de la sécurité** (headers HTTP, validation des payloads, atomicité des transactions).
5. **Préparation Vercel** (`build_files.sh`, `vercel.json`, `requirements.txt`).
6. **Tests et vérification automatisée** de l'ensemble des routes et des fonctionnalités API.

---

## 4. Détail Exhaustif des Corrections & Mesures Appliquées

### A. Nettoyages et Ajustements Effectués
- **Suppression des fichiers orphelins :** Suppression du fichier modèle PyCharm `main.py` et des sauvegardes temporaires (`input.css.backup`).
- **Uniformisation des variables de configuration :** Centralisation de `SITE_WHATSAPP_NUMBER = "221775958179"` dans `config/settings.py` et transmission globale via `shop/context_processors.py`.
- **Harmonisation des dépendances dans `requirements.txt` :** Remplacement de `psycopg2-binary` par `psycopg[binary]==3.2.13` (Psycopg v3) et ajout explicite de `pillow==12.3.0` correspondant exactement à l'environnement d'exécution.
- **Nettoyage des décorateurs dans `shop/views.py` :** Suppression du doublon `@ensure_csrf_cookie` sur la vue `home`.

### B. Bugs Corrigés et Améliorations Apportées
1. **Correction de la balise `twitter_image` et `schema_extra` (`templates/product.html`) :**
   - *Cause :* Le bloc `{% block schema_extra %}` était imbriqué à l'intérieur de `{% block twitter_image %}` sans fermeture préalable.
   - *Effet néfaste :* L'intégralité du `<script type="application/ld+json">` était injectée dans l'attribut HTML `content=""` de la meta Twitter Card de `base.html`, corrompant le DOM et laissant le bloc Schema.org vide.
   - *Résolution :* Fermeture immédiate de `{% block twitter_image %}` par `{% endblock %}` avant la déclaration indépendante de `{% block schema_extra %}`.
2. **Prise en compte des curseurs Supabase dans `config/settings.py` :**
   - *Cause :* `DISABLE_SERVER_SIDE_CURSORS = True` était déclaré au niveau racine du module.
   - *Effet néfaste :* Django ignore les variables de module ; le pooler PgBouncer de Supabase (port 6543 en mode transaction) aurait planté lors de requêtes préparées.
   - *Résolution :* Configuration directe dans le dictionnaire de base de données : `DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True`.
3. **Élimination des commandes fantômes dans `shop/views.py` :**
   - *Cause :* `Order.objects.create(...)` était appelé avant l'itération et la validation des slugs produits.
   - *Résolution :* Validation préalable de l'existence des produits et de leur disponibilité (`is_available=True`), calcul préalable du montant total, et rejet avec HTTP 400 si le panier est vide ou invalide.
4. **Atomicité des commandes (`django.db.transaction`) :**
   - *Résolution :* Enveloppement de la création de la commande et de ses `OrderItem` dans `with transaction.atomic():` pour garantir qu'aucune commande incomplète ne peut être enregistrée en cas d'erreur.
5. **Prévention des collisions de référence de commande (`shop/models.py`) :**
   - *Résolution :* Ajout d'une boucle de vérification d'unicité avant l'attribution finale de `CMD-AAAAMMJJ-XXXX` dans `Order.save()`.
6. **URLs HTTPS dans les Sitemaps (`shop/sitemaps.py`) :**
   - *Résolution :* Ajout de `protocol = "https"` sur `StaticViewSitemap`, `CategorySitemap` et `ProductSitemap`.

### C. Mesures de Sécurité Mises en Place
- **Protection des variables sensibles :** Maintien strict de `.env`, `db.sqlite3` et `staticfiles/` dans `.gitignore`. Aucune clé secrète n'est exposée dans les templates ni dans le dépôt Git.
- **En-têtes de sécurité HTTP ajoutés dans `config/settings.py` :**
  - `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` : détection fiable du protocole sécurisé derrière le reverse-proxy Vercel.
  - `SECURE_CONTENT_TYPE_NOSNIFF = True` : protection contre le reniflage MIME.
  - `X_FRAME_OPTIONS = "DENY"` : protection absolue contre le clickjacking.
  - En production (`DEBUG = False`) : activation automatique de `SESSION_COOKIE_SECURE = True` et `CSRF_COOKIE_SECURE = True`.
- **Validation stricte des entrées utilisateur :**
  - Troncature et assainissement des champs `customer_name` (120 car.) et `customer_whatsapp` (30 car.).
  - Validation et forçage de la quantité (`qty >= 1`).
  - Échappement des caractères spéciaux dans les JSON-LD (`escapejs`).

---

## 5. Recommandations pour le Futur

### 🎨 Recommandations Visuelles & UX
- **Formats d'image Next-Gen (WebP/AVIF) :** Convertir les images produits JPG/PNG en WebP compressé pour accélérer le chargement mobile sur les connexions 4G à Dakar.
- **Skeleton Loaders :** Ajouter des placeholders animés lors du chargement des images dans la galerie et le catalogue.
- **Indicateur de stock visuel :** Afficher un badge "Plus que 2 exemplaires" lorsque le stock est faible pour créer un sentiment d'urgence d'achat.

### ⚙️ Recommandations Fonctionnelles
- **Paiement mobile local (Wave & Orange Money) :** Intégrer une passerelle de paiement sénégalaise (ex : PayTech Sénégal, CinetPay ou Wave Business API) en complément du contact WhatsApp.
- **Recherche prédictive (Autocomplete) :** Connecter l'overlay de recherche (Ctrl+K) à un endpoint d'autocomplétion renvoyant des aperçus instantanés avec image et prix.
- **Gestion des avis clients :** Permettre aux clients ayant reçu leur commande d'ajouter un avis avec note sur la fiche produit.

### 🛡️ Recommandations de Sécurité
- **Rate-Limiting sur `/api/orders/` :** Mettre en place `django-ratelimit` pour limiter le nombre de requêtes POST par minute par adresse IP et prévenir tout abus.
- **Monitoring Sentry :** Ajouter le SDK `sentry-sdk` pour être notifié instantanément en cas d'erreur 500 en production sur Vercel.
- **Rotation de `SECRET_KEY` :** S'assurer que la clé utilisée sur Vercel est distincte et générée aléatoirement via `django.core.management.utils.get_random_secret_key()`.

---

## 6. Étapes de Maintenance Régulière

1. **Sauvegardes de la base Supabase :** Vérifier que les backups automatiques quotidiens sont actifs dans le tableau de bord Supabase.
2. **Mises à jour de sécurité des dépendances :** Exécuter périodiquement `pip list --outdated` et tester les mises à jour mineures de Django et Psycopg.
3. **Contrôle des statiques WhiteNoise :** Après chaque modification de feuille de style, exécuter `npm run build:css` puis `python manage.py collectstatic --noinput`.
4. **Vérification de l'indexation Google Search Console :** Soumettre `https://<domaine>/sitemap.xml` dans Google Search Console pour surveiller la couverture des pages et la validité des données Schema.org.

---

## 7. Tableau Récapitulatif des Phases

| Phase | Intitulé | Statut | Synthèse |
|---|---|---|---|
| **Phase 0** | Cadrage et identité | **Terminée** | Palette `#6491A6` / `#1F2235`, univers Otaku haut de gamme. |
| **Phase 1** | Initialisation Django | **Terminée** | Architecture Django 5.2, modularité application `shop`. |
| **Phase 2** | Design system Tailwind v4 | **Terminée** | `input.css` avec design tokens, mode sombre/clair, classes utilitaires. |
| **Phase 3** | Layout global | **Terminée** | `base.html`, navigation responsive, footer, drawer panier, dark mode. |
| **Phase 4** | Homepage | **Terminée** | Sections immersives, coverflow, parallaxe, CTA WhatsApp. |
| **Phase 5** | Catalogue dynamique | **Terminée** | Filtres multi-critères, recherche, tri, gestion du stock. |
| **Phase 6** | Fiche produit dynamique | **Terminée** | Galerie, sélecteur de quantité, suggestions, Schema.org corrigé. |
| **Phase 7** | Pages secondaires | **Terminée** | Pages `/a-propos/` (Team reveal, flip-fade) et `/contact/` (FAQ). |
| **Phase 8** | Panier frontend & WhatsApp | **Terminée** | `cart.js`, persistance `localStorage`, drawer fluide, conversion WhatsApp. |
| **Phase 9** | Modèles & Supabase | **Terminée** | Modèles `Category`, `Product`, PostgreSQL Supabase, psycopg v3. |
| **Phase 10** | Administration Django | **Terminée** | Admin complète avec inlines d'articles, filtres et sécurité. |
| **Phase 11** | Historisation commandes | **Terminée** | Modèles `Order` & `OrderItem`, `/api/orders/`, fail-safe WhatsApp. |
| **Phase 12** | Sécurité & Environnement | **Terminée** | Headers HTTP de sécurité, isolation `.env`, curseurs Supabase fixés. |
| **Phase 13** | SEO & Métadonnées | **Terminée** | OpenGraph, Twitter Cards, Schema.org validé, `robots.txt`, `sitemap.xml`. |
| **Phase 14** | Déploiement Vercel | **Terminée** | `vercel.json`, `build_files.sh`, WSGI serverless, WhiteNoise. |

---

## 8. Commandes Clés d'Exploitation

```powershell
# 1. Compiler les styles Tailwind v4
npm run build:css

# 2. Vérifier l'intégrité Django
.\venv\Scripts\python.exe manage.py check

# 3. Collecter les statiques WhiteNoise
.\venv\Scripts\python.exe manage.py collectstatic --noinput

# 4. Lancer le serveur local
.\venv\Scripts\python.exe manage.py runserver

# 5. Déployer sur Vercel en production
npx vercel --prod
```
