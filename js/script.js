// === VARIABLES GLOBALES ===
// Sert à gérer qui est devant qui (Z-Index)
let highestZIndex = 100;

// === FONCTION : METTRE AU PREMIER PLAN ===
function bringToFront(element) {
    highestZIndex++;
    element.style.zIndex = highestZIndex;
}

// === FONCTION : RENDRE UN ÉLÉMENT DÉPLAÇABLE (Drag & Drop) ===
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    // Si on fournit un "handle" (ex: barre de titre), on tire par là. 
    // Sinon on tire par l'élément entier (ex: icône).
    const dragHandle = handle || element;
    
    dragHandle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        // e.preventDefault(); // On le laisse commenté pour ne pas bloquer le tactile/clic mobile
        
        // Dès qu'on clique pour bouger, l'élément passe devant
        bringToFront(element);

        // On récupère la position initiale de la souris
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // On écoute les mouvements
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        // On calcule le déplacement
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // On applique la nouvelle position (CSS)
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // On arrête d'écouter les mouvements quand on relâche la souris
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// === INITIALISATION AU CHARGEMENT ===

// 1. GESTION DES ICÔNES DU BUREAU (Déplaçables)
const desktopShortcuts = document.querySelectorAll('.desktop__shortcut');
desktopShortcuts.forEach(shortcut => {
    makeDraggable(shortcut);
});

// 2. GESTION DES FENÊTRES (Déplaçables via la barre de titre)
const windows = document.querySelectorAll('.window');
windows.forEach(win => {
    const header = win.querySelector('.window__header');
    
    // On rend la fenêtre draggable uniquement via le header
    makeDraggable(win, header);
    
    // Si on clique n'importe où sur la fenêtre, elle passe devant
    win.addEventListener('mousedown', () => bringToFront(win));
    
    // Gestion du bouton fermer
    const closeBtn = win.querySelector('.window__close');
    closeBtn.addEventListener('click', () => {
        win.classList.remove('active');
    });
});

// 3. GESTION DE L'OUVERTURE (Système universel)
// Ça marche pour les icônes du bureau ET les icônes dans les dossiers
// ... (Garde tout le début de ton script : variables, bringToFront, makeDraggable...) ...

// ==========================================
// 3. GESTION DE L'OUVERTURE (Intelligente)
// ==========================================

// Petite fonction pour ouvrir la fenêtre (pour ne pas répéter le code)
function openWindowFromTrigger(trigger) {
    const targetId = trigger.getAttribute('data-target');
    const targetWindow = document.getElementById(targetId);

    if (targetWindow) {
        targetWindow.classList.add('active');
        bringToFront(targetWindow);
    }
}

// On sélectionne tous les éléments qui doivent ouvrir quelque chose
const allTriggers = document.querySelectorAll('[data-target]');

allTriggers.forEach(trigger => {
    
    // CAS 1 : SUR ORDINATEUR (> 768px)
    // On utilise le DOUBLE CLIC ('dblclick').
    // Ainsi, un simple clic ou un déplacement ne déclenchera rien.
    trigger.addEventListener('dblclick', (e) => {
        if (window.innerWidth > 768) {
            e.stopPropagation();
            openWindowFromTrigger(trigger);
        }
    });

    // CAS 2 : SUR MOBILE (<= 768px)
    // On garde le SIMPLE CLIC ('click') car on ne peut pas "drag & drop" 
    // sur la version mobile (grâce au CSS) et le double tap est désagréable.
    trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.stopPropagation();
            openWindowFromTrigger(trigger);
        }
    });
    
    // OPTIONNEL : Si tu veux que le curseur change en "main" seulement au survol
    // et pas pendant le drag, le CSS le gère déjà.
});

// ... (Garde la gestion du Clic Droit à la fin si tu l'as mise) ...

// ... Ton code précédent ...

// ==========================================
// 5. GESTION DE LA BARRE DES TÂCHES
// ==========================================

// --- HORLOGE ---
function updateClock() {
    const now = new Date();
    // On formate l'heure pour avoir toujours 2 chiffres (ex: 09:05)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = `${hours}:${minutes}`;
    }
}

// Lancer l'horloge tout de suite
updateClock();
// Mettre à jour toutes les secondes (1000ms)
setInterval(updateClock, 1000);


// --- MENU DÉMARRER ---
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

if (startBtn && startMenu) {
    startBtn.addEventListener('click', (e) => {
        // Empêche le clic de se propager au bureau (sinon ça fermerait tout de suite)
        e.stopPropagation();
        
        // Toggle (Affiche / Cache)
        startMenu.classList.toggle('visible');
        startBtn.classList.toggle('active'); // Garde le bouton enfoncé visuellement
    });

    // Fermer le menu si on clique n'importe où ailleurs sur le bureau
    document.addEventListener('click', (e) => {
        // Si on clique en dehors du menu et du bouton
        if (!startMenu.contains(e.target) && e.target !== startBtn) {
            startMenu.classList.remove('visible');
            startBtn.classList.remove('active');
        }
    });
}

// ==========================================
// GESTION DE L'EXTINCTION (Simulée)
// ==========================================

const shutdownBtn = document.getElementById('shutdown-btn');

if (shutdownBtn) {
    shutdownBtn.addEventListener('click', () => {
        
        // 1. On crée un écran noir
        const blackScreen = document.createElement('div');
        
        // 2. On lui donne le style "Plein écran" via JS
        Object.assign(blackScreen.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            zIndex: '999999', // Au-dessus de TOUT
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: "'Courier New', Courier, monospace"
        });

        // 3. Le message à afficher
        blackScreen.innerHTML = `
            <h1 style="margin-bottom: 20px;">Arrêt du système...</h1>
            <p style="font-size: 14px; opacity: 0.7;">Vous pouvez maintenant fermer cette page.</p>
        `;

        // 4. On l'ajoute à la page
        document.body.appendChild(blackScreen);

        // 5. On tente quand même de fermer la fenêtre (ça marchera dans de rares cas)
        setTimeout(() => {
            try {
                window.close();
            } catch (e) {
                console.log("Le navigateur a empêché la fermeture automatique.");
            }
        }, 1000);
    });
}

// A COLLER À LA FIN DE js/script.js

// === 5. VISIONNEUSE D'IMAGES (Galerie) ===

const previewWindow = document.getElementById('win-preview');
const previewImg = document.getElementById('preview-img');
const previewTitle = document.getElementById('preview-title');

function setupImageGallery() {
    // Cible toutes les images avec la classe 'clickable-image'
    const galleryImages = document.querySelectorAll('.clickable-image');

    galleryImages.forEach(img => {
        // On nettoie les anciens écouteurs pour éviter les doublons
        img.removeEventListener('click', openPreview);
        img.addEventListener('click', openPreview);
    });
}

function openPreview(e) {
    e.stopPropagation(); // Empêche de sélectionner le dossier en dessous
    const imgClicked = e.target;
    
    // 1. Mettre l'image dans la visionneuse
    if (previewImg) previewImg.src = imgClicked.src;

    // 2. Mettre à jour le titre
    if (previewTitle) {
        const label = imgClicked.parentElement.querySelector('.file-grid__label');
        previewTitle.textContent = "Visionneuse - " + (label ? label.innerText : "Image");
    }

    // 3. Ouvrir la fenêtre
    if (previewWindow) {
        previewWindow.classList.add('active');
        bringToFront(previewWindow);
    }
}

// On lance la détection des images au chargement
setupImageGallery();