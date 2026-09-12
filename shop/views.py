import json
import urllib.parse

from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from .models import Product, Category, Order, OrderItem


# ---------------------------------------------------------------------------
# Vues frontend
# ---------------------------------------------------------------------------

@ensure_csrf_cookie
def home(request):
    featured_products = (
        Product.objects
        .filter(stock=True)
        .order_by("-popularity", "name")[:4]
    )
    return render(
        request,
        "home.html",
        {"featured_products": featured_products},
    )


@ensure_csrf_cookie
def catalog(request):
    query = request.GET.get("q", "").strip()
    category = request.GET.get("category", "").strip()
    sort = request.GET.get("sort", "popular")
    available_only = request.GET.get("available") == "on"

    products = Product.objects.all()

    if query:
        products = products.filter(
            Q(name__icontains=query)
            | Q(style__icontains=query)
            | Q(description__icontains=query)
            | Q(tags__icontains=query)
        )

    if category:
        products = products.filter(category__name=category)

    if available_only:
        products = products.filter(stock=True)

    if sort == "price-asc":
        products = products.order_by("price", "name")
    elif sort == "price-desc":
        products = products.order_by("-price", "name")
    else:
        products = products.order_by("-popularity", "name")

    categories_qs = Category.objects.all().order_by("name")
    categories = [cat.name for cat in categories_qs]
    category_counts = {
        cat.name: cat.products.count()
        for cat in categories_qs
    }

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
            "total_products": products.count(),
        },
    )


@ensure_csrf_cookie
def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)

    suggestions = (
        Product.objects
        .filter(category=product.category)
        .exclude(pk=product.pk)[:3]
    )

    if len(suggestions) < 3:
        extra = (
            Product.objects
            .order_by("-popularity", "name")
            .exclude(pk=product.pk)[: 3 - len(suggestions)]
        )
        suggestions = list(suggestions) + list(extra)

    whatsapp_number = "221771768690"
    whatsapp_message = (
        f"Bonjour Anime Store Dakar 👋\n"
        f"Je suis intéressé(e) par le produit suivant :\n"
        f"*{product.name}* — {product.price:,} FCFA\n"
        f"Pouvez-vous me confirmer la disponibilité ? Merci !"
    )
    whatsapp_url = (
        f"https://wa.me/{whatsapp_number}"
        f"?text={urllib.parse.quote(whatsapp_message)}"
    )

    return render(
        request,
        "product.html",
        {
            "product": product,
            "suggestions": suggestions,
            "whatsapp_url": whatsapp_url,
        },
    )


@ensure_csrf_cookie
def about(request):
    return render(request, "about.html")


@ensure_csrf_cookie
def contact(request):
    whatsapp_number = "221771768690"
    whatsapp_message = "Bonjour Anime Store Dakar 👋\nJ'ai une question pour vous :"
    whatsapp_url = (
        f"https://wa.me/{whatsapp_number}"
        f"?text={urllib.parse.quote(whatsapp_message)}"
    )
    return render(request, "contact.html", {"whatsapp_url": whatsapp_url})


# ---------------------------------------------------------------------------
# API — Enregistrement des commandes (Phase 11)
# ---------------------------------------------------------------------------

@require_POST
def create_order(request):
    """
    Enregistre une commande validée côté client.

    Accepte deux formats :
      - Panier groupé : { "items": [{"slug": ..., "quantity": ...}, ...] }
      - Mono produit  : { "single": {"slug": ..., "quantity": ...} }
    Plus les champs optionnels : customer_name, customer_whatsapp.
    """
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({"ok": False, "error": "JSON invalide"}, status=400)

    items = payload.get("items")
    if not items:
        single = payload.get("single")
        if isinstance(single, dict) and single.get("slug"):
            items = [single]

    if not isinstance(items, list) or not items:
        return JsonResponse({"ok": False, "error": "Panier vide"}, status=400)

    customer_name = (payload.get("customer_name") or "").strip()[:120]
    customer_whatsapp = (payload.get("customer_whatsapp") or "").strip()[:30]

    slugs = [str(i.get("slug", "")).strip() for i in items if i.get("slug")]
    products = {p.slug: p for p in Product.objects.filter(slug__in=slugs)}

    order = Order.objects.create(
        customer_name=customer_name,
        customer_whatsapp=customer_whatsapp,
        total=0,
    )

    total = 0
    for item in items:
        slug = str(item.get("slug", "")).strip()
        product = products.get(slug)
        if not product:
            continue

        try:
            qty = int(item.get("quantity", 1))
        except (TypeError, ValueError):
            qty = 1
        if qty < 1:
            qty = 1

        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            product_slug=product.slug,
            quantity=qty,
            unit_price=product.price,
        )
        total += product.price * qty

    order.total = total
    order.save(update_fields=["total"])

    return JsonResponse({
        "ok": True,
        "order_id": order.id,
        "reference": order.reference,
        "total": total,
    })
