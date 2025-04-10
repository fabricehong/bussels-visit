#!/bin/bash

# Vérifier si sips est disponible (il est installé par défaut sur macOS)
if ! command -v sips &> /dev/null; then
    echo "sips n'est pas disponible sur votre système."
    exit 1
fi

# Chemin vers le fichier image source
SOURCE_IMAGE="app-image/icon.webp"

# Vérifier si l'image source existe
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Image source non trouvée : $SOURCE_IMAGE"
    echo "Veuillez placer votre image source à cet emplacement."
    echo "L'image doit être carrée et de préférence 512x512 pixels ou plus."
    exit 1
fi

# Tailles d'icônes à générer
SIZES=(72 96 128 144 152 192 384 512)

# Créer le dossier de destination s'il n'existe pas
mkdir -p images/icons

# Générer les icônes PNG
for size in "${SIZES[@]}"; do
    echo "Génération de l'icône ${size}x${size}..."
    # Copier l'image source
    cp "$SOURCE_IMAGE" "images/icons/icon-${size}x${size}.png"
    # Redimensionner avec sips
    sips -z "$size" "$size" "images/icons/icon-${size}x${size}.png" &> /dev/null
done

echo "Génération des icônes terminée !"
echo "Toutes les icônes ont été créées dans le dossier images/icons/"
