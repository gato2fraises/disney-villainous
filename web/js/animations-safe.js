// Version corrigée et simplifiée d'AnimationManager

class AnimationManager {
    constructor() {
        console.log('🎬 AnimationManager: Initialisation...');
        
        this.isAnimating = false;
        this.isPaused = false;
        this.animationQueue = [];
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        
        // Configuration des animations
        this.config = {
            cardAnimation: {
                duration: 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            },
            powerGain: {
                duration: 800,
                particles: 5
            },
            victory: {
                duration: 3000,
                fireworks: 8
            }
        };
        
        // Initialiser de manière sécurisée
        this.initSafely();
    }
    
    initSafely() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupAnimationCanvas());
            } else {
                this.setupAnimationCanvas();
            }
            this.setupEventListeners();
            console.log('✅ AnimationManager: Initialisé avec succès');
        } catch (error) {
            console.warn('⚠️ AnimationManager: Initialisation partielle:', error.message);
        }
    }
    
    setupAnimationCanvas() {
        try {
            if (!document.body) {
                console.warn('⚠️ AnimationManager: document.body non disponible, retry...');
                setTimeout(() => this.setupAnimationCanvas(), 100);
                return;
            }
            
            // Créer un canvas pour les effets de particules
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'animation-canvas';
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '9999';
            this.canvas.style.display = 'none';
            
            document.body.appendChild(this.canvas);
            
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            
            console.log('✅ AnimationManager: Canvas créé');
        } catch (error) {
            console.warn('⚠️ AnimationManager: Erreur création canvas:', error.message);
        }
    }
    
    setupEventListeners() {
        try {
            window.addEventListener('resize', () => this.resizeCanvas());
        } catch (error) {
            console.warn('⚠️ AnimationManager: Erreur event listeners:', error.message);
        }
    }
    
    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }
    
    // === MÉTHODES DE CONTRÔLE ===
    
    pauseAnimations() {
        this.isPaused = true;
    }
    
    resumeAnimations() {
        this.isPaused = false;
    }
    
    // === ANIMATIONS SIMPLIFIÉES ===
    
    playCardAnimation(card) {
        console.log(`🎴 Animation carte: ${card?.name || 'inconnue'}`);
        
        if (!card || !card.name) return;
        
        const cardElement = document.querySelector(`[data-card-name="${card.name}"]`);
        if (!cardElement) {
            console.warn('⚠️ Élément carte non trouvé:', card.name);
            return;
        }
        
        try {
            cardElement.classList.add('animate-card-play');
            this.addSparkleEffect(cardElement);
            this.playSound('card-play');
            
            setTimeout(() => {
                cardElement.classList.remove('animate-card-play');
            }, this.config.cardAnimation.duration);
        } catch (error) {
            console.warn('⚠️ Erreur animation carte:', error.message);
        }
    }
    
    playDrawCardAnimation(cards) {
        console.log(`🃏 Animation pioche: ${cards?.length || 0} cartes`);
        
        if (!cards || !Array.isArray(cards)) return;
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                this.animateCardDraw(card, index);
            }, index * 100);
        });
    }
    
    animateCardDraw(card, index) {
        console.log(`📤 Animation pioche carte ${index + 1}`);
        // Animation simplifiée pour éviter les erreurs
    }
    
    playPowerGainAnimation(amount) {
        console.log(`⚡ Animation pouvoir: +${amount}`);
        
        try {
            const powerElement = document.getElementById('player-power');
            if (powerElement) {
                powerElement.classList.add('animate-power-gain');
                this.addPulseEffect(powerElement);
                
                setTimeout(() => {
                    powerElement.classList.remove('animate-power-gain');
                }, this.config.powerGain.duration);
            }
            
            this.playSound('power-gain');
        } catch (error) {
            console.warn('⚠️ Erreur animation pouvoir:', error.message);
        }
    }
    
    playDefeatAnimation(hero) {
        console.log(`⚔️ Animation défaite: ${hero?.name || 'héros'}`);
        
        if (!hero || !hero.name) return;
        
        try {
            const heroElement = document.querySelector(`[data-hero-name="${hero.name}"]`);
            if (heroElement) {
                heroElement.classList.add('animate-defeat');
                this.createExplosionEffect(heroElement);
                
                setTimeout(() => {
                    heroElement.style.display = 'none';
                }, 800);
            }
            
            this.playSound('defeat');
        } catch (error) {
            console.warn('⚠️ Erreur animation défaite:', error.message);
        }
    }
    
    playVictoryAnimation(winner) {
        console.log(`🎉 Animation victoire: ${winner?.name || 'joueur'}`);
        
        try {
            if (this.canvas) {
                this.canvas.style.display = 'block';
                this.createFireworks();
                this.createConfetti();
                
                setTimeout(() => {
                    this.canvas.style.display = 'none';
                }, this.config.victory.duration);
            }
            
            if (winner) {
                this.animateVictoryText(winner);
            }
            
            this.playSound('victory');
        } catch (error) {
            console.warn('⚠️ Erreur animation victoire:', error.message);
        }
    }
    
    playDiscardAnimation(card) {
        console.log(`🗑️ Animation défausse: ${card?.name || 'carte'}`);
        
        if (!card || !card.name) return;
        
        try {
            const cardElement = document.querySelector(`[data-card-name="${card.name}"]`);
            if (cardElement) {
                cardElement.classList.add('animate-card-discard');
                
                setTimeout(() => {
                    cardElement.style.display = 'none';
                }, this.config.cardAnimation.duration);
            }
        } catch (error) {
            console.warn('⚠️ Erreur animation défausse:', error.message);
        }
    }
    
    playShuffleAnimation() {
        console.log('🔀 Animation mélange');
        
        try {
            const deckElement = document.getElementById('deck-pile');
            if (deckElement) {
                deckElement.classList.add('animate-shuffle');
                
                setTimeout(() => {
                    deckElement.classList.remove('animate-shuffle');
                }, 1000);
            }
            
            this.playSound('shuffle');
        } catch (error) {
            console.warn('⚠️ Erreur animation mélange:', error.message);
        }
    }
    
    // === EFFETS SIMPLIFIÉS ===
    
    addSparkleEffect(element) {
        if (element) {
            element.classList.add('sparkle-effect');
            setTimeout(() => {
                element.classList.remove('sparkle-effect');
            }, 1000);
        }
    }
    
    addPulseEffect(element) {
        if (element) {
            element.classList.add('pulse-effect');
            setTimeout(() => {
                element.classList.remove('pulse-effect');
            }, 1500);
        }
    }
    
    addGlowEffect(element, color = '#FFD700') {
        if (element) {
            element.style.boxShadow = `0 0 20px ${color}`;
            element.style.transition = 'box-shadow 0.3s ease';
            
            setTimeout(() => {
                element.style.boxShadow = '';
            }, 1000);
        }
    }
    
    // === ANIMATIONS DE DRAG & DROP ===
    
    animateDragStart(element) {
        if (element) {
            element.classList.add('animate-drag-start');
            this.addGlowEffect(element, '#00FF88');
        }
    }
    
    animateDragEnd(element) {
        if (element) {
            element.classList.remove('animate-drag-start');
        }
    }
    
    animateDropSuccess(element) {
        if (element) {
            element.classList.add('animate-drop-success');
            setTimeout(() => {
                element.classList.remove('animate-drop-success');
            }, 600);
        }
    }
    
    animateDropFail(element) {
        if (element) {
            element.classList.add('animate-drop-fail');
            setTimeout(() => {
                element.classList.remove('animate-drop-fail');
            }, 400);
        }
    }
    
    // === EFFETS DE PARTICULES SIMPLIFIÉS ===
    
    createExplosionEffect(element) {
        console.log('💥 Effet d\'explosion');
        // Version simplifiée sans canvas complexe
    }
    
    createFireworks() {
        console.log('🎆 Feux d\'artifice');
        // Version simplifiée
    }
    
    createConfetti() {
        console.log('🎊 Confettis');
        // Version simplifiée
    }
    
    animateVictoryText(winner) {
        try {
            const textElement = document.createElement('div');
            textElement.className = 'victory-text-animation';
            textElement.textContent = `${winner.name} Wins!`;
            textElement.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                font-size: 4rem;
                font-weight: bold;
                color: #FFD700;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                z-index: 10000;
                animation: victoryTextBounce 2s ease-out;
            `;
            
            document.body.appendChild(textElement);
            
            setTimeout(() => {
                if (document.body.contains(textElement)) {
                    document.body.removeChild(textElement);
                }
            }, 2000);
        } catch (error) {
            console.warn('⚠️ Erreur texte victoire:', error.message);
        }
    }
    
    // === SONS (STUBS SÉCURISÉS) ===
    
    playSound(soundName) {
        console.log(`🔊 Son: ${soundName}`);
        // Placeholder sécurisé pour les effets sonores
    }
    
    // === UTILITAIRES ===
    
    createFloatingText(text, x, y, color = '#FFD700') {
        try {
            const floatingText = document.createElement('div');
            floatingText.textContent = text;
            floatingText.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                color: ${color};
                font-size: 24px;
                font-weight: bold;
                pointer-events: none;
                z-index: 9999;
                animation: floatingText 2s ease-out forwards;
            `;
            
            document.body.appendChild(floatingText);
            
            setTimeout(() => {
                if (document.body.contains(floatingText)) {
                    document.body.removeChild(floatingText);
                }
            }, 2000);
        } catch (error) {
            console.warn('⚠️ Erreur texte flottant:', error.message);
        }
    }
}

console.log('✅ animations-safe.js chargé');