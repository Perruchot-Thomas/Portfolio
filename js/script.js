/* ============================================================
   PORTFOLIO OS - SCRIPT COMPLET (CORRIGÉ)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // === VARIABLES GLOBALES ===
    let highestZIndex = 100;

    // === 1. FONCTIONS UTILITAIRES (Z-Index et Drag & Drop) ===
    
    function bringToFront(element) {
        highestZIndex++;
        element.style.zIndex = highestZIndex;
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const dragHandle = handle || element;
        
        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            bringToFront(element);
            pos3 = e.clientX;
            pos4 = e.clientY;
            // On écoute le mouvement sur tout le document
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // === 2. INITIALISATION DES FENÊTRES ET ICÔNES ===
    
    // Rendre les icônes du bureau déplaçables
    const desktopShortcuts = document.querySelectorAll('.desktop__shortcut');
    desktopShortcuts.forEach(shortcut => makeDraggable(shortcut));

    // Rendre les fenêtres déplaçables via leur barre de titre
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        const header = win.querySelector('.window__header');
        if(header) makeDraggable(win, header);
        
        // Passer au premier plan quand on clique dessus
        win.addEventListener('mousedown', () => bringToFront(win));
        
        // Gestion du bouton Fermer (X)
        const closeBtn = win.querySelector('.window__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Évite les conflits
                win.classList.remove('active');
            });
        }
    });

    // === 3. GESTION DE L'OUVERTURE DES DOSSIERS ===
    
    function openWindowFromTrigger(trigger) {
        const targetId = trigger.getAttribute('data-target');
        const targetWindow = document.getElementById(targetId);
        
        if (targetWindow) {
            targetWindow.classList.add('active');
            bringToFront(targetWindow);
            
            // Sur mobile : on centre la fenêtre
            if (window.innerWidth <= 768) {
                targetWindow.style.top = "50%";
                targetWindow.style.left = "50%";
                targetWindow.style.transform = "translate(-50%, -50%)";
            }
        }
    }

    // On attache les événements aux dossiers (Double clic PC / Simple clic Mobile)
    const allTriggers = document.querySelectorAll('[data-target]');
    allTriggers.forEach(trigger => {
        // PC : Double clic
        trigger.addEventListener('dblclick', (e) => {
            if (window.innerWidth > 768) {
                e.stopPropagation();
                openWindowFromTrigger(trigger);
            }
        });
        // Mobile : Simple clic
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.stopPropagation();
                openWindowFromTrigger(trigger);
            }
        });
    });

    // === 4. BARRE DES TÂCHES ET MENU ===
    
    // Horloge
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const clock = document.getElementById('clock');
        if (clock) clock.textContent = `${hours}:${minutes}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Menu Démarrer
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');
    
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.classList.toggle('visible');
            startBtn.classList.toggle('active');
        });
        // Fermer si on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && e.target !== startBtn) {
                startMenu.classList.remove('visible');
                startBtn.classList.remove('active');
            }
        });
    }

    // Bouton Éteindre
    const shutdownBtn = document.getElementById('shutdown-btn');
    if (shutdownBtn) {
        shutdownBtn.addEventListener('click', () => {
            const blackScreen = document.createElement('div');
            Object.assign(blackScreen.style, {
                position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                backgroundColor: 'black', zIndex: '999999', display: 'flex',
                flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white'
            });
            blackScreen.innerHTML = `<h1>Arrêt du système...</h1>`;
            document.body.appendChild(blackScreen);
        });
    }

    // === 5. VISIONNEUSE D'IMAGES (LIENS CLIQUABLES) ===
    
    const previewWindow = document.getElementById('win-preview');
    const previewImg = document.getElementById('preview-img');
    const previewTitle = document.getElementById('preview-title');

    function openPreview(e) {
        e.stopPropagation(); 
        const imgClicked = e.target;

        // 1. Mettre l'image dans la visionneuse
        if (previewImg) previewImg.src = imgClicked.src;

        // 2. Mettre le titre
        if (previewTitle) {
            const label = imgClicked.parentElement.querySelector('.file-grid__label');
            previewTitle.textContent = "Visionneuse - " + (label ? label.innerText : "Image");
        }

        // 3. Afficher la fenêtre
        if (previewWindow) {
            previewWindow.classList.add('active');
            bringToFront(previewWindow);
            
            // Centrage forcé pour être sûr qu'elle est visible
            previewWindow.style.top = "50%";
            previewWindow.style.left = "50%";
            previewWindow.style.transform = "translate(-50%, -50%)";
        }
    }

    // Attacher l'événement CLIC sur toutes les images "clickable-image"
    // On utilise le simple clic pour simuler l'ouverture d'un fichier/lien
    const galleryImages = document.querySelectorAll('.clickable-image');
    galleryImages.forEach(img => {
        img.addEventListener('click', openPreview);
        img.style.cursor = "pointer"; 
    });

    // === 6. EASTER EGGS & FOND D'ÉCRAN ===
    
    document.addEventListener('mousedown', (e) => {
        // Clic Droit
        if (e.button === 2) document.body.classList.add('right-click-active');
        // Easter Egg (Shift + Clic)
        if (e.button === 0 && e.shiftKey) document.body.classList.add('easter-egg-active');
        
        // Changement de fond au clic sur le bureau
        if (e.button === 0 && e.target.classList.contains('desktop')) {
            e.target.classList.toggle('click-bg-active');
        }
    });

    document.addEventListener('mouseup', () => {
        document.body.classList.remove('right-click-active');
        document.body.classList.remove('easter-egg-active');
    });

    // Bloquer le menu contextuel par défaut
    document.addEventListener('contextmenu', (e) => e.preventDefault());

}); // Fin du chargement DOM