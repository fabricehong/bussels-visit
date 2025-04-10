const CACHE_NAME = 'bruxelles-creative-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/additional-styles.css',
  '/css/responsive.css',
  '/css/cross-browser.css',
  '/js/main-complete.js',
  '/js/map-complete.js',
  '/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.79.0/dist/L.Control.Locate.min.css',
  'https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.79.0/dist/L.Control.Locate.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Mise en cache des ressources');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache: Cache First, puis réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retourner la réponse du cache
        if (response) {
          return response;
        }

        // Cloner la requête
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Vérifier si la réponse est valide
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloner la réponse
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Ne pas mettre en cache les URL externes (comme les tuiles de carte)
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(error => {
            console.log('Service Worker: Erreur de récupération', error);
            // Vous pouvez retourner une page d'erreur personnalisée ici
          });
      })
  );
});

// Gestion des événements push
self.addEventListener('push', event => {
  const title = 'Bruxelles Créative';
  const options = {
    body: event.data.text(),
    icon: 'images/icons/icon-192x192.png',
    badge: 'images/icons/icon-72x72.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Événement pour l'installation de l'application
self.addEventListener('beforeinstallprompt', event => {
  console.log('Service Worker: Événement beforeinstallprompt déclenché');
  // Stockez l'événement pour l'utiliser plus tard
  self.deferredPrompt = event;
});
