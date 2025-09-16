"""
Classe Card - Représente une carte dans Disney Villainous
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from ..core.enums import CardType


@dataclass
class CardEffect:
    """Représente un effet d'une carte"""
    description: str
    trigger: str  # "play", "activate", "discard", "passive"
    target: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None


@dataclass
class Card:
    """
    Classe représentant une carte du jeu
    """
    id: str
    name: str
    card_type: CardType
    cost: int
    description: str
    effects: List[CardEffect]
    
    # Attributs spécifiques selon le type
    strength: Optional[int] = None  # Pour les alliés et héros
    location_restriction: Optional[str] = None  # Lieu spécifique requis
    
    # Métadonnées
    villain_set: Optional[str] = None  # À quel méchant appartient la carte
    expansion: str = "base"
    
    def __post_init__(self):
        """Validation des données après initialisation"""
        if self.cost < 0:
            raise ValueError("Le coût d'une carte ne peut pas être négatif")
        
        if self.strength is not None and self.strength < 0:
            raise ValueError("La force d'une carte ne peut pas être négative")
    
    def is_ally(self) -> bool:
        """Vérifie si la carte est un allié"""
        return self.card_type == CardType.ALLY
    
    def is_hero(self) -> bool:
        """Vérifie si la carte est un héros"""
        return self.card_type == CardType.HERO
    
    def is_item(self) -> bool:
        """Vérifie si la carte est un objet"""
        return self.card_type in [CardType.ITEM, CardType.ITEM_HERO]
    
    def is_playable_at_location(self, location_name: str) -> bool:
        """Vérifie si la carte peut être jouée à un lieu donné"""
        if self.location_restriction is None:
            return True
        return self.location_restriction == location_name
    
    def get_effects_by_trigger(self, trigger: str) -> List[CardEffect]:
        """Retourne tous les effets déclenchés par un trigger donné"""
        return [effect for effect in self.effects if effect.trigger == trigger]
    
    def __str__(self) -> str:
        """Représentation textuelle de la carte"""
        return f"{self.name} ({self.cost} Power) - {self.description}"
    
    def __repr__(self) -> str:
        """Représentation pour le debug"""
        return f"Card(id='{self.id}', name='{self.name}', type='{self.card_type.value}', cost={self.cost})"