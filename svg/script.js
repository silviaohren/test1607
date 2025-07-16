// ============================================
//   CONFIGURAZIONE
// ============================================
const CONFIG = {
    // Password per l'area riservata (in produzione, usare un sistema più sicuro)
    UPLOAD_PASSWORD: '2021'
};

// ============================================
//   LANGUAGE SWITCHING
// ============================================
function switchLanguage(lang) {
    // Update button states
    const langEnBtn = document.getElementById('lang-en');
    const langItBtn = document.getElementById('lang-it');
    
    if (langEnBtn && langItBtn) {
        langEnBtn.classList.remove('active');
        langItBtn.classList.remove('active');
        
        if (lang === 'en') {
            langEnBtn.classList.add('active');
        } else if (lang === 'it') {
            langItBtn.classList.add('active');
        }
    }
    
    // Show/hide content based on language
    const bioContentEn = document.getElementById('bio-content-en');
    const bioContentIt = document.getElementById('bio-content-it');
    
    if (bioContentEn && bioContentIt) {
        if (lang === 'en') {
            bioContentEn.style.display = 'block';
            bioContentIt.style.display = 'none';
        } else if (lang === 'it') {
            bioContentEn.style.display = 'none';
            bioContentIt.style.display = 'block';
        }
    }
    
    // Save language preference
    localStorage.setItem('preferred-language', lang);
}

function initLanguageSwitcher() {
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    switchLanguage(savedLang);
}

// ============================================
//   GESTIONE NAVIGAZIONE
// ============================================
function showPage(pageId, clickedLink) {
    console.log('showPage called with pageId:', pageId);
    
    // Nascondi tutte le pagine
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Mostra la pagina selezionata
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        console.log('Found target page:', pageId);
        targetPage.classList.add('active');
        if (pageId === 'wavetable-page') {
            console.log('Initializing wavetable...');
            initWavetable();
        }
    } else {
        console.error('Target page not found:', pageId);
    }
    
    // Show/hide language switcher based on page
    const languageSwitcher = document.getElementById('bio-language-switcher');
    if (languageSwitcher) {
        if (pageId === 'bio-page') {
            languageSwitcher.style.display = 'flex';
            // Initialize language switcher when BIO page is shown
            initLanguageSwitcher();
        } else {
            languageSwitcher.style.display = 'none';
        }
    }
    
    // Se è stato passato un link (non per il bottone alieno)
    if (clickedLink) {
        updateNavigation(clickedLink);
        updateURL(clickedLink.getAttribute('href'));
    }
    
    // Render dynamic grids if needed
    if (pageId === 'film-page') renderFilm();
    if (pageId === 'documentary-page') renderDocumentary();
    if (pageId === 'commercial-page') renderCommercial();
    if (pageId === 'libraries-page') renderLibraries();
    
    return false; // Previene l'azione predefinita del link
}

function updateNavigation(activeLink) {
    // Rimuovi classe active da tutti i link ma preserva menu-green
    const links = document.querySelectorAll('.nav-menu a');
    links.forEach(link => {
        const isGreen = link.classList.contains('menu-green');
        link.classList.remove('active');
        // Ripristina la classe menu-green se necessario
        if (isGreen && !link.classList.contains('menu-green')) {
            link.classList.add('menu-green');
        }
    });
    
    // Aggiungi classe active al link cliccato
    activeLink.classList.add('active');
}

function updateURL(hash) {
    // Aggiorna URL senza causare refresh della pagina
    if (history.pushState) {
        history.pushState(null, null, hash);
    } else {
        location.hash = hash;
    }
}

// ============================================
//   GESTIONE POSTER STRAPPATI
// ============================================
function initTornPosters() {
    // Aggiungi interazione di click per ogni poster strappato
    const tornPosters = document.querySelectorAll('.torn-poster');
    tornPosters.forEach(poster => {
        poster.addEventListener('click', function(e) {
            // Close all other posters
            tornPosters.forEach(p => {
                if (p !== this) p.classList.remove('active');
            });
            // Toggle this one
            this.classList.toggle('active');
        });
    });
}

// ============================================
//   GESTIONE AREA RISERVATA
// ============================================
function checkPassword() {
    const passwordInput = document.getElementById('access-password');
    const password = passwordInput.value;
    
    if (password === CONFIG.UPLOAD_PASSWORD) {
        showUploadContent();
        saveAuthentication();
    } else {
        showPasswordError();
    }
}

function showUploadContent() {
    // Nascondi il form di accesso
    const passwordForm = document.getElementById('password-form-container');
    if (passwordForm) {
        passwordForm.style.display = 'none';
    }
    
    // Mostra il contenuto protetto
    const uploadContent = document.getElementById('upload-content');
    if (uploadContent) {
        uploadContent.style.display = 'block';
    }
}

function showPasswordError() {
    alert('Password non corretta. Riprova.');
    // Pulisci il campo password
    const passwordInput = document.getElementById('access-password');
    if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function saveAuthentication() {
    // Salva un flag in sessionStorage
    sessionStorage.setItem('authenticated', 'true');
}

function checkAuthentication() {
    if (sessionStorage.getItem('authenticated') === 'true') {
        const passwordForm = document.getElementById('password-form-container');
        const uploadContent = document.getElementById('upload-content');
        
        if (passwordForm && uploadContent) {
            passwordForm.style.display = 'none';
            uploadContent.style.display = 'block';
        }
    }
}

// ============================================
//   LOGOUT FUNCTIONALITY
// ============================================
function logout() {
    // Rimuovi l'autenticazione
    sessionStorage.removeItem('authenticated');
    
    // Nascondi il contenuto protetto
    const uploadContent = document.getElementById('upload-content');
    if (uploadContent) {
        uploadContent.style.display = 'none';
    }
    
    // Mostra di nuovo il form di accesso
    const passwordForm = document.getElementById('password-form-container');
    if (passwordForm) {
        passwordForm.style.display = 'block';
    }
    
    // Pulisci il campo password
    const passwordInput = document.getElementById('access-password');
    if (passwordInput) {
        passwordInput.value = '';
    }
    
    // Torna alla pagina principale
    showPage('film-page', document.querySelector('.nav-menu a[href="#film"]'));
}

// ============================================
//   FILE UPLOAD FUNCTIONALITY
// ============================================
function initFileUpload() {
    const fileUpload = document.getElementById('file-upload');
    const fileUploadContainer = document.querySelector('.file-upload-container');
    
    if (fileUpload && fileUploadContainer) {
        // Drag and drop functionality
        fileUploadContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--accent-color)';
            this.style.backgroundColor = 'rgba(255, 77, 109, 0.1)';
        });
        
        fileUploadContainer.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255, 77, 109, 0.3)';
            this.style.backgroundColor = 'transparent';
        });
        
        fileUploadContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255, 77, 109, 0.3)';
            this.style.backgroundColor = 'transparent';
            
            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });
        
        // Click to upload
        fileUpload.addEventListener('change', function(e) {
            const files = e.target.files;
            handleFileUpload(files);
        });
    }
}

function handleFileUpload(files) {
    if (files.length === 0) return;
    
    // Simulate file upload (in a real app, you'd upload to a server)
    console.log('Files to upload:', files);
    
    // Show upload progress
    showUploadProgress(files);
    
    // In a real application, you would:
    // 1. Create FormData
    // 2. Send to server via fetch/XMLHttpRequest
    // 3. Show real progress
    // 4. Handle success/error responses
}

function showUploadProgress(files) {
    // Create a simple progress notification
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'upload-progress';
        progressDiv.innerHTML = `
            <div style="background: rgba(255, 77, 109, 0.1); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <p style="margin: 0; color: var(--accent-color);">📤 Caricamento ${files.length} file...</p>
                <div style="background: rgba(255, 255, 255, 0.1); height: 4px; border-radius: 2px; margin-top: 0.5rem;">
                    <div style="background: var(--accent-color); height: 100%; width: 0%; border-radius: 2px; transition: width 0.3s ease;" id="progress-bar"></div>
                </div>
            </div>
        `;
        
        uploadArea.appendChild(progressDiv);
        
        // Simulate progress
        let progress = 0;
        const progressBar = progressDiv.querySelector('#progress-bar');
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressDiv.innerHTML = `
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                            <p style="margin: 0; color: #10b981;">✅ File caricati con successo!</p>
                        </div>
                    `;
                    setTimeout(() => progressDiv.remove(), 3000);
                }, 500);
            }
        }, 200);
    }
}

// ============================================
//   GESTIONE FORM CONTATTO
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(event) {
    // Qui puoi aggiungere validazione aggiuntiva se necessario
    // Il form viene inviato automaticamente a Web3Forms
    console.log('Form di contatto inviato');
}

// ============================================
//   UTILITY FUNCTIONS
// ============================================
function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
        const targetLink = document.querySelector(`.nav-menu a[href="${hash}"]`);
        if (targetLink) {
            const pageId = targetLink.getAttribute('href').replace('#', '') + '-page';
            showPage(pageId, targetLink);
        }
    } else {
        // Default to film page if no hash
        const filmLink = document.querySelector('.nav-menu a[href="#film"]');
        showPage('film-page', filmLink);
    }
}

// ============================================
//   INIZIALIZZAZIONE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Inizializza la navigazione basata sull'URL
    handleHashNavigation();
    
    // Hide language switcher by default (only shows on BIO page)
    const languageSwitcher = document.getElementById('bio-language-switcher');
    if (languageSwitcher) {
        languageSwitcher.style.display = 'none';
    }
    
    // Inizializza i poster strappati
    initTornPosters();
    
    // Controlla se l'utente è già autenticato
    checkAuthentication();
    
    // Inizializza il form di contatto
    initContactForm();
    
    // Inizializza i form di upload
    initUploadForms();
    
    // Aggiungi event listener per il tasto Enter nel form password
    const passwordInput = document.getElementById('access-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }
    
    // Nuova inizializzazione per i player circolari
    initializeCircularPlayers();
    
    // Re-inizializza i player quando si cambia pagina
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(() => {
                initializeCircularPlayers();
            }, 100);
        });
    });

    // COMMERCIAL POSTER COLOR LOGIC
    const commercialCards = document.querySelectorAll('.commercial-card');
    commercialCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Remove .active from all
            commercialCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
        card.addEventListener('mouseleave', function(e) {
            // Only remove .active if not clicked (optional: keep active until another is clicked)
            // this.classList.remove('active');
        });
    });

    // Hide CAMBIA INFO SITO when a category is selected
    const categorySelect = document.getElementById('project-category');
    const cambiaInfoSitoSection = Array.from(document.querySelectorAll('.upload-section')).find(section => section.querySelector('h4') && section.querySelector('h4').textContent.includes('CAMBIA INFO SITO'));
    if (categorySelect && cambiaInfoSitoSection) {
        categorySelect.addEventListener('change', function() {
            if (categorySelect.value) {
                cambiaInfoSitoSection.style.display = 'none';
            } else {
                cambiaInfoSitoSection.style.display = '';
            }
        });
    }

    // AJAX upload feedback for CAMBIA INFO SITO mini-forms
    document.querySelectorAll('.upload-section .project-form').forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const messageDiv = form.querySelector('.upload-message');
        messageDiv.textContent = 'Caricamento in corso...';
        messageDiv.style.color = '#3284c9';

        const formData = new FormData(form);
        fetch(form.action, {
          method: 'POST',
          body: formData
        })
        .then(response => {
          if (response.ok) {
            messageDiv.textContent = 'Caricamento completato!';
            messageDiv.style.color = '#10b981';
            form.reset();
          } else {
            throw new Error('Errore server');
          }
        })
        .catch(() => {
          messageDiv.textContent = 'Errore durante il caricamento. Riprova.';
          messageDiv.style.color = '#ff4d6d';
        });
      });
    });
});

// ============================================
//   GESTIONE BROWSER BACK/FORWARD
// ============================================
window.addEventListener('popstate', function() {
    handleHashNavigation();
});

// ============================================
//   GESTIONE FORM UPLOAD
// ============================================
function showCategoryForm() {
    const categorySelect = document.getElementById('project-category');
    const selectedCategory = categorySelect.value;
    
    // Nascondi tutti i form
    const allForms = document.querySelectorAll('.upload-form');
    allForms.forEach(form => {
        form.style.display = 'none';
    });
    
    // Mostra il form selezionato
    if (selectedCategory) {
        const targetForm = document.getElementById(selectedCategory + '-form');
        if (targetForm) {
            targetForm.style.display = 'block';
            
            // Scroll smooth al form
            targetForm.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        // Reset del form
        form.querySelector('form').reset();
        
        // Reset del dropdown principale
        const categorySelect = document.getElementById('project-category');
        if (categorySelect) {
            categorySelect.value = '';
        }
        
        // Nascondi il form
        form.style.display = 'none';
        
        // Scroll in cima alla pagina
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    }
}

// ============================================
//   GESTIONE SUBMIT FORM
// ============================================
function initUploadForms() {
    const forms = document.querySelectorAll('.project-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    });
}

function handleFormSubmit(form) {
    // Raccogli i dati del form
    const formData = new FormData(form);
    const projectData = {};
    
    // Converti FormData in oggetto
    for (let [key, value] of formData.entries()) {
        projectData[key] = value;
    }
    
    // Determina la categoria dal form
    const formId = form.closest('.upload-form').id;
    const category = formId.replace('-form', '');
    projectData.category = category;
    
    // Simula l'upload (in una vera app, invieresti al server)
    console.log('Dati progetto da caricare:', projectData);
    
    // Mostra messaggio di successo
    showUploadSuccess(category);
    
    // Reset del form
    form.reset();
    
    // Reset del dropdown principale
    const categorySelect = document.getElementById('project-category');
    if (categorySelect) {
        categorySelect.value = '';
    }
    
    // Nascondi il form
    const formContainer = form.closest('.upload-form');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
}

function showUploadSuccess(category) {
    // Crea un messaggio di successo
    const successDiv = document.createElement('div');
    successDiv.className = 'upload-success';
    successDiv.innerHTML = `
        <div style="
            background: rgba(16, 185, 129, 0.1); 
            border: 1px solid #10b981; 
            border-radius: 8px; 
            padding: 1.5rem; 
            margin: 2rem 0;
            text-align: center;
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <h4 style="color: #10b981; margin-bottom: 0.5rem;">Progetto ${category.toUpperCase()} caricato con successo!</h4>
            <p style="color: rgba(255, 255, 255, 0.8); margin: 0;">Il progetto è stato aggiunto al tuo portfolio.</p>
        </div>
    `;
    
    // Inserisci il messaggio dopo il dropdown
    const categorySection = document.querySelector('.category-selector');
    if (categorySection) {
        categorySection.parentNode.insertBefore(successDiv, categorySection.nextSibling);
    }
    
    // Rimuovi il messaggio dopo 5 secondi
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

// ============================================
// PLAYER AUDIO CIRCOLARE PER LIBRARIES
// ============================================
function initializeCircularPlayers() {
    const players = document.querySelectorAll('.player-circle');
    
    players.forEach(player => {
        player.addEventListener('click', function(e) {
            e.stopPropagation(); // Previene l'apertura della scheda
            
            const isPlaying = this.classList.contains('playing');
            
            if (isPlaying) {
                // Pausa
                this.classList.remove('playing');
                this.querySelector('.play-icon').textContent = '▶';
            } else {
                // Play
                // Ferma tutti gli altri player
                players.forEach(p => {
                    p.classList.remove('playing');
                    p.querySelector('.play-icon').textContent = '▶';
                });
                
                // Avvia questo player
                this.classList.add('playing');
                this.querySelector('.play-icon').textContent = '⏸';
                
                // Simula la riproduzione audio (qui potresti integrare un vero player audio)
                console.log('Playing audio for:', this.closest('.library-card').querySelector('.scheda-titolo').textContent);
            }
        });
    });
}

// ============================================
//   INIZIALIZZAZIONE WAVETABLE PAGE
// ============================================
function initWavetable() {
    console.log('initWavetable called');
    const waveContainer = document.getElementById('waveContainer');
    const mouseCursor = document.getElementById('mouseCursor');
    console.log('waveContainer found:', !!waveContainer);
    console.log('mouseCursor found:', !!mouseCursor);
    if (!waveContainer || !mouseCursor) {
        console.error('Required elements not found for wavetable');
        return;
    }

    // Rimuovi eventuali nodi precedenti
    const nodesToRemove = waveContainer.querySelectorAll('.wave-node');
    nodesToRemove.forEach(node => node.remove());

    // Rimuovi vecchi event listener (clona il nodo per rimuovere tutti i listener)
    const newWaveContainer = waveContainer.cloneNode(true);
    waveContainer.parentNode.replaceChild(newWaveContainer, waveContainer);

    // Aggiorna i riferimenti
    const waveContainerRef = document.getElementById('waveContainer');
    const mouseCursorRef = document.getElementById('mouseCursor');

    const nodeSpacing = 20;
    const waveSpeed = 80;
    const maxWaveRadius = 200;
    const waveIntensity = 2;
    const wavePause = 150;
    const asciiChars = [
        '·', ':', '·', ':', '·', ':', '·', ':', '·', ':',
        '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', '▂', '▁',
        '░', '▒', '▓', '█', '▓', '▒', '░',
        '⠁', '⠉', '⠋', '⠛', '⠟', '⠿', '⠟', '⠛', '⠋', '⠉', '⠁',
        '○', '◎', '●', '◎', '○'
    ];
    let nodes = [];
    let gridWidth, gridHeight;
    let lastWaveTime = 0;
    let isMouseOver = false;
    let mouseX = 0, mouseY = 0;
    let waveInterval = null;

    function createGrid() {
        const nodesToRemove = waveContainerRef.querySelectorAll('.wave-node');
        nodesToRemove.forEach(node => node.remove());
        nodes = [];
        gridWidth = waveContainerRef.clientWidth;
        gridHeight = waveContainerRef.clientHeight;
        const numCols = Math.floor(gridWidth / nodeSpacing);
        const numRows = Math.floor(gridHeight / nodeSpacing);
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                const x = j * nodeSpacing + nodeSpacing / 2;
                const y = i * nodeSpacing + nodeSpacing / 2;
                const node = document.createElement('div');
                node.className = 'wave-node';
                node.style.left = `${x}px`;
                node.style.top = `${y}px`;
                const charIndex = Math.floor(Math.random() * asciiChars.length);
                node.textContent = asciiChars[charIndex];
                waveContainerRef.appendChild(node);
                nodes.push({
                    element: node,
                    x: x,
                    y: y,
                    originalChar: node.textContent,
                    charIndex: charIndex
                });
            }
        }
    }
    function createWave(centerX, centerY) {
        const now = Date.now();
        if (now - lastWaveTime < wavePause) return;
        lastWaveTime = now;
        nodes.forEach(node => {
            const dx = node.x - centerX;
            const dy = node.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= maxWaveRadius) {
                const delay = distance * waveSpeed / 100;
                setTimeout(() => {
                    const wavePhase = (distance / 30) * Math.PI * waveIntensity;
                    const amplitude = Math.cos(wavePhase) * Math.max(0, 1 - distance / maxWaveRadius);
                    if (Math.abs(amplitude) > 0.7) {
                        node.element.className = 'wave-node active-1';
                        node.element.textContent = asciiChars[(node.charIndex + 15) % asciiChars.length];
                    } else if (Math.abs(amplitude) > 0.4) {
                        node.element.className = 'wave-node active-2';
                        node.element.textContent = asciiChars[(node.charIndex + 10) % asciiChars.length];
                    } else if (Math.abs(amplitude) > 0.1) {
                        node.element.className = 'wave-node active-3';
                        node.element.textContent = asciiChars[(node.charIndex + 5) % asciiChars.length];
                    }
                    setTimeout(() => {
                        node.element.className = 'wave-node';
                        node.element.textContent = node.originalChar;
                    }, 300);
                }, delay);
            }
        });
    }
    function handleMouseMove(e) {
        const rect = waveContainerRef.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        mouseCursorRef.style.left = `${mouseX}px`;
        mouseCursorRef.style.top = `${mouseY}px`;
    }
    function handleMouseEnter() {
        isMouseOver = true;
        if (!waveInterval) {
            waveInterval = setInterval(() => {
                if (isMouseOver) {
                    createWave(mouseX, mouseY);
                }
            }, wavePause);
        }
        mouseCursorRef.style.display = 'block';
    }
    function handleMouseLeave() {
        isMouseOver = false;
        mouseCursorRef.style.display = 'none';
        if (waveInterval) {
            clearInterval(waveInterval);
            waveInterval = null;
        }
    }
    createGrid();
    window.addEventListener('resize', createGrid);
    waveContainerRef.addEventListener('mousemove', handleMouseMove);
    waveContainerRef.addEventListener('mouseenter', handleMouseEnter);
    waveContainerRef.addEventListener('mouseleave', handleMouseLeave);
    waveContainerRef.style.cursor = 'none';
    mouseCursorRef.style.display = 'none';
} 

// ============================================
//   LIBRARIES UPLOAD CROPPING TOOL LOGIC (UPDATED FOR TWO FILES, BOTH CROPPABLE)
// ============================================
let libCropper = null;
let libCroppedDataUrl = null;
let libCropped16x9DataUrl = null;

function initLibrariesCropper() {
  const poster16x9Input = document.getElementById('lib-poster-16x9');
  const poster1x1Input = document.getElementById('lib-poster-1x1');
  const cropperModal = document.getElementById('lib-cropper-modal');
  const cropperImage = document.getElementById('lib-cropper-image');
  const cropBtn = document.getElementById('lib-cropper-crop-btn');
  const cancelBtn = document.getElementById('lib-cropper-cancel-btn');
  const closeBtn = document.getElementById('lib-cropper-close-btn');
  const poster16x9Preview = document.getElementById('lib-poster-16x9-preview');
  const poster1x1Preview = document.getElementById('lib-poster-1x1-preview');
  const cropPreview = document.getElementById('lib-crop-preview');

  let cropMode = null; // '16x9' or '1x1'

  if (poster16x9Input) {
    poster16x9Input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      cropMode = '16x9';
      const reader = new FileReader();
      reader.onload = function(evt) {
        cropperImage.src = evt.target.result;
        cropperImage.style.display = 'block';
        cropperImage.onload = function() {
          cropperModal.style.display = 'flex';
          if (libCropper) {
            libCropper.destroy();
            libCropper = null;
          }
          libCropper = new Cropper(cropperImage, {
            aspectRatio: 16/9,
            viewMode: 1,
            autoCropArea: 1,
            movable: true,
            zoomable: true,
            rotatable: false,
            scalable: false,
            responsive: true,
            background: false,
          });
          // Add keyboard shortcuts
          document.addEventListener('keydown', libCropperKeyHandler);
        };
      };
      reader.readAsDataURL(file);
    });
  }

  if (poster1x1Input) {
    poster1x1Input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      cropMode = '1x1';
      const reader = new FileReader();
      reader.onload = function(evt) {
        cropperImage.src = evt.target.result;
        cropperImage.style.display = 'block';
        cropperImage.onload = function() {
          cropperModal.style.display = 'flex';
          if (libCropper) {
            libCropper.destroy();
            libCropper = null;
          }
          libCropper = new Cropper(cropperImage, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 1,
            movable: true,
            zoomable: true,
            rotatable: false,
            scalable: false,
            responsive: true,
            background: false,
          });
          // Add keyboard shortcuts
          document.addEventListener('keydown', libCropperKeyHandler);
        };
      };
      reader.readAsDataURL(file);
    });
  }

  function libCropperKeyHandler(e) {
    if (cropperModal.style.display === 'flex') {
      if (e.key === 'Enter') {
        cropBtn.click();
      } else if (e.key === 'Escape') {
        closeBtn.click();
      }
    }
  }

  cropBtn.addEventListener('click', function() {
    if (libCropper) {
      if (cropMode === '16x9') {
        const canvas = libCropper.getCroppedCanvas({ width: 800, height: 450 });
        libCropped16x9DataUrl = canvas.toDataURL('image/png');
        poster16x9Preview.innerHTML = `<div style='text-align:center;'><strong>Immagine 16:9:</strong><br><img src='${libCropped16x9DataUrl}' style='max-width:220px; max-height:120px; border-radius:10px; margin-top:0.5rem;'></div>`;
      } else if (cropMode === '1x1') {
        const canvas = libCropper.getCroppedCanvas({ width: 400, height: 400 });
        libCroppedDataUrl = canvas.toDataURL('image/png');
        poster1x1Preview.innerHTML = `<div style='text-align:center;'><img src='${libCroppedDataUrl}' style='max-width:120px; max-height:120px; border-radius:10px; margin-top:0.5rem;'></div>`;
        // Remove or clear cropPreview
        cropPreview.innerHTML = '';
      }
      cropperModal.style.display = 'none';
      libCropper.destroy();
      libCropper = null;
      cropMode = null;
      document.removeEventListener('keydown', libCropperKeyHandler);
    }
  });

  cancelBtn.addEventListener('click', function() {
    cropperModal.style.display = 'none';
    if (libCropper) {
      libCropper.destroy();
      libCropper = null;
    }
    if (cropMode === '16x9') {
      poster16x9Input.value = '';
      poster16x9Preview.innerHTML = '';
    } else if (cropMode === '1x1') {
      poster1x1Input.value = '';
      poster1x1Preview.innerHTML = '';
      cropPreview.innerHTML = '';
    }
    cropperImage.style.display = 'none';
    cropMode = null;
    document.removeEventListener('keydown', libCropperKeyHandler);
  });
  closeBtn.addEventListener('click', function() {
    cropperModal.style.display = 'none';
    if (libCropper) {
      libCropper.destroy();
      libCropper = null;
    }
    if (cropMode === '16x9') {
      poster16x9Input.value = '';
      poster16x9Preview.innerHTML = '';
    } else if (cropMode === '1x1') {
      poster1x1Input.value = '';
      poster1x1Preview.innerHTML = '';
      cropPreview.innerHTML = '';
    }
    cropperImage.style.display = 'none';
    cropMode = null;
    document.removeEventListener('keydown', libCropperKeyHandler);
  });
}

// ============================================
//   DYNAMIC LIBRARIES PROJECTS
// ============================================
const librariesProjects = [
  {
    title: 'coming soon',
    location: '--',
    year: '--',
    audio: 'sounds/clock.mp3',
    img16_9: 'images/poster/libraries/coming-soon-16x9.svg',
    img1_1: 'images/poster/libraries/coming-soon-1x1.svg',
  }
];

function renderLibraries() {
  const grid = document.querySelector('.library-mini-grid');
  const fullPosterContainer = document.getElementById('library-full-poster-container');
  if (!grid || !fullPosterContainer) return;
  grid.innerHTML = '';

  // Render main projects (newest first, as in array order)
  librariesProjects.forEach((proj, idx) => {
    const mini = document.createElement('div');
    mini.className = 'library-mini-poster';
    mini.setAttribute('data-index', idx);
    mini.innerHTML = `
      <img src="${proj.img1_1}" alt="${proj.title} mini-poster" />
      <div class="library-mini-title">${proj.title}</div>
    `;
    mini.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.library-mini-poster').forEach(el => el.classList.remove('active'));
      mini.classList.add('active');
      showLibraryFullPoster(idx);
    });
    grid.appendChild(mini);
  });
  // Demo posters removed
}

function renderCustomAudioPlayer(audioUrl) {
  return `
    <div class="custom-audio-player" data-audio="${audioUrl}">
      <button class="audio-play-btn" aria-label="Play/Pause">▶</button>
      <div class="audio-progress-container">
        <div class="audio-progress-bar"></div>
      </div>
      <span class="audio-time">0:00 / 0:00</span>
      <audio src="${audioUrl}" preload="auto"></audio>
    </div>
  `;
}

function renderMinimalAudioPlayer(audioUrl) {
  // New speaker SVG from images/icons/speaker.svg
  const speakerSVG = `<svg class='audio-volume-svg' width='22' height='22' viewBox='0 0 256 256' fill='none' xmlns='http://www.w3.org/2000/svg' style='filter: drop-shadow(0 1px 2px #000);'><g><g><path fill='#fff' d='M206.7,81.5c-5-0.8-9.6,2.5-10.4,7.4c-0.8,5,2.5,9.6,7.4,10.4c14.2,2.4,24.2,14.9,24.2,30.2c0,14.7-10.3,27.4-24.5,30.2c-4.9,1-8.2,5.8-7.1,10.7c0.9,4.3,4.6,7.3,8.9,7.3c0.6,0,1.2,0,1.8-0.2c22.7-4.4,39.1-24.7,39.1-47.9C246,105.5,229.4,85.3,206.7,81.5L206.7,81.5z'/><path fill='#fff' d='M168.4,1.8c-3-1.6-6.5-1.5-9.3,0.4L68.3,73.6H38c-15.4,0-28,11-28,24.5l0.5,59.8c0,13.4,12.5,24.3,28,24.3h30.2l90.4,71.6c1.5,1.1,3.3,1.5,5.1,1.5c1.5,0,2.9-0.4,4.3-1c2.9-1.6,4.8-4.7,4.8-8.1V9.8C173.2,6.4,171.3,3.3,168.4,1.8z M155.1,229.3l-78.6-63.6c-1.5-1-3.2-1.5-5-1.5h-33c-5.8,0-9.9-3.2-9.9-6.3L28.1,98c0-3,4.1-6.3,9.9-6.3h33c1.8,0,3.6-0.5,5.1-1.5l79.1-63.4L155.1,229.3L155.1,229.3z'/></g></g></svg>`;
  // Play SVG
  const playSVG = `<svg class='audio-play-svg' width='22' height='22' viewBox='0 0 256 256' fill='none' xmlns='http://www.w3.org/2000/svg' style='filter: drop-shadow(0 1px 2px #000);'><g><g><g><path fill='#fff' d='M33.5,10.8c-2.1,1-4,3-4.8,5.1c-0.5,1.1-0.6,35.3-0.6,112.3c0,122.3-0.3,113.1,3.7,116.2c1.8,1.4,2.7,1.6,5.3,1.6l3.2-0.1l92.4-55.5c68.7-41.2,92.8-56,93.7-57.4c1.8-2.6,1.8-7.3,0-9.9c-1-1.4-25-16.1-93.7-57.3C33.3,6.1,37.9,8.8,33.5,10.8z M200.6,128c0.1,0.2-34.6,21.2-77.1,46.7l-77.2,46.3v-93V35l77.1,46.3C165.8,106.8,200.6,127.8,200.6,128z'/></g></g></g></svg>`;
  // Pause SVG
  const pauseSVG = `<svg class='audio-play-svg' width='22' height='22' viewBox='0 0 256 256' fill='none' xmlns='http://www.w3.org/2000/svg' style='filter: drop-shadow(0 1px 2px #000);'><g><g><g><path fill='#fff' d='M40.2,10.5c-1.2,0.4-2.8,1.2-3.5,1.9c-3.3,3.1-3.1-4.3-3.1,115.7v111.1l1.4,2c0.7,1.2,2.3,2.6,3.5,3.3c2.1,1.2,3,1.3,28,1.3c25.1,0,25.9-0.1,27.5-1.3c0.9-0.7,2.2-2,2.9-2.9c1.3-1.6,1.3-1.8,1.6-111.7c0.2-60.5,0.1-111-0.1-112.1c-0.5-2.4-2-4.6-4.4-6.4c-1.6-1.2-2.4-1.3-26.6-1.4C51.8,10,41.5,10.1,40.2,10.5z M79.9,127.9v99l-13.7,0.2l-13.8,0.1v-99.3V28.6l13.8,0.1l13.7,0.2V127.9z'/><path fill='#fff' d='M164,10.4c-1,0.3-2.8,1.6-3.9,2.7l-2.1,2.2V128v112.7l2.5,2.4c3.3,3.1,4.1,3.1,32,2.9c21.9-0.2,23.1-0.2,25.1-1.5c1.2-0.7,2.7-2.1,3.5-3.3l1.4-2V127.9V16.7l-1.4-2c-0.7-1.2-2.3-2.6-3.5-3.3c-2.1-1.2-3.1-1.3-27-1.4C177.1,10,165,10.1,164,10.4z M203.7,127.9v99.3l-13.7-0.1l-13.8-0.2l-0.2-98.4c-0.1-54.1,0-98.8,0.2-99.2c0.2-0.5,3.6-0.7,13.9-0.7h13.6V127.9z'/></g></g></g></svg>`;
  return `
    <button class="audio-play-btn" aria-label="Play/Pause">${playSVG}</button>
    <div class="audio-player-right">
      <div class="audio-seek"><div class="audio-seek-bar"></div></div>
      <span class="audio-time">0:00 / 0:00</span>
      <div class="audio-volume">
        <span class="audio-volume-icon" aria-label="Volume">${speakerSVG}</span>
        <input type="range" min="0" max="1" step="0.01" value="1">
      </div>
    </div>
    <audio src="${audioUrl || ''}" preload="auto"></audio>
  `;
}

function initMinimalAudioPlayer(container) {
  const audio = container.querySelector('audio');
  const playBtn = container.querySelector('.audio-play-btn');
  const seek = container.querySelector('.audio-seek');
  const seekBar = container.querySelector('.audio-seek-bar');
  const timeDisplay = container.querySelector('.audio-time');
  const volume = container.querySelector('input[type=range]');
  const volIcon = container.querySelector('.audio-volume-icon');
  const volWrap = container.querySelector('.audio-volume');
  // Remove waveform logic
  let raf;
  // Get SVGs for toggling
  const playSVG = playBtn.innerHTML;
  const pauseSVG = `<svg class='audio-play-svg' width='22' height='22' viewBox='0 0 256 256' fill='none' xmlns='http://www.w3.org/2000/svg' style='filter: drop-shadow(0 1px 2px #000);'><g><g><g><path fill='#fff' d='M40.2,10.5c-1.2,0.4-2.8,1.2-3.5,1.9c-3.3,3.1-3.1-4.3-3.1,115.7v111.1l1.4,2c0.7,1.2,2.3,2.6,3.5,3.3c2.1,1.2,3,1.3,28,1.3c25.1,0,25.9-0.1,27.5-1.3c0.9-0.7,2.2-2,2.9-2.9c1.3-1.6,1.3-1.8,1.6-111.7c0.2-60.5,0.1-111-0.1-112.1c-0.5-2.4-2-4.6-4.4-6.4c-1.6-1.2-2.4-1.3-26.6-1.4C51.8,10,41.5,10.1,40.2,10.5z M79.9,127.9v99l-13.7,0.2l-13.8,0.1v-99.3V28.6l13.8,0.1l13.7,0.2V127.9z'/><path fill='#fff' d='M164,10.4c-1,0.3-2.8,1.6-3.9,2.7l-2.1,2.2V128v112.7l2.5,2.4c3.3,3.1,4.1,3.1,32,2.9c21.9-0.2,23.1-0.2,25.1-1.5c1.2-0.7,2.7-2.1,3.5-3.3l1.4-2V127.9V16.7l-1.4-2c-0.7-1.2-2.3-2.6-3.5-3.3c-2.1-1.2-3.1-1.3-27-1.4C177.1,10,165,10.1,164,10.4z M203.7,127.9v99.3l-13.7-0.1l-13.8-0.2l-0.2-98.4c-0.1-54.1,0-98.8,0.2-99.2c0.2-0.5,3.6-0.7,13.9-0.7h13.6V127.9z'/></g></g></g></svg>`;
  function formatTime(sec) {
    sec = Math.floor(sec);
    return `${Math.floor(sec/60)}:${('0'+(sec%60)).slice(-2)}`;
  }
  function updateProgress() {
    const current = audio.currentTime;
    const duration = audio.duration || 0;
    seekBar.style.width = duration ? ((current / duration) * 100) + '%' : '0%';
    timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    if (!audio.paused) raf = requestAnimationFrame(updateProgress);
  }
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.innerHTML = pauseSVG;
      raf = requestAnimationFrame(updateProgress);
    } else {
      audio.pause();
      playBtn.innerHTML = playSVG;
      cancelAnimationFrame(raf);
    }
  });
  audio.addEventListener('ended', () => {
    playBtn.innerHTML = playSVG;
    seekBar.style.width = '0%';
    timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
  });
  audio.addEventListener('loadedmetadata', () => {
    timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
  });
  seek.addEventListener('click', (e) => {
    const rect = seek.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
    updateProgress();
  });
  // Volume slider show/hide
  volIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    volWrap.classList.toggle('show-slider');
  });
  // Hide slider when clicking outside
  document.addEventListener('mousedown', function hideSlider(ev) {
    if (!volWrap.contains(ev.target)) volWrap.classList.remove('show-slider');
  });
  // Volume logic
  volume.addEventListener('input', () => {
    audio.volume = volume.value;
  });
}

function showLibraryFullPoster(idx) {
  const proj = librariesProjects[idx];
  const fullPosterContainer = document.getElementById('library-full-poster-container');
  if (!proj || !fullPosterContainer) return;
  fullPosterContainer.style.display = 'block';
  fullPosterContainer.classList.remove('hide');
  setTimeout(() => { fullPosterContainer.classList.add('show'); }, 10);
  const fullImg = document.getElementById('library-full-img');
  fullImg.src = proj.img16_9;
  fullImg.alt = proj.title + ' full-poster';
  fullImg.classList.add('color');
  document.getElementById('library-full-title').textContent = proj.title;
  document.getElementById('library-full-info').innerHTML = `Location: ${proj.location}<br>Year: ${proj.year}`;
  // Render minimal custom audio player with project audio
  const audioPlayerDiv = document.getElementById('library-full-audio-player');
  const audioUrl = proj.audio || 'sounds/ex snia_demo.mp3';
  audioPlayerDiv.innerHTML = renderMinimalAudioPlayer(audioUrl);
  initMinimalAudioPlayer(audioPlayerDiv);
  // Add close on outside click
  function closeOnOutside(e) {
    if (e.target === fullPosterContainer) {
      fullPosterContainer.classList.remove('show');
      fullPosterContainer.classList.add('hide');
      setTimeout(() => { fullPosterContainer.style.display = 'none'; fullPosterContainer.classList.remove('hide'); }, 200);
      document.removeEventListener('mousedown', closeOnOutside);
      // Remove .color from full-poster img
      fullImg.classList.remove('color');
      // Remove .active from all mini-posters
      document.querySelectorAll('.library-mini-poster').forEach(el => el.classList.remove('active'));
    }
  }
  document.removeEventListener('mousedown', closeOnOutside);
  setTimeout(() => {
    document.addEventListener('mousedown', closeOnOutside);
  }, 20);
}

document.addEventListener('DOMContentLoaded', function() {
  renderLibraries();
  // Add minimize button logic
  const minimizeBtn = document.getElementById('library-full-minimize');
  const fullPosterContainer = document.getElementById('library-full-poster-container');
  if (minimizeBtn && fullPosterContainer) {
    minimizeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      fullPosterContainer.classList.remove('show');
      fullPosterContainer.classList.add('hide');
      setTimeout(() => { fullPosterContainer.style.display = 'none'; fullPosterContainer.classList.remove('hide'); }, 200);
      // Remove .color from full-poster img
      document.getElementById('library-full-img').classList.remove('color');
      // Remove .active from all mini-posters
      document.querySelectorAll('.library-mini-poster').forEach(el => el.classList.remove('active'));
    });
  }
  initLibrariesCropper();
}); 

// ============================================
//   BIO PROFILE PIC CROPPER LOGIC (4:3)
// ============================================
let bioCropper = null;
let bioCroppedDataUrl = null;

function initBioCropper() {
  const bioPicInput = document.getElementById('bio-pic');
  const bioCropperModal = document.getElementById('bio-cropper-modal');
  const bioCropperImage = document.getElementById('bio-cropper-image');
  const bioCropBtn = document.getElementById('bio-cropper-crop-btn');
  const bioCancelBtn = document.getElementById('bio-cropper-cancel-btn');
  const bioCloseBtn = document.getElementById('bio-cropper-close-btn');
  const bioCropPreview = document.getElementById('bio-crop-preview');

  if (!bioPicInput) return;

  bioPicInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      bioCropperImage.src = evt.target.result;
      bioCropperImage.style.display = 'block';
      bioCropperImage.onload = function() {
        bioCropperModal.style.display = 'flex';
        if (bioCropper) {
          bioCropper.destroy();
          bioCropper = null;
        }
        bioCropper = new Cropper(bioCropperImage, {
          aspectRatio: 3/4, // vertical portrait
          viewMode: 1,
          autoCropArea: 1,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false,
          responsive: true,
          background: false,
        });
        // Add keyboard shortcuts
        document.addEventListener('keydown', bioCropperKeyHandler);
      };
    };
    reader.readAsDataURL(file);
  });

  function bioCropperKeyHandler(e) {
    if (bioCropperModal.style.display === 'flex') {
      if (e.key === 'Enter') {
        bioCropBtn.click();
      } else if (e.key === 'Escape') {
        bioCloseBtn.click();
      }
    }
  }

  bioCropBtn.addEventListener('click', function() {
    if (bioCropper) {
      const canvas = bioCropper.getCroppedCanvas({ width: 300, height: 400 });
      bioCroppedDataUrl = canvas.toDataURL('image/png');
      bioCropPreview.innerHTML = `<div style='text-align:center;'><strong>Anteprima 3:4:</strong><br><img src='${bioCroppedDataUrl}' style='max-width:135px; max-height:180px; border-radius:10px; margin-top:0.5rem;'></div>`;
      bioCropperModal.style.display = 'none';
      bioCropper.destroy();
      bioCropper = null;
      document.removeEventListener('keydown', bioCropperKeyHandler);
    }
  });

  bioCancelBtn.addEventListener('click', function() {
    bioCropperModal.style.display = 'none';
    if (bioCropper) {
      bioCropper.destroy();
      bioCropper = null;
    }
    bioPicInput.value = '';
    bioCropPreview.innerHTML = '';
    bioCropperImage.style.display = 'none';
    document.removeEventListener('keydown', bioCropperKeyHandler);
  });
  bioCloseBtn.addEventListener('click', function() {
    bioCropperModal.style.display = 'none';
    if (bioCropper) {
      bioCropper.destroy();
      bioCropper = null;
    }
    bioPicInput.value = '';
    bioCropPreview.innerHTML = '';
    bioCropperImage.style.display = 'none';
    document.removeEventListener('keydown', bioCropperKeyHandler);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initBioCropper();
}); 

// ============================================
//   FILM POSTER EXPAND FUNCTIONALITY
// ============================================
function expandFilmPoster(event, index) {
    event.stopPropagation(); // Prevent the torn poster click event
    console.log('Expanding film poster for index:', index);
    const project = filmProjects[index];
    console.log('Project data:', project);
    const modal = document.getElementById('film-expanded-modal');
    if (modal && project) {
        // Update modal content with project data
        const modalImage = modal.querySelector('.film-expanded-image');
        if (modalImage) {
            modalImage.src = project.poster;
            modalImage.alt = project.title + ' - Expanded View';
        }
        modal.style.display = 'flex';
        // Trigger animation after a small delay
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    } else {
        console.log('Modal or project not found:', { modal: !!modal, project: !!project });
    }
}
window.expandFilmPoster = expandFilmPoster;

function closeFilmPoster() {
    const modal = document.getElementById('film-expanded-modal');
    if (modal) {
        modal.classList.remove('show');
        // Hide modal after animation completes
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside the content
document.addEventListener('DOMContentLoaded', function() {
    const filmModal = document.getElementById('film-expanded-modal');
    const documentaryModal = document.getElementById('documentary-expanded-modal');
    
    if (filmModal) {
        filmModal.addEventListener('click', function(e) {
            if (e.target === filmModal) {
                closeFilmPoster();
            }
        });
    }
    
    if (documentaryModal) {
        documentaryModal.addEventListener('click', function(e) {
            if (e.target === documentaryModal) {
                closeDocumentaryPoster();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const filmModal = document.getElementById('film-expanded-modal');
            const documentaryModal = document.getElementById('documentary-expanded-modal');
            
            if (filmModal && filmModal.style.display === 'flex') {
                closeFilmPoster();
            }
            if (documentaryModal && documentaryModal.style.display === 'flex') {
                closeDocumentaryPoster();
            }
        }
    });
});

// ============================================
//   DOCUMENTARY POSTER EXPAND FUNCTIONALITY
// ============================================
function expandDocumentaryPoster(event, index) {
    event.stopPropagation(); // Prevent the torn poster click event
    
    console.log('Expanding documentary poster for index:', index);
    const project = documentaryProjects[index];
    console.log('Project data:', project);
    
    const modal = document.getElementById('documentary-expanded-modal');
    if (modal && project) {
        // Update modal content with project data
        const modalImage = modal.querySelector('.film-expanded-image');
        if (modalImage) {
            modalImage.src = project.poster;
            modalImage.alt = project.title + ' - Expanded View';
        }
        
        modal.style.display = 'flex';
        // Trigger animation after a small delay
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    } else {
        console.log('Modal or project not found:', { modal: !!modal, project: !!project });
    }
}

function closeDocumentaryPoster() {
    const modal = document.getElementById('documentary-expanded-modal');
    if (modal) {
        modal.classList.remove('show');
        // Hide modal after animation completes
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// --- FILM PROJECTS ---
const filmProjects = [
  {
    title: 'Ferrini',
    director: 'Uriel De Nola',
    production: 'Francesco Appoggetti',
    year: '2018',
    type: 'Short Film',
    role: 'Sound Designer',
    trailer: 'https://www.youtube.com/watch?v=3s8AArVvq1Y&ab_channel=Ferrini-ShortFilm',
    imdb: 'https://www.imdb.com/it/title/tt9060828/?ref_=nv_sr_srsg_4_tt_3_nm_5_in_0_q_ferrini',
    poster: 'images/poster/film/ferrini.jpg',
  },
  {
    title: 'DOMANI ALL\'ALBA',
    director: 'Giulia di Battista',
    production: 'CSC production',
    year: '2019',
    type: 'Short Film',
    role: 'Sound Designer',
    trailer: 'https://www.youtube.com/watch?v=_vbIs-VBjsI',
    imdb: 'https://www.imdb.com/title/tt13923774/?ref_=fn_all_ttl_1',
    poster: 'images/poster/film/domani-allalba.jpg',
  },
];
window.filmProjects = filmProjects;

// --- DOCUMENTARY PROJECTS ---
const documentaryProjects = [
  {
    title: "C'é un lupo nel parco del Re",
    director: 'Virginia Nardelli',
    production: 'CSC sede Sicilia',
    year: '2019',
    role: 'Sound Designer',
    trailer: 'https://vimeo.com/381645585?p=1s',
    imdb: 'https://www.labandita.org/ita/portfolio/ce-un-lupo-nel-parco-del-re/',
    poster: 'images/poster/documentary/lupoparco.jpg',
  },
  {
    title: 'NOI',
    director: 'Benedetta Valabrega',
    production: 'CSC sede Sicilia',
    year: '2019',
    role: 'Sound Effects Editor',
    trailer: 'https://www.youtube.com/watch?v=CM_OERAFAlE',
    imdb: 'https://www.siciliaqueerfilmfest.it/edizioni/sicilia-queer-2019/panorama-queer-2019/noi',
    poster: 'images/poster/documentary/noi.jpg',
  },
];
window.documentaryProjects = documentaryProjects;

// --- COMMERCIAL PROJECTS ---
const commercialProjects = [
  {
    title: 'La legge di Lidia Poet - TRAILER',
    director: '',
    production: 'Netflix',
    year: '2023',
    role: 'Re-recording Mixer',
    trailer: 'https://youtu.be/VCttxLaikW0?feature=shared',
    imdb: '',
    poster: 'images/poster/commercial/lidiapoet.jpg',
  },
  {
    title: 'PORSCHE ELECTRICITY TALK - LONDON EYE',
    director: '',
    production: 'Porsche',
    year: '2019',
    role: 'Sound Designer',
    trailer: 'https://www.youtube.com/watch?v=7ZR_cUSh1w0',
    imdb: '',
    poster: 'images/poster/commercial/porsche-electricity-talk-london-eye.jpg',
  },
];
window.commercialProjects = commercialProjects;

// After filmProjects definition
console.log('filmProjects:', filmProjects);
// After documentaryProjects definition
console.log('documentaryProjects:', documentaryProjects);

// At the start of renderFilm
function renderFilm() {
  const grid = document.querySelector('.film-mini-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Use only real projects, no TESTER
  const projects = [...filmProjects];

  const isMobile = window.matchMedia('(max-width: 600px)').matches;

  projects.forEach((proj, idx) => {
    if (isMobile) {
      // MOBILE LAYOUT
      const box = document.createElement('div');
      box.className = 'mobile-poster-box';
      // Sidebands + Poster
      box.innerHTML = `
        <div class="mobile-poster-sideband"></div>
        <img class="mobile-poster-img" src="${proj.poster}" alt="${proj.title}">
        <div class="mobile-poster-sideband"></div>
        <div class="mobile-poster-flip hide">
          <div class="film-info-title-group">
            <h3>${proj.title}</h3>
            <div class="year-type">(${proj.year}) <span class="type">${proj.type}</span></div>
          </div>
          <div class="film-info-meta-group">
            <p><strong>DIRECTOR:</strong><br>${proj.director}</p>
            <p><strong>PRODUCTION:</strong><br>${proj.production}</p>
            <p><strong>ROLE:</strong><br>${proj.role}</p>
          </div>
          <div class="film-info-actions-group">
            ${proj.imdb ? `<a class="imdb-btn" href="${proj.imdb}" target="_blank" aria-label="IMDB Page">IMDb</a>` : ''}
            ${proj.trailer ? `<a class="trailer-link" href="${proj.trailer}" target="_blank" rel="noopener">trailer</a>` : ''}
          </div>
        </div>
      `;
      // Flip logic: tap poster to show info, tap info to go back
      const posterImg = box.querySelector('.mobile-poster-img');
      const infoFlip = box.querySelector('.mobile-poster-flip');
      posterImg.addEventListener('click', () => {
        posterImg.style.visibility = 'hidden';
        box.querySelectorAll('.mobile-poster-sideband').forEach(b => b.style.visibility = 'hidden');
        infoFlip.classList.remove('hide');
      });
      infoFlip.addEventListener('click', () => {
        posterImg.style.visibility = '';
        box.querySelectorAll('.mobile-poster-sideband').forEach(b => b.style.visibility = '');
        infoFlip.classList.add('hide');
      });
      grid.appendChild(box);
      // Restore color on poster hover for mobile
      if (posterImg) {
        posterImg.addEventListener('mouseenter', function() {
          posterImg.style.filter = 'none';
        });
        posterImg.addEventListener('mouseleave', function() {
          posterImg.style.filter = '';
        });
      }
    } else {
      // DESKTOP LAYOUT (unchanged)
      const card = document.createElement('div');
      card.className = 'scheda';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', proj.title + ' - ' + proj.role);

      // Flip container
      const flipContainer = document.createElement('div');
      flipContainer.className = 'flip-container';
      const flipper = document.createElement('div');
      flipper.className = 'flipper';

      // Card front (poster)
      const cardFront = document.createElement('div');
      cardFront.className = 'card-front';
      cardFront.innerHTML = `
        <div class="poster-container">
          <img class="poster-base" src="${proj.poster}" alt="${proj.title}">
        </div>
        <div class="torn-info-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; padding-bottom: 2.5rem; pointer-events: none;">
          <h3 class="scheda-titolo" style="margin-top: -0.5rem; margin-bottom: 0.1rem; text-align: center; color: var(--blue-main);">${proj.title}</h3>
          <div style="margin-bottom: 1.1rem; text-align: center;"><span class="year" style="font-weight:400; font-family:var(--body-font);">(${proj.year})</span> <span class="type" style="color:#888; font-size:1rem; font-weight:400;">${proj.type}</span></div>
        </div>
      `;

      // Card back (info)
      const cardBack = document.createElement('div');
      cardBack.className = 'card-back';
      cardBack.innerHTML = `
        <button class="close-info-btn" aria-label="Close info">&times;</button>
        <div class="film-info-details">
          <div class="film-info-title-group">
            <h3>${proj.title}</h3>
            <div class="year-type">(${proj.year}) <span style="color:#888; font-size:1rem; font-weight:400;">${proj.type}</span></div>
          </div>
          <div class="film-info-meta-group">
            <p><strong>DIRECTOR:</strong><br>${proj.director}</p>
            <p><strong>PRODUCTION:</strong><br>${proj.production}</p>
            <p><strong>ROLE:</strong><br>${proj.role}</p>
          </div>
          <div class="film-info-actions-group">
            <span style="flex:1; display:flex;">
              ${proj.imdb ? `<a class="imdb-btn" href="${proj.imdb}" target="_blank" aria-label="IMDB Page">IMDb</a>` : ''}
            </span>
            <span style="flex:1; display:flex; justify-content: flex-end;">
              ${proj.trailer ? `<a class="trailer-link" href="${proj.trailer}" target="_blank" rel="noopener">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue-main)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                trailer
              </a>` : ''}
            </span>
          </div>
        </div>
      `;

      // Build structure
      flipper.appendChild(cardFront);
      flipper.appendChild(cardBack);
      flipContainer.appendChild(flipper);
      card.appendChild(flipContainer);
      grid.appendChild(card);

      // Flip logic
      card.addEventListener('click', function(e) {
        // Only flip if not clicking the close button
        if (e.target.classList.contains('close-info-btn')) return;
        card.classList.toggle('flipped');
      });
      // Close button on back
      cardBack.querySelector('.close-info-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        card.classList.remove('flipped');
      });
      // After card is created and appended:
      // Restore color on poster hover
      card.addEventListener('mouseenter', function() {
        const poster = card.querySelector('.poster-base, .poster');
        if (poster) poster.style.filter = 'none';
      });
      card.addEventListener('mouseleave', function() {
        const poster = card.querySelector('.poster-base, .poster');
        if (poster) poster.style.filter = '';
      });
    }
  });
}

function renderDocumentary() {
  const grid = document.querySelector('.documentary-mini-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Use only real projects, no DOC-TESTER
  const projects = [...documentaryProjects];

  const isMobile = window.matchMedia('(max-width: 600px)').matches;

  projects.forEach((proj, idx) => {
    if (isMobile) {
      // MOBILE LAYOUT
      const box = document.createElement('div');
      box.className = 'mobile-poster-box';
      // Sidebands + Poster
      box.innerHTML = `
        <div class="mobile-poster-sideband"></div>
        <img class="mobile-poster-img" src="${proj.poster}" alt="${proj.title}">
        <div class="mobile-poster-sideband"></div>
        <div class="mobile-poster-flip hide">
          <div class="film-info-title-group">
            <h3>${proj.title}</h3>
            <div class="year-type">(${proj.year}) <span class="type">${proj.type}</span></div>
          </div>
          <div class="film-info-meta-group">
            <p><strong>DIRECTOR:</strong><br>${proj.director}</p>
            <p><strong>PRODUCTION:</strong><br>${proj.production}</p>
            <p><strong>ROLE:</strong><br>${proj.role}</p>
          </div>
          <div class="film-info-actions-group">
            ${proj.imdb ? `<a class="imdb-btn" href="${proj.imdb}" target="_blank" aria-label="IMDB Page">ImDb</a>` : ''}
            ${proj.trailer ? `<a class="trailer-link" href="${proj.trailer}" target="_blank" rel="noopener">Trailer</a>` : ''}
          </div>
        </div>
      `;
      // Flip logic: tap poster to show info, tap info to go back
      const posterImg = box.querySelector('.mobile-poster-img');
      const infoFlip = box.querySelector('.mobile-poster-flip');
      posterImg.addEventListener('click', () => {
        posterImg.style.visibility = 'hidden';
        box.querySelectorAll('.mobile-poster-sideband').forEach(b => b.style.visibility = 'hidden');
        infoFlip.classList.remove('hide');
      });
      infoFlip.addEventListener('click', () => {
        posterImg.style.visibility = '';
        box.querySelectorAll('.mobile-poster-sideband').forEach(b => b.style.visibility = '');
        infoFlip.classList.add('hide');
      });
      grid.appendChild(box);
      // Restore color on poster hover for mobile
      if (posterImg) {
        posterImg.addEventListener('mouseenter', function() {
          posterImg.style.filter = 'none';
        });
        posterImg.addEventListener('mouseleave', function() {
          posterImg.style.filter = '';
        });
      }
    } else {
      // DESKTOP LAYOUT (unchanged)
      const card = document.createElement('div');
      card.className = 'scheda';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', proj.title + ' - ' + proj.role);

      // Flip container
      const flipContainer = document.createElement('div');
      flipContainer.className = 'flip-container';
      const flipper = document.createElement('div');
      flipper.className = 'flipper';

      // Card front (poster)
      const cardFront = document.createElement('div');
      cardFront.className = 'card-front';
      cardFront.innerHTML = `
        <div class="poster-container">
          <img class="poster-base" src="${proj.poster}" alt="${proj.title}">
        </div>
        <div class="torn-info-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; padding-bottom: 2.5rem; pointer-events: none;">
          <h3 class="scheda-titolo" style="margin-top: -0.5rem; margin-bottom: 0.1rem; text-align: center; color: var(--blue-main);">${proj.title}</h3>
          <div style="margin-bottom: 1.1rem; text-align: center;"><span class="year" style="font-weight:400; font-family:var(--body-font);">(${proj.year})</span> <span class="type" style="color:#888; font-size:1rem; font-weight:400;">Documentary</span></div>
        </div>
      `;

      // Card back (info)
      const cardBack = document.createElement('div');
      cardBack.className = 'card-back';
      cardBack.innerHTML = `
        <button class="close-info-btn" aria-label="Close info">&times;</button>
        <div class="film-info-details">
          <div class="film-info-title-group">
            <h3>${proj.title}</h3>
            <div class="year-type">(${proj.year}) <span style="color:#888; font-size:1rem; font-weight:400;">Documentary</span></div>
          </div>
          <div class="film-info-meta-group">
            <p><strong>DIRECTOR:</strong><br>${proj.director}</p>
            <p><strong>PRODUCTION:</strong><br>${proj.production}</p>
            <p><strong>ROLE:</strong><br>${proj.role}</p>
          </div>
          <div class="film-info-actions-group">
            <span style="flex:1; display:flex;">
              ${proj.imdb ? `<a class="imdb-btn" href="${proj.imdb}" target="_blank" aria-label="IMDB Page">IMDb</a>` : ''}
            </span>
            <span style="flex:1; display:flex; justify-content: flex-end;">
              ${proj.trailer ? `<a class="trailer-link" href="${proj.trailer}" target="_blank" rel="noopener">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue-main)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                trailer
              </a>` : ''}
            </span>
          </div>
        </div>
      `;

      // Build structure
      flipper.appendChild(cardFront);
      flipper.appendChild(cardBack);
      flipContainer.appendChild(flipper);
      card.appendChild(flipContainer);
      grid.appendChild(card);

      // Flip logic
      card.addEventListener('click', function(e) {
        // Only flip if not clicking the close button
        if (e.target.classList.contains('close-info-btn')) return;
        card.classList.toggle('flipped');
      });
      // Close button on back
      cardBack.querySelector('.close-info-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        card.classList.remove('flipped');
      });
      // After card is created and appended:
      // Restore color on poster hover
      card.addEventListener('mouseenter', function() {
        const poster = card.querySelector('.poster-base, .poster');
        if (poster) poster.style.filter = 'none';
      });
      card.addEventListener('mouseleave', function() {
        const poster = card.querySelector('.poster-base, .poster');
        if (poster) poster.style.filter = '';
      });
    }
  });
}

function renderCommercial() {
  const grid = document.querySelector('.commercial-mini-grid');
  if (!grid) return;
  grid.innerHTML = '';
  commercialProjects.forEach((proj, idx) => {
    const card = document.createElement('div');
    card.className = 'commercial-card';
    card.innerHTML = `
      <div class="poster-col">
        <div class="poster-img horizontal-poster">
          <img src="${proj.poster}" alt="Poster ${proj.title}">
          ${proj.trailer ? `<div class="trailer-link-bottom-right">
            <a href="${proj.trailer}" target="_blank" rel="noopener" style="display: flex; align-items: center; justify-content: center; padding: 0; gap: 0.4rem;">
              <img src="images/icons/play.svg" alt="Play trailer" style="width: 0.85rem; height: 0.85rem; display: block; filter: none;" />
              <span style="font-weight: 400; font-size: 1rem; letter-spacing: 0.03em; color: #111;">watch</span>
            </a>
          </div>` : ''}
        </div>
      </div>
      <div class="info-col">
        <div class="project-info vertical-info">
          <h3 class="project-title">${proj.title}</h3>
          <div class="project-details">
            <p><strong>AGENCY:</strong> ${proj.production}</p>
            <p><strong>YEAR:</strong> ${proj.year}</p>
            <p><strong>ROLE:</strong> ${proj.role}</p>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render dynamic grids when pages are shown
document.addEventListener('DOMContentLoaded', function() {
  renderFilm();
  renderDocumentary();
  renderCommercial();
  renderLibraries();
});

// ... existing code ...
function showFilmInfoModal(index, event) {
  const modal = document.getElementById('film-info-modal');
  const content = modal.querySelector('.film-info-details');
  const project = filmProjects[index];
  if (!modal || !content || !project) return;
  
  // Fill modal with project info
  content.innerHTML = `
    <h3>${project.title}</h3>
    <div class="year-type">(${project.year}) <span style="color:#888; font-size:1rem; font-weight:400;">${project.type}</span></div>
    <div class="film-info-meta">
      <p><strong>DIRECTOR:</strong> ${project.director}</p>
      <p><strong>PRODUCTION:</strong> ${project.production}</p>
      <p><strong>ROLE:</strong> ${project.role}</p>
    </div>
    <div class="info-actions">
      ${project.imdb ? `<a class="imdb-btn" href="${project.imdb}" target="_blank" aria-label="IMDB Page">IMDb</a>` : ''}
      ${project.trailer ? `<a class="trailer-link" href="${project.trailer}" target="_blank" rel="noopener">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue-main)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        trailer
      </a>` : ''}
    </div>
  `;
  
  modal.style.display = 'flex';
  setTimeout(() => { modal.classList.add('show'); }, 10);
  document.body.style.overflow = 'hidden';
}
function closeFilmInfoModal() {
  const modal = document.getElementById('film-info-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
  }
}
window.closeFilmInfoModal = closeFilmInfoModal;
// ... existing code ...

// Add a modal for documentary info in index.html (do this in HTML, but here is the JS logic)
// Add showDocumentaryInfoModal and closeDocumentaryInfoModal functions
function showDocumentaryInfoModal(index) {
  const modal = document.getElementById('documentary-info-modal');
  const content = modal.querySelector('.film-info-details');
  const project = documentaryProjects[index];
  if (!modal || !content || !project) return;
  content.innerHTML = `
    <h3>${project.title}</h3>
    <div class="year-type">(${project.year}) <span class="type">${project.type || 'Documentary'}</span></div>
    <div class="film-info-meta">
      <p><strong>DIRECTOR:</strong> ${project.director}</p>
      <p><strong>PRODUCTION:</strong> ${project.production}</p>
      <p><strong>ROLE:</strong> ${project.role}</p>
    </div>
    <div class="info-actions">
      ${project.imdb ? `<a class="imdb-btn" href="${project.imdb}" target="_blank" aria-label="IMDB Page">IMDb</a>` : ''}
      ${project.trailer ? `<a class="trailer-link" href="${project.trailer}" target="_blank" rel="noopener">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue-main)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        trailer
      </a>` : ''}
    </div>
  `;
  modal.style.display = 'flex';
  setTimeout(() => { modal.classList.add('show'); }, 10);
  document.body.style.overflow = 'hidden';
}
function closeDocumentaryInfoModal() {
  const modal = document.getElementById('documentary-info-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
  }
}
window.closeDocumentaryInfoModal = closeDocumentaryInfoModal;
// ... existing code ...

// ... existing code ...
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    // Close all modals/windows with a close button
    document.querySelectorAll('.close-info-btn, .close-expanded-btn').forEach(btn => {
      // Find the closest modal container
      let modal = btn.closest('.film-info-modal, .film-expanded-modal, #library-full-poster-container');
      if (modal && (modal.style.display === 'flex' || modal.style.display === 'block')) {
        // Try to call the close function if available
        if (btn.classList.contains('close-info-btn')) {
          if (modal.id === 'film-info-modal' && typeof closeFilmInfoModal === 'function') closeFilmInfoModal();
          else if (modal.id === 'documentary-info-modal' && typeof closeDocumentaryInfoModal === 'function') closeDocumentaryInfoModal();
        } else if (btn.classList.contains('close-expanded-btn')) {
          if (modal.id === 'film-expanded-modal' && typeof closeFilmPoster === 'function') closeFilmPoster();
          else if (modal.id === 'documentary-expanded-modal' && typeof closeDocumentaryPoster === 'function') closeDocumentaryPoster();
        } else if (modal.id === 'library-full-poster-container') {
          modal.classList.remove('show');
          modal.classList.add('hide');
          setTimeout(() => { modal.style.display = 'none'; modal.classList.remove('hide'); }, 200);
          document.body.style.overflow = '';
        }
      }
    });
  }
});

// Restore color on poster hover for FILM and DOCUMENTARY
function enablePosterHoverColor() {
  function handleMouseEnter(e) {
    const poster = e.currentTarget.querySelector('.poster-base, .poster');
    if (poster) poster.style.filter = 'none';
  }
  function handleMouseLeave(e) {
    const poster = e.currentTarget.querySelector('.poster-base, .poster');
    if (poster) poster.style.filter = '';
  }
  // FILM posters
  document.querySelectorAll('.film-mini-grid .scheda, .film-mini-grid .torn-poster').forEach(card => {
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
  // DOCUMENTARY posters
  document.querySelectorAll('.documentary-mini-grid .scheda, .documentary-mini-grid .torn-poster').forEach(card => {
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
}
// Call on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enablePosterHoverColor);
} else {
  enablePosterHoverColor();
}

// === ELIMINA PROGETTO SECTION LOGIC ===
window.populateDeleteProjectList = function() {
  var cat = document.getElementById('delete-category').value;
  var group = document.getElementById('delete-project-group');
  var list = document.getElementById('delete-project-list');
  var btns = document.getElementById('delete-modify-btns');
  var msg = document.getElementById('delete-message');
  msg.textContent = '';
  if (!cat) {
    group.style.display = 'none';
    btns.style.display = 'none';
    list.innerHTML = '<option value="">-- Seleziona un progetto/articolo --</option>';
    return;
  }
  // Use actual data arrays
  var data = {
    film: (window.filmProjects || []).map(function(p, i){ return {title: p.title, idx: i}; }),
    documentary: (window.documentaryProjects || []).map(function(p, i){ return {title: p.title, idx: i}; }),
    commercial: (window.commercialProjects || []).map(function(p, i){ return {title: p.title, idx: i}; }),
    libraries: (window.librariesProjects || []).map(function(p, i){ return {title: p.title, idx: i}; }),
    blog: (window.blogArticles || []).map(function(p, i){ return {title: p.title, idx: i}; })
  };
  var options = '<option value="">-- Seleziona un progetto/articolo --</option>';
  (data[cat] || []).forEach(function(obj) {
    options += '<option value="' + obj.idx + '">' + obj.title + '</option>';
  });
  list.innerHTML = options;
  group.style.display = '';
  btns.style.display = 'none';
  list.onchange = function() {
    btns.style.display = list.value ? '' : 'none';
    msg.textContent = '';
  };
};

// Prepare for MODIFICA: show a form with project data for editing
window.modifySelectedProject = function() {
  var cat = document.getElementById('delete-category').value;
  var list = document.getElementById('delete-project-list');
  var msg = document.getElementById('delete-message');
  if (!list.value) return;
  var idx = parseInt(list.value, 10);
  var project = null;
  if (cat === 'film') project = window.filmProjects[idx];
  else if (cat === 'documentary') project = window.documentaryProjects[idx];
  else if (cat === 'commercial') project = window.commercialProjects[idx];
  else if (cat === 'libraries') project = window.librariesProjects[idx];
  else if (cat === 'blog') project = window.blogArticles ? window.blogArticles[idx] : null;
  if (!project) { msg.textContent = 'Progetto non trovato.'; return; }
  // Build a form for editing
  var formHtml = '<form id="modify-project-form" class="project-form" style="margin-top:1.5rem;">';
  for (var key in project) {
    if (typeof project[key] === 'string' && key !== 'poster' && key !== 'img16_9' && key !== 'img1_1' && key !== 'audio') {
      formHtml += '<div class="form-group"><label>' + key.toUpperCase() + '</label>' +
        '<input type="text" name="' + key + '" value="' + project[key].replace(/"/g,'&quot;') + '" class="contact-input"></div>';
    }
  }
  // For images/audio, show file input
  if (cat === 'film' || cat === 'documentary' || cat === 'commercial') {
    formHtml += '<div class="form-group"><label>Poster</label><input type="file" name="poster" class="file-input"></div>';
  } else if (cat === 'libraries') {
    formHtml += '<div class="form-group"><label>Immagine 16:9</label><input type="file" name="img16_9" class="file-input"></div>';
    formHtml += '<div class="form-group"><label>Immagine 1:1</label><input type="file" name="img1_1" class="file-input"></div>';
    formHtml += '<div class="form-group"><label>Audio</label><input type="file" name="audio" class="file-input"></div>';
  }
  formHtml += '<button type="submit" class="submit-btn" style="background:var(--blue-main);color:#fff;">Salva modifiche</button>';
  formHtml += '</form>';
  msg.innerHTML = formHtml;
  var form = document.getElementById('modify-project-form');
  form.onsubmit = function(e) {
    e.preventDefault();
    msg.innerHTML = '<span style="color:var(--blue-main);">Salvataggio non ancora implementato.</span>';
  };
};
// ... existing code ...

// ... existing code ...
window.deleteSelectedProject = function() {
  var cat = document.getElementById('delete-category').value;
  var list = document.getElementById('delete-project-list');
  var msg = document.getElementById('delete-message');
  if (!list.value) return;
  var idx = parseInt(list.value, 10);
  var arr = null;
  if (cat === 'film') arr = window.filmProjects;
  else if (cat === 'documentary') arr = window.documentaryProjects;
  else if (cat === 'commercial') arr = window.commercialProjects;
  else if (cat === 'libraries') arr = window.librariesProjects;
  else if (cat === 'blog') arr = window.blogArticles;
  if (!arr || !arr[idx]) { msg.textContent = 'Progetto non trovato.'; return; }
  // Remove from array
  arr.splice(idx, 1);
  msg.textContent = 'Progetto eliminato.';
  // Refresh dropdown and page
  populateDeleteProjectList();
  if (cat === 'film') renderFilm();
  else if (cat === 'documentary') renderDocumentary();
  else if (cat === 'commercial') renderCommercial();
  else if (cat === 'libraries') renderLibraries();
};

// Update modifySelectedProject to handle form submit and update the project in-place
window.modifySelectedProject = function() {
  var cat = document.getElementById('delete-category').value;
  var list = document.getElementById('delete-project-list');
  var msg = document.getElementById('delete-message');
  if (!list.value) return;
  var idx = parseInt(list.value, 10);
  var arr = null;
  if (cat === 'film') arr = window.filmProjects;
  else if (cat === 'documentary') arr = window.documentaryProjects;
  else if (cat === 'commercial') arr = window.commercialProjects;
  else if (cat === 'libraries') arr = window.librariesProjects;
  else if (cat === 'blog') arr = window.blogArticles;
  if (!arr || !arr[idx]) { msg.textContent = 'Progetto non trovato.'; return; }
  var project = arr[idx];
  // Build a form for editing
  var formHtml = '<form id="modify-project-form" class="project-form" style="margin-top:1.5rem;">';
  for (var key in project) {
    if (typeof project[key] === 'string' && key !== 'poster' && key !== 'img16_9' && key !== 'img1_1' && key !== 'audio') {
      formHtml += '<div class="form-group"><label>' + key.toUpperCase() + '</label>' +
        '<input type="text" name="' + key + '" value="' + project[key].replace(/"/g,'&quot;') + '" class="contact-input"></div>';
    }
  }
  // For images/audio, show file input
  if (cat === 'film' || cat === 'documentary' || cat === 'commercial') {
    formHtml += '<div class="form-group"><label>Poster</label><input type="file" name="poster" class="file-input"></div>';
  } else if (cat === 'libraries') {
    formHtml += '<div class="form-group"><label>Immagine 16:9</label><input type="file" name="img16_9" class="file-input"></div>';
    formHtml += '<div class="form-group"><label>Immagine 1:1</label><input type="file" name="img1_1" class="file-input"></div>';
    formHtml += '<div class="form-group"><label>Audio</label><input type="file" name="audio" class="file-input"></div>';
  }
  formHtml += '<div class="form-group"><button type="submit" class="submit-btn">Salva Modifiche</button></div>';
  formHtml += '</form>';
  msg.innerHTML = formHtml;
  var form = document.getElementById('modify-project-form');
  form.onsubmit = function(e) {
    e.preventDefault();
    // Update fields
    var formData = new FormData(form);
    for (var key in project) {
      if (typeof project[key] === 'string' && key !== 'poster' && key !== 'img16_9' && key !== 'img1_1' && key !== 'audio') {
        if (formData.has(key)) project[key] = formData.get(key);
      }
    }
    // For images/audio, just update the path if a new file is selected (simulate upload)
    if ((cat === 'film' || cat === 'documentary' || cat === 'commercial') && formData.get('poster') && formData.get('poster').name) {
      project.poster = 'images/poster/' + cat + '/' + formData.get('poster').name;
    }
    if (cat === 'libraries') {
      if (formData.get('img16_9') && formData.get('img16_9').name) project.img16_9 = 'images/poster/libraries/' + formData.get('img16_9').name;
      if (formData.get('img1_1') && formData.get('img1_1').name) project.img1_1 = 'images/poster/libraries/' + formData.get('img1_1').name;
      if (formData.get('audio') && formData.get('audio').name) project.audio = 'sounds/' + formData.get('audio').name;
    }
    msg.textContent = 'Progetto aggiornato.';
    // Refresh dropdown and page
    populateDeleteProjectList();
    if (cat === 'film') renderFilm();
    else if (cat === 'documentary') renderDocumentary();
    else if (cat === 'commercial') renderCommercial();
    else if (cat === 'libraries') renderLibraries();
  };
};
// ... existing code ...