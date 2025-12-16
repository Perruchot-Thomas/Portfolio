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
const allTriggers = document.querySelectorAll('[data-target]');

allTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        // Empêche le bug où le clic traverse parfois les éléments
        e.stopPropagation();

        // On récupère l'ID de la fenêtre à ouvrir
        const targetId = trigger.getAttribute('data-target');
        const targetWindow = document.getElementById(targetId);

        if (targetWindow) {
            targetWindow.classList.add('active'); // Affiche la fenêtre
            bringToFront(targetWindow);           // La met devant
            
            // Note : Le centrage initial est géré par le CSS (top: 50%, left: 50%)
            // Le Drag & Drop mettra à jour ces valeurs ensuite.
        }
    });
});