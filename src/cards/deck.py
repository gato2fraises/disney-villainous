"""
Classe Deck - Gestion des paquets de cartes
"""

import random
from typing import List, Optional
from .card import Card


class Deck:
    """
    Classe pour gérer un paquet de cartes (deck, main, défausse)
    """
    
    def __init__(self, cards: List[Card] = None):
        """Initialise le deck avec une liste de cartes"""
        self.cards: List[Card] = cards or []
        self._original_cards: List[Card] = list(self.cards)  # Sauvegarde pour reset
    
    def add_card(self, card: Card) -> None:
        """Ajoute une carte au deck"""
        self.cards.append(card)
    
    def remove_card(self, card: Card) -> bool:
        """Retire une carte du deck"""
        if card in self.cards:
            self.cards.remove(card)
            return True
        return False
    
    def draw_card(self) -> Optional[Card]:
        """Tire une carte du dessus du deck"""
        if self.cards:
            return self.cards.pop(0)
        return None
    
    def draw_cards(self, count: int) -> List[Card]:
        """Tire plusieurs cartes du deck"""
        drawn = []
        for _ in range(count):
            card = self.draw_card()
            if card:
                drawn.append(card)
            else:
                break
        return drawn
    
    def peek_top(self, count: int = 1) -> List[Card]:
        """Regarde les cartes du dessus sans les retirer"""
        return self.cards[:min(count, len(self.cards))]
    
    def shuffle(self) -> None:
        """Mélange le deck"""
        random.shuffle(self.cards)
    
    def add_to_bottom(self, card: Card) -> None:
        """Ajoute une carte en bas du deck"""
        self.cards.append(card)
    
    def add_to_top(self, card: Card) -> None:
        """Ajoute une carte au dessus du deck"""
        self.cards.insert(0, card)
    
    def is_empty(self) -> bool:
        """Vérifie si le deck est vide"""
        return len(self.cards) == 0
    
    def size(self) -> int:
        """Retourne la taille du deck"""
        return len(self.cards)
    
    def reset(self) -> None:
        """Remet le deck à son état initial"""
        self.cards = list(self._original_cards)
        self.shuffle()
    
    def find_card(self, card_id: str) -> Optional[Card]:
        """Trouve une carte par son ID"""
        for card in self.cards:
            if card.id == card_id:
                return card
        return None
    
    def get_cards_by_type(self, card_type) -> List[Card]:
        """Retourne toutes les cartes d'un type donné"""
        return [card for card in self.cards if card.card_type == card_type]
    
    def get_playable_cards(self, available_power: int) -> List[Card]:
        """Retourne les cartes jouables avec le pouvoir disponible"""
        return [card for card in self.cards if card.cost <= available_power]
    
    def __len__(self) -> int:
        """Permet d'utiliser len(deck)"""
        return len(self.cards)
    
    def __iter__(self):
        """Permet d'itérer sur le deck"""
        return iter(self.cards)
    
    def __str__(self) -> str:
        """Représentation textuelle du deck"""
        return f"Deck({len(self.cards)} cartes)"
    
    def __repr__(self) -> str:
        """Représentation pour le debug"""
        return f"Deck(cards={len(self.cards)})"


class Hand(Deck):
    """
    Classe spécialisée pour la main d'un joueur
    """
    
    def __init__(self, max_size: int = 4):
        """Initialise une main avec une taille maximale"""
        super().__init__()
        self.max_size = max_size
    
    def is_full(self) -> bool:
        """Vérifie si la main est pleine"""
        return len(self.cards) >= self.max_size
    
    def can_add_card(self) -> bool:
        """Vérifie si on peut ajouter une carte"""
        return not self.is_full()
    
    def add_card(self, card: Card) -> bool:
        """Ajoute une carte si possible"""
        if self.can_add_card():
            self.cards.append(card)
            return True
        return False
    
    def play_card(self, card: Card) -> bool:
        """Joue une carte (la retire de la main)"""
        return self.remove_card(card)
    
    def get_cheapest_cards(self) -> List[Card]:
        """Retourne les cartes les moins chères"""
        if not self.cards:
            return []
        
        min_cost = min(card.cost for card in self.cards)
        return [card for card in self.cards if card.cost == min_cost]
    
    def get_most_expensive_cards(self) -> List[Card]:
        """Retourne les cartes les plus chères"""
        if not self.cards:
            return []
        
        max_cost = max(card.cost for card in self.cards)
        return [card for card in self.cards if card.cost == max_cost]
    
    def __str__(self) -> str:
        """Représentation textuelle de la main"""
        return f"Main({len(self.cards)}/{self.max_size} cartes)"


class DiscardPile(Deck):
    """
    Classe spécialisée pour la pile de défausse
    """
    
    def __init__(self):
        """Initialise une pile de défausse vide"""
        super().__init__()
    
    def add_card(self, card: Card) -> None:
        """Ajoute une carte au dessus de la défausse"""
        self.add_to_top(card)
    
    def peek_top_card(self) -> Optional[Card]:
        """Regarde la carte du dessus de la défausse"""
        if self.cards:
            return self.cards[0]
        return None
    
    def take_all_cards(self) -> List[Card]:
        """Récupère toutes les cartes de la défausse"""
        all_cards = list(self.cards)
        self.cards.clear()
        return all_cards
    
    def __str__(self) -> str:
        """Représentation textuelle de la défausse"""
        return f"Défausse({len(self.cards)} cartes)"