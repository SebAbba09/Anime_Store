from django.contrib import admin
from .models import Category, Product, Order, OrderItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "order", "slug")
    list_editable = ("order",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name", "category", "price",
        "stock", "is_available", "is_popular", "popularity",
    )
    list_filter = ("category", "stock", "is_available", "is_popular")
    search_fields = ("name", "description", "tags", "style")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("-popularity", "name")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    fields = (
        "product", "product_name", "quantity",
        "unit_price", "subtotal_display",
    )
    readonly_fields = (
        "product", "product_name", "quantity",
        "unit_price", "subtotal_display",
    )

    def subtotal_display(self, obj):
        if not obj.pk:
            return "—"
        return f"{obj.subtotal:,} FCFA"
    subtotal_display.short_description = "Sous-total"

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "reference", "created_at", "customer_name",
        "customer_whatsapp", "total", "status",
    )
    list_filter = ("status", "created_at")
    search_fields = ("reference", "customer_name", "customer_whatsapp")
    readonly_fields = ("reference", "created_at")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
    inlines = [OrderItemInline]
