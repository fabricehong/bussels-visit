// Variables pour l'installation de la PWA
let deferredPrompt;
let installButton;

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker enregistré avec succès:', registration.scope);
            })
            .catch(error => {
                console.log('Échec de l\'enregistrement du Service Worker:', error);
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
