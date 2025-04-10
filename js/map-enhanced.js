// Fonction pour créer des popups plus riches pour les marqueurs
function createRichPopup(place) {
    // Utiliser une image par défaut si l'image spécifiée n'existe pas
    const imagePath = `images/${place.image}`;
    const imageUrl = place.image ? imagePath : 'images/default-place.jpg';
    
    return `
        <div class="popup-content">
            <img src="${imageUrl}" alt="${place.title}" class="popup-image" onerror="this.src='images/default-place.jpg'">
            <div class="popup-info">
                <h3 class="popup-title">${place.title}</h3>
                <p class="popup-description">${place.description.substring(0, 100)}...</p>
                <a href="#" class="popup-button" onclick="window.mapManager.highlightPlace(${place.index}); return false;">Voir détails</a>
            </div>
        </div>
    `;
}

// Mise à jour de la fonction addMarkersForPlaces pour utiliser les popups riches
function addMarkersForPlaces(places) {
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
            
            // Ajouter un popup riche avec le titre et l'image du lieu
            marker.bindPopup(createRichPopup(place), {
                maxWidth: 250,
                className: 'custom-popup'
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

// Exporter les fonctions pour les utiliser dans d'autres scripts
window.mapManager = {
    initMap,
    addMarkersForPlaces,
    highlightPlace,
    clearMarkers,
    createRichPopup
};
