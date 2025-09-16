// Gestionnaire d'animations pour les plateaux Disney Villainous
// Basé sur l'apparence des plateaux officiels

class VillainBoardAnimations {
    constructor() {
        this.currentBoard = null;
        this.transitionDuration = 800;
        this.locationEffects = new Map();
        
        this.setupBoardEffects();
    }
    
    setupBoardEffects() {
        // Configuration des effets par méchant
        this.villainEffects = {
            'captain_hook': {
                theme: 'pirate',
                particles: '🌊⚓🏴‍☠️',
                sounds: ['wave', 'sword'],
                ambientColor: '#2C5F41'
            },
            'maleficent': {
                theme: 'dark_magic',
                particles: '✨🔮💜',
                sounds: ['magic', 'thunder'],
                ambientColor: '#4A0E4E'
            },
            'jafar': {
                theme: 'oriental',
                particles: '🌟🕌💎',
                sounds: ['genie', 'sand'],
                ambientColor: '#8B4513'
            },
            'queen_hearts': {
                theme: 'cards',
                particles: '♠️♥️♦️♣️',
                sounds: ['card_flip', 'royal'],
                ambientColor: '#DC143C'
            },
            'prince_john': {
                theme: 'royal',
                particles: '👑💰🏰',
                sounds: ['coin', 'fanfare'],
                ambientColor: '#4B0082'
            }
        };
    }
    
    // === TRANSITION ENTRE PLATEAUX ===
    
    switchToVillainBoard(villainId, boardElement) {
        return new Promise((resolve) => {
            // Sortie du plateau actuel
            if (this.currentBoard) {
                this.animateBoardExit(this.currentBoard).then(() => {
                    // Entrée du nouveau plateau
                    this.currentBoard = boardElement;
                    this.animateBoardEntrance(villainId, boardElement).then(resolve);
                });
            } else {
                // Premier plateau
                this.currentBoard = boardElement;
                this.animateBoardEntrance(villainId, boardElement).then(resolve);
            }
        });
    }
    
    animateBoardExit(boardElement) {
        return new Promise((resolve) => {
            boardElement.classList.add('board-transition-exit');
            
            setTimeout(() => {
                boardElement.style.display = 'none';
                boardElement.classList.remove('board-transition-exit');
                resolve();
            }, 500);
        });
    }
    
    animateBoardEntrance(villainId, boardElement) {
        return new Promise((resolve) => {
            // Appliquer le thème du méchant
            this.applyVillainTheme(villainId, boardElement);
            
            // Afficher et animer
            boardElement.style.display = 'grid';
            boardElement.classList.add('board-transition-enter');
            
            // Animer chaque lieu avec un délai
            const locations = boardElement.querySelectorAll('.location');
            locations.forEach((location, index) => {
                setTimeout(() => {
                    this.animateLocationEntrance(location, villainId);
                }, index * 150);
            });
            
            setTimeout(() => {
                boardElement.classList.remove('board-transition-enter');
                this.startAmbientEffects(villainId, boardElement);
                resolve();
            }, this.transitionDuration);
        });
    }
    
    // === THÈMES VISUELS ===
    
    applyVillainTheme(villainId, boardElement) {
        // Nettoyer les classes précédentes
        boardElement.className = 'villain-board';
        
        // Appliquer la nouvelle classe thématique
        const themeClass = villainId.replace('_', '-');
        boardElement.classList.add(themeClass);
        
        // Mettre à jour les couleurs CSS
        const effects = this.villainEffects[villainId];
        if (effects) {
            boardElement.style.setProperty('--current-theme-color', effects.ambientColor);
        }
    }
    
    // === ANIMATIONS DES LIEUX ===
    
    animateLocationEntrance(locationElement, villainId) {
        locationElement.style.opacity = '0';
        locationElement.style.transform = 'translateY(30px) scale(0.8)';
        
        setTimeout(() => {
            locationElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            locationElement.style.opacity = '1';
            locationElement.style.transform = 'translateY(0) scale(1)';
            
            // Effet de particules à l'arrivée
            this.createLocationParticles(locationElement, villainId);
        }, 50);
    }
    
    highlightCurrentLocation(locationElement, villainId) {
        // Retirer la surbrillance des autres lieux
        document.querySelectorAll('.location.current-location')
            .forEach(loc => loc.classList.remove('current-location'));
        
        // Ajouter la surbrillance au lieu actuel
        locationElement.classList.add('current-location');
        
        // Animation spéciale d'arrivée
        this.playLocationArrivalAnimation(locationElement, villainId);
        
        // Effets sonores
        this.playThemeSound(villainId, 'location_enter');
    }
    
    playLocationArrivalAnimation(locationElement, villainId) {
        const effects = this.villainEffects[villainId];
        
        // Créer une onde d'énergie
        const ripple = document.createElement('div');
        ripple.className = 'location-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, ${effects.ambientColor}40 0%, transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1000;
        `;
        
        locationElement.appendChild(ripple);
        
        // Animation de l'onde
        ripple.animate([
            { width: '0px', height: '0px', opacity: 1 },
            { width: '200px', height: '200px', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
        
        // Particules thématiques
        this.createThematicParticles(locationElement, villainId);
    }
    
    // === SYSTÈME DE PARTICULES ===
    
    createLocationParticles(locationElement, villainId) {
        const effects = this.villainEffects[villainId];
        const particles = effects.particles.split('');
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createSingleParticle(
                    locationElement, 
                    particles[Math.floor(Math.random() * particles.length)]
                );
            }, i * 200);
        }
    }
    
    createThematicParticles(locationElement, villainId) {
        const effects = this.villainEffects[villainId];
        const particles = effects.particles.split('');
        const rect = locationElement.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createFloatingParticle(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    particles[Math.floor(Math.random() * particles.length)],
                    effects.ambientColor
                );
            }, i * 100);
        }
    }
    
    createSingleParticle(container, emoji) {
        const particle = document.createElement('div');
        particle.textContent = emoji;
        particle.style.cssText = `
            position: absolute;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            font-size: ${12 + Math.random() * 8}px;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
        `;
        
        container.appendChild(particle);
        
        // Animation de particule
        particle.animate([
            { 
                opacity: 0, 
                transform: 'translateY(0px) scale(0.5)' 
            },
            { 
                opacity: 1, 
                transform: 'translateY(-20px) scale(1)' 
            },
            { 
                opacity: 0, 
                transform: 'translateY(-40px) scale(0.5)' 
            }
        ], {
            duration: 2000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
    
    createFloatingParticle(x, y, emoji, color) {
        const particle = document.createElement('div');
        particle.textContent = emoji;
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 10000;
            filter: drop-shadow(0 0 10px ${color});
        `;
        
        document.body.appendChild(particle);
        
        // Trajectoire aléatoire
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;
        
        particle.animate([
            { 
                opacity: 1, 
                transform: 'translate(-50%, -50%) scale(0.5) rotate(0deg)' 
            },
            { 
                opacity: 1, 
                transform: `translate(${endX - x - 10}px, ${endY - y - 10}px) scale(1) rotate(360deg)` 
            },
            { 
                opacity: 0, 
                transform: `translate(${endX - x - 10}px, ${endY - y - 30}px) scale(0.3) rotate(720deg)` 
            }
        ], {
            duration: 3000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => particle.remove();
    }
    
    // === EFFETS AMBIANTS ===
    
    startAmbientEffects(villainId, boardElement) {
        // Arrêter les effets précédents
        this.stopAmbientEffects();
        
        // Commencer les nouveaux effets
        this.ambientInterval = setInterval(() => {
            this.createAmbientEffect(villainId, boardElement);
        }, 5000 + Math.random() * 5000);
    }
    
    stopAmbientEffects() {
        if (this.ambientInterval) {
            clearInterval(this.ambientInterval);
            this.ambientInterval = null;
        }
    }
    
    createAmbientEffect(villainId, boardElement) {
        const effects = this.villainEffects[villainId];
        const locations = boardElement.querySelectorAll('.location');
        
        if (locations.length > 0) {
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            
            // Effet visuel subtil
            this.addTemporaryEffect(randomLocation, effects.theme);
            
            // Particule occasionnelle
            if (Math.random() < 0.3) {
                this.createLocationParticles(randomLocation, villainId);
            }
        }
    }
    
    addTemporaryEffect(element, theme) {
        const effectClass = `${theme}-effect`;
        element.classList.add(effectClass);
        
        setTimeout(() => {
            element.classList.remove(effectClass);
        }, 2000);
    }
    
    // === SONS THÉMATIQUES ===
    
    playThemeSound(villainId, action) {
        // Système de sons (à implémenter avec Web Audio API)
        console.log(`🔊 Playing ${villainId} ${action} sound`);
    }
    
    // === API PUBLIQUE ===
    
    animateActionFeedback(locationElement, actionType, success = true) {
        const feedbackClass = success ? 'action-success' : 'action-failure';
        locationElement.classList.add(feedbackClass);
        
        setTimeout(() => {
            locationElement.classList.remove(feedbackClass);
        }, 1000);
        
        if (success) {
            this.createSuccessParticles(locationElement);
        }
    }
    
    createSuccessParticles(element) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createSingleParticle(element, '✨');
            }, i * 100);
        }
    }
    
    cleanup() {
        this.stopAmbientEffects();
        this.locationEffects.clear();
    }
}

// Instance globale
let villainBoardAnimations;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    villainBoardAnimations = new VillainBoardAnimations();
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VillainBoardAnimations;
}