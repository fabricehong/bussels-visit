// main-complete.js - Script principal pour la gestion du site avec fonctionnalités de filtrage intégrées

// Variables globales
let currentCategory = 'lieux-plein-air';
let currentData = null;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé, initialisation du site");
    
    // Charger la catégorie par défaut
    loadCategory(currentCategory);
    
    // Ajouter les écouteurs d'événements pour la navigation
    setupNavigation();
    
    // Configurer le bouton de fermeture de la carte
    setupMapControls();
    
    // Vérifier si nous sommes sur un écran de bureau (non-mobile)
    if (window.innerWidth > 768) {
        // Initialiser la carte seulement en mode bureau
        if (window.mapManager && typeof window.mapManager.initMap === 'function') {
            window.mapManager.initMap();
            console.log("Carte initialisée en mode bureau");
            
            // Précharger les marqueurs si des données sont disponibles
            if (window.currentPlaces && window.currentPlaces.length > 0 && 
                window.mapManager.addMarkersForPlaces) {
                window.mapManager.addMarkersForPlaces(window.currentPlaces);
                console.log("Marqueurs ajoutés à la carte");
            }
        }
    } else {
        console.log("Mode mobile détecté, la carte sera initialisée lors du premier clic");
    }
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
        window.currentPlaces = data.places;
        console.log(`[DEBUG] loadCategory: window.currentPlaces mis à jour pour '${currentCategory}' avec ${window.currentPlaces.length} lieux.`);
        
        // Afficher les lieux
        displayPlaces(data.places);
        
        // Ajouter les marqueurs sur la carte seulement si nous sommes en mode bureau
        // ou si la carte est déjà initialisée
        if (window.innerWidth > 768 && window.mapManager && 
            typeof window.mapManager.addMarkersForPlaces === 'function' &&
            window.mapManager.isMapInitialized && window.mapManager.isMapInitialized()) {
            console.log("Ajout des marqueurs à la carte initialisée");
            window.mapManager.addMarkersForPlaces(data.places);
        } else {
            console.log("Stockage des données pour un ajout ultérieur des marqueurs");
            // Stocker les données pour un ajout ultérieur des marqueurs
            window.currentPlaces = data.places;
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
    
    // Ajouter une classe spécifique à la carte en fonction de la catégorie
    switch(currentCategory) {
        case 'lieux-plein-air': card.classList.add('card-plein-air'); break;
        case 'lieux-originaux': card.classList.add('card-originaux'); break;
        case 'evenements': card.classList.add('card-evenements'); break;
        case 'restos-uniques': card.classList.add('card-restos'); break;
        case 'nightlife': card.classList.add('card-nightlife'); break;
    }
    
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
    
    // Ajouter les gestionnaires d'événements après avoir défini innerHTML
    // Ajouter un gestionnaire d'événements pour le survol
    card.addEventListener('mouseenter', function() {
        if (window.mapManager && typeof window.mapManager.highlightPlace === 'function') {
            window.mapManager.highlightPlace(index);
        }
    });
    
    // Ajouter un gestionnaire d'événements pour le clic (pour afficher la carte en mode mobile)
    card.addEventListener('click', function(event) {
        console.log('Card clicked, window width:', window.innerWidth);
        // Vérifier si on est en mode mobile (largeur d'écran <= 768px)
        if (window.innerWidth <= 768) {
            console.log('Mobile mode detected, showing map fullscreen');
            // Mettre en évidence le lieu sur la carte - *** REMOVED from here ***
            // if (window.mapManager && typeof window.mapManager.highlightPlace === 'function') {
            //     window.mapManager.highlightPlace(index);
            // }

            const mapContainerEl = document.querySelector('.map-container'); // Renamed variable to avoid conflict
            console.log('Map container found:', mapContainerEl);

            // Vérifier si la carte est déjà initialisée
            let isMapInitialized = window.mapManager && window.mapManager.isMapInitialized && window.mapManager.isMapInitialized();
            console.log('Is map already initialized:', isMapInitialized);

            // Ajouter la classe pour afficher la carte en plein écran
            document.body.classList.add('map-fullscreen'); // Added
            console.log('Added map-fullscreen class to body');

            // Attendre que le conteneur de la carte soit visible avant d'initialiser/redimensionner
            setTimeout(() => {
                console.log('Délai terminé, gestion de la carte');

                const mapElement = document.getElementById('map'); // Renamed variable
                if (mapElement) {
                    console.log("Dimensions du conteneur avant redim/init:", 
                        mapElement.offsetWidth, 'x', mapElement.offsetHeight);
                    
                    // Re-vérifier l'état DANS le timeout
                    const isMapInitializedNow = window.mapManager && window.mapManager.isMapInitialized && window.mapManager.isMapInitialized();
                    console.log(`[DEBUG] Inside setTimeout: isMapInitialized (captured) = ${isMapInitialized}, isMapInitializedNow (re-checked) = ${isMapInitializedNow}`);

                    // Utiliser la valeur re-vérifiée
                    if (isMapInitializedNow) { 
                        console.log('[DEBUG] Map was already initialized (re-checked). Updating markers.');

                        // MODIFICATION: Ensure markers for the CURRENT category are loaded
                        setTimeout(() => {
                            console.log(`[DEBUG] createPlaceCard mobile click (map exists): Tentative d'ajout de marqueurs pour la catégorie '${window.currentCategory}'.`);
                            console.log(`[DEBUG] window.currentPlaces contient actuellement ${window.currentPlaces ? window.currentPlaces.length : 'undefined'} lieux.`);
                            console.log('[DEBUG] Premier lieu (si existe):', window.currentPlaces ? window.currentPlaces[0]?.title : 'N/A');

                            // ** ADDED/MODIFIED **: Always update markers if map already exists
                            if (window.currentPlaces && window.mapManager.addMarkersForPlaces) {
                                console.log('MobileClick: Map exists, clearing old markers and adding markers for current category:', window.currentCategory);
                                window.mapManager.addMarkersForPlaces(window.currentPlaces); // Load correct markers
                                
                                // Nested timeout for highlighting after markers potentially added/re-added
                                setTimeout(() => {
                                    console.log(`MobileClick: Highlighting place ${index} after marker update`);
                                    window.mapManager.highlightPlace(index);
                                }, 50); // Short delay for marker rendering
                            } else {
                                console.error('MobileClick: Cannot add/re-add markers: currentPlaces or addMarkersForPlaces missing');
                                // Fallback: Try highlighting anyway, might work if markers were somehow correct
                                 setTimeout(() => {
                                    console.warn(`MobileClick: Attempting highlight ${index} without marker update`);
                                    window.mapManager.highlightPlace(index);
                                }, 50);
                            }
                        }, 50); // Short delay after invalidateSize
                    } 
                    // Si la carte n'est PAS initialisée, l'initialiser
                    else if (!isMapInitializedNow && window.mapManager && typeof window.mapManager.initMap === 'function') {
                        console.log('Initializing map for the first time on mobile click (re-checked)');
                        window.mapManager.initMap('map'); 
                        // Ajouter les marqueurs après l'initialisation
                        if (window.currentPlaces && window.currentPlaces.length > 0 && window.mapManager.addMarkersForPlaces) {
                            window.mapManager.addMarkersForPlaces(window.currentPlaces);
                            console.log("Markers added after map init");
                            
                            // *** NESTED TIMEOUT ***: Attendre un court instant avant de highlight
                            setTimeout(() => {
                                console.log('Highlighting place after marker add delay');
                                if (window.mapManager && typeof window.mapManager.highlightPlace === 'function') {
                                    window.mapManager.highlightPlace(index); 
                                }
                            }, 50); // 50ms delay
                        }
                    } else {
                        console.error('Map manager or map instance not available for resize/init (re-checked).'); // Message d'erreur mis à jour
                    }
                } else {
                    console.error('Map element #map not found after delay');
                }
            }, 100); // Délai initial pour assurer que les styles CSS sont appliqués

        } else {
             // Comportement desktop (met en évidence seulement)
            if (window.mapManager && typeof window.mapManager.highlightPlace === 'function') {
                window.mapManager.highlightPlace(index);
            }
        }
    });
    
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

// Fonction pour configurer les contrôles de la carte (bouton de fermeture)
function setupMapControls() {
    console.log('Setting up map controls');
    const closeMapBtn = document.getElementById('close-map-btn');
    console.log('Close map button found:', closeMapBtn);

    if (closeMapBtn) {
        closeMapBtn.addEventListener('click', function(event) {
            console.log('Close map button clicked');
            event.preventDefault();
            event.stopPropagation();

            const mapContainer = document.querySelector('.map-container');
            console.log('Map container before closing:', mapContainer ? mapContainer.className : 'Not found');
            console.log('Body class before closing:', document.body.className);

            // Retirer la classe active pour faire glisser la carte hors écran (si elle existe, pour compatibilité future ou autre logique)
            if(mapContainer) mapContainer.classList.remove('active'); 

            // Retirer la classe du body pour masquer le plein écran
            // document.body.classList.remove('map-active'); // Removed
            document.body.classList.remove('map-fullscreen'); // Added

            console.log('Map container after closing:', mapContainer ? mapContainer.className : 'Not found');
            console.log('Body class after closing:', document.body.className);
        });
    } else {
        console.error('Close map button not found in the DOM');
    }

    // Ajouter un écouteur pour les changements de taille d'écran
    window.addEventListener('resize', function() {
        // Si on passe en mode desktop, s'assurer que la carte est visible et que le mode fullscreen est désactivé
        if (window.innerWidth > 768) {
            const mapContainer = document.querySelector('.map-container');
            if (mapContainer) mapContainer.classList.remove('active'); // Au cas où
            document.body.classList.remove('map-fullscreen'); // Added
            console.log('Resized to desktop, removed active class from map container and map-fullscreen from body');
        }
    });

    // Vérifier l'état initial
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        console.log('Initial map container state:', mapContainer.className);
        console.log('Initial window width:', window.innerWidth);
        console.log('Initial body class:', document.body.className);
    } else {
        console.error('Map container not found in the DOM');
    }
}

console.log("Script principal chargé avec succès");
