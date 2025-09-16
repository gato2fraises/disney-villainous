"""
Board Manager - Gestionnaire des plateaux de méchants
"""

import json
import os
from typing import Dict, List, Optional
from .location import Location, Action
from ..core.enums import ActionType, VillainType


class BoardManager:
    """
    Gestionnaire centralisé pour charger et créer les plateaux
    """
    
    def __init__(self, data_path: str = "data/boards"):
        """Initialise le gestionnaire avec le chemin vers les données"""
        self.data_path = data_path
        self.boards_cache: Dict[str, List[Location]] = {}
    
    def load_action_from_dict(self, action_data: dict) -> Action:
        """Crée une action à partir d'un dictionnaire"""
        return Action(
            action_type=ActionType(action_data["type"]),
            value=action_data.get("value"),
            description=action_data.get("description", ""),
            blocked_by_heroes=action_data.get("blocked_by_heroes", False)
        )
    
    def load_location_from_dict(self, location_data: dict) -> Location:
        """Crée un lieu à partir d'un dictionnaire"""
        actions = []
        for action_data in location_data.get("actions", []):
            action = self.load_action_from_dict(action_data)
            actions.append(action)
        
        location = Location(
            id=location_data["id"],
            name=location_data["name"],
            position=location_data["position"],
            actions=actions,
            description=location_data.get("description", ""),
            image_path=location_data.get("image_path")
        )
        
        return location
    
    def load_board_from_file(self, filepath: str) -> List[Location]:
        """Charge un plateau depuis un fichier JSON"""
        if not os.path.exists(filepath):
            return []
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            locations = []
            for location_data in data.get("locations", []):
                location = self.load_location_from_dict(location_data)
                locations.append(location)
            
            # Trie par position pour assurer l'ordre
            locations.sort(key=lambda x: x.position)
            
            return locations
        
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"Erreur lors du chargement du plateau depuis {filepath}: {e}")
            return []
    
    def load_villain_board(self, villain_name: str) -> List[Location]:
        """Charge le plateau d'un méchant spécifique"""
        if villain_name in self.boards_cache:
            return self.boards_cache[villain_name]
        
        filepath = os.path.join(self.data_path, f"{villain_name}_board.json")
        locations = self.load_board_from_file(filepath)
        
        self.boards_cache[villain_name] = locations
        return locations
    
    def create_sample_board(self, villain_name: str) -> List[Location]:
        """Crée un plateau d'exemple pour les tests"""
        locations = [
            Location(
                id=f"{villain_name}_location_0",
                name="Salle du Trône",
                position=0,
                actions=[
                    Action(ActionType.GAIN_POWER, value=2, description="Gagne 2 pouvoirs"),
                    Action(ActionType.PLAY_CARD, description="Joue une carte", blocked_by_heroes=True),
                    Action(ActionType.ACTIVATE, description="Active une capacité"),
                    Action(ActionType.DISCARD, description="Défausse des cartes")
                ],
                description="Le centre du pouvoir du méchant"
            ),
            Location(
                id=f"{villain_name}_location_1",
                name="Donjon",
                position=1,
                actions=[
                    Action(ActionType.GAIN_POWER, value=1, description="Gagne 1 pouvoir"),
                    Action(ActionType.PLAY_CARD, description="Joue une carte"),
                    Action(ActionType.VANQUISH, description="Vaincs un héros", blocked_by_heroes=True),
                    Action(ActionType.FATE, description="Joue le Destin")
                ],
                description="Lieu sombre et mystérieux"
            ),
            Location(
                id=f"{villain_name}_location_2",
                name="Laboratoire",
                position=2,
                actions=[
                    Action(ActionType.PLAY_CARD, description="Joue une carte", blocked_by_heroes=True),
                    Action(ActionType.ACTIVATE, description="Active une capacité"),
                    Action(ActionType.DISCARD, description="Défausse des cartes"),
                    Action(ActionType.GAIN_POWER, value=1, description="Gagne 1 pouvoir")
                ],
                description="Lieu d'expérimentation"
            ),
            Location(
                id=f"{villain_name}_location_3",
                name="Tour de Guet",
                position=3,
                actions=[
                    Action(ActionType.FATE, description="Joue le Destin"),
                    Action(ActionType.GAIN_POWER, value=2, description="Gagne 2 pouvoirs"),
                    Action(ActionType.MOVE_ITEM, description="Déplace un objet"),
                    Action(ActionType.ACTIVATE, description="Active une capacité", blocked_by_heroes=True)
                ],
                description="Point d'observation stratégique"
            )
        ]
        
        return locations
    
    def save_board_to_file(self, locations: List[Location], filepath: str) -> bool:
        """Sauvegarde un plateau dans un fichier JSON"""
        try:
            # Convertit les lieux en dictionnaires
            locations_data = []
            for location in locations:
                location_dict = {
                    "id": location.id,
                    "name": location.name,
                    "position": location.position,
                    "description": location.description,
                    "actions": [
                        {
                            "type": action.action_type.value,
                            "value": action.value,
                            "description": action.description,
                            "blocked_by_heroes": action.blocked_by_heroes
                        }
                        for action in location.actions
                    ]
                }
                
                if location.image_path:
                    location_dict["image_path"] = location.image_path
                
                locations_data.append(location_dict)
            
            # Crée le dossier si nécessaire
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            # Sauvegarde
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump({"locations": locations_data}, f, indent=2, ensure_ascii=False)
            
            return True
            
        except (IOError, ValueError) as e:
            print(f"Erreur lors de la sauvegarde du plateau: {e}")
            return False
    
    def get_all_board_names(self) -> List[str]:
        """Retourne la liste de tous les plateaux disponibles"""
        board_names = []
        if os.path.exists(self.data_path):
            for filename in os.listdir(self.data_path):
                if filename.endswith("_board.json"):
                    board_name = filename.replace("_board.json", "")
                    board_names.append(board_name)
        return board_names
    
    def validate_board(self, locations: List[Location]) -> List[str]:
        """Valide un plateau et retourne les erreurs trouvées"""
        errors = []
        
        if len(locations) != 4:
            errors.append(f"Un plateau doit avoir exactement 4 lieux (trouvé: {len(locations)})")
        
        positions = [loc.position for loc in locations]
        expected_positions = [0, 1, 2, 3]
        
        if sorted(positions) != expected_positions:
            errors.append(f"Les positions doivent être 0,1,2,3 (trouvé: {sorted(positions)})")
        
        # Vérifie les doublons de position
        if len(set(positions)) != len(positions):
            errors.append("Des lieux ont la même position")
        
        # Vérifie que chaque lieu a au moins une action
        for location in locations:
            if not location.actions:
                errors.append(f"Le lieu '{location.name}' n'a aucune action")
            
            if len(location.actions) > 4:
                errors.append(f"Le lieu '{location.name}' a trop d'actions ({len(location.actions)} > 4)")
        
        return errors
    
    def create_villain_specific_board(self, villain_type: VillainType) -> List[Location]:
        """Crée un plateau spécifique à un méchant"""
        if villain_type == VillainType.MALEFICENT:
            return self._create_maleficent_board()
        elif villain_type == VillainType.JAFAR:
            return self._create_jafar_board()
        elif villain_type == VillainType.CAPTAIN_HOOK:
            return self._create_hook_board()
        else:
            # Plateau générique pour les autres méchants
            return self.create_sample_board(villain_type.value)
    
    def _create_maleficent_board(self) -> List[Location]:
        """Crée le plateau spécifique à Maléfique"""
        return [
            Location(
                id="maleficent_forbidden_mountains",
                name="Montagnes Interdites",
                position=0,
                actions=[
                    Action(ActionType.GAIN_POWER, value=2),
                    Action(ActionType.PLAY_CARD, blocked_by_heroes=True),
                    Action(ActionType.ACTIVATE),
                    Action(ActionType.DISCARD)
                ],
                description="Repaire de Maléfique"
            ),
            Location(
                id="maleficent_briar_rose_cottage",
                name="Chaumière d'Aurore",
                position=1,
                actions=[
                    Action(ActionType.GAIN_POWER, value=1),
                    Action(ActionType.PLAY_CARD),
                    Action(ActionType.VANQUISH, blocked_by_heroes=True),
                    Action(ActionType.FATE)
                ],
                description="Où vit la princesse"
            ),
            Location(
                id="maleficent_king_stefan_castle",
                name="Château du Roi Stefan",
                position=2,
                actions=[
                    Action(ActionType.PLAY_CARD, blocked_by_heroes=True),
                    Action(ActionType.ACTIVATE),
                    Action(ActionType.DISCARD),
                    Action(ActionType.GAIN_POWER, value=1)
                ],
                description="Siège du royaume"
            ),
            Location(
                id="maleficent_forest",
                name="Forêt Enchantée",
                position=3,
                actions=[
                    Action(ActionType.FATE),
                    Action(ActionType.GAIN_POWER, value=2),
                    Action(ActionType.MOVE_ITEM),
                    Action(ActionType.ACTIVATE, blocked_by_heroes=True)
                ],
                description="Forêt mystérieuse"
            )
        ]
    
    def _create_jafar_board(self) -> List[Location]:
        """Crée le plateau spécifique à Jafar"""
        return [
            Location(
                id="jafar_palace_gates",
                name="Portes du Palais",
                position=0,
                actions=[
                    Action(ActionType.GAIN_POWER, value=2),
                    Action(ActionType.PLAY_CARD, blocked_by_heroes=True),
                    Action(ActionType.VANQUISH),
                    Action(ActionType.DISCARD)
                ],
                description="Entrée du palais d'Agrabah"
            ),
            Location(
                id="jafar_throne_room",
                name="Salle du Trône",
                position=1,
                actions=[
                    Action(ActionType.GAIN_POWER, value=1),
                    Action(ActionType.PLAY_CARD),
                    Action(ActionType.ACTIVATE, blocked_by_heroes=True),
                    Action(ActionType.FATE)
                ],
                description="Centre du pouvoir"
            ),
            Location(
                id="jafar_cave_of_wonders",
                name="Caverne aux Merveilles",
                position=2,
                actions=[
                    Action(ActionType.PLAY_CARD, blocked_by_heroes=True),
                    Action(ActionType.ACTIVATE),
                    Action(ActionType.DISCARD),
                    Action(ActionType.GAIN_POWER, value=3)
                ],
                description="Caverne pleine de trésors"
            ),
            Location(
                id="jafar_secret_chamber",
                name="Chambre Secrète",
                position=3,
                actions=[
                    Action(ActionType.FATE),
                    Action(ActionType.GAIN_POWER, value=1),
                    Action(ActionType.MOVE_ITEM),
                    Action(ActionType.ACTIVATE, blocked_by_heroes=True)
                ],
                description="Laboratoire secret de Jafar"
            )
        ]
    
    def _create_hook_board(self) -> List[Location]:
        """Crée le plateau spécifique au Capitaine Crochet"""
        return [
            Location(
                id="hook_jolly_roger",
                name="Le Jolly Roger",
                position=0,
                actions=[
                    Action(ActionType.GAIN_POWER, value=2),
                    Action(ActionType.PLAY_CARD, blocked_by_heroes=True),
                    Action(ActionType.ACTIVATE),
                    Action(ActionType.VANQUISH)
                ],
                description="Navire pirate du Capitaine Crochet"
            ),
            Location(
                id="hook_skull_rock",
                name="Rocher du Crâne",
                position=1,
                actions=[
                    Action(ActionType.GAIN_POWER, value=1),
                    Action(ActionType.PLAY_CARD),
                    Action(ActionType.VANQUISH, blocked_by_heroes=True),
                    Action(ActionType.FATE)
                ],
                description="Repaire secret des pirates"
            ),
            Location(
                id="hook_mermaid_lagoon",
                name="Lagon des Sirènes",
                position=2,
                actions=[
                    Action(ActionType.PLAY_CARD, blocked_by_heroes=True),
                    Action(ActionType.ACTIVATE),
                    Action(ActionType.DISCARD),
                    Action(ActionType.GAIN_POWER, value=1)
                ],
                description="Lagune enchantée"
            ),
            Location(
                id="hook_hangmans_tree",
                name="Arbre du Pendu",
                position=3,
                actions=[
                    Action(ActionType.FATE),
                    Action(ActionType.GAIN_POWER, value=2),
                    Action(ActionType.MOVE_ITEM),
                    Action(ActionType.ACTIVATE, blocked_by_heroes=True)
                ],
                description="Cachette des Enfants Perdus"
            )
        ]
    
    def clear_cache(self) -> None:
        """Vide le cache des plateaux"""
        self.boards_cache.clear()
    
    def __str__(self) -> str:
        """Représentation textuelle du gestionnaire"""
        return f"BoardManager({len(self.boards_cache)} plateaux en cache)"