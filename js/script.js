/* ============================================================
   PORTFOLIO OS - SCRIPT COMPLET CORRIGÉ
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // === 0. CONFIGURATION MUSIQUE ===
    const songs = [
        {
            title: "Piste Audio 1",
            artist: "Artiste Inconnu",
            src: "assets/music/song1.mp3", 
            cover: "assets/cover1.jpg"
        },
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
        }
    ];

    // === VARIABLES GLOBALES ===
    let highestZIndex = 100;

    // === 1. FONCTIONS UTILITAIRES (DRAG & DROP) ===
    function bringToFront(element) {
        highestZIndex++;
        element.style.zIndex = highestZIndex;
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const dragHandle = handle || element;
        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault(); // Empêche la sélection de texte
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

    // === 2. INITIALISATION DES FENÊTRES ET RACCOURCIS ===
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
                // Si c'est la webcam ou la musique, on gère l'arrêt spécifique plus bas
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

    if(songs.length > 0 && audio) loadSong(songs[songIndex]);

    function playSong() {
        if(!playBtn) return;
        playBtn.innerText = "⏸";
        audio.play();
    }
    function pauseSong() {
        if(!playBtn) return;
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

    // === 4. OUVERTURE DES DOSSIERS / FENÊTRES ===
    function openWindowFromTrigger(trigger) {
        const targetId = trigger.getAttribute('data-target');
        const targetWindow = document.getElementById(targetId);
        if (targetWindow) {
            targetWindow.classList.add('active');
            bringToFront(targetWindow);
            
            // Centrage auto sur mobile
            if (window.innerWidth <= 768) {
                targetWindow.style.top = "50%";
                targetWindow.style.left = "50%";
                targetWindow.style.transform = "translate(-50%, -50%)";
            }
        }
    }

    const allTriggers = document.querySelectorAll('[data-target]');
    allTriggers.forEach(trigger => {
        // Double clic sur ordinateur
        trigger.addEventListener('dblclick', (e) => {
            if (window.innerWidth > 768) {
                e.stopPropagation();
                openWindowFromTrigger(trigger);
            }
        });
        // Simple clic sur mobile
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.stopPropagation();
                openWindowFromTrigger(trigger);
            }
        });
    });

    // === 5. BARRE DES TÂCHES & MENU DÉMARRER ===
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

    // === 6. VISIONNEUSE D'IMAGES ===
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
    });

   // === 7. EASTER EGGS ===
    document.addEventListener('mousedown', (e) => {
        // Clic droit
        if (e.button === 2) document.body.classList.add('right-click-active');
        // Shift + Clic
        if (e.button === 0 && e.shiftKey) document.body.classList.add('easter-egg-active');
        
        // J'ai supprimé ici les lignes qui changeaient le fond au clic simple
    });

    document.addEventListener('mouseup', () => {
        document.body.classList.remove('right-click-active');
        document.body.classList.remove('easter-egg-active');
    });
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // === 8. WIDGET CAMERA (DÉPLACÉ ICI POUR MARCHER) ===
    const camWidget = document.querySelector('.camera-widget');
    const camHeader = document.querySelector('.camera-widget__header');
    
    // Rendre la caméra déplaçable
    if (camWidget && camHeader) {
        makeDraggable(camWidget, camHeader);
        camWidget.addEventListener('mousedown', () => bringToFront(camWidget));
    }

    // Gestion de la vidéo
    const videoElem = document.getElementById('webcamVideo');
    const toggleBtn = document.getElementById('camToggleBtn');
    const recIndicator = document.querySelector('.rec-indicator');
    const camCloseBtn = document.querySelector('.cam-close');
    let stream = null;

    async function startWebcam() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if(videoElem) {
                videoElem.srcObject = stream;
                if(recIndicator) recIndicator.classList.add('active'); 
                if(toggleBtn) toggleBtn.style.color = "#00ff00"; 
            }
        } catch (err) {
            console.error("Erreur webcam:", err);
            alert("Impossible d'accéder à la caméra (Permission refusée ?)");
        }
    }

    function stopWebcam() {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            if(videoElem) videoElem.srcObject = null;
            stream = null;
            if(recIndicator) recIndicator.classList.remove('active');
            if(toggleBtn) toggleBtn.style.color = "#ff0055"; 
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
            stopWebcam(); 
            camWidget.style.display = 'none';
        });
    }

}); // FIN DU DOMContentLoaded

// === 10. WIDGET PONG ===
    const pongWidget = document.querySelector('.pong-widget');
    const pongHeader = document.querySelector('.pong-widget__header');
    
    // 1. Rendre le widget déplaçable
    if (pongWidget && pongHeader) {
        makeDraggable(pongWidget, pongHeader);
        pongWidget.addEventListener('mousedown', () => bringToFront(pongWidget));
    }

    // 2. Logique du Jeu
    const cvs = document.getElementById("pongCanvas");
    if (cvs) {
        const ctx = cvs.getContext("2d");
        const scoreDiv = document.getElementById("pongScore");
        const startBtn = document.getElementById("pongStartBtn");
        const closeBtn = document.querySelector(".pong-close");

        // Objets du jeu
        const user = { x: 0, y: cvs.height/2 - 20, w: 10, h: 40, color: "#00f2ea", score: 0 };
        const com = { x: cvs.width - 10, y: cvs.height/2 - 20, w: 10, h: 40, color: "#ff0055", score: 0 };
        const ball = { x: cvs.width/2, y: cvs.height/2, r: 5, speed: 4, velocityX: 4, velocityY: 4, color: "#fff" };
        const net = { x: (cvs.width - 2)/2, y: 0, height: 10, width: 2, color: "#555" };

        let gameRunning = false;
        let animationId;

        // Dessiner le filet
        function drawNet() {
            for (let i = 0; i <= cvs.height; i += 15) {
                drawRect(net.x, net.y + i, net.width, net.height, net.color);
            }
        }

        // Dessiner un rectangle
        function drawRect(x, y, w, h, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        }

        // Dessiner un cercle (balle)
        function drawArc(x, y, r, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }

        // Réinitialiser la balle
        function resetBall() {
            ball.x = cvs.width / 2;
            ball.y = cvs.height / 2;
            ball.speed = 4;
            ball.velocityX = -ball.velocityX; // Change de direction
        }

        // Mettre à jour le jeu
        function update() {
            // Déplacement de la balle
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            // IA simple pour l'ordi (suit la balle avec un léger délai)
            let computerLevel = 0.1;
            com.y += (ball.y - (com.y + com.h/2)) * computerLevel;

            // Collisions haut et bas
            if (ball.y - ball.r < 0 || ball.y + ball.r > cvs.height) {
                ball.velocityY = -ball.velocityY;
            }

            // Détection du joueur (gauche ou droite ?)
            let player = (ball.x < cvs.width/2) ? user : com;

            // Collision raquette
            if (collision(ball, player)) {
                // Point d'impact normalisé (-1 à 1)
                let collidePoint = (ball.y - (player.y + player.h/2));
                collidePoint = collidePoint / (player.h/2);

                // Calcul angle de rebond (45 degrés max)
                let angleRad = (Math.PI/4) * collidePoint;

                // Direction
                let direction = (ball.x < cvs.width/2) ? 1 : -1;

                ball.velocityX = direction * ball.speed * Math.cos(angleRad);
                ball.velocityY = ball.speed * Math.sin(angleRad);

                // Accélération à chaque touche
                ball.speed += 0.2;
            }

            // Gestion du Score
            if (ball.x - ball.r < 0) {
                com.score++;
                scoreDiv.innerText = `${user.score} : ${com.score}`;
                resetBall();
            } else if (ball.x + ball.r > cvs.width) {
                user.score++;
                scoreDiv.innerText = `${user.score} : ${com.score}`;
                resetBall();
            }
        }

        // Détection collision simple
        function collision(b, p) {
            p.top = p.y;
            p.bottom = p.y + p.h;
            p.left = p.x;
            p.right = p.x + p.w;

            b.top = b.y - b.r;
            b.bottom = b.y + b.r;
            b.left = b.x - b.r;
            b.right = b.x + b.r;

            return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
        }

        // Boucle de rendu
        function render() {
            // Effacer le canvas (fond noir)
            drawRect(0, 0, cvs.width, cvs.height, "#000");
            drawNet();
            drawRect(user.x, user.y, user.w, user.h, user.color); // Joueur
            drawRect(com.x, com.y, com.w, com.h, com.color);     // Ordi
            drawArc(ball.x, ball.y, ball.r, ball.color);         // Balle
        }

        function gameLoop() {
            update();
            render();
            if(gameRunning) {
                animationId = requestAnimationFrame(gameLoop);
            }
        }

        // Contrôle Souris
        cvs.addEventListener("mousemove", (evt) => {
            if(gameRunning) {
                let rect = cvs.getBoundingClientRect();
                user.y = evt.clientY - rect.top - user.h/2;
            }
        });

        // Bouton Play/Pause
        startBtn.addEventListener("click", () => {
            if (!gameRunning) {
                gameRunning = true;
                gameLoop();
                startBtn.innerText = "⏸";
            } else {
                gameRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.innerText = "▶";
            }
        });

        // Bouton Fermer
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                gameRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.innerText = "▶";
                pongWidget.style.display = 'none';
            });
        }
        
        // Affichage initial
        render();
    }