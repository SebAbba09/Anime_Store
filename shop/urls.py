from django.urls import path

from .views import about, catalog, contact, home, product_detail


urlpatterns = [
    path("", home, name="home"),
    path("boutique/", catalog, name="catalog"),
    path("boutique/<slug:slug>/", product_detail, name="product_detail"),
    path("a-propos/", about, name="about"),
    path("contact/", contact, name="contact"),
]
