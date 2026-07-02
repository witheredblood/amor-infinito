/* ==========================================================================
   LÓGICA PRINCIPAL - AMOR INFINITO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initCanvasParticles();
    initEnvelopeAndLetter();
});

/* ==========================================================================
   HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   CANVAS DE PARTÍCULAS (CORAZONES FLOTANTES - SCHEME: VINO & ORO)
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const maxParticles = 50;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Clase Partícula
    class HeartParticle {
        constructor(isSpawned = false) {
            this.reset(isSpawned);
        }
        
        reset(isSpawned) {
            this.x = Math.random() * canvas.width;
            this.y = isSpawned ? Math.random() * canvas.height : canvas.height + 20;
            this.size = Math.random() * 10 + 5; // Tamaño del corazón
            this.speedY = -(Math.random() * 0.6 + 0.3);
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.4 + 0.15;
            this.color = Math.random() > 0.6 
                ? 'rgba(212, 175, 55, '     // Oro
                : (Math.random() > 0.5 
                    ? 'rgba(214, 112, 134, ' // Oro rosa / rosa pálido
                    : 'rgba(124, 25, 45, ');  // Vino tinto
            this.angle = Math.random() * 360;
            this.oscillationSpeed = Math.random() * 0.02 + 0.01;
        }
        
        update() {
            this.y += this.speedY;
            this.angle += this.oscillationSpeed;
            this.x += Math.sin(this.angle) * 0.25 + this.speedX;
            
            if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset(false);
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            
            const d = this.size;
            ctx.moveTo(0, -d / 4);
            ctx.bezierCurveTo(-d / 2, -d * 0.7, -d, -d / 3, -d, d / 4);
            ctx.bezierCurveTo(-d, d * 0.7, -d / 3, d * 1.1, 0, d * 1.4);
            ctx.bezierCurveTo(d / 3, d * 1.1, d, d * 0.7, d, d / 4);
            ctx.bezierCurveTo(d, -d / 3, d / 2, -d * 0.7, 0, -d / 4);
            
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Inicializar partículas
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new HeartParticle(true));
    }
    
    // Animación
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Añadir corazón al hacer click en pantalla
    window.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        for (let i = 0; i < 5; i++) {
            if (particles.length >= maxParticles + 15) {
                particles.shift();
            }
            const p = new HeartParticle(false);
            p.x = e.clientX;
            p.y = e.clientY;
            p.speedY = -(Math.random() * 1.2 + 0.6);
            p.speedX = Math.random() * 1.6 - 0.8;
            p.size = Math.random() * 12 + 6;
            particles.push(p);
        }
    });
}

/* ==========================================================================
   CARTA DE AMOR Y SOBRE 3D
   ========================================================================== */
function initEnvelopeAndLetter() {
    const envelope = document.getElementById('envelope-element');
    const instructionText = document.getElementById('envelope-instruction-text');
    const letterOutputText = document.getElementById('letter-output-text');
    const letterModal = document.getElementById('letter-modal');
    const modalLetterBody = document.getElementById('modal-letter-body');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (!envelope || !letterModal) return;

    // Sincronizar contenido
    if (letterOutputText && modalLetterBody) {
        modalLetterBody.innerHTML = letterOutputText.innerHTML;
    }

    let modalTimer = null;

    // Toggle sobre abierto/cerrado al hacer click en el sobre
    envelope.addEventListener('click', (e) => {
        // Si hicieron clic en el papel de la carta que sobresale, abrir modal de inmediato
        if (e.target.closest('.letter-sheet')) {
            openReadingModal();
            return;
        }
        
        if (envelope.classList.contains('open')) {
            closeEnvelope();
        } else {
            openEnvelope();
        }
    });

    function openEnvelope() {
        envelope.classList.add('open');
        if (instructionText) {
            instructionText.textContent = 'Abriendo tu carta... ♥';
        }
        
        // Espera 700ms para que termine la animación de apertura del sobre y muestra la carta completa
        modalTimer = setTimeout(() => {
            openReadingModal();
        }, 700);
    }

    function closeEnvelope() {
        envelope.classList.remove('open');
        if (instructionText) {
            instructionText.textContent = '¡Haz clic sobre el sobre para abrir tu carta de amor!';
        }
        clearTimeout(modalTimer);
    }

    function openReadingModal() {
        letterModal.classList.add('visible');
    }

    function closeReadingModal() {
        letterModal.classList.remove('visible');
        // También cerramos el sobre cuando se cierra el modal
        closeEnvelope();
    }

    // Botón para cerrar el modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeReadingModal();
        });
    }

    // Botón dentro del modal para ir a la canción
    const modalSongBtn = document.getElementById('modal-song-btn');
    if (modalSongBtn) {
        modalSongBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeReadingModal();
            
            // Esperamos un momento a que se oculte el modal y luego nos desplazamos suavemente
            setTimeout(() => {
                const songSection = document.getElementById('cancion');
                if (songSection) {
                    songSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 350);
        });
    }

    // Cerrar el modal al hacer clic en el fondo difuminado
    letterModal.addEventListener('click', (e) => {
        if (e.target === letterModal) {
            closeReadingModal();
        }
    });
}
