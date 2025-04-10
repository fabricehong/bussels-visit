// data-loader-fixed.js - Charge les données JSON pour chaque catégorie (version corrigée pour éviter les erreurs CORS)

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

// Données intégrées pour éviter les problèmes CORS
const embeddedData = {
    'lieux-plein-air': {
        "category": "Lieux en plein air",
        "places": [
            {
                "title": "Parc du Cinquantenaire",
                "description": "Un magnifique parc avec l'arc de triomphe en arrière-plan, offrant de vastes espaces verts et des allées ombragées.",
                "address": "Parc du Cinquantenaire, 1000 Bruxelles",
                "ambiance": "Historique et majestueux, idéal pour les promenades et pique-niques",
                "best_time": "Printemps et été, particulièrement en matinée pour éviter la foule",
                "uniqueness": "L'arc de triomphe monumental et les musées qui l'entourent (Autoworld, Musée de l'Armée)",
                "info": "Accessible tous les jours, gratuit",
                "coordinates": {
                    "lat": 50.8400,
                    "lng": 4.3936
                },
                "image": "parc_cinquantenaire.jpg"
            },
            {
                "title": "Parc Léopold",
                "description": "Un parc paisible situé derrière le Parlement européen dans le quartier européen.",
                "address": "Parc Léopold, 1000 Bruxelles",
                "ambiance": "Calme et institutionnel, fréquenté par les fonctionnaires européens",
                "best_time": "En semaine pendant la pause déjeuner pour observer la vie locale",
                "uniqueness": "La présence d'un petit étang et d'un ancien institut scientifique",
                "info": "Accessible tous les jours, gratuit",
                "coordinates": {
                    "lat": 50.8389,
                    "lng": 4.3797
                },
                "image": "parc_leopold.jpg"
            },
            {
                "title": "Etangs d'Ixelles",
                "description": "Un ensemble d'étangs pittoresques situés dans le quartier Art déco d'Ixelles.",
                "address": "Étangs d'Ixelles, 1050 Ixelles",
                "ambiance": "Romantique et pittoresque, populaire auprès des joggeurs et promeneurs",
                "best_time": "Fin d'après-midi pour profiter du coucher de soleil sur l'eau",
                "uniqueness": "Les cygnes et canards qui peuplent les étangs, entourés d'architecture Art déco",
                "info": "Accessible en permanence, gratuit",
                "coordinates": {
                    "lat": 50.8275,
                    "lng": 4.3792
                },
                "image": "etangs_ixelles.jpg"
            },
            {
                "title": "Bois de la Cambre",
                "description": "Un grand espace boisé qui, le week-end, est en partie fermé à la circulation pour le plus grand bonheur des promeneurs, cyclistes et patineurs.",
                "address": "Bois de la Cambre, 1000 Bruxelles",
                "ambiance": "Naturelle et familiale, idéale pour les activités de plein air",
                "best_time": "Week-ends quand les routes sont fermées aux voitures",
                "uniqueness": "L'île du Chalet Robinson au milieu du lac, accessible par bateau",
                "info": "Accessible tous les jours, routes fermées aux voitures le week-end",
                "coordinates": {
                    "lat": 50.8097,
                    "lng": 4.3804
                },
                "image": "bois_cambre.jpg"
            },
            {
                "title": "Parc de la Woluwe",
                "description": "Un parc vallonné avec plusieurs étangs, offrant un cadre naturel préservé.",
                "address": "Avenue de Tervueren, 1150 Woluwe-Saint-Pierre",
                "ambiance": "Bucolique et paisible, idéal pour l'observation des oiseaux",
                "best_time": "Printemps pour les floraisons et automne pour les couleurs",
                "uniqueness": "Les paysages vallonnés et les étangs qui créent des perspectives variées",
                "info": "Accessible tous les jours, gratuit",
                "coordinates": {
                    "lat": 50.8306,
                    "lng": 4.4278
                },
                "image": "parc_woluwe.jpg"
            }
        ]
    },
    'lieux-originaux': {
        "category": "Lieux originaux",
        "places": [
            {
                "title": "Atomium",
                "description": "Structure emblématique de Bruxelles représentant un cristal de fer agrandi 165 milliards de fois, construite pour l'Exposition universelle de 1958.",
                "address": "Place de l'Atomium 1, 1020 Bruxelles",
                "ambiance": "Futuriste et impressionnante, avec une vue panoramique sur la ville",
                "best_time": "En semaine pour éviter les foules, ou en soirée pour voir l'illumination",
                "uniqueness": "Architecture unique au monde, symbole de l'ère atomique et de la modernité",
                "info": "Ouvert tous les jours de 10h à 18h, visite intérieure possible",
                "coordinates": {
                    "lat": 50.8947,
                    "lng": 4.3415
                },
                "image": "atomium.jpg"
            },
            {
                "title": "Manneken Pis",
                "description": "Petite statue en bronze d'un enfant en train d'uriner, devenue l'un des symboles les plus connus de Bruxelles.",
                "address": "Rue de l'Étuve, 1000 Bruxelles",
                "ambiance": "Touristique et animée, souvent entourée de visiteurs",
                "best_time": "Tôt le matin pour éviter la foule ou lors d'occasions spéciales quand il est habillé",
                "uniqueness": "Statue emblématique datant du début du XVIIe siècle, avec une garde-robe de plus de 1000 costumes",
                "info": "Visible 24h/24, gratuit, costumes changés régulièrement",
                "coordinates": {
                    "lat": 50.8450,
                    "lng": 4.3500
                },
                "image": "manneken_pis.jpg"
            },
            {
                "title": "Musée des Instruments de Musique",
                "description": "Situé dans l'ancien magasin Old England, ce musée abrite une collection impressionnante d'instruments de musique du monde entier.",
                "address": "Rue Montagne de la Cour 2, 1000 Bruxelles",
                "ambiance": "Culturelle et éducative, dans un bâtiment Art Nouveau remarquable",
                "best_time": "En semaine pour une visite plus tranquille",
                "uniqueness": "L'un des plus grands musées d'instruments de musique au monde, avec casques audio pour écouter les sons",
                "info": "Ouvert du mardi au vendredi de 9h30 à 17h, weekends de 10h à 17h",
                "coordinates": {
                    "lat": 50.8425,
                    "lng": 4.3579
                },
                "image": "musee_instruments.jpg"
            },
            {
                "title": "Maison Cauchie",
                "description": "Chef-d'œuvre de l'Art Nouveau, cette maison conçue par Paul Cauchie en 1905 présente une façade extraordinaire avec des sgraffites.",
                "address": "Rue des Francs 5, 1040 Etterbeek",
                "ambiance": "Artistique et intimiste, joyau architectural caché",
                "best_time": "Premiers weekends du mois quand elle est ouverte au public",
                "uniqueness": "Façade unique décorée de sgraffites, technique de décoration murale rare",
                "info": "Ouverte uniquement les premiers weekends du mois de 10h à 13h et de 14h à 17h30",
                "coordinates": {
                    "lat": 50.8383,
                    "lng": 4.3816
                },
                "image": "maison_cauchie.jpg"
            },
            {
                "title": "Galeries Royales Saint-Hubert",
                "description": "Ensemble de galeries marchandes couvertes du XIXe siècle, parmi les plus anciennes d'Europe, abritant boutiques de luxe, cafés et théâtres.",
                "address": "Galerie du Roi 5, 1000 Bruxelles",
                "ambiance": "Élégante et historique, architecture néoclassique impressionnante",
                "best_time": "En soirée pour l'ambiance et l'éclairage, ou tôt le matin pour la tranquillité",
                "uniqueness": "Verrière spectaculaire et architecture préservée depuis 1847",
                "info": "Accessible tous les jours, boutiques ouvertes selon leurs horaires propres",
                "coordinates": {
                    "lat": 50.8462,
                    "lng": 4.3547
                },
                "image": "galeries_saint_hubert.jpg"
            }
        ]
    },
    'evenements': {
        "category": "Événements",
        "places": [
            {
                "title": "Festival du Film Fantastique de Bruxelles",
                "description": "Un festival de cinéma dédié aux films fantastiques, d'horreur et de science-fiction, avec des projections, des rencontres avec des réalisateurs et des événements spéciaux.",
                "address": "BOZAR, Rue Ravenstein 23, 1000 Bruxelles",
                "ambiance": "Cinéphile et festive, ambiance nocturne",
                "best_time": "Soirées pour les projections principales",
                "uniqueness": "L'un des plus grands festivals de films de genre en Europe",
                "info": "Billets disponibles en ligne ou sur place",
                "dates": "14-17 avril 2025",
                "coordinates": {
                    "lat": 50.8454,
                    "lng": 4.3574
                },
                "image": "bifff.jpg"
            },
            {
                "title": "Exposition Art Nouveau & Design",
                "description": "Une exposition temporaire présentant des œuvres d'art et des objets de design de l'époque Art Nouveau, mettant en valeur l'héritage bruxellois dans ce domaine.",
                "address": "Musées Royaux d'Art et d'Histoire, Parc du Cinquantenaire 10, 1000 Bruxelles",
                "ambiance": "Culturelle et éducative, dans un cadre historique",
                "best_time": "Matinée pour éviter l'affluence",
                "uniqueness": "Pièces rares et uniques de designers belges emblématiques",
                "info": "Entrée: 15€, audio-guide disponible",
                "dates": "Exposition en cours, jusqu'au 30 avril 2025",
                "coordinates": {
                    "lat": 50.8400,
                    "lng": 4.3936
                },
                "image": "expo_art_nouveau.jpg"
            },
            {
                "title": "Concert de Jazz au Music Village",
                "description": "Une soirée de jazz live dans l'un des clubs les plus réputés de Bruxelles, avec des musiciens locaux et internationaux.",
                "address": "Music Village, Rue des Pierres 50, 1000 Bruxelles",
                "ambiance": "Intime et chaleureuse, club de jazz authentique",
                "best_time": "Soirée, à partir de 20h30",
                "uniqueness": "Club historique avec une acoustique exceptionnelle",
                "info": "Réservation recommandée, consommation obligatoire",
                "dates": "15 avril 2025",
                "coordinates": {
                    "lat": 50.8461,
                    "lng": 4.3493
                },
                "image": "music_village.jpg"
            },
            {
                "title": "Marché des Artisans Bruxellois",
                "description": "Un marché temporaire réunissant des artisans locaux proposant des créations originales, de la gastronomie et des animations.",
                "address": "Place du Jeu de Balle, 1000 Bruxelles",
                "ambiance": "Conviviale et créative, ambiance de quartier",
                "best_time": "Matinée pour les produits frais, après-midi pour l'ambiance",
                "uniqueness": "Produits artisanaux exclusivement bruxellois",
                "info": "Entrée libre, de 10h à 18h",
                "dates": "16-17 avril 2025",
                "coordinates": {
                    "lat": 50.8400,
                    "lng": 4.3467
                },
                "image": "marche_artisans.jpg"
            },
            {
                "title": "Visite Guidée Street Art de Bruxelles",
                "description": "Une visite guidée à pied pour découvrir les plus belles œuvres de street art dans différents quartiers de Bruxelles, avec des explications sur les artistes et les techniques.",
                "address": "Départ: Station de métro Comte de Flandre, 1080 Molenbeek-Saint-Jean",
                "ambiance": "Urbaine et alternative, découverte de quartiers méconnus",
                "best_time": "Après-midi pour une meilleure lumière",
                "uniqueness": "Parcours constamment renouvelé suivant les nouvelles œuvres",
                "info": "Réservation obligatoire, 20€ par personne, durée: 2h30",
                "dates": "14 et 16 avril 2025, départ à 14h",
                "coordinates": {
                    "lat": 50.8558,
                    "lng": 4.3387
                },
                "image": "street_art_tour.jpg"
            }
        ]
    },
    'restos-uniques': {
        "category": "Restos uniques",
        "places": [
            {
                "title": "Tram Experience",
                "description": "Un restaurant installé dans un ancien tram qui parcourt la ville pendant que vous dégustez un menu gastronomique préparé par des chefs étoilés.",
                "address": "Place Poelaert (point de départ), 1000 Bruxelles",
                "ambiance": "Élégante et insolite, vue panoramique sur la ville",
                "best_time": "Soirée pour profiter des illuminations de la ville",
                "uniqueness": "Expérience gastronomique en mouvement dans un tram historique rénové",
                "info": "Réservation obligatoire, menu à partir de 95€ par personne",
                "coordinates": {
                    "lat": 50.8371,
                    "lng": 4.3520
                },
                "image": "tram_experience.jpg"
            },
            {
                "title": "Belga Queen",
                "description": "Restaurant installé dans un ancien bâtiment de la Banque nationale, combinant architecture classique et design contemporain, proposant une cuisine belge revisitée.",
                "address": "Rue Fossé aux Loups 32, 1000 Bruxelles",
                "ambiance": "Chic et impressionnante, cadre architectural exceptionnel",
                "best_time": "Dîner pour l'ambiance plus feutrée",
                "uniqueness": "Ancien bâtiment bancaire avec coffre-fort transformé en fumoir à cigares",
                "info": "Réservation recommandée, menu à partir de 45€",
                "coordinates": {
                    "lat": 50.8500,
                    "lng": 4.3542
                },
                "image": "belga_queen.jpg"
            },
            {
                "title": "Dinner in the Sky",
                "description": "Une expérience culinaire unique où les convives dînent sur une plateforme suspendue à 50 mètres de hauteur, avec vue panoramique sur Bruxelles.",
                "address": "Varie selon les éditions, généralement près de l'Atomium",
                "ambiance": "Exclusive et spectaculaire, sensation forte garantie",
                "best_time": "Coucher de soleil pour une vue exceptionnelle",
                "uniqueness": "Restaurant suspendu dans les airs avec chefs qui cuisinent devant vous",
                "info": "Événement saisonnier, réservation obligatoire, à partir de 295€ par personne",
                "coordinates": {
                    "lat": 50.8947,
                    "lng": 4.3415
                },
                "image": "dinner_in_sky.jpg"
            },
            {
                "title": "Le Pain Quotidien",
                "description": "Boulangerie-restaurant bio où l'on partage de grandes tables en bois, dans un cadre rustique et chaleureux, proposant des produits frais et de saison.",
                "address": "Rue Antoine Dansaert 16, 1000 Bruxelles (plusieurs adresses)",
                "ambiance": "Conviviale et décontractée, esprit communautaire",
                "best_time": "Brunch du weekend pour l'ambiance",
                "uniqueness": "Concept de table commune et pain bio cuit sur place",
                "info": "Sans réservation, formules à partir de 12€",
                "coordinates": {
                    "lat": 50.8492,
                    "lng": 4.3464
                },
                "image": "pain_quotidien.jpg"
            },
            {
                "title": "Comme Chez Soi",
                "description": "Institution gastronomique bruxelloise fondée en 1926, ce restaurant 2 étoiles Michelin propose une cuisine belge raffinée dans un décor Art Nouveau.",
                "address": "Place Rouppe 23, 1000 Bruxelles",
                "ambiance": "Gastronomique et historique, service impeccable",
                "best_time": "Dîner pour l'expérience complète",
                "uniqueness": "Table du chef avec vue sur les cuisines, décor Art Nouveau authentique",
                "info": "Réservation obligatoire, menu dégustation à partir de 175€",
                "coordinates": {
                    "lat": 50.8417,
                    "lng": 4.3456
                },
                "image": "comme_chez_soi.jpg"
            }
        ]
    },
    'nightlife': {
        "category": "Nightlife",
        "places": [
            {
                "title": "Delirium Café",
                "description": "Le spot le plus populaire parmi les touristes à Bruxelles, avec sa sélection impressionnante de plus de 2000 bières. Cette ruelle abrite plusieurs petits bars, dont le principal s'étend sur trois étages. C'est également l'emplacement de la célèbre statue Jeanneke Pis.",
                "address": "Impasse de la Fidélité 4, 1000 Bruxelles",
                "ambiance": "Animée et conviviale, idéale pour les amateurs de bière",
                "best_time": "En début de soirée pour éviter la foule du week-end",
                "uniqueness": "Détient le record du monde Guinness pour le plus grand nombre de bières disponibles",
                "info": "Ouvert tous les jours, ambiance particulièrement festive le week-end",
                "coordinates": {
                    "lat": 50.8485,
                    "lng": 4.3541
                },
                "image": "delirium_cafe.jpg"
            },
            {
                "title": "Fuse",
                "description": "Ancien cinéma devenu l'un des clubs techno les plus populaires de Bruxelles et un centre de la culture LGBTQ+. Le club est connu pour sa soirée mensuelle La Démence dédiée à la communauté LGBTQ+ qui a débuté il y a plus de 20 ans.",
                "address": "Rue Blaes 208, 1000 Bruxelles",
                "ambiance": "Électronique et inclusive, son de qualité",
                "best_time": "Nuit du samedi pour les meilleures soirées",
                "uniqueness": "L'un des temples de la techno à Bruxelles avec des systèmes sonores et d'éclairage de pointe",
                "info": "Pas de frais d'entrée pour certaines soirées, à 13 minutes du centre-ville",
                "coordinates": {
                    "lat": 50.8383,
                    "lng": 4.3429
                },
                "image": "fuse.jpg"
            },
            {
                "title": "Madame Moustache",
                "description": "Un club fantaisiste classique qui diffuse de la musique de toutes les époques, où vous êtes sûr de danser. C'est l'un des clubs les plus populaires de Bruxelles parmi les touristes et les locaux. Après avoir dansé et bu quelques verres, vous pouvez vous rendre dans le fumoir ou même vous faire couper les cheveux dans le salon de coiffure sur place!",
                "address": "Quai au Bois à Brûler 5-7, 1000 Bruxelles",
                "ambiance": "Éclectique et vintage, décor rétro",
                "best_time": "Vendredi et samedi soir pour l'ambiance maximale",
                "uniqueness": "Salon de coiffure sur place et décoration inspirée des cabarets du 19ème siècle",
                "info": "Concerts live et DJ sets variés, de l'électro-swing au rock",
                "coordinates": {
                    "lat": 50.8512,
                    "lng": 4.3469
                },
                "image": "madame_moustache.jpg"
            },
            {
                "title": "Spirito Brussels",
                "description": "Avez-vous déjà été dans une boîte de nuit installée dans une ancienne église? Après avoir visité Spirito Brussels, vous pourrez dire que oui! Autrefois église, maintenant transformée en club populaire conservant l'architecture originale avec l'ajout de cristal et d'or.",
                "address": "Rue de Stassart 18, 1050 Bruxelles",
                "ambiance": "Grandiose et unique, sous les voûtes d'une église",
                "best_time": "Samedi soir pour l'expérience complète",
                "uniqueness": "Club de nuit dans une église désacralisée avec architecture originale préservée",
                "info": "Code vestimentaire strict, préférez les tenues avec paillettes ou sequins",
                "coordinates": {
                    "lat": 50.8362,
                    "lng": 4.3622
                },
                "image": "spirito.jpg"
            },
            {
                "title": "Le Cercueil",
                "description": "Un bar à thème Halloween ouvert toute l'année situé sur la Grand Place. Se traduisant par \"Le Cercueil\", le bar est rempli de squelettes, y compris les chopes, et les tables sont des cercueils. Profitez d'un verre effrayant en écoutant de la musique hard rock.",
                "address": "Rue des Harengs 10-12, 1000 Bruxelles",
                "ambiance": "Macabre et rock, décoration sur le thème de la mort",
                "best_time": "Soirée pour profiter pleinement de l'ambiance sombre",
                "uniqueness": "Tables en forme de cercueils et décoration permanente d'Halloween",
                "info": "Prix légèrement plus élevés, mais l'atmosphère unique en vaut la peine",
                "coordinates": {
                    "lat": 50.8468,
                    "lng": 4.3525
                },
                "image": "le_cercueil.jpg"
            }
        ]
    }
};

// Fonction pour charger les données d'une catégorie (version corrigée pour éviter les erreurs CORS)
async function loadCategoryData(category) {
    console.log("Chargement des données pour la catégorie:", category);
    
    // Utiliser les données intégrées au lieu de fetch pour éviter les erreurs CORS
    if (embeddedData[category]) {
        console.log("Données chargées depuis la source intégrée");
        return embeddedData[category];
    } else {
        console.error("Catégorie non trouvée dans les données intégrées:", category);
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

console.log("Module de chargement de données initialisé avec succès");
