// Gestionnaire principal de la logique de jeu

class GameManager {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameState = 'setup'; // setup, playing, ended
        this.turnNumber = 1;
        this.actionHistory = [];
        this.gameConfig = {
            maxHandSize: 4,
            startingPower: 0,
            startingHandSize: 4,
            maxActions: 2
        };
        
        this.gameSettings = GAME_CONFIG;
    }
    
    // === INITIALISATION ===
    
    startNewGame(selectedVillains) {
        try {
            // Réinitialiser l'état
            this.players = [];
            this.currentPlayerIndex = 0;
            this.turnNumber = 1;
            this.actionHistory = [];
            this.gameState = 'setup';
            
            // Créer les joueurs
            this.createPlayers(selectedVillains);
            
            // Initialiser le jeu
            this.initializeGame();
            
            // Démarrer le premier tour
            this.startGame();
            
            showNotification('Nouvelle partie commencée !', 'success');
            this.logAction('=== NOUVELLE PARTIE COMMENCÉE ===');
            
        } catch (error) {
            console.error('Erreur lors du démarrage:', error);
            showNotification('Erreur lors du démarrage du jeu', 'error');
        }
    }
    
    createPlayers(selectedVillains) {
        let playerNumber = 1;
        
        for (const [playerId, villainId] of selectedVillains) {
            const villain = VILLAINS[villainId];
            if (!villain) {
                console.error(`Méchant introuvable: ${villainId}`);
                continue;
            }
            
            const player = this.createPlayer(playerNumber, villain);
            this.players.push(player);
            playerNumber++;
        }
        
        if (this.players.length < 2) {
            throw new Error('Au moins 2 joueurs sont nécessaires');
        }
        
        console.log(`${this.players.length} joueurs créés`);
    }
    
    createPlayer(playerNumber, villain) {
        const player = {
            id: `player_${playerNumber}`,
            name: `Joueur ${playerNumber}`,
            villain: { ...villain },
            power: this.gameConfig.startingPower,
            currentLocation: 0,
            hand: [],
            deck: [],
            discard: [],
            items: [],
            conditions: [],
            actionsRemaining: this.gameConfig.maxActions,
            extraActions: 0,
            hasWon: false,
            gameStats: {
                cardsPlayed: 0,
                powerGained: 0,
                turnsTaken: 0
            }
        };
        
        // Copier le plateau du méchant pour éviter les références partagées
        player.villain.board = villain.board.map(location => ({
            ...location,
            allies: [],
            items: [],
            heroes: [...(location.heroes || [])]
        }));
        
        // Créer le deck initial
        player.deck = cardManager.createInitialDeck(villain.id);
        
        // Piocher la main de départ
        this.drawInitialHand(player);
        
        return player;
    }
    
    drawInitialHand(player) {
        for (let i = 0; i < this.gameConfig.startingHandSize; i++) {
            const card = player.deck.pop();
            if (card) {
                player.hand.push(card);
            }
        }
    }
    
    initializeGame() {
        // Mélanger l'ordre des joueurs
        if (this.gameSettings.randomPlayerOrder) {
            this.shuffleArray(this.players);
        }
        
        // Initialiser les plateaux avec les héros de départ
        this.players.forEach(player => {
            this.setupInitialHeroes(player);
        });
        
        this.gameState = 'initialized';
    }
    
    setupInitialHeroes(player) {
        // Placer les héros initiaux selon les règles du méchant
        player.villain.board.forEach((location, index) => {
            if (location.startingHeroes) {
                location.heroes = [...location.startingHeroes];
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.startPlayerTurn();
    }
    
    // === GESTION DES TOURS ===
    
    startPlayerTurn() {
        const player = this.getCurrentPlayer();
        
        // Réinitialiser les actions
        player.actionsRemaining = this.gameConfig.maxActions + (player.extraActions || 0);
        player.extraActions = 0;
        
        // Effets de début de tour
        this.processStartOfTurnEffects(player);
        
        // Mettre à jour l'interface
        this.updateGameInterface();
        
        // Log
        this.logAction(`=== TOUR ${this.turnNumber} - ${player.name} (${player.villain.name}) ===`);
        
        showNotification(`Tour de ${player.name} !`, 'info');
    }
    
    processStartOfTurnEffects(player) {
        // Piocher une carte (règle de base)
        this.drawCard(player);
        
        // Vérifier les conditions de victoire
        this.checkVictoryCondition(player);
        
        // Appliquer les effets passifs
        this.applyPassiveEffects(player);
    }
    
    drawCard(player) {
        if (player.deck.length === 0) {
            cardManager.reshuffleDiscard(player);
        }
        
        if (player.deck.length > 0 && player.hand.length < this.gameConfig.maxHandSize) {
            const card = player.deck.pop();
            player.hand.push(card);
            
            // Animation uniquement si c'est le joueur actuel visible
            if (player === this.getCurrentPlayer() && window.animationManager) {
                animationManager.playDrawCardAnimation([card]);
            }
        }
    }
    
    endCurrentPlayerTurn() {
        const player = this.getCurrentPlayer();
        
        // Vérifier si le joueur peut terminer son tour
        if (!this.canEndTurn(player)) {
            showNotification('Vous devez effectuer toutes vos actions !', 'warning');
            return;
        }
        
        // Effets de fin de tour
        this.processEndOfTurnEffects(player);
        
        // Mettre à jour les statistiques
        player.gameStats.turnsTaken++;
        
        // Passer au joueur suivant
        this.nextPlayer();
    }
    
    canEndTurn(player) {
        // Le joueur peut terminer son tour s'il a utilisé toutes ses actions
        // ou s'il choisit de passer
        return true; // Simplifié pour le moment
    }
    
    processEndOfTurnEffects(player) {
        // Défausser jusqu'à la limite de main
        this.enforceHandLimit(player);
        
        // Appliquer les effets de fin de tour
        this.applyEndOfTurnEffects(player);
        
        // Log
        this.logAction(`${player.name} termine son tour`);
    }
    
    enforceHandLimit(player) {
        while (player.hand.length > this.gameConfig.maxHandSize) {
            // Pour le moment, défausser automatiquement
            // Dans une vraie implémentation, le joueur choisirait
            const discardedCard = player.hand.pop();
            cardManager.addCardToDiscard(discardedCard, player);
        }
    }
    
    nextPlayer() {
        // Avancer au joueur suivant
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
        // Si on revient au premier joueur, incrémenter le tour
        if (this.currentPlayerIndex === 0) {
            this.turnNumber++;
        }
        
        // Démarrer le tour du joueur suivant
        this.startPlayerTurn();
    }
    
    // === ACTIONS DE JEU ===
    
    performAction(action, player, parameters = {}) {
        if (player.actionsRemaining <= 0) {
            showNotification('Plus d\'actions disponibles !', 'warning');
            return false;
        }
        
        let success = false;
        
        switch (action.type) {
            case 'gain_power':
                success = this.gainPower(player, action.value || 1);
                break;
                
            case 'play_card':
                success = this.enableCardPlay(player);
                break;
                
            case 'discard':
                success = this.enableCardDiscard(player);
                break;
                
            case 'move':
                success = this.movePlayer(player, parameters.targetLocation);
                break;
                
            case 'fate':
                success = this.performFateAction(player, parameters.targetPlayer);
                break;
                
            case 'vanquish':
                success = this.performVanquishAction(player, parameters.targetHero);
                break;
                
            case 'activate':
                success = this.performActivateAction(player, parameters.targetCard);
                break;
                
            default:
                console.warn(`Action non implémentée: ${action.type}`);
                success = false;
        }
        
        if (success) {
            player.actionsRemaining--;
            this.updateGameInterface();
        }
        
        return success;
    }
    
    gainPower(player, amount) {
        player.power += amount;
        player.gameStats.powerGained += amount;
        
        if (window.animationManager) {
            animationManager.playPowerGainAnimation(amount);
        }
        showNotification(`+${amount} pouvoir !`, 'success');
        
        this.logAction(`${player.name} gagne ${amount} pouvoir`);
        return true;
    }
    
    enableCardPlay(player) {
        // Activer le mode "jouer une carte"
        showNotification('Glissez une carte de votre main vers le plateau !', 'info');
        if (window.dragDropManager) {
            dragDropManager.enableCardPlayMode();
        }
        return true;
    }
    
    enableCardDiscard(player) {
        // Activer le mode "défausser une carte"
        showNotification('Glissez une carte vers la zone de défausse !', 'info');
        if (window.dragDropManager) {
            dragDropManager.enableDiscardMode();
        }
        return true;
    }
    
    movePlayer(player, targetLocation) {
        if (targetLocation === undefined || targetLocation === player.currentLocation) {
            return false;
        }
        
        if (!uiManager.canMoveToLocation(player, targetLocation)) {
            showNotification('Déplacement impossible !', 'warning');
            return false;
        }
        
        const oldLocation = player.currentLocation;
        player.currentLocation = targetLocation;
        
        const locationName = player.villain.board[targetLocation].name;
        showNotification(`Déplacement vers ${locationName}`, 'success');
        this.logAction(`${player.name} se déplace vers ${locationName}`);
        
        return true;
    }
    
    performFateAction(player, targetPlayer) {
        // Action Destin - affecter un autre joueur
        if (!targetPlayer) {
            showNotification('Sélectionnez un joueur cible !', 'warning');
            return false;
        }
        
        // Logique Fate simplifiée
        showNotification(`Action Destin sur ${targetPlayer.name}`, 'info');
        this.logAction(`${player.name} utilise une action Destin sur ${targetPlayer.name}`);
        
        return true;
    }
    
    performVanquishAction(player, targetHero) {
        const currentLocation = player.villain.board[player.currentLocation];
        
        if (!currentLocation.heroes || currentLocation.heroes.length === 0) {
            showNotification('Aucun héros à vaincre ici !', 'warning');
            return false;
        }
        
        // Logique de combat simplifiée
        const hero = currentLocation.heroes[0]; // Premier héros
        currentLocation.heroes.shift();
        
        showNotification(`${hero.name} vaincu !`, 'success');
        if (window.animationManager) {
            animationManager.playDefeatAnimation(hero);
        }
        this.logAction(`${player.name} vainc ${hero.name}`);
        
        return true;
    }
    
    performActivateAction(player, targetCard) {
        // Activer un objet ou allié
        showNotification('Action Activer en développement...', 'info');
        return true;
    }
    
    // === GESTION DES CARTES ===
    
    playCard(card, player, targetLocation = null) {
        if (!cardManager.canPlayCard(card, player)) {
            return false;
        }
        
        const success = cardManager.playCard(card, player, targetLocation);
        
        if (success) {
            player.gameStats.cardsPlayed++;
            
            // Vérifier les conditions de victoire après avoir joué une carte
            this.checkVictoryCondition(player);
        }
        
        return success;
    }
    
    discardCard(card, player) {
        cardManager.discardCard(card, player);
        return true;
    }
    
    // === CONDITIONS DE VICTOIRE ===
    
    checkVictoryCondition(player) {
        if (player.hasWon) return;
        
        const hasWon = this.evaluateVictoryCondition(player);
        
        if (hasWon) {
            player.hasWon = true;
            this.endGame(player);
        }
    }
    
    evaluateVictoryCondition(player) {
        // Conditions spécifiques par méchant
        switch (player.villain.id) {
            case 'jafar':
                return this.checkJafarVictory(player);
                
            case 'maleficent':
                return this.checkMaleficentVictory(player);
                
            case 'captain_hook':
                return this.checkCaptainHookVictory(player);
                
            default:
                // Condition générique (exemple)
                return player.power >= 20;
        }
    }
    
    checkJafarVictory(player) {
        // Jafar gagne s'il a la Lampe du Génie et déplace le Génie vers la Caverne
        const hasLamp = player.items.some(item => item.name === 'Lampe du Génie');
        const genieAtCave = this.checkGenieLocation(player, 'Caverne aux Merveilles');
        
        return hasLamp && genieAtCave;
    }
    
    checkMaleficentVictory(player) {
        // Maleficent gagne si elle a la Malédiction à la Cour Royale
        const courtLocation = player.villain.board.find(loc => loc.name === 'Cour Royale');
        if (!courtLocation) return false;
        
        return courtLocation.items.some(item => item.name === 'Malédiction de la Roue');
    }
    
    checkCaptainHookVictory(player) {
        // Captain Hook gagne s'il vainc Peter Pan au Vaisseau Pirate
        const shipLocation = player.villain.board.find(loc => loc.name === 'Vaisseau Pirate');
        if (!shipLocation) return false;
        
        // Vérifier si Peter Pan a été vaincu (pas de héros Peter Pan)
        const noPeterPan = !player.villain.board.some(loc => 
            loc.heroes.some(hero => hero.name === 'Peter Pan')
        );
        
        return noPeterPan && player.currentLocation === player.villain.board.indexOf(shipLocation);
    }
    
    checkGenieLocation(player, targetLocationName) {
        const targetLocation = player.villain.board.find(loc => loc.name === targetLocationName);
        if (!targetLocation) return false;
        
        return targetLocation.allies.some(ally => ally.name === 'Génie');
    }
    
    endGame(winner) {
        this.gameState = 'ended';
        
        // Animation de victoire
        if (window.animationManager) {
            animationManager.playVictoryAnimation(winner);
        }
        
        // Notification
        showNotification(`🎉 ${winner.name} a gagné avec ${winner.villain.name} ! 🎉`, 'success');
        
        // Log final
        this.logAction(`=== ${winner.name} REMPORTE LA PARTIE ! ===`);
        this.logAction(`Condition de victoire: ${winner.villain.victoryCondition}`);
        this.logAction(`Tours joués: ${this.turnNumber}`);
        
        // Afficher l'écran de victoire
        setTimeout(() => {
            this.showVictoryScreen(winner);
        }, 2000);
    }
    
    showVictoryScreen(winner) {
        // Créer l'écran de victoire
        const victoryModal = this.createVictoryModal(winner);
        document.body.appendChild(victoryModal);
        
        // Afficher les statistiques
        this.displayGameStatistics();
    }
    
    createVictoryModal(winner) {
        const modal = document.createElement('div');
        modal.className = 'modal victory-modal';
        modal.innerHTML = `
            <div class="modal-content victory-content">
                <div class="victory-header">
                    <h2>🎉 VICTOIRE ! 🎉</h2>
                    <div class="winner-name">${winner.name}</div>
                    <div class="winner-villain">${winner.villain.name}</div>
                </div>
                <div class="victory-details">
                    <p><strong>Condition:</strong> ${winner.villain.victoryCondition}</p>
                    <p><strong>Tours joués:</strong> ${this.turnNumber}</p>
                    <p><strong>Cartes jouées:</strong> ${winner.gameStats.cardsPlayed}</p>
                    <p><strong>Pouvoir total gagné:</strong> ${winner.gameStats.powerGained}</p>
                </div>
                <div class="victory-actions">
                    <button onclick="gameManager.newGame()" class="btn primary">Nouvelle Partie</button>
                    <button onclick="gameManager.backToMenu()" class="btn secondary">Menu Principal</button>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    // === EFFETS PASSIFS ===
    
    applyPassiveEffects(player) {
        // Appliquer les effets des objets et conditions
        if (player.items) {
            player.items.forEach(item => {
                if (item.passive) {
                    this.applyPassiveEffect(item.passive, player);
                }
            });
        }
        
        if (player.conditions) {
            player.conditions.forEach(condition => {
                if (condition.passive) {
                    this.applyPassiveEffect(condition.passive, player);
                }
            });
        }
    }
    
    applyPassiveEffect(effect, player) {
        switch (effect.type) {
            case 'power_bonus':
                // Bonus de pouvoir passif (ne pas appliquer à chaque tour)
                break;
                
            case 'draw_bonus':
                if (effect.trigger === 'start_of_turn') {
                    this.drawCard(player);
                }
                break;
                
            case 'action_bonus':
                if (effect.trigger === 'start_of_turn') {
                    player.actionsRemaining += effect.value || 1;
                }
                break;
        }
    }
    
    applyEndOfTurnEffects(player) {
        // Effets de fin de tour
        if (player.conditions) {
            player.conditions.forEach(condition => {
                if (condition.endOfTurn) {
                    cardManager.executeCardAbility(condition.endOfTurn, player);
                }
            });
        }
    }
    
    // === INTERFACE ET ÉTAT ===
    
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
    
    getOtherPlayers() {
        return this.players.filter((_, index) => index !== this.currentPlayerIndex);
    }
    
    updateGameInterface() {
        const currentPlayer = this.getCurrentPlayer();
        
        if (window.uiManager) {
            uiManager.updateGameHeader(this.turnNumber, currentPlayer);
            uiManager.updatePlayerInfo(currentPlayer);
            uiManager.updateHand(currentPlayer);
            uiManager.updateBoard(currentPlayer);
            uiManager.updateActions(currentPlayer);
        }
    }
    
    logAction(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        
        this.actionHistory.push(logEntry);
        console.log(logEntry);
        
        // Mettre à jour le log visible si nécessaire
        this.updateActionLog();
    }
    
    updateActionLog() {
        const logContainer = document.getElementById('action-log');
        if (logContainer) {
            // Afficher les 10 dernières actions
            const recentActions = this.actionHistory.slice(-10);
            logContainer.innerHTML = recentActions
                .map(action => `<div class="log-entry">${action}</div>`)
                .join('');
            
            // Scroll vers le bas
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }
    
    displayGameStatistics() {
        // Afficher les statistiques de la partie
        console.log('=== STATISTIQUES DE LA PARTIE ===');
        this.players.forEach(player => {
            console.log(`${player.name} (${player.villain.name}):`);
            console.log(`  - Tours joués: ${player.gameStats.turnsTaken}`);
            console.log(`  - Cartes jouées: ${player.gameStats.cardsPlayed}`);
            console.log(`  - Pouvoir gagné: ${player.gameStats.powerGained}`);
            console.log(`  - Pouvoir final: ${player.power}`);
        });
    }
    
    // === UTILITAIRES ===
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    newGame() {
        // Nettoyer l'état actuel
        this.cleanupGame();
        
        // Retourner à la configuration
        uiManager.showGameSetup();
    }
    
    backToMenu() {
        // Nettoyer l'état actuel
        this.cleanupGame();
        
        // Retourner au menu principal
        uiManager.showMainMenu();
    }
    
    cleanupGame() {
        // Nettoyer les modals de victoire
        document.querySelectorAll('.victory-modal').forEach(modal => {
            modal.remove();
        });
        
        // Réinitialiser l'état
        this.players = [];
        this.currentPlayerIndex = 0;
        this.turnNumber = 1;
        this.actionHistory = [];
        this.gameState = 'setup';
    }
    
    saveGameState() {
        // Sauvegarder l'état du jeu (localStorage)
        const gameState = {
            players: this.players,
            currentPlayerIndex: this.currentPlayerIndex,
            turnNumber: this.turnNumber,
            gameState: this.gameState,
            actionHistory: this.actionHistory.slice(-50) // Garder seulement les 50 dernières actions
        };
        
        try {
            localStorage.setItem('villainous_save', JSON.stringify(gameState));
            showNotification('Partie sauvegardée !', 'success');
        } catch (error) {
            console.error('Erreur de sauvegarde:', error);
            showNotification('Erreur de sauvegarde', 'error');
        }
    }
    
    loadGameState() {
        try {
            const saved = localStorage.getItem('villainous_save');
            if (!saved) return false;
            
            const gameState = JSON.parse(saved);
            
            this.players = gameState.players;
            this.currentPlayerIndex = gameState.currentPlayerIndex;
            this.turnNumber = gameState.turnNumber;
            this.gameState = gameState.gameState;
            this.actionHistory = gameState.actionHistory || [];
            
            this.updateGameInterface();
            showNotification('Partie chargée !', 'success');
            
            return true;
        } catch (error) {
            console.error('Erreur de chargement:', error);
            showNotification('Erreur de chargement', 'error');
            return false;
        }
    }
}

// Instance globale
let gameManager;