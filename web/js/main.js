// Fichier principal - Initialisation et coordination de l'application

// Configuration globale
window.GAME_VERSION = '1.0.0';
window.DEBUG_MODE = false;

// Variables globales pour les gestionnaires
let gameManager;
let uiManager;
let cardManager;
let dragDropManager;
let animationManager;

// === FONCTION DE NOTIFICATION GLOBALE (DISPONIBLE IMMÉDIATEMENT) ===

function showNotification(message, type = 'info') {
    // Version simple pour l'initialisation
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Essayer d'utiliser le système de notification s'il est disponible
    try {
        const overlay = document.getElementById('notification-overlay');
        const notification = document.getElementById('notification');
        const text = document.getElementById('notification-text');
        
        if (overlay && notification && text) {
            // Configurer la notification
            text.textContent = message;
            notification.className = `notification ${type}`;
            
            // Icônes selon le type
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            const iconElement = notification.querySelector('.notification-icon');
            if (iconElement) {
                iconElement.textContent = icons[type] || icons.info;
            }
            
            // Afficher
            overlay.classList.remove('hidden');
            notification.classList.add('notification-enter');
            
            // Masquer automatiquement
            setTimeout(() => {
                notification.classList.remove('notification-enter');
                notification.classList.add('notification-exit');
                
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    notification.classList.remove('notification-exit');
                }, 300);
            }, 3000);
        }
    } catch (error) {
        // Fallback vers console si erreur
        console.log(`[NOTIFICATION ERROR] ${message}`, error);
    }
}

// === INITIALISATION PRINCIPALE ===

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Initialisation de Disney Villainous Web');
    
    try {
        initializeApplication();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showErrorModal('Erreur d\'initialisation', 'Impossible de démarrer le jeu. Veuillez recharger la page.');
    }
});

async function initializeApplication() {
    // 1. Afficher l'écran de chargement
    showLoadingScreen();
    
    // 2. Initialiser les gestionnaires dans l'ordre
    await initializeManagers();
    
    // 3. Vérifier les dépendances
    checkDependencies();
    
    // 4. Configurer les événements globaux
    setupGlobalEventListeners();
    
    // 5. Charger les ressources
    await loadGameResources();
    
    // 6. Finaliser l'initialisation
    finalizeInitialization();
    
    console.log('✅ Application initialisée avec succès');
}

async function initializeManagers() {
    console.log('🔧 Initialisation des gestionnaires...');
    
    try {
        // Ordre important : les dépendances doivent être initialisées en premier
        
        // 1. Animation Manager (pas de dépendances)
        if (typeof AnimationManager !== 'undefined') {
            animationManager = new AnimationManager();
            console.log('✅ Animation Manager initialisé');
        } else {
            console.warn('⚠️ AnimationManager non disponible');
        }
        
        // 2. Card Manager (dépend des animations)
        if (typeof CardManager !== 'undefined') {
            cardManager = new CardManager();
            console.log('✅ Card Manager initialisé');
        } else {
            console.warn('⚠️ CardManager non disponible');
        }
        
        // 3. Drag Drop Manager (dépend du card manager)
        if (typeof DragDropManager !== 'undefined') {
            dragDropManager = new DragDropManager();
            console.log('✅ Drag Drop Manager initialisé');
        } else {
            console.warn('⚠️ DragDropManager non disponible');
        }
        
        // 4. UI Manager (dépend de tous les autres)
        if (typeof UIManager !== 'undefined') {
            uiManager = new UIManager();
            console.log('✅ UI Manager initialisé');
        } else {
            console.warn('⚠️ UIManager non disponible');
        }
        
        // 5. Game Manager (gestionnaire principal)
        if (typeof GameManager !== 'undefined') {
            gameManager = new GameManager();
            console.log('✅ Game Manager initialisé');
        } else {
            console.warn('⚠️ GameManager non disponible');
        }
        
        // Permettre un délai pour l'initialisation complète
        await new Promise(resolve => setTimeout(resolve, 500));
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des gestionnaires:', error);
        showNotification('Erreur d\'initialisation des gestionnaires', 'error');
        throw error;
    }
}

function checkDependencies() {
    console.log('🔍 Vérification des dépendances...');
    
    const requiredElements = [
        'loading-screen',
        'main-menu',
        'game-setup',
        'game-interface'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('❌ Éléments HTML manquants:', missingElements);
        throw new Error(`Éléments manquants: ${missingElements.join(', ')}`);
    }
    
    // Vérifier les données de jeu
    const missingData = [];
    if (typeof window.VILLAINS === 'undefined') {
        missingData.push('VILLAINS');
    }
    if (typeof window.VILLAIN_CARDS === 'undefined') {
        missingData.push('VILLAIN_CARDS');
    }
    if (typeof window.GAME_CONFIG === 'undefined') {
        missingData.push('GAME_CONFIG');
    }
    
    if (missingData.length > 0) {
        console.error('❌ Données de jeu manquantes:', missingData);
        throw new Error(`Données de jeu manquantes: ${missingData.join(', ')}`);
    }
    
    console.log('✅ Toutes les dépendances sont présentes');
}

function setupGlobalEventListeners() {
    console.log('⚡ Configuration des événements globaux...');
    
    // Gestion des erreurs globales
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Gestion des animations
    window.addEventListener('resize', debounce(handleWindowResize, 250));
    
    // Gestion de la visibilité de la page
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Raccourcis clavier
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Gestion du mode plein écran
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    console.log('✅ Événements globaux configurés');
}

async function loadGameResources() {
    console.log('📦 Chargement des ressources...');
    
    // Simuler le chargement de ressources
    const loadingTasks = [
        loadImages(),
        loadSounds(),
        loadConfiguration(),
        validateGameData()
    ];
    
    await Promise.all(loadingTasks);
    
    console.log('✅ Ressources chargées');
}

async function loadImages() {
    // Placeholder pour le chargement d'images
    return new Promise(resolve => {
        // Dans une vraie implémentation, charger les images des cartes, icônes, etc.
        setTimeout(resolve, 200);
    });
}

async function loadSounds() {
    // Placeholder pour le chargement de sons
    return new Promise(resolve => {
        // Dans une vraie implémentation, charger les effets sonores
        setTimeout(resolve, 100);
    });
}

async function loadConfiguration() {
    // Charger la configuration depuis localStorage ou serveur
    try {
        const savedConfig = localStorage.getItem('villainous_config');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            Object.assign(GAME_CONFIG, config);
        }
    } catch (error) {
        console.warn('Impossible de charger la configuration sauvegardée:', error);
    }
}

async function validateGameData() {
    // Valider l'intégrité des données de jeu
    const villainCount = Object.keys(VILLAINS).length;
    const cardCount = Object.keys(VILLAIN_CARDS).reduce((total, villain) => 
        total + VILLAIN_CARDS[villain].length, 0);
    
    console.log(`📊 ${villainCount} méchants, ${cardCount} cartes chargées`);
    
    if (villainCount < 3) {
        throw new Error('Pas assez de méchants disponibles');
    }
}

function finalizeInitialization() {
    // Masquer l'écran de chargement
    hideLoadingScreen();
    
    // Afficher le menu principal
    setTimeout(() => {
        if (window.uiManager && typeof uiManager.showMainMenu === 'function') {
            uiManager.showMainMenu();
        } else {
            // Fallback : afficher manuellement le menu principal
            console.warn('⚠️ UIManager non disponible, affichage manuel du menu');
            const loadingScreen = document.getElementById('loading-screen');
            const mainMenu = document.getElementById('main-menu');
            
            if (loadingScreen) loadingScreen.classList.add('hidden');
            if (mainMenu) mainMenu.classList.remove('hidden');
        }
    }, 500);
    
    // Afficher la version en mode debug
    if (window.DEBUG_MODE) {
        console.log(`🐛 Mode debug activé - Version ${window.GAME_VERSION}`);
        displayDebugInfo();
    }
    
    // Confirmer l'initialisation réussie
    showNotification('Application initialisée avec succès !', 'success');
}

// === GESTION DES ÉVÉNEMENTS GLOBAUX ===

function handleGlobalError(event) {
    console.error('Erreur globale:', event.error);
    
    showNotification('Une erreur est survenue', 'error');
    
    // En production, envoyer l'erreur à un service de monitoring
    if (!window.DEBUG_MODE) {
        // sendErrorToMonitoring(event.error);
    }
}

function handleUnhandledRejection(event) {
    console.error('Promise rejetée non gérée:', event.reason);
    
    showNotification('Erreur de traitement', 'error');
    
    event.preventDefault(); // Empêcher l'affichage dans la console du navigateur
}

function handleWindowResize() {
    // Redimensionner le canvas d'animation
    if (window.animationManager && animationManager.resizeCanvas) {
        animationManager.resizeCanvas();
    }
    
    // Recalculer la mise en page si nécessaire
    if (window.uiManager && window.gameManager && 
        uiManager.currentScreen === 'game-interface') {
        const currentPlayer = gameManager.getCurrentPlayer();
        if (currentPlayer) {
            uiManager.updateBoard(currentPlayer);
        }
    }
}

function handleVisibilityChange() {
    if (document.hidden) {
        // Page cachée - pauser les animations
        if (window.animationManager && animationManager.pauseAnimations) {
            animationManager.pauseAnimations();
        }
    } else {
        // Page visible - reprendre les animations
        if (window.animationManager && animationManager.resumeAnimations) {
            animationManager.resumeAnimations();
        }
    }
}

function handleKeyboardShortcuts(event) {
    // Empêcher les raccourcis pendant la saisie
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (event.key) {
        case 'Escape':
            handleEscapeKey();
            break;
            
        case 'F11':
            event.preventDefault();
            toggleFullscreen();
            break;
            
        case 's':
            if (event.ctrlKey) {
                event.preventDefault();
                saveGame();
            }
            break;
            
        case 'l':
            if (event.ctrlKey) {
                event.preventDefault();
                loadGame();
            }
            break;
            
        case 'r':
            if (event.ctrlKey && event.shiftKey) {
                event.preventDefault();
                resetGame();
            }
            break;
            
        case 'h':
            if (event.ctrlKey) {
                event.preventDefault();
                showHelp();
            }
            break;
    }
}

function handleEscapeKey() {
    // Fermer les modals ouverts
    const openModals = document.querySelectorAll('.modal:not(.hidden)');
    if (openModals.length > 0) {
        const lastModal = openModals[openModals.length - 1];
        uiManager.closeModal(lastModal.id);
        return;
    }
    
    // Afficher le menu de pause si en jeu
    if (gameManager && gameManager.gameState === 'playing') {
        showPauseMenu();
    }
}

function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement !== null;
    
    if (isFullscreen) {
        document.body.classList.add('fullscreen-mode');
        showNotification('Mode plein écran activé', 'info');
    } else {
        document.body.classList.remove('fullscreen-mode');
    }
}

// === FONCTIONS UTILITAIRES ===

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('animate-fade-out');
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            loadingScreen.classList.remove('animate-fade-out');
        }, 500);
    }
}

function showErrorModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'modal error-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="error-header">
                <h2>❌ ${title}</h2>
            </div>
            <div class="error-message">
                <p>${message}</p>
            </div>
            <div class="error-actions">
                <button onclick="location.reload()" class="btn primary">Recharger</button>
                <button onclick="this.closest('.modal').remove()" class="btn secondary">Fermer</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}

function showPauseMenu() {
    // Créer ou afficher le menu de pause
    let pauseModal = document.getElementById('pause-modal');
    
    if (!pauseModal) {
        pauseModal = createPauseModal();
        document.body.appendChild(pauseModal);
    }
    
    pauseModal.classList.remove('hidden');
}

function createPauseModal() {
    const modal = document.createElement('div');
    modal.id = 'pause-modal';
    modal.className = 'modal pause-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="pause-header">
                <h2>⏸️ Jeu en pause</h2>
            </div>
            <div class="pause-actions">
                <button onclick="resumeGame()" class="btn primary">Reprendre</button>
                <button onclick="saveGame()" class="btn secondary">Sauvegarder</button>
                <button onclick="showSettings()" class="btn secondary">Paramètres</button>
                <button onclick="confirmQuitGame()" class="btn danger">Quitter</button>
            </div>
            <div class="pause-shortcuts">
                <h3>Raccourcis clavier :</h3>
                <ul>
                    <li><kbd>Échap</kbd> - Menu pause</li>
                    <li><kbd>Ctrl+S</kbd> - Sauvegarder</li>
                    <li><kbd>Ctrl+L</kbd> - Charger</li>
                    <li><kbd>F11</kbd> - Plein écran</li>
                </ul>
            </div>
        </div>
    `;
    
    return modal;
}

function resumeGame() {
    const pauseModal = document.getElementById('pause-modal');
    if (pauseModal) {
        pauseModal.classList.add('hidden');
    }
}

function saveGame() {
    if (gameManager) {
        gameManager.saveGameState();
    }
}

function loadGame() {
    if (gameManager) {
        const success = gameManager.loadGameState();
        if (success) {
            uiManager.showGameInterface();
        }
    }
}

function resetGame() {
    if (confirm('Êtes-vous sûr de vouloir recommencer ? Le progrès actuel sera perdu.')) {
        if (gameManager) {
            gameManager.newGame();
        }
    }
}

function showHelp() {
    uiManager.showModal('rules-modal');
}

function showSettings() {
    // Créer ou afficher le modal des paramètres
    showNotification('Paramètres en développement...', 'info');
}

function confirmQuitGame() {
    if (confirm('Êtes-vous sûr de vouloir quitter ? Le progrès non sauvegardé sera perdu.')) {
        if (gameManager) {
            gameManager.backToMenu();
        }
        
        const pauseModal = document.getElementById('pause-modal');
        if (pauseModal) {
            pauseModal.classList.add('hidden');
        }
    }
}

function displayDebugInfo() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.position = 'fixed';
    debugPanel.style.top = '10px';
    debugPanel.style.right = '10px';
    debugPanel.style.background = 'rgba(0,0,0,0.8)';
    debugPanel.style.color = 'white';
    debugPanel.style.padding = '10px';
    debugPanel.style.borderRadius = '5px';
    debugPanel.style.fontSize = '12px';
    debugPanel.style.zIndex = '99999';
    debugPanel.style.fontFamily = 'monospace';
    
    debugPanel.innerHTML = `
        <div>🐛 Debug Mode</div>
        <div>Version: ${window.GAME_VERSION}</div>
        <div>Managers: ${getManagerStatus()}</div>
        <div>Performance: <span id="debug-fps">--</span> FPS</div>
    `;
    
    document.body.appendChild(debugPanel);
    
    // Mise à jour du FPS
    startFPSMonitoring();
}

function getManagerStatus() {
    const managers = {
        game: !!gameManager,
        ui: !!uiManager,
        card: !!cardManager,
        drag: !!dragDropManager,
        anim: !!animationManager
    };
    
    return Object.entries(managers)
        .map(([name, status]) => `${name}:${status ? '✅' : '❌'}`)
        .join(' ');
}

function startFPSMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    function updateFPS() {
        const currentTime = performance.now();
        frameCount++;
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            const fpsElement = document.getElementById('debug-fps');
            if (fpsElement) {
                fpsElement.textContent = fps;
                fpsElement.style.color = fps >= 30 ? '#0f0' : fps >= 15 ? '#ff0' : '#f00';
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    updateFPS();
}

// === FONCTIONS UTILITAIRES GÉNÉRIQUES ===

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function generateUniqueId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// === EXPORT POUR LES TESTS ===

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApplication,
        initializeManagers,
        checkDependencies,
        debounce,
        throttle,
        generateUniqueId,
        formatTime
    };
}

// Exposer les fonctions principales globalement pour les autres modules
window.villainousApp = {
    saveGame,
    loadGame,
    resetGame,
    showHelp,
    toggleFullscreen,
    resumeGame
};

console.log('📜 Module principal chargé');