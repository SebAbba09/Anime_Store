from django.db import models
from django.utils.text import slugify
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, default="")
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Category.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.ForeignKey(
        Category,
        related_name="products",
        on_delete=models.CASCADE,
    )
    description = models.TextField(blank=True, default="")
    price = models.PositiveIntegerField(help_text="Prix en FCFA")
    stock = models.BooleanField(default=True, help_text="Produit en stock ?")

    badge = models.CharField(
        max_length=50, blank=True, default="",
        help_text="Ex: Populaire, Nouveau, Édition, Rare, etc.",
    )
    color = models.CharField(
        max_length=50, blank=True, default="brand-dark",
        help_text="brand-dark, brand, brand-soft",
    )
    style = models.CharField(
        max_length=100, blank=True, default="",
        help_text="Nom du style / univers (Ace, Naruto, Goku, etc.)",
    )
    popularity = models.PositiveIntegerField(
        default=50,
        help_text="Plus c'est grand, plus c'est mis en avant",
    )
    image = models.CharField(
        max_length=255, blank=True, default="",
        help_text="Chemin relatif, ex: images/products/figurine-ace.jpg",
    )
    tags = models.CharField(
        max_length=255, blank=True, default="",
        help_text="Tags séparés par des virgules (one piece, ace, collector)",
    )
    is_available = models.BooleanField(
        default=True,
        help_text="Produit visible sur le site (vs retiré)",
    )
    is_popular = models.BooleanField(
        default=False,
        help_text="Affiché dans les produits mis en avant (home)",
    )

    class Meta:
        ordering = ["-popularity", "name"]
        verbose_name = "Produit"
        verbose_name_plural = "Produits"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def get_tags_list(self):
        if not self.tags:
            return []
        return [t.strip() for t in self.tags.split(",") if t.strip()]

    def __str__(self):
        return f"{self.name} ({self.price:,} FCFA)"


# ---------------------------------------------------------------------------
# Commandes (Phase 11)
# ---------------------------------------------------------------------------

class Order(models.Model):
    STATUS_PENDING = "pending"
    STATUS_CONFIRMED = "confirmed"
    STATUS_DELIVERED = "delivered"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_PENDING, "En attente"),
        (STATUS_CONFIRMED, "Confirmée"),
        (STATUS_DELIVERED, "Livrée"),
        (STATUS_CANCELLED, "Annulée"),
    ]

    reference = models.CharField(
        max_length=20, unique=True, blank=True,
        help_text="Généré automatiquement (CMD-AAAAMMJJ-0001)",
    )
    customer_name = models.CharField(max_length=120, blank=True, default="")
    customer_whatsapp = models.CharField(
        max_length=30, blank=True, default="",
        help_text="Numéro WhatsApp du client, si fourni",
    )
    total = models.PositiveIntegerField(default=0, help_text="Total en FCFA")
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING,
    )
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Commande"
        verbose_name_plural = "Commandes"

    def save(self, *args, **kwargs):
        if not self.reference:
            today = timezone.now().strftime("%Y%m%d")
            prefix = f"CMD-{today}-"
            last = (
                Order.objects
                .filter(reference__startswith=prefix)
                .order_by("-reference")
                .first()
            )
            seq = 1
            if last:
                try:
                    seq = int(last.reference.rsplit("-", 1)[-1]) + 1
                except (ValueError, IndexError):
                    seq = 1
            self.reference = f"{prefix}{seq:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference} — {self.total:,} FCFA"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, related_name="items", on_delete=models.CASCADE,
    )
    product = models.ForeignKey(
        Product, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="order_items",
    )
    product_name = models.CharField(max_length=200)
    product_slug = models.CharField(max_length=220, blank=True, default="")
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.PositiveIntegerField(
        help_text="Prix unitaire au moment de la commande (FCFA)",
    )

    class Meta:
        verbose_name = "Article commandé"
        verbose_name_plural = "Articles commandés"

    @property
    def subtotal(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.quantity}× {self.product_name}"
