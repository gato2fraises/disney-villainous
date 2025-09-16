"""
Énumérations pour Disney Villainous
Définit les types et constantes utilisés dans le jeu
"""

from enum import Enum


class CardType(Enum):
    """Types de cartes dans le jeu"""
    # Cartes Méchant
    ALLY = "ally"
    ITEM = "item"
    EFFECT = "effect"
    CONDITION = "condition"
    
    # Cartes Destin (Héros)
    HERO = "hero"
    EVENT = "event"
    ITEM_HERO = "item_hero"


class ActionType(Enum):
    """Types d'actions disponibles sur les lieux"""
    GAIN_POWER = "gain_power"
    PLAY_CARD = "play_card"
    ACTIVATE = "activate"
    DISCARD = "discard"
    VANQUISH = "vanquish"
    FATE = "fate"
    MOVE_ITEM = "move_item"
    MOVE_HERO = "move_hero"


class LocationPosition(Enum):
    """Positions des lieux sur le plateau"""
    LEFT = 0
    CENTER_LEFT = 1
    CENTER_RIGHT = 2
    RIGHT = 3


class GameState(Enum):
    """États possibles du jeu"""
    WAITING = "waiting"
    IN_PROGRESS = "in_progress"
    FINISHED = "finished"


class TurnPhase(Enum):
    """Phases d'un tour de jeu"""
    MOVE = "move"
    ACTIONS = "actions"
    DRAW = "draw"
    END = "end"


class VillainType(Enum):
    """Types de méchants disponibles"""
    MALEFICENT = "maleficent"
    JAFAR = "jafar"
    CAPTAIN_HOOK = "captain_hook"
    PRINCE_JOHN = "prince_john"
    QUEEN_OF_HEARTS = "queen_of_hearts"
    URSULA = "ursula"