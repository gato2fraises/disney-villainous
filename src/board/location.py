"""
Classe Location - Représente un lieu sur le plateau d'un méchant
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional
from ..core.enums import ActionType


@dataclass
class Action:
    """Représente une action disponible sur un lieu"""
    action_type: ActionType
    value: Optional[int] = None  # Valeur pour gain_power par exemple
    description: str = ""
    blocked_by_heroes: bool = False  # Si l'action est bloquée par la présence de héros
    
    def __str__(self) -> str:
        if self.value:
            return f"{self.action_type.value} ({self.value})"
        return self.action_type.value


@dataclass
class Location:
    """
    Classe représentant un lieu sur le plateau d'un méchant
    """
    id: str
    name: str
    position: int  # 0-3 pour les 4 lieux
    actions: List[Action] = field(default_factory=list)
    
    # État du lieu
    heroes_present: List[str] = field(default_factory=list)  # IDs des héros présents
    items_present: List[str] = field(default_factory=list)   # IDs des objets présents
    
    # Métadonnées
    description: str = ""
    image_path: Optional[str] = None
    
    def __post_init__(self):
        """Validation après initialisation"""
        if not (0 <= self.position <= 3):
            raise ValueError("La position d'un lieu doit être entre 0 et 3")
        
        if len(self.actions) > 4:
            raise ValueError("Un lieu ne peut pas avoir plus de 4 actions")
    
    def add_hero(self, hero_id: str) -> None:
        """Ajoute un héros sur ce lieu"""
        if hero_id not in self.heroes_present:
            self.heroes_present.append(hero_id)
    
    def remove_hero(self, hero_id: str) -> None:
        """Retire un héros de ce lieu"""
        if hero_id in self.heroes_present:
            self.heroes_present.remove(hero_id)
    
    def add_item(self, item_id: str) -> None:
        """Ajoute un objet sur ce lieu"""
        if item_id not in self.items_present:
            self.items_present.append(item_id)
    
    def remove_item(self, item_id: str) -> None:
        """Retire un objet de ce lieu"""
        if item_id in self.items_present:
            self.items_present.remove(item_id)
    
    def has_heroes(self) -> bool:
        """Vérifie s'il y a des héros présents"""
        return len(self.heroes_present) > 0
    
    def get_available_actions(self) -> List[Action]:
        """Retourne les actions disponibles (non bloquées par les héros)"""
        if not self.has_heroes():
            return self.actions
        
        # Filtre les actions bloquées par les héros
        return [action for action in self.actions if not action.blocked_by_heroes]
    
    def get_action_by_type(self, action_type: ActionType) -> Optional[Action]:
        """Retourne la première action du type spécifié"""
        for action in self.actions:
            if action.action_type == action_type:
                return action
        return None
    
    def can_perform_action(self, action_type: ActionType) -> bool:
        """Vérifie si une action peut être effectuée"""
        available_actions = self.get_available_actions()
        return any(action.action_type == action_type for action in available_actions)
    
    def __str__(self) -> str:
        """Représentation textuelle du lieu"""
        heroes_info = f" (Héros: {len(self.heroes_present)})" if self.has_heroes() else ""
        return f"{self.name}{heroes_info}"
    
    def __repr__(self) -> str:
        """Représentation pour le debug"""
        return f"Location(id='{self.id}', name='{self.name}', pos={self.position})"