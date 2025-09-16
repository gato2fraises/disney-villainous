"""
Card Manager - Gestion centralisée des cartes
"""

import json
import os
from typing import Dict, List, Optional, Tuple
from .card import Card, CardEffect
from .deck import Deck
from ..core.enums import CardType


class CardManager:
    """
    Gestionnaire centralisé pour charger et créer les cartes
    """
    
    def __init__(self, data_path: str = "data/cards"):
        """Initialise le gestionnaire avec le chemin vers les données"""
        self.data_path = data_path
        self.cards_cache: Dict[str, Card] = {}
        self.villain_cards: Dict[str, List[Card]] = {}
        self.fate_cards: Dict[str, List[Card]] = {}
    
    def load_card_from_dict(self, card_data: dict) -> Card:
        """Crée une carte à partir d'un dictionnaire"""
        # Traite les effets
        effects = []
        for effect_data in card_data.get("effects", []):
            effect = CardEffect(
                description=effect_data["description"],
                trigger=effect_data["trigger"],
                target=effect_data.get("target"),
                parameters=effect_data.get("parameters")
            )
            effects.append(effect)
        
        # Crée la carte
        card = Card(
            id=card_data["id"],
            name=card_data["name"],
            card_type=CardType(card_data["type"]),
            cost=card_data["cost"],
            description=card_data["description"],
            effects=effects,
            strength=card_data.get("strength"),
            location_restriction=card_data.get("location_restriction"),
            villain_set=card_data.get("villain_set"),
            expansion=card_data.get("expansion", "base")
        )
        
        return card
    
    def load_cards_from_file(self, filepath: str) -> List[Card]:
        """Charge les cartes depuis un fichier JSON"""
        if not os.path.exists(filepath):
            return []
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            cards = []
            for card_data in data.get("cards", []):
                card = self.load_card_from_dict(card_data)
                cards.append(card)
                self.cards_cache[card.id] = card
            
            return cards
        
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"Erreur lors du chargement des cartes depuis {filepath}: {e}")
            return []
    
    def load_villain_cards(self, villain_name: str) -> List[Card]:
        """Charge les cartes d'un méchant spécifique"""
        if villain_name in self.villain_cards:
            return self.villain_cards[villain_name]
        
        filepath = os.path.join(self.data_path, f"{villain_name}_villain.json")
        cards = self.load_cards_from_file(filepath)
        
        self.villain_cards[villain_name] = cards
        return cards
    
    def load_fate_cards(self, villain_name: str) -> List[Card]:
        """Charge les cartes Destin d'un méchant spécifique"""
        if villain_name in self.fate_cards:
            return self.fate_cards[villain_name]
        
        filepath = os.path.join(self.data_path, f"{villain_name}_fate.json")
        cards = self.load_cards_from_file(filepath)
        
        self.fate_cards[villain_name] = cards
        return cards
    
    def create_villain_deck(self, villain_name: str) -> Deck:
        """Crée un deck de méchant mélangé"""
        cards = self.load_villain_cards(villain_name)
        deck = Deck(list(cards))  # Copie des cartes
        deck.shuffle()
        return deck
    
    def create_fate_deck(self, villain_name: str) -> Deck:
        """Crée un deck Destin mélangé"""
        cards = self.load_fate_cards(villain_name)
        deck = Deck(list(cards))  # Copie des cartes
        deck.shuffle()
        return deck
    
    def get_card_by_id(self, card_id: str) -> Optional[Card]:
        """Récupère une carte par son ID"""
        return self.cards_cache.get(card_id)
    
    def create_sample_cards(self, villain_name: str) -> Tuple[List[Card], List[Card]]:
        """Crée des cartes d'exemple pour les tests"""
        # Cartes Méchant d'exemple
        villain_cards = [
            Card(
                id=f"{villain_name}_ally_1",
                name="Serviteur Loyal",
                card_type=CardType.ALLY,
                cost=2,
                description="Un serviteur fidèle qui aide le méchant",
                effects=[
                    CardEffect(
                        description="Gagne 1 de force",
                        trigger="play"
                    )
                ],
                strength=2,
                villain_set=villain_name
            ),
            Card(
                id=f"{villain_name}_item_1",
                name="Objet Magique",
                card_type=CardType.ITEM,
                cost=3,
                description="Un objet aux pouvoirs mystérieux",
                effects=[
                    CardEffect(
                        description="Gagne 1 pouvoir par tour",
                        trigger="passive"
                    )
                ],
                villain_set=villain_name
            ),
            Card(
                id=f"{villain_name}_effect_1",
                name="Sortilège",
                card_type=CardType.EFFECT,
                cost=1,
                description="Un effet magique temporaire",
                effects=[
                    CardEffect(
                        description="Gagne 2 pouvoirs",
                        trigger="play"
                    )
                ],
                villain_set=villain_name
            )
        ]
        
        # Cartes Destin d'exemple
        fate_cards = [
            Card(
                id=f"{villain_name}_hero_1",
                name="Héros Courageux",
                card_type=CardType.HERO,
                cost=0,
                description="Un héros qui s'oppose au méchant",
                effects=[
                    CardEffect(
                        description="Bloque les actions du lieu",
                        trigger="passive"
                    )
                ],
                strength=3,
                villain_set=villain_name
            ),
            Card(
                id=f"{villain_name}_event_1",
                name="Intervention Héroïque",
                card_type=CardType.EVENT,
                cost=0,
                description="Les héros agissent contre le méchant",
                effects=[
                    CardEffect(
                        description="Le méchant perd 2 pouvoirs",
                        trigger="play"
                    )
                ],
                villain_set=villain_name
            )
        ]
        
        return villain_cards, fate_cards
    
    def save_cards_to_file(self, cards: List[Card], filepath: str) -> bool:
        """Sauvegarde des cartes dans un fichier JSON"""
        try:
            # Convertit les cartes en dictionnaires
            cards_data = []
            for card in cards:
                card_dict = {
                    "id": card.id,
                    "name": card.name,
                    "type": card.card_type.value,
                    "cost": card.cost,
                    "description": card.description,
                    "effects": [
                        {
                            "description": effect.description,
                            "trigger": effect.trigger,
                            "target": effect.target,
                            "parameters": effect.parameters
                        }
                        for effect in card.effects
                    ],
                    "villain_set": card.villain_set,
                    "expansion": card.expansion
                }
                
                # Ajoute les attributs optionnels
                if card.strength is not None:
                    card_dict["strength"] = card.strength
                if card.location_restriction is not None:
                    card_dict["location_restriction"] = card.location_restriction
                
                cards_data.append(card_dict)
            
            # Crée le dossier si nécessaire
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            # Sauvegarde
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump({"cards": cards_data}, f, indent=2, ensure_ascii=False)
            
            return True
            
        except (IOError, ValueError) as e:
            print(f"Erreur lors de la sauvegarde des cartes: {e}")
            return False
    
    def get_all_villain_names(self) -> List[str]:
        """Retourne la liste de tous les méchants disponibles"""
        villain_names = []
        if os.path.exists(self.data_path):
            for filename in os.listdir(self.data_path):
                if filename.endswith("_villain.json"):
                    villain_name = filename.replace("_villain.json", "")
                    villain_names.append(villain_name)
        return villain_names
    
    def clear_cache(self) -> None:
        """Vide le cache des cartes"""
        self.cards_cache.clear()
        self.villain_cards.clear()
        self.fate_cards.clear()
    
    def __str__(self) -> str:
        """Représentation textuelle du gestionnaire"""
        return f"CardManager({len(self.cards_cache)} cartes en cache)"