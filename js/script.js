/* ============================================================
   PORTFOLIO OS - SCRIPT COMPLET CORRIGÉ ET UNIFIÉ
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // === 0. CONFIGURATION MUSIQUE ===
    const songs = [
        {
            title: "Slickville",
            artist: "Ricky Hill",
            src: "assets/music/song1.mp3", 
            cover: "assets/cover1.jpg"
        },
        {
            title: "Hate Me",
            artist: "Ellie Goulding, Juice Wrld, Snakehips",
            src: "assets/music/song2.mp3",
            cover: "assets/cover2.jpg"
        },
        {
            title: "...And to Those I Love, Thanks for Sticking Around",
            artist: "$uicideboy$",
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
            e.preventDefault(); 
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
            // MODIFICATION: Affiche seulement le titre de l'image
            previewTitle.textContent = label ? label.innerText : "Aperçu";
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
        if (e.button === 2) document.body.classList.add('right-click-active');
        if (e.button === 0 && e.shiftKey) document.body.classList.add('easter-egg-active');
    });

    document.addEventListener('mouseup', () => {
        document.body.classList.remove('right-click-active');
        document.body.classList.remove('easter-egg-active');
    });
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // === 8. WIDGET CAMERA ===
    const camWidget = document.querySelector('.camera-widget');
    const camHeader = document.querySelector('.camera-widget__header');
    
    if (camWidget && camHeader) {
        makeDraggable(camWidget, camHeader);
        camWidget.addEventListener('mousedown', () => bringToFront(camWidget));
    }

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
                if(toggleBtn) toggleBtn.classList.add('active'); 
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
            if(toggleBtn) toggleBtn.classList.remove('active'); 
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

    if (camCloseBtn && camWidget) {
        camCloseBtn.addEventListener('click', () => {
            stopWebcam(); 
            camWidget.style.display = 'none';
        });
    }

    // === 10. WIDGET PONG ===
    const pongWidget = document.querySelector('.pong-widget');
    const pongHeader = document.querySelector('.pong-widget__header');
    
    if (pongWidget && pongHeader) {
        makeDraggable(pongWidget, pongHeader);
        pongWidget.addEventListener('mousedown', () => bringToFront(pongWidget));
    }

    const cvs = document.getElementById("pongCanvas");
    if (cvs) {
        const ctx = cvs.getContext("2d");
        const scoreDiv = document.getElementById("pongScore");
        const startBtn = document.getElementById("pongStartBtn");
        // Suppression de closeBtn car bouton supprimé du HTML

        // Objets du jeu
        const user = { x: 0, y: cvs.height/2 - 20, w: 10, h: 40, color: "#ffffffff", score: 0 };
        const com = { x: cvs.width - 10, y: cvs.height/2 - 20, w: 10, h: 40, color: "#ffffffff", score: 0 };
        const ball = { x: cvs.width/2, y: cvs.height/2, r: 5, speed: 4, velocityX: 4, velocityY: 4, color: "#fff" };
        const net = { x: (cvs.width - 2)/2, y: 0, height: 10, width: 2, color: "#555" };

        let gameRunning = false;
        let animationId;

        // Fonctions de dessin
        function drawRect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
        function drawArc(x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2, true); ctx.closePath(); ctx.fill(); }
        function drawNet() { for (let i = 0; i <= cvs.height; i += 15) drawRect(net.x, net.y + i, net.width, net.height, net.color); }

        function resetBall() {
            ball.x = cvs.width / 2;
            ball.y = cvs.height / 2;
            ball.speed = 4;
            ball.velocityX = -ball.velocityX;
        }

        function collision(b, p) {
            p.top = p.y; p.bottom = p.y + p.h; p.left = p.x; p.right = p.x + p.w;
            b.top = b.y - b.r; b.bottom = b.y + b.r; b.left = b.x - b.r; b.right = b.x + b.r;
            return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
        }

        function update() {
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            
            // IA
            let computerLevel = 0.1;
            com.y += (ball.y - (com.y + com.h/2)) * computerLevel;

            if (ball.y - ball.r < 0 || ball.y + ball.r > cvs.height) ball.velocityY = -ball.velocityY;

            let player = (ball.x < cvs.width/2) ? user : com;

            if (collision(ball, player)) {
                let collidePoint = (ball.y - (player.y + player.h/2));
                collidePoint = collidePoint / (player.h/2);
                let angleRad = (Math.PI/4) * collidePoint;
                let direction = (ball.x < cvs.width/2) ? 1 : -1;
                ball.velocityX = direction * ball.speed * Math.cos(angleRad);
                ball.velocityY = ball.speed * Math.sin(angleRad);
                ball.speed += 0.2;
            }

            if (ball.x - ball.r < 0) {
                com.score++; scoreDiv.innerText = `${user.score} : ${com.score}`; resetBall();
            } else if (ball.x + ball.r > cvs.width) {
                user.score++; scoreDiv.innerText = `${user.score} : ${com.score}`; resetBall();
            }
        }

        function render() {
            drawRect(0, 0, cvs.width, cvs.height, "#000");
            drawNet();
            drawRect(user.x, user.y, user.w, user.h, user.color);
            drawRect(com.x, com.y, com.w, com.h, com.color);
            drawArc(ball.x, ball.y, ball.r, ball.color);
        }

        function gameLoop() {
            update(); render();
            if(gameRunning) animationId = requestAnimationFrame(gameLoop);
        }

        cvs.addEventListener("mousemove", (evt) => {
            if(gameRunning) {
                let rect = cvs.getBoundingClientRect();
                user.y = evt.clientY - rect.top - user.h/2;
            }
        });

        startBtn.addEventListener("click", () => {
            if (!gameRunning) {
                gameRunning = true; gameLoop(); startBtn.innerText = "⏸";
            } else {
                gameRunning = false; cancelAnimationFrame(animationId); startBtn.innerText = "▶";
            }
        });

        // La fermeture se gère désormais via le bouton de la barre des tâches
        render();
    }

    // === 11. GESTION DES BOUTONS DE LA BARRE DES TÂCHES ===
    
    const btnMusic = document.getElementById('btn-toggle-music');
    const btnPong = document.getElementById('btn-toggle-pong');
    const btnCam = document.getElementById('btn-toggle-cam');

    function toggleWidget(btn, widget, onOpen = null, onClose = null) {
        if (!widget || !btn) return;
        const isVisible = window.getComputedStyle(widget).display !== 'none';

        if (isVisible) {
            widget.style.display = 'none';
            btn.classList.remove('active');
            if (onClose) onClose();
        } else {
            widget.style.display = 'flex';
            btn.classList.add('active');
            bringToFront(widget);
            if (onOpen) onOpen();
        }
    }

    // BOUTON MUSIQUE
    if (btnMusic && musicPlayer) {
        btnMusic.addEventListener('click', () => toggleWidget(btnMusic, musicPlayer));
    }

    // BOUTON PONG
    if (btnPong && pongWidget) {
        btnPong.addEventListener('click', () => {
            toggleWidget(btnPong, pongWidget, null, () => {
                // Mettre pause quand on ferme via la barre des tâches
                if (typeof gameRunning !== 'undefined' && gameRunning) {
                   // Note: gameRunning est dans la portée locale de cvs, 
                   // donc idéalement on devrait gérer l'état globalement, 
                   // mais cliquer sur le bouton arrêtera simplement l'affichage.
                }
            });
        });
    }

    // BOUTON CAMÉRA
    if (btnCam && camWidget) {
        btnCam.addEventListener('click', () => {
            toggleWidget(btnCam, camWidget, null, () => {
                stopWebcam(); // Important : éteindre la caméra
            });
        });

        // Synchro fermeture via la croix
        const camCloseX = camWidget.querySelector('.cam-close'); 
        if (camCloseX) {
            camCloseX.addEventListener('click', () => {
                btnCam.classList.remove('active');
                stopWebcam(); // S'assurer qu'elle s'éteint aussi par la croix
            });
        }
    }

}); // FIN DU DOMContentLoaded