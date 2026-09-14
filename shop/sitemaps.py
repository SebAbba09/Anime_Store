"""
Sitemaps — aide Google à indexer toutes les pages du site.
"""

from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from .models import Product, Category


class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = "weekly"
    protocol = "https"

    def items(self):
        return ["home", "catalog", "about", "contact"]

    def location(self, item):
        return reverse(item)


class CategorySitemap(Sitemap):
    priority = 0.7
    changefreq = "weekly"
    protocol = "https"

    def items(self):
        return Category.objects.all()

    def location(self, obj):
        return f"{reverse('catalog')}?category={obj.name}"


class ProductSitemap(Sitemap):
    priority = 0.9
    changefreq = "weekly"
    protocol = "https"

    def items(self):
        return Product.objects.filter(is_available=True)

    def lastmod(self, obj):
        # Utilise la date de la dernière migration/update si dispo
        # Sinon, pas de lastmod (Google utilisera sa propre date)
        return None

    def location(self, obj):
        return reverse("product_detail", kwargs={"slug": obj.slug})