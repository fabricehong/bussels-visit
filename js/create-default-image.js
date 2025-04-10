// Créer une image par défaut pour les lieux
const defaultImage = document.createElement('canvas');
defaultImage.width = 800;
defaultImage.height = 500;
const ctx = defaultImage.getContext('2d');

// Fond dégradé
const gradient = ctx.createLinearGradient(0, 0, 800, 500);
gradient.addColorStop(0, '#FF4D6D');
gradient.addColorStop(1, '#6C63FF');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 800, 500);

// Texte "Bruxelles Créative"
ctx.font = 'bold 48px Montserrat, sans-serif';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Bruxelles Créative', 400, 250);

// Exporter l'image
const dataUrl = defaultImage.toDataURL('image/jpeg');
const link = document.createElement('a');
link.href = dataUrl;
link.download = 'default-place.jpg';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
