// Système de drag-and-drop pour Disney Villainous

class DragDropManager {
    constructor() {
        this.isDragging = false;
        this.draggedElement = null;
        this.draggedCard = null;
        this.dragPreview = null;
        this.dropZones = null;
        this.originalPosition = null;
        
        this.initializeDragDrop();
    }
    
    initializeDragDrop() {
        this.dropZones = document.getElementById('drop-zones');
        
        // Gestionnaires globaux pour le drag and drop
        document.addEventListener('dragstart', this.handleDragStart.bind(this));
        document.addEventListener('dragend', this.handleDragEnd.bind(this));
        document.addEventListener('dragover', this.handleDragOver.bind(this));
        document.addEventListener('drop', this.handleDrop.bind(this));
        
        // Gestion tactile pour mobile
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    }
    
    makeCardDraggable(cardElement, cardData) {
        cardElement.draggable = true;
        cardElement.dataset.cardId = cardData.id;
        cardElement.dataset.cardData = JSON.stringify(cardData);
        
        // Ajout des classes CSS pour les effets
        cardElement.classList.add('draggable-card');
        
        // Gestionnaires spécifiques à la carte
        cardElement.addEventListener('mousedown', (e) => {
            this.prepareDrag(cardElement, cardData, e);
        });
        
        cardElement.addEventListener('dragstart', (e) => {
            this.startCardDrag(cardElement, cardData, e);
        });
    }
    
    prepareDrag(element, cardData, event) {
        // Vérifier si la carte peut être jouée
        const currentPlayer = gameManager.getCurrentPlayer();
        const canAfford = currentPlayer && currentPlayer.power >= cardData.cost;
        
        if (!canAfford) {
            element.classList.add('animate-shake');
            setTimeout(() => element.classList.remove('animate-shake'), 500);
            showNotification('Pas assez de pouvoir !', 'warning');
            return false;
        }
        
        // Sauvegarder la position originale
        this.originalPosition = {
            x: event.clientX,
            y: event.clientY,
            element: element,
            parent: element.parentNode
        };
        
        return true;
    }
    
    startCardDrag(element, cardData, event) {
        this.isDragging = true;
        this.draggedElement = element;
        this.draggedCard = cardData;
        
        // Ajouter les classes CSS
        element.classList.add('dragging');
        document.body.classList.add('dragging-active');
        
        // Afficher les zones de drop
        this.showDropZones();
        
        // Créer un aperçu personnalisé
        this.createDragPreview(element, cardData, event);
        
        // Données pour le transfert
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', cardData.id);
        
        // Animation de feedback
        animationManager.playCardLiftAnimation(element);
    }
    
    createDragPreview(element, cardData, event) {
        // Créer un élément de prévisualisation
        this.dragPreview = element.cloneNode(true);
        this.dragPreview.classList.add('drag-preview');
        this.dragPreview.style.position = 'fixed';
        this.dragPreview.style.pointerEvents = 'none';
        this.dragPreview.style.zIndex = '10000';
        this.dragPreview.style.transform = 'rotate(5deg) scale(0.9)';
        this.dragPreview.style.opacity = '0.8';
        
        document.body.appendChild(this.dragPreview);
        
        // Cacher l'image de drag par défaut
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        event.dataTransfer.setDragImage(img, 0, 0);
    }
    
    updateDragPreview(x, y) {
        if (this.dragPreview) {
            this.dragPreview.style.left = (x - 80) + 'px';
            this.dragPreview.style.top = (y - 110) + 'px';
        }
    }
    
    showDropZones() {
        if (this.dropZones) {
            this.dropZones.classList.remove('hidden');
            this.dropZones.classList.add('active');
            
            // Animer l'apparition des zones de drop
            const zones = this.dropZones.querySelectorAll('.drop-zone');
            zones.forEach((zone, index) => {
                setTimeout(() => {
                    zone.style.animation = 'fadeInUp 0.3s ease forwards';
                }, index * 100);
            });
        }
    }
    
    hideDropZones() {
        if (this.dropZones) {
            this.dropZones.classList.add('hidden');
            this.dropZones.classList.remove('active');
            
            // Retirer les classes de drag-over
            const zones = this.dropZones.querySelectorAll('.drop-zone');
            zones.forEach(zone => {
                zone.classList.remove('drag-over');
                zone.style.animation = '';
            });
        }
    }
    
    handleDragStart(event) {
        // Géré par startCardDrag
    }
    
    handleDragEnd(event) {
        this.endDrag();
    }
    
    handleDragOver(event) {
        event.preventDefault();
        
        if (!this.isDragging) return;
        
        // Mettre à jour la position de la prévisualisation
        this.updateDragPreview(event.clientX, event.clientY);
        
        // Vérifier si on survole une zone de drop
        const dropZone = event.target.closest('.drop-zone');
        if (dropZone) {
            dropZone.classList.add('drag-over');
            this.showDropFeedback(dropZone);
        } else {
            // Retirer le feedback de toutes les zones
            const zones = this.dropZones.querySelectorAll('.drop-zone');
            zones.forEach(zone => {
                zone.classList.remove('drag-over');
                this.hideDropFeedback(zone);
            });
        }
    }
    
    handleDrop(event) {
        event.preventDefault();
        
        if (!this.isDragging || !this.draggedCard) return;
        
        const dropZone = event.target.closest('.drop-zone');
        if (dropZone) {
            const action = dropZone.dataset.action;
            this.processCardDrop(this.draggedCard, action);
        }
        
        this.endDrag();
    }
    
    processCardDrop(cardData, action) {
        switch (action) {
            case 'play':
                this.playCard(cardData);
                break;
            case 'discard':
                this.discardCard(cardData);
                break;
            default:
                console.warn('Action de drop inconnue:', action);
        }
    }
    
    playCard(cardData) {
        const currentPlayer = gameManager.getCurrentPlayer();
        
        if (!currentPlayer || currentPlayer.power < cardData.cost) {
            showNotification('Impossible de jouer cette carte !', 'error');
            return false;
        }
        
        // Déduire le coût
        currentPlayer.power -= cardData.cost;
        
        // Retirer la carte de la main
        const cardIndex = currentPlayer.hand.findIndex(card => card.id === cardData.id);
        if (cardIndex !== -1) {
            currentPlayer.hand.splice(cardIndex, 1);
        }
        
        // Appliquer les effets de la carte
        this.applyCardEffects(cardData, currentPlayer);
        
        // Animations et feedback
        animationManager.playCardPlayAnimation(this.draggedElement);
        showNotification(`${cardData.name} jouée !`, 'success');
        
        // Mettre à jour l'interface
        uiManager.updatePlayerInfo(currentPlayer);
        uiManager.updateHand(currentPlayer);
        
        // Log de l'action
        gameManager.logAction(`${currentPlayer.name} joue ${cardData.name}`);
        
        return true;
    }
    
    discardCard(cardData) {
        const currentPlayer = gameManager.getCurrentPlayer();
        
        // Retirer la carte de la main
        const cardIndex = currentPlayer.hand.findIndex(card => card.id === cardData.id);
        if (cardIndex !== -1) {
            currentPlayer.hand.splice(cardIndex, 1);
        }
        
        // Animations et feedback
        animationManager.playCardDiscardAnimation(this.draggedElement);
        showNotification(`${cardData.name} défaussée`, 'info');
        
        // Mettre à jour l'interface
        uiManager.updateHand(currentPlayer);
        
        // Log de l'action
        gameManager.logAction(`${currentPlayer.name} défausse ${cardData.name}`);
        
        return true;
    }
    
    applyCardEffects(cardData, player) {
        if (!cardData.effects) return;
        
        cardData.effects.forEach(effect => {
            this.applyEffect(effect, cardData, player);
        });
    }
    
    applyEffect(effect, cardData, player) {
        // Analyser l'effet textuel et l'appliquer
        const effectText = effect.toLowerCase();
        
        if (effectText.includes('gagne') && effectText.includes('pouvoir')) {
            // Extraire le nombre de pouvoirs
            const match = effectText.match(/(\\d+)\\s*pouvoir/);
            if (match) {
                const powerGain = parseInt(match[1]);
                player.power += powerGain;
                animationManager.playPowerGainAnimation(powerGain);
                showNotification(`+${powerGain} pouvoir !`, 'success');
            }
        }
        
        if (effectText.includes('pioche') && effectText.includes('carte')) {
            // Extraire le nombre de cartes
            const match = effectText.match(/(\\d+)\\s*carte/);
            const cardsToDraw = match ? parseInt(match[1]) : 1;
            
            for (let i = 0; i < cardsToDraw; i++) {
                const newCard = gameManager.drawCard(player);
                if (newCard) {
                    player.hand.push(newCard);
                }
            }
            
            showNotification(`+${cardsToDraw} carte(s) !`, 'success');
        }
        
        // Effets spéciaux selon le type de carte
        if (cardData.type === 'ally' || cardData.type === 'item') {
            // Placer sur le plateau
            const currentLocation = gameManager.getCurrentLocation(player);
            if (currentLocation) {
                currentLocation.items = currentLocation.items || [];
                currentLocation.items.push(cardData.id);
                showNotification(`${cardData.name} placé(e) à ${currentLocation.name}`, 'info');
            }
        }
    }
    
    showDropFeedback(dropZone) {
        // Afficher un feedback visuel
        if (!dropZone.querySelector('.drop-feedback')) {
            const feedback = document.createElement('div');
            feedback.className = 'drop-feedback';
            
            const action = dropZone.dataset.action;
            const actionText = action === 'play' ? 'Jouer la carte' : 'Défausser la carte';
            feedback.textContent = actionText;
            
            dropZone.appendChild(feedback);
        }
    }
    
    hideDropFeedback(dropZone) {
        const feedback = dropZone.querySelector('.drop-feedback');
        if (feedback) {
            feedback.remove();
        }
    }
    
    endDrag() {
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
        }
        
        document.body.classList.remove('dragging-active');
        
        // Nettoyer la prévisualisation
        if (this.dragPreview && this.dragPreview.parentNode) {
            this.dragPreview.parentNode.removeChild(this.dragPreview);
        }
        
        // Cacher les zones de drop
        this.hideDropZones();
        
        // Réinitialiser les variables
        this.isDragging = false;
        this.draggedElement = null;
        this.draggedCard = null;
        this.dragPreview = null;
        this.originalPosition = null;
    }
    
    // === GESTION TACTILE POUR MOBILE ===
    
    handleTouchStart(event) {
        const card = event.target.closest('.draggable-card');
        if (!card) return;
        
        const cardData = JSON.parse(card.dataset.cardData);
        if (!this.prepareDrag(card, cardData, event.touches[0])) {
            event.preventDefault();
            return;
        }
        
        this.touchDragData = {
            element: card,
            cardData: cardData,
            startX: event.touches[0].clientX,
            startY: event.touches[0].clientY
        };
        
        // Empêcher le scroll
        event.preventDefault();
    }
    
    handleTouchMove(event) {
        if (!this.touchDragData) return;
        
        event.preventDefault();
        
        const touch = event.touches[0];
        const deltaX = touch.clientX - this.touchDragData.startX;
        const deltaY = touch.clientY - this.touchDragData.startY;
        
        // Seuil pour commencer le drag
        if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
            if (!this.isDragging) {
                this.startTouchDrag();
            }
            
            this.updateDragPreview(touch.clientX, touch.clientY);
            
            // Vérifier les zones de drop
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = elementBelow?.closest('.drop-zone');
            
            if (dropZone !== this.currentTouchDropZone) {
                if (this.currentTouchDropZone) {
                    this.currentTouchDropZone.classList.remove('drag-over');
                }
                
                if (dropZone) {
                    dropZone.classList.add('drag-over');
                    this.showDropFeedback(dropZone);
                }
                
                this.currentTouchDropZone = dropZone;
            }
        }
    }
    
    handleTouchEnd(event) {
        if (!this.touchDragData) return;
        
        event.preventDefault();
        
        if (this.isDragging && this.currentTouchDropZone) {
            const action = this.currentTouchDropZone.dataset.action;
            this.processCardDrop(this.touchDragData.cardData, action);
        }
        
        this.endTouchDrag();
    }
    
    startTouchDrag() {
        this.isDragging = true;
        this.draggedElement = this.touchDragData.element;
        this.draggedCard = this.touchDragData.cardData;
        
        this.draggedElement.classList.add('dragging');
        document.body.classList.add('dragging-active');
        
        this.showDropZones();
        this.createTouchDragPreview();
    }
    
    createTouchDragPreview() {
        this.dragPreview = this.touchDragData.element.cloneNode(true);
        this.dragPreview.classList.add('drag-preview');
        this.dragPreview.style.position = 'fixed';
        this.dragPreview.style.pointerEvents = 'none';
        this.dragPreview.style.zIndex = '10000';
        this.dragPreview.style.transform = 'rotate(5deg) scale(0.9)';
        this.dragPreview.style.opacity = '0.8';
        
        document.body.appendChild(this.dragPreview);
    }
    
    endTouchDrag() {
        this.endDrag();
        this.touchDragData = null;
        this.currentTouchDropZone = null;
    }
}

// Instance globale
let dragDropManager;