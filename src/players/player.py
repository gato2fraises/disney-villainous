"""
Classe Player - Représente un joueur dans Disney Villainous
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any
from ..cards.card import Card
from ..board.location import Location
from ..core.enums import VillainType, TurnPhase


@dataclass
class Player:
    """
    Classe représentant un joueur (méchant) dans le jeu
    """
    id: str
    name: str
    villain_type: VillainType
    
    # Ressources
    power: int = 0
    
    # Cartes
    hand: List[Card] = field(default_factory=list)
    villain_deck: List[Card] = field(default_factory=list)
    fate_deck: List[Card] = field(default_factory=list)
    discard_pile: List[Card] = field(default_factory=list)
    fate_discard: List[Card] = field(default_factory=list)
    
    # Plateau
    board_locations: List[Location] = field(default_factory=list)
    current_location: int = 0  # Position actuelle (0-3)
    
    # Cartes en jeu
    allies_in_play: List[Card] = field(default_factory=list)
    items_in_play: List[Card] = field(default_factory=list)
    conditions_in_play: List[Card] = field(default_factory=list)
    
    # État du jeu
    has_won: bool = False
    turn_phase: TurnPhase = TurnPhase.MOVE
    actions_remaining: int = 0
    
    # Objectif de victoire
    victory_condition: str = ""
    victory_progress: Dict[str, Any] = field(default_factory=dict)
    
    def __post_init__(self):
        """Initialisation après création"""
        if len(self.board_locations) == 0:
            # Les locations seront chargées depuis les données
            pass
        
        # Validation de la position
        if not (0 <= self.current_location <= 3):
            self.current_location = 0
    
    # === Gestion des cartes ===
    
    def draw_card(self, from_fate: bool = False) -> Optional[Card]:
        """Pioche une carte du deck approprié"""
        deck = self.fate_deck if from_fate else self.villain_deck
        discard = self.fate_discard if from_fate else self.discard_pile
        
        if deck.is_empty():
            # Mélange la défausse dans le deck
            if discard:
                for card in discard:
                    deck.add_card(card)
                discard.clear()
                deck.shuffle()
            else:
                return None  # Plus de cartes disponibles
        
        card = deck.draw_card()
        if card and not from_fate:
            self.hand.append(card)
        return card
    
    def play_card(self, card: Card, location_id: Optional[str] = None) -> bool:
        """Joue une carte depuis la main"""
        if card not in self.hand:
            return False
        
        if self.power < card.cost:
            return False  # Pas assez de pouvoir
        
        # Vérifie les restrictions de lieu
        if location_id and not card.is_playable_at_location(location_id):
            return False
        
        # Paye le coût
        self.power -= card.cost
        
        # Retire de la main
        self.hand.remove(card)
        
        # Place la carte selon son type
        if card.is_ally():
            self.allies_in_play.append(card)
        elif card.is_item():
            self.items_in_play.append(card)
        elif card.card_type.value == "condition":
            self.conditions_in_play.append(card)
        else:
            # Effet immédiat, va à la défausse
            self.discard_pile.append(card)
        
        return True
    
    def discard_card(self, card: Card) -> bool:
        """Défausse une carte de la main"""
        if card in self.hand:
            self.hand.remove(card)
            self.discard_pile.append(card)
            return True
        return False
    
    def refill_hand(self, target_size: int = 4) -> None:
        """Remet la main à la taille cible"""
        while len(self.hand) < target_size:
            drawn_card = self.draw_card()
            if not drawn_card:
                break  # Plus de cartes à piocher
    
    # === Gestion du plateau ===
    
    def move_to_location(self, position: int) -> bool:
        """Déplace le méchant vers un lieu"""
        if 0 <= position <= 3 and position != self.current_location:
            self.current_location = position
            return True
        return False
    
    def get_current_location(self) -> Optional[Location]:
        """Retourne le lieu actuel"""
        if 0 <= self.current_location < len(self.board_locations):
            return self.board_locations[self.current_location]
        return None
    
    def can_move_to(self, position: int) -> bool:
        """Vérifie si le déplacement est possible"""
        return (0 <= position <= 3 and 
                position != self.current_location and
                position < len(self.board_locations))
    
    # === Gestion des ressources ===
    
    def gain_power(self, amount: int) -> None:
        """Gagne du pouvoir"""
        self.power = max(0, self.power + amount)
    
    def spend_power(self, amount: int) -> bool:
        """Dépense du pouvoir si possible"""
        if self.power >= amount:
            self.power -= amount
            return True
        return False
    
    # === Conditions de victoire ===
    
    def check_victory_condition(self) -> bool:
        """Vérifie si le joueur a gagné (à surcharger par méchant)"""
        # Implémentation de base - à spécialiser
        return False
    
    def update_victory_progress(self, key: str, value: Any) -> None:
        """Met à jour le progrès vers la victoire"""
        self.victory_progress[key] = value
        
        # Vérifie la condition après chaque mise à jour
        if self.check_victory_condition():
            self.has_won = True
    
    # === Informations d'état ===
    
    def get_hand_size(self) -> int:
        """Retourne la taille de la main"""
        return len(self.hand)
    
    def get_deck_size(self) -> int:
        """Retourne la taille du deck"""
        return len(self.villain_deck)
    
    def get_total_strength(self, location_id: Optional[str] = None) -> int:
        """Retourne la force totale des alliés (optionnellement à un lieu)"""
        total = 0
        for ally in self.allies_in_play:
            if ally.strength and (location_id is None or ally.location_restriction == location_id):
                total += ally.strength
        return total
    
    def __str__(self) -> str:
        """Représentation textuelle du joueur"""
        location_name = ""
        if self.get_current_location():
            location_name = f" @ {self.get_current_location().name}"
        
        return f"{self.name} ({self.villain_type.value}) - {self.power} Power{location_name}"
    
    def __repr__(self) -> str:
        """Représentation pour le debug"""
        return f"Player(id='{self.id}', villain='{self.villain_type.value}', power={self.power})"