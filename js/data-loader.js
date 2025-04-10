// data-loader.js - Charge les données JSON pour chaque catégorie

// Mappage des catégories aux fichiers JSON
const categoryMapping = {
    'lieux-plein-air': 'lieux_plein_air.json',
    'lieux-originaux': 'lieux_originaux.json',
    'evenements': 'evenements.json',
    'restos-uniques': 'restos_uniques.json',
    'nightlife': 'nightlife.json'
};

// Mappage des catégories aux titres et descriptions
const categoryInfo = {
    'lieux-plein-air': {
        title: 'Lieux en plein air',
        description: 'Découvrez les plus beaux espaces verts et lieux de promenade à Bruxelles'
    },
    'lieux-originaux': {
        title: 'Lieux originaux',
        description: 'Explorez les endroits atypiques, insolites et créatifs de la capitale belge'
    },
    'evenements': {
        title: 'Événements',
        description: 'Les meilleurs événements à Bruxelles du 14 au 17 avril 2025'
    },
    'restos-uniques': {
        title: 'Restos uniques',
        description: 'Des restaurants avec une ambiance ou un concept original pour une expérience culinaire mémorable'
    },
    'nightlife': {
        title: 'Nightlife',
        description: 'Bars, clubs et soirées originales pour découvrir la vie nocturne bruxelloise'
    }
};

// Fonction pour charger les données d'une catégorie
async function loadCategoryData(category) {
    try {
        const response = await fetch(`data/${categoryMapping[category]}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors du chargement des données pour ${category}:`, error);
        return null;
    }
}

// Fonction pour créer une carte de lieu
function createPlaceCard(place, index) {
    const card = document.createElement('div');
    card.className = 'place-card';
    card.dataset.index = index;
    
    // Utiliser une image par défaut si l'image spécifiée n'existe pas
    const imagePath = `images/${place.image}`;
    const imageUrl = place.image ? imagePath : 'images/default-place.jpg';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${place.title}" class="place-image" onerror="this.src='images/default-place.jpg'">
        <div class="place-info">
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

// Exporter les fonctions et objets pour les utiliser dans d'autres scripts
window.dataLoader = {
    loadCategoryData,
    createPlaceCard,
    categoryInfo
};
