/* ==========================================================================
   LÓGICA PRINCIPAL - AMOR INFINITO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initCanvasParticles();
    initEnvelopeAndLetter();
    initLoveCounter();
    initLoveJar();
    initLoveMemories();
});

/* ==========================================================================
   HEADER & MOBILE MENU
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

function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-links-menu');
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

/* ==========================================================================
   CANVAS DE PARTÍCULAS (CORAZONES FLOTANTES Y DESTELLOS)
   ========================================================================== */
let triggerHeartBurst = null;

function initCanvasParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const maxParticles = 60;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class HeartParticle {
        constructor(isSpawned = false) {
            this.reset(isSpawned);
        }
        
        reset(isSpawned) {
            this.x = Math.random() * canvas.width;
            this.y = isSpawned ? Math.random() * canvas.height : canvas.height + 20;
            this.size = Math.random() * 10 + 5;
            this.speedY = -(Math.random() * 0.6 + 0.3);
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.4 + 0.15;
            this.color = Math.random() > 0.6 
                ? 'rgba(212, 175, 55, '     // Oro
                : (Math.random() > 0.5 
                    ? 'rgba(214, 112, 134, ' // Rosa pálido
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
    
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new HeartParticle(true));
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Función global de explosión de corazones al interactuar
    triggerHeartBurst = (x, y) => {
        for (let i = 0; i < 8; i++) {
            if (particles.length >= maxParticles + 25) {
                particles.shift();
            }
            const p = new HeartParticle(false);
            p.x = x;
            p.y = y;
            p.speedY = -(Math.random() * 1.6 + 0.8);
            p.speedX = Math.random() * 2.4 - 1.2;
            p.size = Math.random() * 14 + 6;
            particles.push(p);
        }
    };

    window.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        triggerHeartBurst(e.clientX, e.clientY);
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

    if (!letterModal) return;

    if (letterOutputText && modalLetterBody) {
        modalLetterBody.innerHTML = letterOutputText.innerHTML;
    }

    let modalTimer = null;

    if (envelope) {
        envelope.addEventListener('click', (e) => {
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
    }

    function openEnvelope() {
        if (envelope) envelope.classList.add('open');
        if (instructionText) {
            instructionText.textContent = 'Abriendo tu carta... ♥';
        }
        
        modalTimer = setTimeout(() => {
            openReadingModal();
        }, 700);
    }

    function closeEnvelope() {
        if (envelope) envelope.classList.remove('open');
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
        closeEnvelope();
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeReadingModal();
        });
    }

    const modalSongBtn = document.getElementById('modal-song-btn');
    if (modalSongBtn) {
        modalSongBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeReadingModal();
            
            setTimeout(() => {
                const songSection = document.getElementById('cancion');
                if (songSection) {
                    songSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 350);
        });
    }

    letterModal.addEventListener('click', (e) => {
        if (e.target === letterModal) {
            closeReadingModal();
        }
    });
}

/* ==========================================================================
   CONTADOR DE TIEMPO JUNTOS
   ========================================================================== */
function initLoveCounter() {
    const daysVal = document.getElementById('days-val');
    const hoursVal = document.getElementById('hours-val');
    const minutesVal = document.getElementById('minutes-val');
    const secondsVal = document.getElementById('seconds-val');
    const counterSinceText = document.getElementById('counter-since-text');

    if (!daysVal) return;

    // Fecha fija de inicio: 10 de julio de 2026
    const startDate = new Date('2026-07-10T00:00:00');

    function updateCounterDisplay() {
        const now = new Date();
        const diffMs = Math.max(0, now - startDate);

        const secondsTotal = Math.floor(diffMs / 1000);
        const days = Math.floor(secondsTotal / (3600 * 24));
        const hours = Math.floor((secondsTotal % (3600 * 24)) / 3600);
        const minutes = Math.floor((secondsTotal % 3600) / 60);
        const seconds = Math.floor(secondsTotal % 60);

        daysVal.textContent = days < 10 ? '0' + days : days;
        hoursVal.textContent = hours < 10 ? '0' + hours : hours;
        minutesVal.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsVal.textContent = seconds < 10 ? '0' + seconds : seconds;

        if (counterSinceText) {
            counterSinceText.textContent = `Calculado desde el 10 de julio de 2026 ✨`;
        }
    }

    updateCounterDisplay();
    setInterval(updateCounterDisplay, 1000);
}

/* ==========================================================================
   FRASCO DE RAZONES DE AMOR
   ========================================================================== */
function initLoveJar() {
    const jarElement = document.getElementById('jar-element');
    const loveNoteCard = document.getElementById('love-note-card');
    const noteNumber = document.getElementById('note-number');
    const noteText = document.getElementById('note-text');
    const btnDrawNote = document.getElementById('btn-draw-note');

    if (!btnDrawNote || !noteText) return;

    const reasonsList = [
        "Me encanta cómo tu sonrisa ilumina al instante hasta el día más complicado.",
        "Amo la paz y calma que siento cuando estoy a tu lado.",
        "Tu risa es mi sonido favorito en todo el universo.",
        "Me fascina tu forma única y hermosa de ver la vida.",
        "Amo cómo cinco minutos contigo se sienten tan valiosos como horas.",
        "Me encanta cómo te ves cuando te concentras o te ríes espontáneamente.",
        "Porque contigo no necesito fingir nada; puedo ser yo mismo sin miedo.",
        "Me fascinan tus ocurrencias y la forma tan bonita que tienes de contar tus historias.",
        "Porque siempre encuentras una forma especial de hacerme sonreír.",
        "Amo que te hayas convertido en mi lugar seguro y mi pensamiento favorito.",
        "Me encanta recordar la primera vez que te vi y darme cuenta de cuánto te amo hoy.",
        "Porque tu mirada transmite una dulzura que me derriete cada vez.",
        "Amo cómo me inspiras a ser una mejor persona cada día.",
        "Porque hasta en el día más gris, tu mensaje es suficiente para alegrarme.",
        "Me encanta descubrir un detalle nuevo de ti que me hace volver a enamorarme.",
        "Porque contigo todo se siente natural, bonito y lleno de magia.",
        "Amo cómo abrazas y cómo me haces sentir protegido y querido.",
        "Porque eres la persona con la que quiero compartir mis risas y mis mejores momentos."
    ];

    let currentIndex = 0;

    function drawNextNote() {
        // Animación suave de transición
        loveNoteCard.style.opacity = '0';
        loveNoteCard.style.transform = 'scale(0.9) translateY(10px)';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % reasonsList.length;
            noteNumber.textContent = currentIndex + 1;
            noteText.textContent = `"${reasonsList[currentIndex]}"`;

            loveNoteCard.style.opacity = '1';
            loveNoteCard.style.transform = 'scale(1) translateY(0)';
        }, 250);

        if (triggerHeartBurst) {
            const rect = btnDrawNote.getBoundingClientRect();
            triggerHeartBurst(rect.left + rect.width / 2, rect.top);
        }
    }

    btnDrawNote.addEventListener('click', drawNextNote);

    if (jarElement) {
        jarElement.addEventListener('click', drawNextNote);
    }
}

/* ==========================================================================
   GALERÍA DE RECUERDOS (ALMACENAMIENTO PERSISTENTE INDEXEDDB)
   ========================================================================== */
let dbPromise = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open('AmorInfinitoDB', 1);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('memories')) {
                    db.createObjectStore('memories', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }
    return dbPromise;
}

async function getAllMemoriesFromDB() {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('memories', 'readonly');
            const store = tx.objectStore('memories');
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    } catch (err) {
        console.error('Error al leer recuerdos de IndexedDB:', err);
        return [];
    }
}

async function saveMemoryToDB(memoryObj) {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('memories', 'readwrite');
            const store = tx.objectStore('memories');
            const req = store.add(memoryObj);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    } catch (err) {
        console.error('Error al guardar recuerdo en IndexedDB:', err);
    }
}

async function deleteMemoryFromDB(id) {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('memories', 'readwrite');
            const store = tx.objectStore('memories');
            const req = store.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (err) {
        console.error('Error al eliminar recuerdo de IndexedDB:', err);
    }
}

async function initLoveMemories() {
    const polaroidGrid = document.getElementById('polaroid-grid');
    const btnAddMemory = document.getElementById('btn-add-memory');
    const memoryModal = document.getElementById('memory-modal');
    const closeMemoryModalBtn = document.getElementById('close-memory-modal-btn');
    const btnSaveMemory = document.getElementById('btn-save-memory');
    const titleInput = document.getElementById('memory-title-input');
    const dateInput = document.getElementById('memory-date-input');
    const fileInput = document.getElementById('memory-file-input');
    const previewContainer = document.getElementById('memory-preview-container');
    const previewImg = document.getElementById('memory-preview-img');

    if (!polaroidGrid) return;

    let selectedBase64Image = '';

    // Cargar y mostrar recuerdos guardados
    async function renderMemories() {
        polaroidGrid.innerHTML = '';
        const savedMemories = await getAllMemoriesFromDB();

        // Filtrar y limpiar recuerdos de ejemplo previos si existían
        const userMemories = savedMemories.filter(mem => !mem.imageData.includes('unsplash.com'));
        
        // Si había ejemplos en la base de datos, limpiarlos para dejar solo las fotos reales del usuario
        if (savedMemories.length !== userMemories.length) {
            for (const mem of savedMemories) {
                if (mem.imageData.includes('unsplash.com')) {
                    await deleteMemoryFromDB(mem.id);
                }
            }
            return renderMemories();
        }

        // Si no hay fotos guardadas, mostrar tarjeta de estado vacío
        if (userMemories.length === 0) {
            polaroidGrid.innerHTML = `
                <div class="empty-gallery-card glass-card">
                    <span class="empty-icon">📷</span>
                    <h3>Tu Galería de Recuerdos está Lista</h3>
                    <p>Aquí podrás poner las fotos que te gusten, puedes escribir algún mensajito, quedarán guardados de forma local por el momento ♥</p>
                </div>
            `;
            return;
        }

        userMemories.forEach(mem => {
            const card = document.createElement('div');
            card.className = 'polaroid-card';
            card.innerHTML = `
                <div class="polaroid-pin">📌</div>
                <button class="polaroid-delete-btn" title="Eliminar este recuerdo">✕</button>
                <div class="polaroid-img-wrapper">
                    <img src="${mem.imageData}" alt="${mem.title}" class="polaroid-img">
                </div>
                <div class="polaroid-caption">
                    <h4 class="polaroid-title">${mem.title || 'Recuerdo Especial'}</h4>
                    <span class="polaroid-date">${mem.date || 'Momento Inolvidable'}</span>
                </div>
            `;

            // Handler para eliminar recuerdo
            const deleteBtn = card.querySelector('.polaroid-delete-btn');
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm('¿Deseas eliminar este recuerdo de tu galería?')) {
                    await deleteMemoryFromDB(mem.id);
                    renderMemories();
                }
            });

            polaroidGrid.appendChild(card);
        });
    }

    renderMemories();

    // Eventos del modal para subir imágenes
    if (btnAddMemory && memoryModal) {
        btnAddMemory.addEventListener('click', () => {
            titleInput.value = '';
            dateInput.value = '';
            fileInput.value = '';
            selectedBase64Image = '';
            previewContainer.classList.add('hidden');
            memoryModal.classList.add('visible');
        });
    }

    if (closeMemoryModalBtn && memoryModal) {
        closeMemoryModalBtn.addEventListener('click', () => {
            memoryModal.classList.remove('visible');
        });
    }

    // Previsualización de la imagen al seleccionarla
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    selectedBase64Image = event.target.result;
                    previewImg.src = selectedBase64Image;
                    previewContainer.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Guardar nuevo recuerdo en IndexedDB
    if (btnSaveMemory) {
        btnSaveMemory.addEventListener('click', async () => {
            const title = titleInput.value.trim() || 'Momento Inolvidable ♥';
            let dateStr = dateInput.value;
            
            if (dateStr) {
                const [year, month, day] = dateStr.split('-');
                const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                dateStr = `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
            } else {
                dateStr = 'Momento Especial';
            }

            if (!selectedBase64Image) {
                alert('Por favor selecciona una foto para tu recuerdo.');
                return;
            }

            await saveMemoryToDB({
                title: title,
                date: dateStr,
                imageData: selectedBase64Image
            });

            if (triggerHeartBurst) {
                const rect = btnSaveMemory.getBoundingClientRect();
                triggerHeartBurst(rect.left + rect.width / 2, rect.top);
            }

            memoryModal.classList.remove('visible');
            renderMemories();
        });
    }
}


