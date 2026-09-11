from django.shortcuts import render, get_object_or_404
from django.http import Http404


# ---------------------------------------------------------------------------
# Données fictives — seront remplacées par PostgreSQL + Admin Django (Phase 9)
# ---------------------------------------------------------------------------

PRODUCTS = [
    # ── Figurines ──────────────────────────────────────────────────────────
    {
        "slug": "figurine-naruto-hokage",
        "name": "Figurine Naruto Hokage",
        "category": "Figurines",
        "price": 18500,
        "badge": "Populaire",
        "stock": True,
        "color": "brand-dark",
        "style": "Naruto",
        "popularity": 98,
        "description": "Figurine collector de Naruto en tenue Hokage. Finition premium, socle inclus. Hauteur 22 cm.",
        "tags": ["shonen", "naruto", "collector"],
    },
    {
        "slug": "figurine-goku-ultra-instinct",
        "name": "Figurine Goku Ultra Instinct",
        "category": "Figurines",
        "price": 22000,
        "badge": "Édition",
        "stock": True,
        "color": "brand",
        "style": "Goku",
        "popularity": 95,
        "description": "Figurine articulée Dragon Ball Super — Goku en mode Ultra Instinct avec effet d'aura lumineux. Hauteur 28 cm.",
        "tags": ["dragon ball", "goku", "collector"],
    },
    {
        "slug": "figurine-demon-slayer-tanjiro",
        "name": "Figurine Tanjiro Kamado",
        "category": "Figurines",
        "price": 15000,
        "badge": "Nouveau",
        "stock": True,
        "color": "brand-dark",
        "style": "Tanjiro",
        "popularity": 91,
        "description": "Figurine Demon Slayer — Tanjiro en position de combat avec katana. Édition collector limitée.",
        "tags": ["demon slayer", "kimetsu", "collector"],
    },
    {
        "slug": "figurine-one-piece-luffy-gear5",
        "name": "Figurine Luffy Gear 5",
        "category": "Figurines",
        "price": 25000,
        "badge": "Rare",
        "stock": False,
        "color": "brand-soft",
        "style": "Luffy",
        "popularity": 99,
        "description": "Figurine One Piece — Monkey D. Luffy transformation Gear 5. Pièce rare très convoitée par les collectionneurs.",
        "tags": ["one piece", "luffy", "rare"],
    },
    # ── Vêtements ──────────────────────────────────────────────────────────
    {
        "slug": "hoodie-akatsuki-oversize",
        "name": "Hoodie Akatsuki Oversize",
        "category": "Vêtements",
        "price": 18000,
        "badge": "Bestseller",
        "stock": True,
        "color": "brand-dark",
        "style": "Akatsuki",
        "popularity": 97,
        "description": "Hoodie noir premium avec broderie nuage rouge Akatsuki dans le dos. Coupe oversize confortable. Tailles S à XXL.",
        "tags": ["naruto", "streetwear", "hoodie"],
    },
    {
        "slug": "tshirt-one-piece-luffy-vintage",
        "name": "T-shirt Luffy Vintage",
        "category": "Vêtements",
        "price": 8500,
        "badge": "Nouveau",
        "stock": True,
        "color": "brand",
        "style": "Vintage",
        "popularity": 87,
        "description": "T-shirt coton épais — graphique vintage Luffy effet usé. Style streetwear japonais. Disponible en blanc et noir.",
        "tags": ["one piece", "streetwear", "t-shirt"],
    },
    {
        "slug": "tshirt-attack-on-titan-scout",
        "name": "T-shirt Scout Regiment",
        "category": "Vêtements",
        "price": 9000,
        "badge": "Stock",
        "stock": True,
        "color": "brand-soft",
        "style": "Scout",
        "popularity": 82,
        "description": "T-shirt Attack on Titan — logo du Corps d'Exploration brodé sur la poitrine. Coton respirant, coupe moderne.",
        "tags": ["attack on titan", "aot", "scout"],
    },
    {
        "slug": "veste-anime-club-bomber",
        "name": "Veste Bomber Anime Club",
        "category": "Vêtements",
        "price": 28000,
        "badge": "Premium",
        "stock": True,
        "color": "brand-dark",
        "style": "Bomber",
        "popularity": 88,
        "description": "Veste bomber brodée avec motifs manga japonais. Doublure satinée. Édition limitée Anime Store Dakar.",
        "tags": ["bomber", "premium", "streetwear"],
    },
    # ── Mangas ─────────────────────────────────────────────────────────────
    {
        "slug": "manga-jjk-tome-1",
        "name": "Jujutsu Kaisen — Tome 1",
        "category": "Mangas",
        "price": 4500,
        "badge": "Classique",
        "stock": True,
        "color": "brand-soft",
        "style": "JJK",
        "popularity": 89,
        "description": "Le début de l'aventure de Yuji Itadori. Édition française VF. Couverture cartonnée collector.",
        "tags": ["jjk", "jujutsu", "shonen"],
    },
    {
        "slug": "manga-demon-slayer-edition-speciale",
        "name": "Demon Slayer — Édition Spéciale",
        "category": "Mangas",
        "price": 7500,
        "badge": "Édition",
        "stock": True,
        "color": "brand",
        "style": "Kimetsu",
        "popularity": 92,
        "description": "Coffret collector Demon Slayer tomes 1 à 3. Avec artbook exclusif et illustration bonus inédite.",
        "tags": ["demon slayer", "coffret", "collector"],
    },
    {
        "slug": "manga-solo-leveling-tome-1",
        "name": "Solo Leveling — Tome 1",
        "category": "Mangas",
        "price": 5000,
        "badge": "Tendance",
        "stock": True,
        "color": "brand-dark",
        "style": "Solo",
        "popularity": 94,
        "description": "Le manhwa phénomène enfin en format livre. Sung Jinwoo commence son ascension. Traduction française officielle.",
        "tags": ["solo leveling", "manhwa", "action"],
    },
    {
        "slug": "manga-one-piece-tome-100",
        "name": "One Piece — Tome 100",
        "category": "Mangas",
        "price": 6000,
        "badge": "Collector",
        "stock": False,
        "color": "brand",
        "style": "OP-100",
        "popularity": 96,
        "description": "Le tome historique numéro 100 de One Piece. Couverture spéciale gold foil. Pièce de collection incontournable.",
        "tags": ["one piece", "collector", "milestone"],
    },
    # ── Accessoires ────────────────────────────────────────────────────────
    {
        "slug": "tote-bag-manga-panel",
        "name": "Tote Bag Manga Panel",
        "category": "Accessoires",
        "price": 4000,
        "badge": "Goodies",
        "stock": True,
        "color": "brand-soft",
        "style": "Panel",
        "popularity": 73,
        "description": "Tote bag en coton épais avec impression de panels manga en noir et blanc. Capacité 15L. Anse longue.",
        "tags": ["tote bag", "manga", "goodies"],
    },
    {
        "slug": "poster-demon-slayer-neon",
        "name": "Poster Demon Slayer Néon",
        "category": "Accessoires",
        "price": 3500,
        "badge": "Déco",
        "stock": True,
        "color": "brand-dark",
        "style": "Poster",
        "popularity": 67,
        "description": "Affiche 50×70cm — composition néon Demon Slayer. Papier mat qualité galerie. Idéal pour chambre ou salon.",
        "tags": ["poster", "déco", "demon slayer"],
    },
    {
        "slug": "porte-cles-jjk-sukuna",
        "name": "Porte-clés Sukuna",
        "category": "Accessoires",
        "price": 2000,
        "badge": "Mini",
        "stock": True,
        "color": "brand",
        "style": "Sukuna",
        "popularity": 71,
        "description": "Porte-clés acrylique double face — Ryomen Sukuna. Finition brillante, 6 cm. Livraison en pochette cadeau.",
        "tags": ["porte-clés", "jjk", "sukuna"],
    },
    {
        "slug": "mug-anime-store-dakar",
        "name": "Mug Anime Store Dakar",
        "category": "Accessoires",
        "price": 3000,
        "badge": "Exclusif",
        "stock": True,
        "color": "brand-dark",
        "style": "Mug",
        "popularity": 65,
        "description": "Mug 33cl exclusif Anime Store Dakar. Impression céramique haute résistance. Résistant au lave-vaisselle.",
        "tags": ["mug", "exclusif", "goodies"],
    },
    {
        "slug": "pin-dragon-ball-set",
        "name": "Set de Pins Dragon Ball",
        "category": "Accessoires",
        "price": 3500,
        "badge": "Bundle",
        "stock": True,
        "color": "brand-soft",
        "style": "Pins",
        "popularity": 69,
        "description": "Set de 4 pins Dragon Ball — Goku, Vegeta, Piccolo, Frieza. Finition émaillée, dorure or. Présentoir inclus.",
        "tags": ["pins", "dragon ball", "bundle"],
    },
    {
        "slug": "pack-decouverte-otaku",
        "name": "Pack Découverte Otaku",
        "category": "Accessoires",
        "price": 12000,
        "badge": "Promo",
        "stock": True,
        "color": "brand",
        "style": "Pack",
        "popularity": 85,
        "description": "Pack surprise Otaku : 1 manga au choix, 1 poster, 1 porte-clés et 1 sticker pack. Le cadeau idéal pour un fan.",
        "tags": ["pack", "cadeau", "surprise"],
    },
]


# ---------------------------------------------------------------------------
# Vues
# ---------------------------------------------------------------------------

def home(request):
    featured_products = [p for p in PRODUCTS if p["stock"]][:4]
    return render(
        request,
        "home.html",
        {
            "featured_products": featured_products,
        },
    )


def catalog(request):
    query = request.GET.get("q", "").strip()
    category = request.GET.get("category", "").strip()
    sort = request.GET.get("sort", "popular")
    available_only = request.GET.get("available") == "on"

    products = PRODUCTS.copy()

    if query:
        products = [
            p for p in products
            if query.lower() in p["name"].lower()
            or query.lower() in p["style"].lower()
            or query.lower() in p["description"].lower()
            or any(query.lower() in tag for tag in p.get("tags", []))
        ]

    if category:
        products = [p for p in products if p["category"] == category]

    if available_only:
        products = [p for p in products if p["stock"]]

    if sort == "price-asc":
        products = sorted(products, key=lambda p: p["price"])
    elif sort == "price-desc":
        products = sorted(products, key=lambda p: p["price"], reverse=True)
    else:
        products = sorted(products, key=lambda p: p["popularity"], reverse=True)

    categories = sorted({p["category"] for p in PRODUCTS})
    category_counts = {cat: sum(1 for p in PRODUCTS if p["category"] == cat) for cat in categories}

    return render(
        request,
        "catalog.html",
        {
            "products": products,
            "categories": categories,
            "category_counts": category_counts,
            "selected_category": category,
            "query": query,
            "sort": sort,
            "available_only": available_only,
            "total_products": len(PRODUCTS),
        },
    )


def product_detail(request, slug):
    product = next((p for p in PRODUCTS if p["slug"] == slug), None)
    if not product:
        raise Http404("Produit introuvable")

    # Suggestions : même catégorie, sauf le produit courant
    suggestions = [
        p for p in PRODUCTS
        if p["category"] == product["category"] and p["slug"] != slug
    ][:3]

    # Si moins de 3, compléter avec des produits populaires
    if len(suggestions) < 3:
        extra = [
            p for p in sorted(PRODUCTS, key=lambda x: x["popularity"], reverse=True)
            if p["slug"] != slug and p not in suggestions
        ]
        suggestions += extra[: 3 - len(suggestions)]

    # Numéro WhatsApp et message pré-rempli
    whatsapp_number = "221771768690"
    whatsapp_message = (
        f"Bonjour Anime Store Dakar 👋\n"
        f"Je suis intéressé(e) par le produit suivant :\n"
        f"*{product['name']}* — {product['price']:,} FCFA\n"
        f"Pouvez-vous me confirmer la disponibilité ? Merci !"
    )
    import urllib.parse
    whatsapp_url = f"https://wa.me/{whatsapp_number}?text={urllib.parse.quote(whatsapp_message)}"

    return render(
        request,
        "product.html",
        {
            "product": product,
            "suggestions": suggestions,
            "whatsapp_url": whatsapp_url,
        },
    )


def about(request):
    return render(request, "about.html")


def contact(request):
    whatsapp_number = "221771768690"
    import urllib.parse
    whatsapp_message = "Bonjour Anime Store Dakar 👋\nJ'ai une question pour vous :"
    whatsapp_url = f"https://wa.me/{whatsapp_number}?text={urllib.parse.quote(whatsapp_message)}"

    return render(request, "contact.html", {"whatsapp_url": whatsapp_url})
