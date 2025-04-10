# Guide d'utilisation - Site Bruxelles Créative (Version corrigée)

## Présentation
Ce site web présente la ville de Bruxelles à travers cinq catégories de lieux et activités adaptés à un profil créatif et avide de découvertes originales :
- Lieux en plein air
- Lieux originaux
- Événements (filtrés du 14 au 17 avril)
- Restos uniques
- Nightlife

## Comment exécuter le site

### Méthode simple
1. Décompressez le fichier `brussels-discovery.zip`
2. Ouvrez le fichier `index.html` dans votre navigateur web

Le site est entièrement fonctionnel sans serveur web, toutes les ressources sont chargées localement.

### Avec un serveur web local (optionnel)
Si vous souhaitez utiliser un serveur web local :

```bash
# Avec Python
cd brussels-discovery
python -m http.server 8000

# Avec Node.js
cd brussels-discovery
npx serve
```

Puis accédez à `http://localhost:8000` ou `http://localhost:3000` dans votre navigateur.

## Fonctionnalités

### Navigation par catégories
- Cliquez sur les onglets en haut de la page pour naviguer entre les différentes catégories
- Chaque catégorie affiche une liste de lieux avec leurs détails

### Carte interactive
- La carte à droite affiche tous les lieux de la catégorie sélectionnée
- Cliquez sur un lieu dans la liste pour le mettre en évidence sur la carte
- Cliquez sur un marqueur sur la carte pour voir les détails du lieu

### Filtrage des événements
- Dans la catégorie "Événements", utilisez les filtres de date pour afficher les événements spécifiques à chaque jour du 14 au 17 avril

### Design responsive
- Le site s'adapte à tous les appareils : ordinateurs, tablettes et smartphones
- En mode mobile, la carte s'affiche en dessous de la liste des lieux

## Modifications techniques apportées
- Correction des problèmes de chargement des données JSON
- Optimisation du code JavaScript pour une meilleure performance
- Amélioration de la compatibilité avec différents navigateurs
- Correction des interactions entre la liste des lieux et la carte

## Structure du projet
- `index.html` : Page principale du site
- `css/` : Fichiers de style
- `js/` : Scripts JavaScript
- `data/` : Données JSON pour chaque catégorie
- `images/` : Images utilisées dans le site

## Technologies utilisées
- HTML5, CSS3, JavaScript
- Leaflet.js pour la carte interactive
- Polices Google Fonts (Montserrat et Poppins)
- Design responsive sans framework externe

Profitez de votre découverte de Bruxelles !
