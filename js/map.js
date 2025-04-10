// map.js - Gestion de la carte interactive

// Initialisation de la carte
let map;
let markers = [];
let activeMarker = null;

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

// Ajout des marqueurs pour les lieux d'une catégorie
function addMarkersForPlaces(places) {
    // Supprimer les marqueurs existants
    clearMarkers();
    
    // Créer un groupe pour les limites de la carte
    const bounds = L.latLngBounds();
    
    // Ajouter les nouveaux marqueurs
    places.forEach((place, index) => {
        if (place.coordinates && place.coordinates.lat && place.coordinates.lng) {
            const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
                icon: createCustomMarker(),
                title: place.title,
                alt: place.title,
                placeIndex: index
            });
            
            // Ajouter un popup avec le titre du lieu
            marker.bindPopup(`<strong>${place.title}</strong>`);
            
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
            // Ouvrir le popup
            marker.openPopup();
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

// Exporter les fonctions pour les utiliser dans d'autres scripts
window.mapManager = {
    initMap,
    addMarkersForPlaces,
    highlightPlace,
    clearMarkers
};
