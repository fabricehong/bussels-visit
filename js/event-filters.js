// Fonction pour ajouter des filtres de date pour les événements
function addDateFilters() {
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
                window.mapManager.addMarkersForPlaces(currentData.places);
            } else {
                // Filtrer les événements pour cette date
                filterEventsByDate(day, this.dataset.month, parseInt(this.dataset.year));
            }
        });
    });
}

// Fonction améliorée pour filtrer les événements par date
function filterEventsByDate(day, month, year) {
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
    
    // Afficher les événements filtrés
    displayPlaces(filteredEvents);
    window.mapManager.addMarkersForPlaces(filteredEvents);
}

// Mise à jour de la fonction loadCategory pour ajouter les filtres de date
async function loadCategory(category) {
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
        currentData = data;
        
        // Afficher les lieux
        displayPlaces(data.places);
        
        // Ajouter les marqueurs sur la carte
        window.mapManager.addMarkersForPlaces(data.places);
        
        // Ajouter les filtres de date pour la catégorie événements
        if (category === 'evenements') {
            addDateFilters();
        }
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

// Fonction améliorée pour créer une carte de lieu
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

// Remplacer la fonction existante dans window.dataLoader
window.dataLoader.createPlaceCard = createPlaceCard;
