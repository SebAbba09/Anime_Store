#!/bin/bash

echo "=== Démarrage du build Vercel (Anime Store Dakar) ==="

# 1. Installation des dépendances Python
python3 -m pip install -r requirements.txt

# 2. Collecte des fichiers statiques WhiteNoise
python3 manage.py collectstatic --noinput --clear

# 3. Application des migrations Django si DATABASE_URL est défini
if [ -n "$DATABASE_URL" ]; then
    echo "Application des migrations sur la base distante..."
    python3 manage.py migrate --noinput
fi

echo "=== Build Vercel terminé avec succès ==="
