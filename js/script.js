/* ============================================================
   PORTFOLIO OS - SCRIPT COMPLET
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // === 0. CONFIGURATION MUSIQUE (Basé sur tes uploads) ===
    const songs = [
        {
            title: "Piste Audio 2",
            artist: "Artiste Inconnu",
            src: "assets/music/song2.mp3",
            cover: "assets/cover2.jpg"
        },
        {
            title: "Piste Audio 3",
            artist: "Artiste Inconnu",
            src: "assets/music/song3.mp3",
            cover: "assets/cover3.jpg"
        },
         {
            title: "Piste Audio 1",
            artist: "Artiste Inconnu",
            src: "assets/music/song1.mp3", 
            cover: "assets/cover1.jpg"
        }
    ];

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

    // === 2. INITIALISATION ===
    const desktopShortcuts = document.querySelectorAll('.desktop__shortcut');
    desktopShortcuts.forEach(shortcut => makeDraggable(shortcut));

    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        const header = win.querySelector('.window__header');
        if(header) makeDraggable(win, header);
        win.addEventListener('mousedown', () => bringToFront(win));
        const closeBtn = win.querySelector('.window__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                win.classList.remove('active');
            });
        }
    });

    const musicPlayer = document.querySelector('.music-player');
    const musicHeader = document.querySelector('.music-player__header');
    if(musicPlayer && musicHeader) {
        makeDraggable(musicPlayer, musicHeader);
        musicPlayer.addEventListener('mousedown', () => bringToFront(musicPlayer));
    }

    // === 3. LECTEUR AUDIO ===
    const audio = document.getElementById('audio');
    const title = document.getElementById('music-title');
    const artist = document.getElementById('music-artist');
    const cover = document.getElementById('music-cover');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let songIndex = 0;

    function loadSong(song) {
        if(!song) return;
        title.innerText = song.title;
        artist.innerText = song.artist;
        audio.src = song.src;
        cover.src = song.cover;
    }

    if(songs.length > 0) loadSong(songs[songIndex]);

    function playSong() {
        playBtn.innerText = "⏸";
        audio.play();
    }
    function pauseSong() {
        playBtn.innerText = "▶";
        audio.pause();
    }
    function prevSong() {
        songIndex--;
        if (songIndex < 0) songIndex = songs.length - 1;
        loadSong(songs[songIndex]);
        playSong();
    }
    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) songIndex = 0;
        loadSong(songs[songIndex]);
        playSong();
    }

    if(playBtn) playBtn.addEventListener('click', () => {
        if(audio.paused) playSong();
        else pauseSong();
    });
    if(prevBtn) prevBtn.addEventListener('click', prevSong);
    if(nextBtn) nextBtn.addEventListener('click', nextSong);
    if(audio) audio.addEventListener('ended', nextSong);

    // === 4. OUVERTURE DOSSIERS ===
    function openWindowFromTrigger(trigger) {
        const targetId = trigger.getAttribute('data-target');
        const targetWindow = document.getElementById(targetId);
        if (targetWindow) {
            targetWindow.classList.add('active');
            bringToFront(targetWindow);
            if (window.innerWidth <= 768) {
                targetWindow.style.top = "50%";
                targetWindow.style.left = "50%";
                targetWindow.style.transform = "translate(-50%, -50%)";
            }
        }
    }

    const allTriggers = document.querySelectorAll('[data-target]');
    allTriggers.forEach(trigger => {
        trigger.addEventListener('dblclick', (e) => {
            if (window.innerWidth > 768) {
                e.stopPropagation();
                openWindowFromTrigger(trigger);
            }
        });
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.stopPropagation();
                openWindowFromTrigger(trigger);
            }
        });
    });

    // === 5. BARRE DES TÂCHES & MENU ===
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const clock = document.getElementById('clock');
        if (clock) clock.textContent = `${hours}:${minutes}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

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

    // === 6. VISIONNEUSE ===
    const previewWindow = document.getElementById('win-preview');
    const previewImg = document.getElementById('preview-img');
    const previewTitle = document.getElementById('preview-title');

    function openPreview(e) {
        e.stopPropagation(); 
        const imgClicked = e.target;
        if (previewImg) previewImg.src = imgClicked.src;
        if (previewTitle) {
            const label = imgClicked.parentElement.querySelector('.file-grid__label');
            previewTitle.textContent = "Visionneuse - " + (label ? label.innerText : "Image");
        }
        if (previewWindow) {
            previewWindow.classList.add('active');
            bringToFront(previewWindow);
            previewWindow.style.top = "50%";
            previewWindow.style.left = "50%";
            previewWindow.style.transform = "translate(-50%, -50%)";
        }
    }

    const galleryImages = document.querySelectorAll('.clickable-image');
    galleryImages.forEach(img => {
        img.addEventListener('click', openPreview);
        img.style.cursor = "pointer"; 
    });

    // === 7. EASTER EGGS ===
    document.addEventListener('mousedown', (e) => {
        if (e.button === 2) document.body.classList.add('right-click-active');
        if (e.button === 0 && e.shiftKey) document.body.classList.add('easter-egg-active');
        
        if (e.button === 0 && e.target.classList.contains('desktop')) {
            e.target.classList.toggle('click-bg-active');
        }
    });
    document.addEventListener('mouseup', () => {
        document.body.classList.remove('right-click-active');
        document.body.classList.remove('easter-egg-active');
    });
    document.addEventListener('contextmenu', (e) => e.preventDefault());
});

// === 9. WIDGET CAMERA ===
    const camWidget = document.querySelector('.camera-widget');
    const camHeader = document.querySelector('.camera-widget__header');
    
    // 1. Rendre déplaçable
    if (camWidget && camHeader) {
        makeDraggable(camWidget, camHeader);
        camWidget.addEventListener('mousedown', () => bringToFront(camWidget));
    }

    // 2. Gestion de la vidéo
    const videoElem = document.getElementById('webcamVideo');
    const toggleBtn = document.getElementById('camToggleBtn');
    const recIndicator = document.querySelector('.rec-indicator');
    const camCloseBtn = document.querySelector('.cam-close');
    let stream = null;

    async function startWebcam() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElem.srcObject = stream;
            recIndicator.classList.add('active'); // Affiche "REC"
            toggleBtn.style.color = "#00ff00"; // Bouton devient vert
        } catch (err) {
            console.error("Erreur webcam:", err);
            alert("Impossible d'accéder à la caméra (Permission refusée ?)");
        }
    }

    function stopWebcam() {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoElem.srcObject = null;
            stream = null;
            recIndicator.classList.remove('active');
            toggleBtn.style.color = "#ff0055"; // Retour au rouge
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (stream) {
                stopWebcam();
            } else {
                startWebcam();
            }
        });
    }

    // Bouton croix pour fermer complètement le widget
    if (camCloseBtn && camWidget) {
        camCloseBtn.addEventListener('click', () => {
            stopWebcam(); // On coupe la caméra d'abord
            camWidget.style.display = 'none';
        });
    }