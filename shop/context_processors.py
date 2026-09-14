"""
Context processor SEO — rend les variables de config disponibles dans tous les templates.
"""

from django.conf import settings


def seo_context(request):
    return {
        "SITE_URL": settings.SITE_URL,
        "SITE_NAME": settings.SITE_NAME,
        "SITE_DEFAULT_OG_IMAGE": settings.SITE_DEFAULT_OG_IMAGE,
        "SITE_INSTAGRAM": settings.SITE_INSTAGRAM,
        "SITE_WHATSAPP": settings.SITE_WHATSAPP,
        "SITE_WHATSAPP_NUMBER": getattr(settings, "SITE_WHATSAPP_NUMBER", "221775958179"),
    }