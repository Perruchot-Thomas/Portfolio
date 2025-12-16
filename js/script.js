document.addEventListener('DOMContentLoaded', () => {
    
    // === VARIABLES GLOBALES ===
    let highestZIndex = 100;

    // === 1. FONCTIONS UTILITAIRES ===
    
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

    // === 2. INITIALISATION (FENÊTRES & ICÔNES) ===
    
    // Rendre les icônes du bureau déplaçables
    const desktopShortcuts = document.querySelectorAll('.desktop__shortcut');
    desktopShortcuts.forEach(shortcut => makeDraggable(shortcut));

    // Rendre les fenêtres déplaçables et gérer la fermeture
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        const header = win.querySelector('.window__header');
        if(header) makeDraggable(win, header);
        
        // Passer au premier plan au clic
        win.addEventListener('mousedown', () => bringToFront(win));
        
        // Bouton de fermeture (X)
        const closeBtn = win.querySelector('.window__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Empêche de cliquer sur la fenêtre en dessous
                win.classList.remove('active');
            });
        }
    });

    // === 3. SYSTÈME D'OUVERTURE DES DOSSIERS ===
    
    function openWindowFromTrigger(trigger) {
        const targetId = trigger.getAttribute('data-target');
        const targetWindow = document.getElementById(targetId);
        
        if (targetWindow) {
            targetWindow.classList.add('active');
            bringToFront(targetWindow);
            
            // Recentrage automatique sur mobile
            if (window.innerWidth <= 768) {
                targetWindow.style.top = "50%";
                targetWindow.style.left = "50%";
                targetWindow.style.transform = "translate(-50%, -50%)";
            }
        }
    }

    // Gestion du clic sur les dossiers (Icônes bureau + Icônes dans fenêtres)
    const allTriggers = document.querySelectorAll('[data-target]');
    allTriggers.forEach(trigger => {
        // Double Clic pour Ordinateur
        trigger.addEventListener('dblclick', (e) => {
            if (window.innerWidth > 768) {
                e.stopPropagation();
                openWindowFromTrigger(trigger);
            }
        });
        // Simple Clic pour Mobile
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.stopPropagation();
                openWindowFromTrigger(trigger);
            }
        });
    });

    // === 4. BARRE DES TÂCHES & MENU DÉMARRER ===
    
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
        e.stopPropagation(); // Empêche les conflits
        const imgClicked = e.target;

        console.log("Image cliquée : ", imgClicked.src); // Pour le débogage

        // 1. Mettre l'image source dans la visionneuse
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
            
            // Centrage forcé pour être sûr qu'elle est visible
            previewWindow.style.top = "50%";
            previewWindow.style.left = "50%";
            previewWindow.style.transform = "translate(-50%, -50%)";
        }
    }

    // On attache l'événement CLIC (Simple clic comme un lien)
    const galleryImages = document.querySelectorAll('.clickable-image');
    galleryImages.forEach(img => {
        img.addEventListener('click', openPreview);
        // Ajout du style curseur main pour bien montrer que c'est cliquable
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