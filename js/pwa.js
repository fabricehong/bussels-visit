// Variables pour l'installation de la PWA
let deferredPrompt;
let installButton;
const updateButton = document.getElementById('update-pwa-btn'); // Get update button
let newWorker; // Variable to hold the new waiting worker

// Function to show the update button and attach listener
function showUpdateButton(worker) {
  if (updateButton && worker) {
    newWorker = worker; // Store the waiting worker
    updateButton.classList.add('visible'); // Use class to show
    // Remove previous listener to avoid duplicates if function is called multiple times
    updateButton.removeEventListener('click', handleUpdateButtonClick);
    updateButton.addEventListener('click', handleUpdateButtonClick); // Add the actual handler
    updateButton.disabled = false; // Ensure button is enabled initially
    updateButton.innerHTML = '<i class="fas fa-sync-alt"></i>'; // Reset icon
  }
}

// Separate handler function for the button click
function handleUpdateButtonClick() {
  if (newWorker) {
    console.log('PWA: Sending SKIP_WAITING to new worker');
    newWorker.postMessage({ type: 'SKIP_WAITING' });
    // Optional: Add visual feedback like disabling button
    updateButton.disabled = true;
    updateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; 
  }
}

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker enregistré avec succès:', registration.scope);

        // 1. Check if a worker is already waiting
        if (registration.waiting) {
          console.log('PWA: Found a waiting service worker on load.');
          showUpdateButton(registration.waiting);
        }

        // 2. Listen for new workers installing
        registration.addEventListener('updatefound', () => {
          console.log('PWA: New service worker found. Installing...');
          // A new worker is installing
          const installingWorker = registration.installing;
          
          installingWorker.addEventListener('statechange', () => {
             console.log(`PWA: New worker state: ${installingWorker.state}`);
            // Check if it's installed and waiting
            if (installingWorker.state === 'installed') {
              // Check if there's an active controller. If so, an update is available.
              if (navigator.serviceWorker.controller) { 
                 console.log('PWA: New service worker installed and waiting.');
                 showUpdateButton(installingWorker);
              } else {
                 // This is the initial SW installation, no update button needed yet.
                 console.log('PWA: Initial service worker installed successfully.');
              }
            }
          });
        });
      })
      .catch(error => {
        console.log('Échec de l\'enregistrement du Service Worker:', error); // Escaped single quote
      });

    // 3. Listen for the controller changing - reload page
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
       console.log('PWA: Controller changed.');
      if (refreshing) return; // Prevent infinite loops
      console.log('PWA: Reloading page for new service worker.');
      window.location.reload();
      refreshing = true;
    });
  });
}

// Intercepter l'événement beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher Chrome 67+ d'afficher automatiquement l'invite
    e.preventDefault();
    // Stocker l'événement pour l'utiliser plus tard
    deferredPrompt = e;
    // Mettre à jour l'interface utilisateur pour informer l'utilisateur qu'il peut installer l'application
    showInstallPromotion();
});

// Afficher la promotion d'installation
function showInstallPromotion() {
    // Créer le bouton d'installation s'il n'existe pas déjà
    if (!document.getElementById('install-button')) {
        installButton = document.createElement('button');
        installButton.id = 'install-button';
        installButton.classList.add('install-button');
        installButton.innerHTML = '<i class="fas fa-download"></i> Installer l\'application';
        
        // Ajouter le bouton au DOM
        document.body.appendChild(installButton);
        
        // Ajouter un écouteur d'événements pour le bouton d'installation
        installButton.addEventListener('click', installPWA);
    }
}

// Fonction pour installer la PWA
function installPWA() {
    // Cacher la promotion d'installation
    if (installButton) {
        installButton.style.display = 'none';
    }
    
    // Afficher l'invite d'installation
    if (deferredPrompt) {
        deferredPrompt.prompt();
        
        // Attendre que l'utilisateur réponde à l'invite
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('L\'utilisateur a accepté l\'installation de l\'application');
                // Afficher un message de confirmation
                showInstallationConfirmation();
            } else {
                console.log('L\'utilisateur a refusé l\'installation de l\'application');
                // Réafficher le bouton d'installation après un certain temps
                setTimeout(() => {
                    if (installButton) {
                        installButton.style.display = 'block';
                    }
                }, 60000); // 1 minute
            }
            
            // Réinitialiser la variable deferredPrompt
            deferredPrompt = null;
        });
    }
}

// Afficher un message de confirmation après l'installation
function showInstallationConfirmation() {
    const confirmation = document.createElement('div');
    confirmation.id = 'install-confirmation';
    confirmation.classList.add('install-confirmation');
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <i class="fas fa-check-circle"></i>
            <p>Application installée avec succès !</p>
            <button id="close-confirmation">Fermer</button>
        </div>
    `;
    
    document.body.appendChild(confirmation);
    
    // Fermer le message de confirmation
    document.getElementById('close-confirmation').addEventListener('click', () => {
        document.body.removeChild(confirmation);
    });
    
    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
        if (document.getElementById('install-confirmation')) {
            document.body.removeChild(confirmation);
        }
    }, 5000);
}

// Vérifier si l'application est déjà installée
window.addEventListener('appinstalled', (evt) => {
    console.log('Application installée');
    // Cacher le bouton d'installation
    if (installButton) {
        installButton.style.display = 'none';
    }
});
