// main-complete.js - Script principal pour la gestion du site avec fonctionnalités de filtrage intégrées

// Variables globales
let currentCategory = 'lieux-plein-air';
let currentData = null;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé, initialisation du site");
    
    // Initialiser la carte
    if (window.mapManager && typeof window.mapManager.initMap === 'function') {
        window.mapManager.initMap();
        console.log("Carte initialisée");
    } else {
        console.error("mapManager ou sa méthode initMap n'est pas disponible");
    }
    
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
    
    console.log("Navigation configurée");
}

// Chargement d'une catégorie
async function loadCategory(category) {
    console.log("Chargement de la catégorie:", category);
    
    // Mettre à jour la catégorie courante
    currentCategory = category;
    
    // Mettre à jour le titre et la description de la catégorie
    updateCategoryInfo(category);
    
    // Supprimer les filtres existants
    const existingFilters = document.querySelector('.filters-container');
    if (existingFilters) {
        existingFilters.remove();
    }
    
    // Charger les données
    const data = await window.dataLoader.loadCategoryData(category);
    
    if (data && data.places) {
        console.log("Données chargées avec succès:", data.places.length, "lieux");
        currentData = data;
        
        // Afficher les lieux
        displayPlaces(data.places);
        
        // Ajouter les marqueurs sur la carte
        if (window.mapManager && typeof window.mapManager.addMarkersForPlaces === 'function') {
            window.mapManager.addMarkersForPlaces(data.places);
        } else {
            console.error("mapManager ou sa méthode addMarkersForPlaces n'est pas disponible");
        }
        
        // Ajouter les filtres de date pour la catégorie événements
        if (category === 'evenements') {
            addDateFilters();
        }
    } else {
        console.error("Erreur lors du chargement des données pour", category);
        // Gérer l'erreur de chargement des données
        document.getElementById('places-container').innerHTML = `
            <div class="error-message">
                <p>Impossible de charger les données pour cette catégorie.</p>
            </div>
        `;
        if (window.mapManager && typeof window.mapManager.clearMarkers === 'function') {
            window.mapManager.clearMarkers();
        }
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
    
    console.log("Affichage de", places.length, "lieux");
    
    // Créer une carte pour chaque lieu
    places.forEach((place, index) => {
        const card = createPlaceCard(place, index);
        
        // Ajouter un écouteur d'événements pour le clic sur la carte
        card.addEventListener('click', function() {
            if (window.mapManager && typeof window.mapManager.highlightPlace === 'function') {
                window.mapManager.highlightPlace(index);
            }
        });
        
        // Ajouter un écouteur d'événements pour le survol de la carte
        card.addEventListener('mouseenter', function() {
            if (window.mapManager && typeof window.mapManager.highlightPlace === 'function') {
                window.mapManager.highlightPlace(index);
            }
        });
        
        container.appendChild(card);
    });
}

// Fonction pour créer une carte de lieu
function createPlaceCard(place, index) {
    const card = document.createElement('div');
    card.className = 'place-card';
    card.dataset.index = index;
    
    // Utiliser une image par défaut si l'image spécifiée n'existe pas
    const imagePath = `images/${place.image}`;
    const imageUrl = place.image ? imagePath : 'images/default-place.jpg';
    
    // Déterminer la classe de badge en fonction de la catégorie
    let badgeClass = '';
    switch(currentCategory) {
        case 'lieux-plein-air': badgeClass = 'plein-air'; break;
        case 'lieux-originaux': badgeClass = 'originaux'; break;
        case 'evenements': badgeClass = 'evenements'; break;
        case 'restos-uniques': badgeClass = 'restos'; break;
        case 'nightlife': badgeClass = 'nightlife'; break;
    }
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${place.title}" class="place-image" onerror="this.src='images/default-place.jpg'">
        <div class="place-info">
            <div class="category-badge ${badgeClass}">${window.dataLoader.categoryInfo[currentCategory].title}</div>
            <h3 class="place-title">${place.title}</h3>
            <p class="place-description">${place.description}</p>
            <div class="place-details">
                <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    <span>${place.address}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🌟</span>
                    <span>${place.uniqueness}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">⏰</span>
                    <span>${place.best_time}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🎭</span>
                    <span>${place.ambiance}</span>
                </div>
                ${place.dates ? `
                <div class="detail-item">
                    <span class="detail-icon">📅</span>
                    <span>${place.dates}</span>
                </div>` : ''}
                ${place.info ? `
                <div class="detail-item">
                    <span class="detail-icon">ℹ️</span>
                    <span>${place.info}</span>
                </div>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Fonction pour ajouter des filtres de date pour les événements
function addDateFilters() {
    console.log("Ajout des filtres de date pour les événements");
    
    // Vérifier si nous sommes sur la catégorie événements
    if (currentCategory !== 'evenements') return;
    
    // Créer le conteneur de filtres s'il n'existe pas déjà
    let filtersContainer = document.querySelector('.filters-container');
    if (!filtersContainer) {
        const categoryTitle = document.querySelector('.category-title');
        filtersContainer = document.createElement('div');
        filtersContainer.className = 'filters-container';
        categoryTitle.after(filtersContainer);
    }
    
    // Définir les dates du séjour (14-17 avril 2025)
    const dates = [
        { day: 14, month: 'avril', year: 2025, label: 'Lundi 14 avril' },
        { day: 15, month: 'avril', year: 2025, label: 'Mardi 15 avril' },
        { day: 16, month: 'avril', year: 2025, label: 'Mercredi 16 avril' },
        { day: 17, month: 'avril', year: 2025, label: 'Jeudi 17 avril' },
        { day: 0, month: '', year: 0, label: 'Tous les jours' }
    ];
    
    // Créer le contenu HTML des filtres
    filtersContainer.innerHTML = `
        <h3 class="filters-title">Filtrer par date</h3>
        <div class="date-filters">
            ${dates.map((date, index) => `
                <div class="date-filter-item ${index === dates.length - 1 ? 'active' : ''}" 
                     data-day="${date.day}" 
                     data-month="${date.month}" 
                     data-year="${date.year}">
                    ${date.label}
                </div>
            `).join('')}
        </div>
    `;
    
    // Ajouter les écouteurs d'événements pour les filtres
    const filterItems = document.querySelectorAll('.date-filter-item');
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            // Mettre à jour la classe active
            filterItems.forEach(filter => filter.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrer les événements
            const day = parseInt(this.dataset.day);
            if (day === 0) {
                // Afficher tous les événements
                displayPlaces(currentData.places);
                if (window.mapManager && typeof window.mapManager.addMarkersForPlaces === 'function') {
                    window.mapManager.addMarkersForPlaces(currentData.places);
                }
            } else {
                // Filtrer les événements pour cette date
                filterEventsByDate(day, this.dataset.month, parseInt(this.dataset.year));
            }
        });
    });
}

// Fonction pour filtrer les événements par date
function filterEventsByDate(day, month, year) {
    console.log("Filtrage des événements pour le", day, month, year);
    
    if (!currentData || !currentData.places || currentCategory !== 'evenements') {
        return;
    }
    
    // Filtrer les événements qui ont lieu à la date spécifiée
    const filteredEvents = currentData.places.filter(place => {
        if (!place.dates) return false;
        
        const dateStr = place.dates.toLowerCase();
        
        // Vérifier si l'événement a lieu pendant la période spécifiée
        if (dateStr.includes(`${day} ${month}`) || 
            dateStr.includes(`${day}-${day+3} ${month}`) || 
            dateStr.includes(`${day-1}-${day} ${month}`) ||
            dateStr.includes(`${day}-${day+1} ${month}`) ||
            dateStr.includes(`${day}-${day+2} ${month}`)) {
            return true;
        }
        
        // Vérifier les périodes (ex: "14-17 avril 2025")
        if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts.length === 2) {
                const startDay = parseInt(parts[0].trim());
                const endParts = parts[1].trim().split(' ');
                const endDay = parseInt(endParts[0]);
                
                // Si le jour spécifié est dans la plage
                if (day >= startDay && day <= endDay) {
                    return true;
                }
            }
        }
        
        // Vérifier "exposition en cours"
        if (dateStr.includes('exposition en cours') || dateStr.includes('en cours')) {
            return true;
        }
        
        return false;
    });
    
    console.log("Événements filtrés:", filteredEvents.length, "trouvés");
    
    // Afficher les événements filtrés
    displayPlaces(filteredEvents);
    if (window.mapManager && typeof window.mapManager.addMarkersForPlaces === 'function') {
        window.mapManager.addMarkersForPlaces(filteredEvents);
    }
}

console.log("Script principal chargé avec succès");
