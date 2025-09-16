// Version simplifiée de main.js pour debug

console.log('🚀 Main.js chargé');

// Configuration globale
window.GAME_VERSION = '1.0.0';
window.DEBUG_MODE = true;

// Variables globales
let gameManager;
let uiManager;
let cardManager;
let dragDropManager;
let animationManager;

// Fonction de notification simple
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    try {
        const overlay = document.getElementById('notification-overlay');
        const notification = document.getElementById('notification');
        const text = document.getElementById('notification-text');
        
        if (overlay && notification && text) {
            text.textContent = message;
            notification.className = `notification ${type}`;
            
            const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
            const iconElement = notification.querySelector('.notification-icon');
            if (iconElement) {
                iconElement.textContent = icons[type] || icons.info;
            }
            
            overlay.classList.remove('hidden');
            notification.classList.add('notification-enter');
            
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
        console.log(`[NOTIFICATION ERROR] ${message}`, error);
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 DOM chargé, initialisation...');
    
    setTimeout(() => {
        try {
            initializeApplication();
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            showNotification('Erreur d\'initialisation', 'error');
            showErrorFallback();
        }
    }, 100);
});

function initializeApplication() {
    console.log('🔧 Début de l\'initialisation');
    
    // Étape 1: Vérifier les dépendances de base
    if (!checkBasicDependencies()) {
        throw new Error('Dépendances de base manquantes');
    }
    
    // Étape 2: Initialiser les gestionnaires
    initializeManagers();
    
    // Étape 3: Finaliser
    setTimeout(() => {
        finalizeInitialization();
    }, 1000);
}

function checkBasicDependencies() {
    console.log('🔍 Vérification des dépendances de base...');
    
    const requiredElements = ['loading-screen', 'main-menu'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('❌ Éléments HTML manquants:', missingElements);
        return false;
    }
    
    console.log('✅ Dépendances de base OK');
    return true;
}

function initializeManagers() {
    console.log('🔧 Initialisation des gestionnaires...');
    
    try {
        // AnimationManager
        if (typeof AnimationManager !== 'undefined') {
            animationManager = new AnimationManager();
            console.log('✅ AnimationManager initialisé');
        } else {
            console.warn('⚠️ AnimationManager non disponible');
        }
        
        // CardManager
        if (typeof CardManager !== 'undefined') {
            cardManager = new CardManager();
            console.log('✅ CardManager initialisé');
        } else {
            console.warn('⚠️ CardManager non disponible');
        }
        
        // DragDropManager
        if (typeof DragDropManager !== 'undefined') {
            dragDropManager = new DragDropManager();
            console.log('✅ DragDropManager initialisé');
        } else {
            console.warn('⚠️ DragDropManager non disponible');
        }
        
        // UIManager
        if (typeof UIManager !== 'undefined') {
            uiManager = new UIManager();
            console.log('✅ UIManager initialisé');
        } else {
            console.warn('⚠️ UIManager non disponible');
        }
        
        // GameManager
        if (typeof GameManager !== 'undefined') {
            gameManager = new GameManager();
            console.log('✅ GameManager initialisé');
        } else {
            console.warn('⚠️ GameManager non disponible');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des gestionnaires:', error);
        throw error;
    }
}

function finalizeInitialization() {
    console.log('🎯 Finalisation de l\'initialisation...');
    
    try {
        // Masquer l'écran de chargement
        const loadingScreen = document.getElementById('loading-screen');
        const mainMenu = document.getElementById('main-menu');
        
        if (loadingScreen) {
            loadingScreen.style.transition = 'opacity 0.5s ease';
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                console.log('✅ Écran de chargement masqué');
            }, 500);
        }
        
        // Afficher le menu principal
        if (mainMenu) {
            setTimeout(() => {
                if (uiManager && typeof uiManager.showMainMenu === 'function') {
                    uiManager.showMainMenu();
                } else {
                    mainMenu.classList.remove('hidden');
                }
                console.log('✅ Menu principal affiché');
                showNotification('Application initialisée avec succès !', 'success');
            }, 600);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la finalisation:', error);
        showErrorFallback();
    }
}

function showErrorFallback() {
    console.log('🚨 Affichage de l\'interface de fallback...');
    
    // Masquer l'écran de chargement et afficher le menu de base
    const loadingScreen = document.getElementById('loading-screen');
    const mainMenu = document.getElementById('main-menu');
    
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (mainMenu) {
        mainMenu.classList.remove('hidden');
        mainMenu.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h1>🏰 Disney Villainous</h1>
                <p style="color: #ff6b6b;">Erreur de chargement de l'application</p>
                <p>Vérifiez la console du navigateur pour plus de détails</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin: 10px; border: none; border-radius: 5px; background: #4a90e2; color: white; cursor: pointer;">
                    Recharger la page
                </button>
            </div>
        `;
    }
}

// Fonctions utilitaires globales
function showGameSetup() {
    if (uiManager && typeof uiManager.showGameSetup === 'function') {
        uiManager.showGameSetup();
    } else {
        showNotification('Interface de configuration en cours de chargement...', 'info');
    }
}

function showMainMenu() {
    if (uiManager && typeof uiManager.showMainMenu === 'function') {
        uiManager.showMainMenu();
    } else {
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.classList.remove('hidden');
    }
}

function showRules() {
    showNotification('Règles du jeu en développement...', 'info');
}

function showCredits() {
    showNotification('Crédits en développement...', 'info');
}

function startGame() {
    if (gameManager && uiManager) {
        showNotification('Démarrage du jeu...', 'info');
    } else {
        showNotification('Jeu en cours de chargement...', 'warning');
    }
}

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('❌ Erreur JavaScript:', event.error);
    showNotification('Une erreur est survenue', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rejetée:', event.reason);
    showNotification('Erreur de traitement', 'error');
    event.preventDefault();
});

console.log('✅ Main.js initialisé');