// map-complete.js - Gestion complète de la carte interactive

// Variables globales
let map;
let markers = [];
let activeMarker = null;

// Initialisation de la carte
function initMap() {
    // Coordonnées du centre de Bruxelles
    const brusselsCenter = [50.8476, 4.3572];
    
    // Création de la carte
    map = L.map('map').setView(brusselsCenter, 13);
    
    // Ajout de la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    console.log("Carte initialisée avec succès");
}

// Création d'un marqueur personnalisé
function createCustomMarker(isActive = false) {
    return L.divIcon({
        className: `custom-marker ${isActive ? 'active' : ''}`,
        html: `<div class="marker-inner"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
}

// Fonction pour créer des popups simples pour les marqueurs (seulement le titre)
function createRichPopup(place) {
    return `<div class="popup-title-only">${place.title}</div>`;
}

// Ajout des marqueurs pour les lieux d'une catégorie
function addMarkersForPlaces(places) {
    console.log("Ajout de marqueurs pour", places.length, "lieux");
    
    // Supprimer les marqueurs existants
    clearMarkers();
    
    // Créer un groupe pour les limites de la carte
    const bounds = L.latLngBounds();
    
    // Ajouter les nouveaux marqueurs
    places.forEach((place, index) => {
        // Ajouter l'index au lieu pour référence
        place.index = index;
        
        if (place.coordinates && place.coordinates.lat && place.coordinates.lng) {
            const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
                icon: createCustomMarker(),
                title: place.title,
                alt: place.title,
                placeIndex: index
            });
            
            // Ajouter un popup simple avec seulement le titre du lieu
            marker.bindPopup(createRichPopup(place), {
                maxWidth: 150,
                className: 'custom-popup-minimal'
            });
            
            // Ajouter un gestionnaire d'événements pour le clic sur le marqueur
            marker.on('click', function() {
                highlightPlace(index);
            });
            
            // Ajouter le marqueur à la carte et au tableau
            marker.addTo(map);
            markers.push(marker);
            
            // Étendre les limites pour inclure ce marqueur
            bounds.extend([place.coordinates.lat, place.coordinates.lng]);
        }
    });
    
    // Ajuster la vue de la carte pour montrer tous les marqueurs
    if (bounds.isValid()) {
        map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 15
        });
    }
}

// Mettre en évidence un lieu et son marqueur
function highlightPlace(index) {
    console.log("Mise en évidence du lieu avec l'index", index);
    
    // Mettre à jour les cartes de lieux
    const placeCards = document.querySelectorAll('.place-card');
    placeCards.forEach(card => {
        card.classList.remove('active');
        if (parseInt(card.dataset.index) === index) {
            card.classList.add('active');
            // Faire défiler jusqu'à la carte sélectionnée
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    // Mettre à jour les marqueurs
    markers.forEach((marker, i) => {
        if (marker.options.placeIndex === index) {
            // Mettre à jour l'icône du marqueur actif
            marker.setIcon(createCustomMarker(true));
            // Ne pas ouvrir automatiquement le popup
            // marker.openPopup();
            // Centrer la carte sur le marqueur
            map.panTo(marker.getLatLng());
            // Mettre à jour le marqueur actif
            activeMarker = marker;
        } else {
            // Réinitialiser les autres marqueurs
            marker.setIcon(createCustomMarker(false));
        }
    });
}

// Supprimer tous les marqueurs de la carte
function clearMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
    activeMarker = null;
}

// Ajouter des styles CSS pour les marqueurs personnalisés
function addCustomMarkerStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .custom-marker {
            background: transparent;
        }
        
        .marker-inner {
            width: 20px;
            height: 20px;
            background-color: var(--primary-color);
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            position: relative;
            top: -10px;
            left: -10px;
            transition: transform 0.3s ease, background-color 0.3s ease;
        }
        
        .custom-marker.active .marker-inner {
            background-color: var(--secondary-color);
            transform: scale(1.4);
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
}

// Exporter les fonctions pour les utiliser dans d'autres scripts
window.mapManager = {
    initMap,
    addMarkersForPlaces,
    highlightPlace,
    clearMarkers,
    createRichPopup,
    createCustomMarker,
    addCustomMarkerStyles
};

// Ajouter les styles des marqueurs
addCustomMarkerStyles();

console.log("Module de carte chargé avec succès");
