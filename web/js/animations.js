// Gestionnaire des animations et effets visuels

class AnimationManager {
    constructor() {
        this.isAnimating = false;
        this.isPaused = false;
        this.animationQueue = [];
        this.particles = [];
        
        this.setupAnimationCanvas();
        this.setupEventListeners();
        
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
    }
    
    setupAnimationCanvas() {
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
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // === ANIMATIONS DE CARTES ===
    
    playCardAnimation(card) {
        const cardElement = document.querySelector(`[data-card-name="${card.name}"]`);
        if (!cardElement) return;
        
        // Animation de la carte jouée
        cardElement.classList.add('animate-card-play');
        
        // Effet de brillance
        this.addSparkleEffect(cardElement);
        
        // Son et feedback
        this.playSound('card-play');
        
        setTimeout(() => {
            cardElement.classList.remove('animate-card-play');
        }, this.config.cardAnimation.duration);
    }
    
    playDrawCardAnimation(cards) {
        cards.forEach((card, index) => {
            setTimeout(() => {
                this.animateCardDraw(card, index);
            }, index * 100);
        });
    }
    
    animateCardDraw(card, index) {
        // Créer un élément temporaire pour l'animation
        const tempCard = this.createTempCardElement();
        document.body.appendChild(tempCard);
        
        // Position de départ (deck)
        const deckPosition = this.getDeckPosition();
        tempCard.style.left = deckPosition.x + 'px';
        tempCard.style.top = deckPosition.y + 'px';
        
        // Animation vers la main
        setTimeout(() => {
            const handPosition = this.getHandPosition(index);
            tempCard.style.transform = `translate(${handPosition.x - deckPosition.x}px, ${handPosition.y - deckPosition.y}px)`;
            tempCard.classList.add('animate-card-draw');
        }, 50);
        
        // Nettoyer après l'animation
        setTimeout(() => {
            document.body.removeChild(tempCard);
        }, this.config.cardAnimation.duration);
    }
    
    playDiscardAnimation(card) {
        const cardElement = document.querySelector(`[data-card-name="${card.name}"]`);
        if (!cardElement) return;
        
        cardElement.classList.add('animate-card-discard');
        
        setTimeout(() => {
            cardElement.style.display = 'none';
        }, this.config.cardAnimation.duration);
    }
    
    playShuffleAnimation() {
        // Animation de mélange des cartes
        const deckElement = document.getElementById('deck-pile');
        if (deckElement) {
            deckElement.classList.add('animate-shuffle');
            
            setTimeout(() => {
                deckElement.classList.remove('animate-shuffle');
            }, 1000);
        }
        
        this.playSound('shuffle');
    }
    
    // === ANIMATIONS DE POUVOIR ===
    
    playPowerGainAnimation(amount) {
        const powerElement = document.getElementById('player-power');
        if (!powerElement) return;
        
        // Animation du nombre
        powerElement.classList.add('animate-power-gain');
        
        // Créer des particules
        this.createPowerParticles(powerElement, amount);
        
        // Effet de pulsation
        this.addPulseEffect(powerElement);
        
        this.playSound('power-gain');
        
        setTimeout(() => {
            powerElement.classList.remove('animate-power-gain');
        }, this.config.powerGain.duration);
    }
    
    createPowerParticles(element, amount) {
        const rect = element.getBoundingClientRect();
        const particleCount = Math.min(amount * 2, 10);
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                type: 'power',
                color: '#FFD700',
                size: Math.random() * 6 + 4,
                velocity: {
                    x: (Math.random() - 0.5) * 4,
                    y: -Math.random() * 6 - 2
                },
                life: 60
            });
        }
        
        this.startParticleAnimation();
    }
    
    // === ANIMATIONS DE COMBAT ===
    
    playDefeatAnimation(hero) {
        // Animation de défaite d'un héros
        const heroElement = document.querySelector(`[data-hero-name="${hero.name}"]`);
        if (heroElement) {
            heroElement.classList.add('animate-defeat');
            
            // Effet d'explosion
            this.createExplosionEffect(heroElement);
            
            setTimeout(() => {
                heroElement.style.display = 'none';
            }, 800);
        }
        
        this.playSound('defeat');
    }
    
    createExplosionEffect(element) {
        const rect = element.getBoundingClientRect();
        
        // Créer des particules d'explosion
        for (let i = 0; i < 15; i++) {
            this.createParticle({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                type: 'explosion',
                color: `hsl(${Math.random() * 60}, 100%, 50%)`,
                size: Math.random() * 8 + 3,
                velocity: {
                    x: (Math.random() - 0.5) * 10,
                    y: (Math.random() - 0.5) * 10
                },
                life: 40
            });
        }
        
        this.startParticleAnimation();
    }
    
    // === ANIMATIONS DE VICTOIRE ===
    
    playVictoryAnimation(winner) {
        // Afficher le canvas d'animation
        this.canvas.style.display = 'block';
        
        // Feux d'artifice
        this.createFireworks();
        
        // Animation du nom du gagnant
        this.animateVictoryText(winner);
        
        // Confettis
        this.createConfetti();
        
        this.playSound('victory');
        
        // Masquer après l'animation
        setTimeout(() => {
            this.canvas.style.display = 'none';
        }, this.config.victory.duration);
    }
    
    createFireworks() {
        for (let i = 0; i < this.config.victory.fireworks; i++) {
            setTimeout(() => {
                this.launchFirework();
            }, i * 400);
        }
    }
    
    launchFirework() {
        const x = Math.random() * this.canvas.width;
        const y = this.canvas.height * 0.8;
        
        // Particules de feu d'artifice
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            
            this.createParticle({
                x: x,
                y: y,
                type: 'firework',
                color: `hsl(${Math.random() * 360}, 100%, 60%)`,
                size: Math.random() * 4 + 2,
                velocity: {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                },
                life: 80,
                gravity: 0.1
            });
        }
        
        this.startParticleAnimation();
    }
    
    createConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createParticle({
                    x: Math.random() * this.canvas.width,
                    y: -10,
                    type: 'confetti',
                    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    size: Math.random() * 6 + 2,
                    velocity: {
                        x: (Math.random() - 0.5) * 2,
                        y: Math.random() * 2 + 1
                    },
                    life: 200,
                    gravity: 0.05,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.2
                });
            }, i * 50);
        }
        
        this.startParticleAnimation();
    }
    
    animateVictoryText(winner) {
        // Créer un élément de texte temporaire
        const textElement = document.createElement('div');
        textElement.className = 'victory-text-animation';
        textElement.textContent = `${winner.name} Wins!`;
        textElement.style.position = 'fixed';
        textElement.style.top = '50%';
        textElement.style.left = '50%';
        textElement.style.transform = 'translate(-50%, -50%) scale(0)';
        textElement.style.fontSize = '4rem';
        textElement.style.fontWeight = 'bold';
        textElement.style.color = '#FFD700';
        textElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        textElement.style.zIndex = '10000';
        textElement.style.animation = 'victoryTextBounce 2s ease-out';
        
        document.body.appendChild(textElement);
        
        setTimeout(() => {
            document.body.removeChild(textElement);
        }, 2000);
    }
    
    // === SYSTÈME DE PARTICULES ===
    
    createParticle(config) {
        const particle = {
            x: config.x,
            y: config.y,
            vx: config.velocity.x,
            vy: config.velocity.y,
            size: config.size,
            color: config.color,
            life: config.life,
            maxLife: config.life,
            type: config.type,
            gravity: config.gravity || 0,
            rotation: config.rotation || 0,
            rotationSpeed: config.rotationSpeed || 0
        };
        
        this.particles.push(particle);
        return particle;
    }
    
    startParticleAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.canvas.style.display = 'block';
        this.animateParticles();
    }
    
    animateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mettre à jour et dessiner les particules
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Mettre à jour la position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.rotation += particle.rotationSpeed;
            
            // Diminuer la vie
            particle.life--;
            
            // Dessiner la particule
            this.drawParticle(particle);
            
            // Retirer si morte
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Continuer l'animation s'il reste des particules
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animateParticles());
        } else {
            this.isAnimating = false;
            this.canvas.style.display = 'none';
        }
    }
    
    drawParticle(particle) {
        const alpha = particle.life / particle.maxLife;
        
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        
        switch (particle.type) {
            case 'power':
                this.drawStar(particle);
                break;
                
            case 'explosion':
                this.drawCircle(particle);
                break;
                
            case 'firework':
                this.drawCircle(particle);
                break;
                
            case 'confetti':
                this.drawRectangle(particle);
                break;
                
            default:
                this.drawCircle(particle);
        }
        
        this.ctx.restore();
    }
    
    drawStar(particle) {
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        
        const spikes = 5;
        const outerRadius = particle.size;
        const innerRadius = particle.size * 0.5;
        
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i / (spikes * 2)) * Math.PI * 2;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawCircle(particle) {
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawRectangle(particle) {
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
    }
    
    // === EFFETS VISUELS ===
    
    addSparkleEffect(element) {
        element.classList.add('sparkle-effect');
        
        setTimeout(() => {
            element.classList.remove('sparkle-effect');
        }, 1000);
    }
    
    addPulseEffect(element) {
        element.classList.add('pulse-effect');
        
        setTimeout(() => {
            element.classList.remove('pulse-effect');
        }, 1500);
    }
    
    addGlowEffect(element, color = '#FFD700') {
        element.style.boxShadow = `0 0 20px ${color}`;
        element.style.transition = 'box-shadow 0.3s ease';
        
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 1000);
    }
    
    // === TRANSITIONS D'ÉCRAN ===
    
    fadeOut(element, callback) {
        element.classList.add('animate-fade-out');
        
        setTimeout(() => {
            element.style.display = 'none';
            element.classList.remove('animate-fade-out');
            if (callback) callback();
        }, 300);
    }
    
    fadeIn(element, callback) {
        element.style.display = 'block';
        element.classList.add('animate-fade-in');
        
        setTimeout(() => {
            element.classList.remove('animate-fade-in');
            if (callback) callback();
        }, 300);
    }
    
    slideIn(element, direction = 'left') {
        element.classList.add(`animate-slide-in-${direction}`);
        
        setTimeout(() => {
            element.classList.remove(`animate-slide-in-${direction}`);
        }, 500);
    }
    
    // === ANIMATIONS DE DRAG & DROP ===
    
    animateDragStart(element) {
        element.classList.add('animate-drag-start');
        this.addGlowEffect(element, '#00FF88');
    }
    
    animateDragEnd(element) {
        element.classList.remove('animate-drag-start');
    }
    
    animateDropSuccess(element) {
        element.classList.add('animate-drop-success');
        this.createSuccessParticles(element);
        
        setTimeout(() => {
            element.classList.remove('animate-drop-success');
        }, 600);
    }
    
    animateDropFail(element) {
        element.classList.add('animate-drop-fail');
        
        setTimeout(() => {
            element.classList.remove('animate-drop-fail');
        }, 400);
    }
    
    createSuccessParticles(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            this.createParticle({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                type: 'success',
                color: '#00FF88',
                size: Math.random() * 4 + 2,
                velocity: {
                    x: (Math.random() - 0.5) * 6,
                    y: -Math.random() * 4 - 2
                },
                life: 40
            });
        }
        
        this.startParticleAnimation();
    }
    
    // === UTILITAIRES ===
    
    getDeckPosition() {
        const deckElement = document.getElementById('deck-pile');
        if (deckElement) {
            const rect = deckElement.getBoundingClientRect();
            return { x: rect.left, y: rect.top };
        }
        return { x: 50, y: 50 };
    }
    
    getHandPosition(index) {
        const handContainer = document.getElementById('hand-container');
        if (handContainer) {
            const rect = handContainer.getBoundingClientRect();
            return {
                x: rect.left + (index * 120) + 60,
                y: rect.top + 60
            };
        }
        return { x: 200 + (index * 120), y: window.innerHeight - 150 };
    }
    
    createTempCardElement() {
        const tempCard = document.createElement('div');
        tempCard.className = 'temp-card';
        tempCard.style.position = 'fixed';
        tempCard.style.width = '100px';
        tempCard.style.height = '140px';
        tempCard.style.backgroundColor = '#4A90E2';
        tempCard.style.borderRadius = '8px';
        tempCard.style.border = '2px solid #2E5B8F';
        tempCard.style.zIndex = '9998';
        tempCard.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        return tempCard;
    }
    
    // === SONS (STUBS) ===
    
    playSound(soundName) {
        // Placeholder pour les effets sonores
        console.log(`Playing sound: ${soundName}`);
        
        // Dans une vraie implémentation :
        // const audio = new Audio(`sounds/${soundName}.mp3`);
        // audio.play().catch(e => console.log('Sound play failed:', e));
    }
    
    // === MÉTHODES DE CONTRÔLE ===
    
    pauseAnimations() {
        // Marquer les animations comme en pause
        this.isPaused = true;
    }
    
    resumeAnimations() {
        // Reprendre les animations
        this.isPaused = false;
    }
    
    // === ANIMATIONS PERSONNALISÉES ===
    
    animateCardFlip(element, frontContent, backContent) {
        element.style.transformStyle = 'preserve-3d';
        element.style.transition = 'transform 0.6s';
        
        // Première moitié : tourner à 90°
        element.style.transform = 'rotateY(90deg)';
        
        setTimeout(() => {
            // Changer le contenu
            element.innerHTML = backContent;
            
            // Deuxième moitié : terminer la rotation
            element.style.transform = 'rotateY(0deg)';
        }, 300);
        
        setTimeout(() => {
            element.style.transition = '';
            element.style.transformStyle = '';
        }, 600);
    }
    
    animateNumberChange(element, oldValue, newValue) {
        const duration = 800;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Interpolation
            const currentValue = Math.floor(oldValue + (newValue - oldValue) * progress);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    createFloatingText(text, x, y, color = '#FFD700') {
        const floatingText = document.createElement('div');
        floatingText.textContent = text;
        floatingText.style.position = 'fixed';
        floatingText.style.left = x + 'px';
        floatingText.style.top = y + 'px';
        floatingText.style.color = color;
        floatingText.style.fontSize = '24px';
        floatingText.style.fontWeight = 'bold';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.zIndex = '9999';
        floatingText.style.animation = 'floatingText 2s ease-out forwards';
        
        document.body.appendChild(floatingText);
        
        setTimeout(() => {
            document.body.removeChild(floatingText);
        }, 2000);
    }
}

// Instance globale
let animationManager;