// Gestionnaire principal de l'interface utilisateur

class UIManager {
    constructor() {
        this.currentScreen = 'loading';
        this.playerCards = new Map();
        this.notifications = [];
        
        this.initializeUI();
    }
    
    initializeUI() {
        // Initialiser les gestionnaires d'événements
        this.setupEventListeners();
        
        // Configuration initiale
        this.setupVillainSelection();
        this.setupPlayerCountSelector();
        
        // Masquer l'écran de chargement après un délai
        setTimeout(() => {
            this.showMainMenu();
        }, 2000);
    }
    
    setupEventListeners() {
        // Sélecteur de nombre de joueurs
        document.querySelectorAll('.count-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectPlayerCount(parseInt(e.target.dataset.count));
            });
        });
        
        // Gestion des modals
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Fermeture des modals en cliquant à l'extérieur
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }
    
    setupVillainSelection() {
        const villainContainer = document.getElementById('villain-selection');
        villainContainer.innerHTML = '';
        
        Object.values(VILLAINS).forEach(villain => {
            const villainCard = this.createVillainCard(villain);
            villainContainer.appendChild(villainCard);
        });
    }
    
    createVillainCard(villain) {
        const card = document.createElement('div');
        card.className = 'villain-card';
        card.dataset.villainId = villain.id;
        
        card.innerHTML = `
            <span class="villain-icon">${villain.icon}</span>
            <div class="villain-name">${villain.name}</div>
            <div class="villain-description">${villain.description}</div>
        `;
        
        card.addEventListener('click', () => {
            this.selectVillain(villain.id, card);
        });
        
        return card;
    }
    
    setupPlayerCountSelector() {
        // Sélectionner 4 joueurs par défaut
        this.selectPlayerCount(4);
    }
    
    selectPlayerCount(count) {
        // Mettre à jour l'interface
        document.querySelectorAll('.count-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-count="${count}"]`).classList.add('active');
        
        // Mettre à jour les sélections de méchants
        this.updateVillainSelection(count);
        
        // Vérifier si on peut commencer
        this.checkCanStartGame();
    }
    
    updateVillainSelection(playerCount) {
        const villainCards = document.querySelectorAll('.villain-card');
        
        // Réinitialiser toutes les cartes
        villainCards.forEach(card => {
            card.classList.remove('selected', 'taken');
            const assignment = card.querySelector('.player-assignment');
            if (assignment) {
                assignment.remove();
            }
        });
        
        // Réinitialiser les sélections
        this.selectedVillains = new Map();
        this.playerCount = playerCount;
    }
    
    selectVillain(villainId, cardElement) {
        if (cardElement.classList.contains('taken')) {
            return;
        }
        
        const isSelected = cardElement.classList.contains('selected');
        
        if (isSelected) {
            // Désélectionner
            cardElement.classList.remove('selected');
            const assignment = cardElement.querySelector('.player-assignment');
            if (assignment) {
                assignment.remove();
            }
            
            // Retirer de la sélection
            for (let [playerId, selectedVillainId] of this.selectedVillains) {
                if (selectedVillainId === villainId) {
                    this.selectedVillains.delete(playerId);
                    break;
                }
            }
        } else {
            // Vérifier si on peut encore sélectionner
            if (this.selectedVillains.size >= this.playerCount) {
                showNotification('Nombre maximum de joueurs atteint !', 'warning');
                return;
            }
            
            // Sélectionner
            cardElement.classList.add('selected');
            
            // Ajouter l'indicateur de joueur
            const playerNumber = this.selectedVillains.size + 1;
            const assignment = document.createElement('div');
            assignment.className = 'player-assignment';
            assignment.textContent = playerNumber;
            cardElement.appendChild(assignment);
            
            // Ajouter à la sélection
            this.selectedVillains.set(`player_${playerNumber}`, villainId);
        }
        
        this.checkCanStartGame();
    }
    
    checkCanStartGame() {
        const startButton = document.getElementById('start-game-btn');
        const canStart = this.selectedVillains.size >= 2;
        
        startButton.disabled = !canStart;
        
        if (canStart) {
            startButton.classList.add('animate-glow');
        } else {
            startButton.classList.remove('animate-glow');
        }
    }
    
    // === GESTION DES ÉCRANS ===
    
    showMainMenu() {
        this.hideAllScreens();
        document.getElementById('main-menu').classList.remove('hidden');
        this.currentScreen = 'main-menu';
    }
    
    showGameSetup() {
        this.hideAllScreens();
        document.getElementById('game-setup').classList.remove('hidden');
        this.currentScreen = 'game-setup';
    }
    
    showGameInterface() {
        this.hideAllScreens();
        document.getElementById('game-interface').classList.remove('hidden');
        this.currentScreen = 'game-interface';
    }
    
    hideAllScreens() {
        document.querySelectorAll('.loading-screen, .main-menu, .game-setup, .game-interface').forEach(screen => {
            screen.classList.add('hidden');
        });
    }
    
    // === GESTION DES MODALS ===
    
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('animate-fade-in');
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('animate-fade-out');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('animate-fade-in', 'animate-fade-out');
            }, 300);
        }
    }
    
    // === INTERFACE DE JEU ===
    
    updateGameHeader(turnNumber, currentPlayer) {
        document.getElementById('turn-number').textContent = turnNumber;
        document.getElementById('current-player-name').textContent = currentPlayer.name;
        document.getElementById('current-villain').textContent = currentPlayer.villain.name;
    }
    
    updatePlayerInfo(player) {
        // Mettre à jour le pouvoir
        const powerAmount = document.getElementById('player-power');
        if (powerAmount) {
            const oldValue = parseInt(powerAmount.textContent);
            powerAmount.textContent = player.power;
            
            // Animation si le pouvoir a changé
            if (player.power !== oldValue) {
                powerAmount.classList.add('animate-power-gain');
                setTimeout(() => {
                    powerAmount.classList.remove('animate-power-gain');
                }, 800);
            }
        }
        
        // Mettre à jour l'objectif et le progrès
        this.updateVictoryProgress(player);
    }
    
    updateVictoryProgress(player) {
        const conditionElement = document.getElementById('victory-condition');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (conditionElement && player.villain) {
            conditionElement.textContent = player.villain.victoryCondition;
        }
        
        // Calculer le progrès (simplifié)
        const progress = this.calculateVictoryProgress(player);
        
        if (progressFill && progressText) {
            progressFill.style.width = progress + '%';
            progressText.textContent = `${Math.round(progress)}% accompli`;
            
            // Animation si proche de la victoire
            if (progress >= 80) {
                progressFill.classList.add('animate-victory-pulse');
            } else {
                progressFill.classList.remove('animate-victory-pulse');
            }
        }
    }
    
    calculateVictoryProgress(player) {
        // Logique simplifiée pour le progrès
        // Dans un vrai jeu, cela serait plus complexe
        const baseProgress = Math.min(player.power * 2, 50);
        const itemBonus = (player.location?.items?.length || 0) * 10;
        
        return Math.min(baseProgress + itemBonus, 100);
    }
    
    updateHand(player) {
        const handContainer = document.getElementById('hand-container');
        if (!handContainer) return;
        
        // Vider la main actuelle
        handContainer.innerHTML = '';
        
        // Ajouter chaque carte avec animation
        player.hand.forEach((card, index) => {
            setTimeout(() => {
                const cardElement = this.createCardElement(card, player);
                cardElement.classList.add('animate-card-slide-in');
                handContainer.appendChild(cardElement);
                
                // Rendre la carte draggable
                if (window.dragDropManager) {
                    dragDropManager.makeCardDraggable(cardElement, card);
                }
            }, index * 100);
        });
    }
    
    createCardElement(card, player) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.type}`;
        
        // Vérifier si jouable
        const canAfford = player.power >= card.cost;
        cardDiv.classList.add(canAfford ? 'affordable' : 'expensive');
        
        const strengthDisplay = card.strength ? 
            `<div class="card-strength">${card.strength}</div>` : '';
        
        cardDiv.innerHTML = `
            <div class="card-header">
                <div class="card-cost">${card.cost}</div>
                <div class="card-type">${card.type}</div>
            </div>
            <div class="card-name">${card.name}</div>
            <div class="card-image">${card.image || CARD_ICONS[card.type]}</div>
            <div class="card-description">${card.description}</div>
            ${strengthDisplay}
        `;
        
        return cardDiv;
    }
    
    updateBoard(player) {
        const boardContainer = document.getElementById('board-container');
        if (!boardContainer) return;
        
        boardContainer.innerHTML = '';
        
        // Créer le plateau
        const board = document.createElement('div');
        board.className = 'board';
        
        player.villain.board.forEach((location, index) => {
            const locationElement = this.createLocationElement(location, index, player);
            board.appendChild(locationElement);
        });
        
        boardContainer.appendChild(board);
    }
    
    createLocationElement(location, index, player) {
        const locationDiv = document.createElement('div');
        locationDiv.className = 'board-location';
        
        // Vérifier si c'est la position actuelle
        if (index === player.currentLocation) {
            locationDiv.classList.add('current');
        }
        
        // Vérifier si c'est une position possible
        if (this.canMoveToLocation(player, index)) {
            locationDiv.classList.add('available');
        }
        
        // Actions du lieu
        const actionsHTML = location.actions.map(action => {
            const blocked = location.heroes && location.heroes.length > 0 && action.blockedByHeroes;
            const statusClass = blocked ? 'blocked' : 'available';
            const statusIcon = blocked ? '🔒' : '✅';
            
            return `
                <div class="location-action ${statusClass}">
                    <span class="action-icon-small">${action.icon}</span>
                    <span>${action.description}</span>
                    <span class="action-status">${statusIcon}</span>
                </div>
            `;
        }).join('');
        
        // Marker pour le joueur actuel
        const playerMarker = index === player.currentLocation ? 
            '<div class="current-player-marker">👑</div>' : '';
        
        locationDiv.innerHTML = `
            <div class="location-header">
                <div class="location-number">${index + 1}</div>
                ${playerMarker}
            </div>
            <div class="location-name">${location.name}</div>
            <div class="location-description">${location.description}</div>
            <div class="location-actions">
                ${actionsHTML}
            </div>
            <div class="location-cards">
                <div class="location-heroes">
                    <span>👹</span>
                    <span class="card-count heroes-count">${location.heroes?.length || 0}</span>
                </div>
                <div class="location-items">
                    <span>📦</span>
                    <span class="card-count items-count">${location.items?.length || 0}</span>
                </div>
            </div>
        `;
        
        // Gestionnaire de clic pour le déplacement
        if (this.canMoveToLocation(player, index)) {
            locationDiv.addEventListener('click', () => {
                this.movePlayer(player, index);
            });
        }
        
        return locationDiv;
    }
    
    canMoveToLocation(player, locationIndex) {
        // Logique simplifiée : adjacent ou même lieu
        const currentLocation = player.currentLocation;
        return Math.abs(currentLocation - locationIndex) <= 1 || 
               locationIndex === 0 || locationIndex === player.villain.board.length - 1;
    }
    
    movePlayer(player, newLocation) {
        if (!this.canMoveToLocation(player, newLocation)) {
            showNotification('Déplacement impossible !', 'warning');
            return;
        }
        
        const oldLocation = player.currentLocation;
        player.currentLocation = newLocation;
        
        // Animation et feedback
        const locationName = player.villain.board[newLocation].name;
        showNotification(`Déplacement vers ${locationName}`, 'success');
        
        // Mettre à jour l'affichage
        this.updateBoard(player);
        
        // Log de l'action
        gameManager.logAction(`${player.name} se déplace vers ${locationName}`);
    }
    
    updateActions(player) {
        const actionsContainer = document.getElementById('actions-container');
        if (!actionsContainer) return;
        
        actionsContainer.innerHTML = '';
        
        const currentLocation = player.villain.board[player.currentLocation];
        if (!currentLocation) return;
        
        currentLocation.actions.forEach(action => {
            const actionButton = this.createActionButton(action, currentLocation, player);
            actionsContainer.appendChild(actionButton);
        });
    }
    
    createActionButton(action, location, player) {
        const button = document.createElement('button');
        button.className = 'action-button';
        
        // Vérifier si l'action est bloquée
        const blocked = location.heroes && location.heroes.length > 0 && action.blockedByHeroes;
        if (blocked) {
            button.classList.add('blocked');
            button.disabled = true;
        }
        
        button.innerHTML = `
            <span class="action-icon">${action.icon}</span>
            <span class="action-description">${action.description}</span>
            ${action.value ? `<span class="action-value">+${action.value}</span>` : ''}
        `;
        
        if (!blocked) {
            button.addEventListener('click', () => {
                this.performAction(action, player);
            });
        }
        
        return button;
    }
    
    performAction(action, player) {
        switch (action.type) {
            case 'gain_power':
                player.power += action.value || 1;
                if (window.animationManager) {
                    animationManager.playPowerGainAnimation(action.value || 1);
                }
                showNotification(`+${action.value || 1} pouvoir !`, 'success');
                this.updatePlayerInfo(player);
                break;
                
            case 'play_card':
                showNotification('Glissez une carte pour la jouer !', 'info');
                break;
                
            case 'discard':
                showNotification('Glissez une carte dans la zone de défausse !', 'info');
                break;
                
            case 'fate':
                this.performFateAction(player);
                break;
                
            case 'vanquish':
                this.performVanquishAction(player);
                break;
                
            case 'activate':
                this.performActivateAction(player);
                break;
        }
        
        // Log de l'action
        if (window.gameManager) {
            gameManager.logAction(`${player.name} effectue l'action ${action.description}`);
        }
    }
    
    performFateAction(player) {
        // Implémenter l'action Destin
        showNotification('Action Destin en développement...', 'info');
    }
    
    performVanquishAction(player) {
        // Implémenter l'action Vaincre
        showNotification('Action Vaincre en développement...', 'info');
    }
    
    performActivateAction(player) {
        // Implémenter l'action Activer
        showNotification('Action Activer en développement...', 'info');
    }
}

// === FONCTIONS UTILITAIRES GLOBALES ===

function showGameSetup() {
    uiManager.showGameSetup();
}

function showMainMenu() {
    uiManager.showMainMenu();
}

function showRules() {
    uiManager.showModal('rules-modal');
}

function showCredits() {
    uiManager.showModal('credits-modal');
}

function closeModal(modalId) {
    uiManager.closeModal(modalId);
}

function startGame() {
    if (!uiManager || uiManager.selectedVillains.size < 2) {
        showNotification('Sélectionnez au moins 2 méchants !', 'warning');
        return;
    }
    
    // Initialiser le jeu
    if (window.gameManager) {
        gameManager.startNewGame(uiManager.selectedVillains);
        
        // Afficher l'interface de jeu
        uiManager.showGameInterface();
    }
}

function endTurn() {
    if (window.gameManager) {
        gameManager.endCurrentPlayerTurn();
    }
}

function showGameMenu() {
    // Afficher le menu de jeu
    showNotification('Menu de jeu en développement...', 'info');
}

// Instance globale
let uiManager;