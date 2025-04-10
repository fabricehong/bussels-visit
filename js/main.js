// main.js - Script principal pour la gestion du site

// Variables globales
let currentCategory = 'lieux-plein-air';
let currentData = null;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser la carte
    window.mapManager.initMap();
    
    // Charger la catégorie par défaut
    loadCategory(currentCategory);
    
    // Ajouter les écouteurs d'événements pour la navigation
    setupNavigation();
});

// Configuration de la navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Mettre à jour la classe active
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Charger la nouvelle catégorie
            const category = this.dataset.category;
            loadCategory(category);
        });
    });
}

// Chargement d'une catégorie
async function loadCategory(category) {
    // Mettre à jour la catégorie courante
    currentCategory = category;
    
    // Mettre à jour le titre et la description de la catégorie
    updateCategoryInfo(category);
    
    // Charger les données
    const data = await window.dataLoader.loadCategoryData(category);
    
    if (data && data.places) {
        currentData = data;
        
        // Afficher les lieux
        displayPlaces(data.places);
        
        // Ajouter les marqueurs sur la carte
        window.mapManager.addMarkersForPlaces(data.places);
    } else {
        // Gérer l'erreur de chargement des données
        document.getElementById('places-container').innerHTML = `
            <div class="error-message">
                <p>Impossible de charger les données pour cette catégorie.</p>
            </div>
        `;
        window.mapManager.clearMarkers();
    }
}

// Mise à jour des informations de catégorie
function updateCategoryInfo(category) {
    const info = window.dataLoader.categoryInfo[category];
    
    if (info) {
        const titleElement = document.querySelector('.category-title h2');
        const descriptionElement = document.querySelector('.category-description');
        
        titleElement.textContent = info.title;
        descriptionElement.textContent = info.description;
    }
}

// Affichage des lieux
function displayPlaces(places) {
    const container = document.getElementById('places-container');
    container.innerHTML = '';
    
    if (places.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>Aucun lieu trouvé pour cette catégorie.</p>
            </div>
        `;
        return;
    }
    
    // Créer une carte pour chaque lieu
    places.forEach((place, index) => {
        const card = window.dataLoader.createPlaceCard(place, index);
        
        // Ajouter un écouteur d'événements pour le clic sur la carte
        card.addEventListener('click', function() {
            window.mapManager.highlightPlace(index);
        });
        
        // Ajouter un écouteur d'événements pour le survol de la carte
        card.addEventListener('mouseenter', function() {
            window.mapManager.highlightPlace(index);
        });
        
        container.appendChild(card);
    });
}

// Fonction pour filtrer les événements par date (utilisée pour la catégorie événements)
function filterEventsByDate(startDate, endDate) {
    if (!currentData || !currentData.places || currentCategory !== 'evenements') {
        return;
    }
    
    // Convertir les dates en objets Date
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Filtrer les événements qui ont lieu entre les dates spécifiées
    const filteredEvents = currentData.places.filter(place => {
        if (!place.dates) return false;
        
        // Analyser la date de l'événement
        const dateStr = place.dates;
        
        // Vérifier si l'événement a lieu pendant la période spécifiée
        // Cette logique peut être adaptée en fonction du format des dates dans vos données
        if (dateStr.includes('-')) {
            // Période (ex: "14-17 avril 2025")
            return true; // Simplification pour l'exemple
        } else {
            // Date unique (ex: "14 avril 2025")
            return true; // Simplification pour l'exemple
        }
    });
    
    // Afficher les événements filtrés
    displayPlaces(filteredEvents);
    window.mapManager.addMarkersForPlaces(filteredEvents);
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

// Ajouter les styles des marqueurs
addCustomMarkerStyles();
