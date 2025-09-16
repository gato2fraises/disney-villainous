// Gestionnaire des cartes et de leurs interactions

class CardManager {
    constructor() {
        this.selectedCard = null;
        this.cardDatabase = this.initializeCardDatabase();
        this.setupDropZones();
    }
    
    initializeCardDatabase() {
        // Base de données complète des cartes par méchant
        return {
            jafar: VILLAIN_CARDS.jafar,
            maleficent: VILLAIN_CARDS.maleficent,
            captain_hook: VILLAIN_CARDS.captain_hook
        };
    }
    
    setupDropZones() {
        // Zones de dépôt pour les cartes
        this.playZone = document.getElementById('board-container');
        this.discardZone = document.getElementById('discard-pile');
        this.powerZone = document.getElementById('player-power');
    }
    
    // === GESTION DES CARTES ===
    
    playCard(card, player, targetLocation = null) {
        if (!this.canPlayCard(card, player)) {
            showNotification('Impossible de jouer cette carte !', 'error');
            return false;
        }
        
        // Vérifier le coût
        if (player.power < card.cost) {
            showNotification('Pouvoir insuffisant !', 'warning');
            return false;
        }
        
        // Déduire le coût
        player.power -= card.cost;
        
        // Jouer la carte selon son type
        const success = this.executeCardEffect(card, player, targetLocation);
        
        if (success) {
            // Retirer de la main
            this.removeCardFromHand(card, player);
            
            // Ajouter à la zone appropriée
            this.addCardToPlay(card, player, targetLocation);
            
            // Animation et feedback
            if (window.animationManager) {
                animationManager.playCardAnimation(card);
            }
            showNotification(`${card.name} joué !`, 'success');
            
            // Log de l'action
            gameManager.logAction(`${player.name} joue ${card.name}`);
            
            // Mettre à jour l'interface
            uiManager.updatePlayerInfo(player);
            uiManager.updateHand(player);
            uiManager.updateBoard(player);
            
            return true;
        }
        
        // Rembourser en cas d'échec
        player.power += card.cost;
        return false;
    }
    
    canPlayCard(card, player) {
        // Vérifications générales
        if (!card || !player) return false;
        if (player.power < card.cost) return false;
        
        // Vérifications spécifiques par type
        switch (card.type) {
            case 'ally':
                return this.canPlayAlly(card, player);
                
            case 'item':
                return this.canPlayItem(card, player);
                
            case 'effect':
                return this.canPlayEffect(card, player);
                
            case 'condition':
                return this.canPlayCondition(card, player);
                
            default:
                return true;
        }
    }
    
    canPlayAlly(card, player) {
        const currentLocation = player.villain.board[player.currentLocation];
        
        // Vérifier si le lieu accepte les alliés
        const hasPlayAction = currentLocation.actions.some(action => 
            action.type === 'play_card' && !this.isActionBlocked(action, currentLocation)
        );
        
        return hasPlayAction;
    }
    
    canPlayItem(card, player) {
        // Les objets peuvent généralement être joués partout
        return true;
    }
    
    canPlayEffect(card, player) {
        // Vérifier les conditions de l'effet
        if (card.conditions) {
            return this.checkCardConditions(card.conditions, player);
        }
        return true;
    }
    
    canPlayCondition(card, player) {
        // Les conditions ont des règles spéciales
        return this.checkSpecialConditions(card, player);
    }
    
    executeCardEffect(card, player, targetLocation) {
        switch (card.type) {
            case 'ally':
                return this.executeAllyEffect(card, player, targetLocation);
                
            case 'item':
                return this.executeItemEffect(card, player);
                
            case 'effect':
                return this.executeEffectCard(card, player);
                
            case 'condition':
                return this.executeConditionCard(card, player);
                
            default:
                console.warn(`Type de carte non géré: ${card.type}`);
                return false;
        }
    }
    
    executeAllyEffect(card, player, targetLocation) {
        const locationIndex = targetLocation !== null ? targetLocation : player.currentLocation;
        const location = player.villain.board[locationIndex];
        
        if (!location) return false;
        
        // Ajouter l'allié au lieu
        if (!location.allies) {
            location.allies = [];
        }
        location.allies.push(card);
        
        // Effet immédiat si spécifié
        if (card.onPlay) {
            this.executeCardAbility(card.onPlay, player, location);
        }
        
        return true;
    }
    
    executeItemEffect(card, player) {
        // Ajouter l'objet à l'inventaire du joueur
        if (!player.items) {
            player.items = [];
        }
        player.items.push(card);
        
        // Effet immédiat
        if (card.onPlay) {
            this.executeCardAbility(card.onPlay, player);
        }
        
        // Effet permanent
        if (card.passive) {
            this.applyPassiveEffect(card.passive, player);
        }
        
        return true;
    }
    
    executeEffectCard(card, player) {
        // Exécuter l'effet immédiatement
        if (card.effect) {
            return this.executeCardAbility(card.effect, player);
        }
        return true;
    }
    
    executeConditionCard(card, player) {
        // Les cartes condition restent en jeu
        if (!player.conditions) {
            player.conditions = [];
        }
        player.conditions.push(card);
        
        // Effet d'entrée
        if (card.onPlay) {
            this.executeCardAbility(card.onPlay, player);
        }
        
        return true;
    }
    
    executeCardAbility(ability, player, location = null) {
        if (!ability) return true;
        
        switch (ability.type) {
            case 'gain_power':
                return this.gainPower(player, ability.value);
                
            case 'draw_cards':
                return this.drawCards(player, ability.value);
                
            case 'move_item':
                return this.moveItem(player, ability);
                
            case 'defeat_hero':
                return this.defeatHero(player, location, ability);
                
            case 'gain_action':
                return this.gainAction(player, ability);
                
            case 'search_deck':
                return this.searchDeck(player, ability);
                
            case 'protect_location':
                return this.protectLocation(player, location, ability);
                
            default:
                console.warn(`Capacité non implémentée: ${ability.type}`);
                return true;
        }
    }
    
    // === EFFETS SPÉCIFIQUES ===
    
    gainPower(player, amount) {
        player.power += amount;
        if (window.animationManager) {
            animationManager.playPowerGainAnimation(amount);
        }
        showNotification(`+${amount} pouvoir !`, 'success');
        return true;
    }
    
    drawCards(player, amount) {
        const drawnCards = [];
        
        for (let i = 0; i < amount; i++) {
            const card = this.drawCard(player);
            if (card) {
                drawnCards.push(card);
            }
        }
        
        if (drawnCards.length > 0) {
            showNotification(`${drawnCards.length} carte(s) piochée(s) !`, 'success');
            if (window.animationManager) {
                animationManager.playDrawCardAnimation(drawnCards);
            }
        }
        
        return drawnCards.length > 0;
    }
    
    drawCard(player) {
        if (!player.deck || player.deck.length === 0) {
            // Mélanger la défausse dans le deck
            this.reshuffleDiscard(player);
        }
        
        if (player.deck.length === 0) {
            return null;
        }
        
        const card = player.deck.pop();
        player.hand.push(card);
        
        return card;
    }
    
    reshuffleDiscard(player) {
        if (!player.discard || player.discard.length === 0) {
            return;
        }
        
        // Mélanger la défausse
        player.deck = this.shuffleArray([...player.discard]);
        player.discard = [];
        
        showNotification('Défausse mélangée dans le deck !', 'info');
        if (window.animationManager) {
            animationManager.playShuffleAnimation();
        }
    }
    
    moveItem(player, ability) {
        // Déplacer un objet (logique Jafar)
        const item = ability.itemName;
        const targetLocation = ability.targetLocation;
        
        showNotification(`Déplacement de ${item} vers ${targetLocation}`, 'info');
        return true;
    }
    
    defeatHero(player, location, ability) {
        if (!location || !location.heroes || location.heroes.length === 0) {
            return false;
        }
        
        // Logique de combat simplifiée
        const heroIndex = 0; // Premier héros par défaut
        const defeatedHero = location.heroes.splice(heroIndex, 1)[0];
        
        if (defeatedHero) {
            showNotification(`${defeatedHero.name} vaincu !`, 'success');
            if (window.animationManager) {
                animationManager.playDefeatAnimation(defeatedHero);
            }
            
            // Récompense
            if (ability.reward) {
                this.executeCardAbility(ability.reward, player);
            }
        }
        
        return true;
    }
    
    gainAction(player, ability) {
        // Gagner une action supplémentaire
        if (!player.extraActions) {
            player.extraActions = 0;
        }
        player.extraActions += ability.value || 1;
        
        showNotification(`+${ability.value || 1} action !`, 'success');
        return true;
    }
    
    searchDeck(player, ability) {
        // Chercher une carte spécifique dans le deck
        const cardType = ability.cardType;
        const foundCard = player.deck.find(card => 
            card.type === cardType || card.name === ability.cardName
        );
        
        if (foundCard) {
            // Retirer du deck et ajouter à la main
            player.deck = player.deck.filter(card => card !== foundCard);
            player.hand.push(foundCard);
            
            showNotification(`${foundCard.name} trouvé !`, 'success');
            return true;
        }
        
        return false;
    }
    
    protectLocation(player, location, ability) {
        // Protéger un lieu
        if (location) {
            location.protected = true;
            showNotification(`${location.name} protégé !`, 'success');
        }
        return true;
    }
    
    // === GESTION DES PILES ===
    
    removeCardFromHand(card, player) {
        player.hand = player.hand.filter(c => c !== card);
    }
    
    addCardToPlay(card, player, location) {
        switch (card.type) {
            case 'ally':
                this.addAllyToLocation(card, player, location);
                break;
                
            case 'item':
                this.addItemToPlayer(card, player);
                break;
                
            case 'effect':
                this.addCardToDiscard(card, player);
                break;
                
            case 'condition':
                this.addConditionToPlayer(card, player);
                break;
        }
    }
    
    addAllyToLocation(card, player, locationIndex) {
        const location = player.villain.board[locationIndex || player.currentLocation];
        if (!location.allies) {
            location.allies = [];
        }
        location.allies.push(card);
    }
    
    addItemToPlayer(card, player) {
        if (!player.items) {
            player.items = [];
        }
        player.items.push(card);
    }
    
    addConditionToPlayer(card, player) {
        if (!player.conditions) {
            player.conditions = [];
        }
        player.conditions.push(card);
    }
    
    addCardToDiscard(card, player) {
        if (!player.discard) {
            player.discard = [];
        }
        player.discard.push(card);
    }
    
    discardCard(card, player) {
        // Retirer de la main
        this.removeCardFromHand(card, player);
        
        // Ajouter à la défausse
        this.addCardToDiscard(card, player);
        
        // Feedback
        showNotification(`${card.name} défaussé`, 'info');
        if (window.animationManager) {
            animationManager.playDiscardAnimation(card);
        }
        
        // Mettre à jour l'interface
        uiManager.updateHand(player);
        
        // Log
        gameManager.logAction(`${player.name} défausse ${card.name}`);
    }
    
    // === VÉRIFICATIONS ET CONDITIONS ===
    
    isActionBlocked(action, location) {
        return action.blockedByHeroes && location.heroes && location.heroes.length > 0;
    }
    
    checkCardConditions(conditions, player) {
        // Vérifier toutes les conditions
        for (const condition of conditions) {
            if (!this.checkSingleCondition(condition, player)) {
                return false;
            }
        }
        return true;
    }
    
    checkSingleCondition(condition, player) {
        switch (condition.type) {
            case 'power_minimum':
                return player.power >= condition.value;
                
            case 'location_type':
                const currentLocation = player.villain.board[player.currentLocation];
                return currentLocation.type === condition.value;
                
            case 'has_item':
                return player.items && player.items.some(item => item.name === condition.value);
                
            case 'ally_present':
                const location = player.villain.board[player.currentLocation];
                return location.allies && location.allies.length > 0;
                
            case 'no_heroes':
                const loc = player.villain.board[player.currentLocation];
                return !loc.heroes || loc.heroes.length === 0;
                
            default:
                return true;
        }
    }
    
    checkSpecialConditions(card, player) {
        // Conditions spéciales selon le méchant et la carte
        if (card.special) {
            switch (card.special.type) {
                case 'jafar_lamp':
                    return this.checkJafarLampCondition(player);
                    
                case 'maleficent_curse':
                    return this.checkMaleficentCurseCondition(player);
                    
                case 'hook_clock':
                    return this.checkHookClockCondition(player);
                    
                default:
                    return true;
            }
        }
        return true;
    }
    
    checkJafarLampCondition(player) {
        // Vérifier si Jafar a la lampe
        return player.items && player.items.some(item => item.name === 'Lampe du Génie');
    }
    
    checkMaleficentCurseCondition(player) {
        // Vérifier les conditions de malédiction
        return player.conditions && player.conditions.some(cond => cond.name.includes('Malédiction'));
    }
    
    checkHookClockCondition(player) {
        // Vérifier le crocodile/horloge
        return player.items && player.items.some(item => item.name.includes('Horloge'));
    }
    
    // === UTILITAIRES ===
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    createInitialDeck(villainId) {
        const villainCards = this.cardDatabase[villainId];
        if (!villainCards) {
            console.error(`Aucune carte trouvée pour ${villainId}`);
            return [];
        }
        
        // Créer le deck complet avec les bonnes quantités
        const deck = [];
        
        villainCards.forEach(cardTemplate => {
            const quantity = cardTemplate.quantity || 1;
            for (let i = 0; i < quantity; i++) {
                deck.push({ ...cardTemplate });
            }
        });
        
        return this.shuffleArray(deck);
    }
    
    getCardInfo(cardName, villainId) {
        const villainCards = this.cardDatabase[villainId];
        return villainCards ? villainCards.find(card => card.name === cardName) : null;
    }
    
    countCardsInPlay(player, cardType = null) {
        let count = 0;
        
        // Compter dans les lieux
        player.villain.board.forEach(location => {
            if (location.allies) {
                count += cardType ? 
                    location.allies.filter(card => card.type === cardType).length :
                    location.allies.length;
            }
        });
        
        // Compter les objets
        if (player.items) {
            count += cardType === 'item' ? player.items.length : 
                    cardType === null ? player.items.length : 0;
        }
        
        // Compter les conditions
        if (player.conditions) {
            count += cardType === 'condition' ? player.conditions.length :
                    cardType === null ? player.conditions.length : 0;
        }
        
        return count;
    }
}

// Instance globale
let cardManager;