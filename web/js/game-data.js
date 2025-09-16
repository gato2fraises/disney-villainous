// Données de jeu pour Disney Villainous Web

// Méchants disponibles
const VILLAINS = {
    jafar: {
        id: 'jafar',
        name: 'Jafar',
        icon: '🧙‍♂️',
        description: 'Le vizir maléfique d\'Agrabah qui cherche à devenir le génie le plus puissant',
        startingPower: 4,
        victoryCondition: 'Avoir la Lampe Magique à la Caverne aux Merveilles et avoir vaincu Aladdin',
        color: '#8B4513',
        board: [
            {
                id: 'palace_gates',
                name: 'Portes du Palais',
                description: 'L\'entrée majestueuse du palais d\'Agrabah',
                actions: [
                    { type: 'gain_power', value: 2, icon: '💰', description: 'Gagne 2 pouvoirs' },
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte', blockedByHeroes: true },
                    { type: 'vanquish', icon: '⚔️', description: 'Vaincs un héros' },
                    { type: 'discard', icon: '🗑️', description: 'Défausse des cartes' }
                ]
            },
            {
                id: 'throne_room',
                name: 'Salle du Trône',
                description: 'Le cœur du pouvoir du palais',
                actions: [
                    { type: 'gain_power', value: 1, icon: '💰', description: 'Gagne 1 pouvoir' },
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte' },
                    { type: 'activate', icon: '🔧', description: 'Active une capacité', blockedByHeroes: true },
                    { type: 'fate', icon: '🔮', description: 'Joue le Destin' }
                ]
            },
            {
                id: 'cave_of_wonders',
                name: 'Caverne aux Merveilles',
                description: 'La caverne mystérieuse pleine de trésors',
                actions: [
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte', blockedByHeroes: true },
                    { type: 'activate', icon: '🔧', description: 'Active une capacité' },
                    { type: 'discard', icon: '🗑️', description: 'Défausse des cartes' },
                    { type: 'gain_power', value: 3, icon: '💰', description: 'Gagne 3 pouvoirs' }
                ]
            },
            {
                id: 'secret_chamber',
                name: 'Chambre Secrète',
                description: 'Le laboratoire secret de Jafar',
                actions: [
                    { type: 'fate', icon: '🔮', description: 'Joue le Destin' },
                    { type: 'gain_power', value: 1, icon: '💰', description: 'Gagne 1 pouvoir' },
                    { type: 'move_item', icon: '📦', description: 'Déplace un objet' },
                    { type: 'activate', icon: '🔧', description: 'Active une capacité', blockedByHeroes: true }
                ]
            }
        ]
    },
    maleficent: {
        id: 'maleficent',
        name: 'Maléfique',
        icon: '🧚‍♀️',
        description: 'La fée maléfique qui veut maudire tous les royaumes',
        startingPower: 3,
        victoryCondition: 'Commencer son tour avec une Malédiction sur chacun des 4 lieux',
        color: '#9932CC',
        board: [
            {
                id: 'forbidden_mountain',
                name: 'Montagne Interdite',
                description: 'Le repaire sinistre de Maléfique',
                actions: [
                    { type: 'gain_power', value: 2, icon: '💰', description: 'Gagne 2 pouvoirs' },
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte' },
                    { type: 'activate', icon: '🔧', description: 'Active une capacité', blockedByHeroes: true },
                    { type: 'discard', icon: '🗑️', description: 'Défausse des cartes' }
                ]
            },
            {
                id: 'briar_rose_cottage',
                name: 'Chaumière de Rose',
                description: 'La cachette des trois fées',
                actions: [
                    { type: 'fate', icon: '🔮', description: 'Joue le Destin' },
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte', blockedByHeroes: true },
                    { type: 'gain_power', value: 1, icon: '💰', description: 'Gagne 1 pouvoir' },
                    { type: 'vanquish', icon: '⚔️', description: 'Vaincs un héros' }
                ]
            },
            {
                id: 'king_stefans_castle',
                name: 'Château du Roi Stefan',
                description: 'Le royaume de la Princesse Aurore',
                actions: [
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte' },
                    { type: 'vanquish', icon: '⚔️', description: 'Vaincs un héros', blockedByHeroes: true },
                    { type: 'gain_power', value: 2, icon: '💰', description: 'Gagne 2 pouvoirs' },
                    { type: 'activate', icon: '🔧', description: 'Active une capacité' }
                ]
            },
            {
                id: 'forest',
                name: 'Forêt Enchantée',
                description: 'La forêt où se cache Aurore',
                actions: [
                    { type: 'discard', icon: '🗑️', description: 'Défausse des cartes' },
                    { type: 'fate', icon: '🔮', description: 'Joue le Destin' },
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte', blockedByHeroes: true },
                    { type: 'gain_power', value: 1, icon: '💰', description: 'Gagne 1 pouvoir' }
                ]
            }
        ]
    },
    captain_hook: {
        id: 'captain_hook',
        name: 'Capitaine Crochet',
        icon: '🏴‍☠️',
        description: 'Le capitaine pirate obsédé par sa vengeance contre Peter Pan',
        startingPower: 2,
        victoryCondition: 'Vaincre Peter Pan au Jolly Roger',
        color: '#8B0000',
        board: [
            {
                id: 'jolly_roger',
                name: 'Jolly Roger',
                description: 'Le navire pirate du Capitaine Crochet',
                actions: [
                    { type: 'gain_power', value: 2, icon: '💰', description: 'Gagne 2 pouvoirs' },
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte', blockedByHeroes: true },
                    { type: 'vanquish', icon: '⚔️', description: 'Vaincs un héros' },
                    { type: 'activate', icon: '🔧', description: 'Active une capacité' }
                ]
            },
            {
                id: 'skull_rock',
                name: 'Rocher du Crâne',
                description: 'Le repaire secret des pirates',
                actions: [
                    { type: 'fate', icon: '🔮', description: 'Joue le Destin' },
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte' },
                    { type: 'gain_power', value: 1, icon: '💰', description: 'Gagne 1 pouvoir' },
                    { type: 'discard', icon: '🗑️', description: 'Défausse des cartes', blockedByHeroes: true }
                ]
            },
            {
                id: 'mermaid_lagoon',
                name: 'Lagon des Sirènes',
                description: 'Le territoire aquatique du Pays Imaginaire',
                actions: [
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte' },
                    { type: 'activate', icon: '🔧', description: 'Active une capacité', blockedByHeroes: true },
                    { type: 'fate', icon: '🔮', description: 'Joue le Destin' },
                    { type: 'gain_power', value: 2, icon: '💰', description: 'Gagne 2 pouvoirs' }
                ]
            },
            {
                id: 'hangmans_tree',
                name: 'Arbre du Pendu',
                description: 'La cachette de Peter Pan et des Enfants Perdus',
                actions: [
                    { type: 'discard', icon: '🗑️', description: 'Défausse des cartes' },
                    { type: 'play_card', icon: '🃏', description: 'Joue une carte', blockedByHeroes: true },
                    { type: 'gain_power', value: 1, icon: '💰', description: 'Gagne 1 pouvoir' },
                    { type: 'vanquish', icon: '⚔️', description: 'Vaincs un héros' }
                ]
            }
        ]
    }
};

// Cartes par méchant
const CARDS = {
    jafar: {
        villain: [
            {
                id: 'iago',
                name: 'Iago',
                type: 'ally',
                cost: 2,
                strength: 1,
                description: 'Le perroquet maléfique de Jafar',
                image: '🦜',
                effects: ['Gagne 1 pouvoir quand joué']
            },
            {
                id: 'razoul',
                name: 'Razoul',
                type: 'ally',
                cost: 3,
                strength: 3,
                description: 'Capitaine des gardes du palais',
                image: '💂',
                effects: ['Force +1 si au Palais']
            },
            {
                id: 'guards',
                name: 'Gardes du Palais',
                type: 'ally',
                cost: 1,
                strength: 1,
                description: 'Les gardes loyaux au Vizir',
                image: '🛡️',
                effects: ['Force +1 pour chaque autre garde']
            },
            {
                id: 'thieves',
                name: 'Voleurs d\'Agrabah',
                type: 'ally',
                cost: 2,
                strength: 2,
                description: 'Bandits des rues d\'Agrabah',
                image: '🗡️',
                effects: ['Gagne 1 pouvoir en entrant en jeu']
            },
            {
                id: 'giant_cobra',
                name: 'Cobra Géant',
                type: 'ally',
                cost: 4,
                strength: 4,
                description: 'Serpent transformé par la magie de Jafar',
                image: '🐍',
                effects: ['Peut vaincre n\'importe quel héros de force 3 ou moins']
            },
            {
                id: 'magic_lamp',
                name: 'Lampe Magique',
                type: 'item',
                cost: 4,
                description: 'La lampe du génie - objectif de victoire',
                image: '🪔',
                effects: ['Permet de vaincre n\'importe quel héros', 'Gagne 2 pouvoirs par tour']
            },
            {
                id: 'snake_staff',
                name: 'Bâton de Serpent',
                type: 'item',
                cost: 2,
                description: 'Le bâton magique de Jafar',
                image: '🐍',
                effects: ['Les héros ont -1 force']
            },
            {
                id: 'control_ring',
                name: 'Anneau de Contrôle',
                type: 'item',
                cost: 3,
                description: 'Anneau magique pour contrôler les esprits',
                image: '💍',
                effects: ['Peut hypnotiser un héros au lieu de le vaincre']
            },
            {
                id: 'flying_carpet',
                name: 'Tapis Volant',
                type: 'item',
                cost: 2,
                description: 'Permet de se déplacer rapidement',
                image: '🕌',
                effects: ['Peut se déplacer vers n\'importe quel lieu']
            },
            {
                id: 'hypnotize',
                name: 'Hypnotiser',
                type: 'effect',
                cost: 2,
                description: 'Jafar hypnotise ses ennemis',
                image: '👁️',
                effects: ['Prends le contrôle d\'un héros']
            },
            {
                id: 'all_powerful_genie',
                name: 'Génie Tout-Puissant',
                type: 'effect',
                cost: 5,
                description: 'Jafar devient le génie le plus puissant',
                image: '🧞',
                effects: ['Gagne 4 pouvoirs et pioche 2 cartes']
            },
            {
                id: 'sandstorm',
                name: 'Tempête de Sable',
                type: 'effect',
                cost: 3,
                description: 'Une tempête bloque tous les héros',
                image: '🌪️',
                effects: ['Tous les héros sont bloqués ce tour']
            },
            {
                id: 'palace_riches',
                name: 'Richesses du Palais',
                type: 'effect',
                cost: 1,
                description: 'Puise dans les richesses royales',
                image: '💎',
                effects: ['Gagne 3 pouvoirs']
            },
            {
                id: 'magic_illusion',
                name: 'Illusion Magique',
                type: 'effect',
                cost: 2,
                description: 'Crée des illusions pour tromper les héros',
                image: '✨',
                effects: ['Pioche 2 cartes et gagne 1 pouvoir']
            },
            {
                id: 'sultan_hypnotized',
                name: 'Sultan Hypnotisé',
                type: 'condition',
                cost: 3,
                description: 'Le Sultan est sous contrôle',
                image: '👑',
                effects: ['Gagne 1 pouvoir par tour']
            }
        ],
        fate: [
            {
                id: 'aladdin',
                name: 'Aladdin',
                type: 'hero',
                strength: 3,
                description: 'Le jeune voleur d\'Agrabah',
                image: '👳',
                effects: ['Bloque les actions de jeu de carte']
            },
            {
                id: 'abu',
                name: 'Abu',
                type: 'hero',
                strength: 1,
                description: 'Le singe fidèle d\'Aladdin',
                image: '🐒',
                effects: ['Vole 1 pouvoir quand placé']
            },
            {
                id: 'genie',
                name: 'Génie',
                type: 'hero',
                strength: 4,
                description: 'Le génie de la lampe magique',
                image: '🧞‍♂️',
                effects: ['Ne peut être vaincu que par la Lampe Magique']
            },
            {
                id: 'jasmine',
                name: 'Princesse Jasmine',
                type: 'hero',
                strength: 2,
                description: 'La princesse rebelle d\'Agrabah',
                image: '👸',
                effects: ['Déplace Aladdin vers ce lieu']
            },
            {
                id: 'rajah',
                name: 'Rajah',
                type: 'hero',
                strength: 2,
                description: 'Le tigre protecteur de Jasmine',
                image: '🐅',
                effects: ['Les alliés ont -1 force ici']
            },
            {
                id: 'magic_carpet',
                name: 'Tapis Magique',
                type: 'hero',
                strength: 1,
                description: 'Le tapis volant d\'Aladdin',
                image: '🕌',
                effects: ['Déplace un héros vers un autre lieu']
            }
        ]
    }
};

// Types d'actions
const ACTION_TYPES = {
    gain_power: { name: 'Gagner du Pouvoir', icon: '💰' },
    play_card: { name: 'Jouer une Carte', icon: '🃏' },
    activate: { name: 'Activer', icon: '🔧' },
    vanquish: { name: 'Vaincre', icon: '⚔️' },
    discard: { name: 'Défausser', icon: '🗑️' },
    fate: { name: 'Destin', icon: '🔮' },
    move_item: { name: 'Déplacer', icon: '📦' }
};

// Configuration du jeu
const GAME_CONFIG = {
    maxPlayers: 6,
    minPlayers: 2,
    handSize: 4,
    maxActions: 4,
    startingHandSize: 4
};

// Utilitaires
const CARD_ICONS = {
    ally: '👥',
    item: '📦',
    effect: '✨',
    condition: '📋',
    hero: '🦸'
};

const CARD_COLORS = {
    ally: '#8B4513',
    item: '#4169E1',
    effect: '#9932CC',
    condition: '#DC143C',
    hero: '#FFD700'
};