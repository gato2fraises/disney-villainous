"""
Victory Conditions - Conditions de victoire spécifiques par méchant
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List
from ..players.player import Player
from ..core.enums import VillainType, CardType


class VictoryCondition(ABC):
    """
    Classe abstraite pour les conditions de victoire
    """
    
    def __init__(self, description: str):
        self.description = description
    
    @abstractmethod
    def check_victory(self, player: Player) -> bool:
        """Vérifie si la condition de victoire est remplie"""
        pass
    
    @abstractmethod
    def get_progress(self, player: Player) -> Dict[str, Any]:
        """Retourne le progrès vers la victoire"""
        pass
    
    def __str__(self) -> str:
        return self.description


class MaleficentVictory(VictoryCondition):
    """
    Condition de victoire de Maléfique:
    Commencer son tour avec une Malédiction sur chacun des 4 lieux
    """
    
    def __init__(self):
        super().__init__("Commencer son tour avec une Malédiction sur chacun des 4 lieux")
    
    def check_victory(self, player: Player) -> bool:
        """Vérifie si Maléfique a une malédiction sur chaque lieu"""
        if len(player.board_locations) != 4:
            return False
        
        # Compte les lieux avec des malédictions
        cursed_locations = 0
        for location in player.board_locations:
            has_curse = any(
                item_id.startswith("maleficent_curse") 
                for item_id in location.items_present
            )
            if has_curse:
                cursed_locations += 1
        
        return cursed_locations >= 4
    
    def get_progress(self, player: Player) -> Dict[str, Any]:
        """Retourne le progrès des malédictions"""
        cursed_locations = 0
        location_status = {}
        
        for location in player.board_locations:
            has_curse = any(
                item_id.startswith("maleficent_curse") 
                for item_id in location.items_present
            )
            location_status[location.name] = has_curse
            if has_curse:
                cursed_locations += 1
        
        return {
            "cursed_locations": cursed_locations,
            "total_locations": len(player.board_locations),
            "location_status": location_status,
            "percentage": (cursed_locations / 4) * 100 if player.board_locations else 0
        }


class JafarVictory(VictoryCondition):
    """
    Condition de victoire de Jafar:
    Commencer son tour avec la Lampe Magique à la Caverne aux Merveilles
    et avoir vaincu Aladdin
    """
    
    def __init__(self):
        super().__init__("Avoir la Lampe Magique à la Caverne aux Merveilles et avoir vaincu Aladdin")
    
    def check_victory(self, player: Player) -> bool:
        """Vérifie les conditions de victoire de Jafar"""
        # Trouve la Caverne aux Merveilles
        cave_location = None
        for location in player.board_locations:
            if "cave_of_wonders" in location.id.lower():
                cave_location = location
                break
        
        if not cave_location:
            return False
        
        # Vérifie la présence de la Lampe Magique
        has_lamp = any(
            "magic_lamp" in item_id.lower() 
            for item_id in cave_location.items_present
        )
        
        # Vérifie qu'Aladdin a été vaincu (absence de héros Aladdin)
        aladdin_defeated = True  # Simplifié pour l'exemple
        for location in player.board_locations:
            if any("aladdin" in hero_id.lower() for hero_id in location.heroes_present):
                aladdin_defeated = False
                break
        
        return has_lamp and aladdin_defeated
    
    def get_progress(self, player: Player) -> Dict[str, Any]:
        """Retourne le progrès de Jafar"""
        cave_location = None
        for location in player.board_locations:
            if "cave_of_wonders" in location.id.lower():
                cave_location = location
                break
        
        has_lamp = False
        if cave_location:
            has_lamp = any(
                "magic_lamp" in item_id.lower() 
                for item_id in cave_location.items_present
            )
        
        aladdin_defeated = True
        for location in player.board_locations:
            if any("aladdin" in hero_id.lower() for hero_id in location.heroes_present):
                aladdin_defeated = False
                break
        
        return {
            "has_magic_lamp": has_lamp,
            "aladdin_defeated": aladdin_defeated,
            "lamp_location": cave_location.name if cave_location else "Inconnue",
            "objectives_completed": sum([has_lamp, aladdin_defeated])
        }


class CaptainHookVictory(VictoryCondition):
    """
    Condition de victoire du Capitaine Crochet:
    Vaincre Peter Pan au Jolly Roger
    """
    
    def __init__(self):
        super().__init__("Vaincre Peter Pan au Jolly Roger")
    
    def check_victory(self, player: Player) -> bool:
        """Vérifie si Peter Pan a été vaincu au Jolly Roger"""
        # Trouve le Jolly Roger
        jolly_roger = None
        for location in player.board_locations:
            if "jolly_roger" in location.id.lower():
                jolly_roger = location
                break
        
        if not jolly_roger:
            return False
        
        # Vérifie que Peter Pan n'est pas présent (a été vaincu)
        peter_pan_present = any(
            "peter_pan" in hero_id.lower() 
            for hero_id in jolly_roger.heroes_present
        )
        
        # TODO: Ajouter une vérification que Peter Pan était présent et a été vaincu
        # Pour l'instant, on vérifie juste l'absence
        
        return not peter_pan_present
    
    def get_progress(self, player: Player) -> Dict[str, Any]:
        """Retourne le progrès du Capitaine Crochet"""
        jolly_roger = None
        for location in player.board_locations:
            if "jolly_roger" in location.id.lower():
                jolly_roger = location
                break
        
        peter_pan_present = False
        if jolly_roger:
            peter_pan_present = any(
                "peter_pan" in hero_id.lower() 
                for hero_id in jolly_roger.heroes_present
            )
        
        return {
            "jolly_roger_found": jolly_roger is not None,
            "peter_pan_present": peter_pan_present,
            "peter_pan_defeated": not peter_pan_present,
            "location": jolly_roger.name if jolly_roger else "Non trouvé"
        }


class PrinceJohnVictory(VictoryCondition):
    """
    Condition de victoire du Prince Jean:
    Commencer son tour avec au moins 20 Pouvoirs
    """
    
    def __init__(self):
        super().__init__("Commencer son tour avec au moins 20 Pouvoirs")
    
    def check_victory(self, player: Player) -> bool:
        """Vérifie si le Prince Jean a au moins 20 pouvoirs"""
        return player.power >= 20
    
    def get_progress(self, player: Player) -> Dict[str, Any]:
        """Retourne le progrès du Prince Jean"""
        return {
            "current_power": player.power,
            "target_power": 20,
            "power_needed": max(0, 20 - player.power),
            "percentage": min(100, (player.power / 20) * 100)
        }


class QueenOfHeartsVictory(VictoryCondition):
    """
    Condition de victoire de la Reine de Cœur:
    Avoir une Tête Tranchée dans les 4 lieux différents
    """
    
    def __init__(self):
        super().__init__("Avoir une Tête Tranchée dans chacun des 4 lieux")
    
    def check_victory(self, player: Player) -> bool:
        """Vérifie si la Reine de Cœur a des têtes tranchées partout"""
        if len(player.board_locations) != 4:
            return False
        
        locations_with_heads = 0
        for location in player.board_locations:
            has_head = any(
                "severed_head" in item_id.lower() 
                for item_id in location.items_present
            )
            if has_head:
                locations_with_heads += 1
        
        return locations_with_heads >= 4
    
    def get_progress(self, player: Player) -> Dict[str, Any]:
        """Retourne le progrès de la Reine de Cœur"""
        locations_with_heads = 0
        location_status = {}
        
        for location in player.board_locations:
            has_head = any(
                "severed_head" in item_id.lower() 
                for item_id in location.items_present
            )
            location_status[location.name] = has_head
            if has_head:
                locations_with_heads += 1
        
        return {
            "locations_with_heads": locations_with_heads,
            "total_locations": len(player.board_locations),
            "location_status": location_status,
            "percentage": (locations_with_heads / 4) * 100 if player.board_locations else 0
        }


class UrsulaVictory(VictoryCondition):
    """
    Condition de victoire d'Ursula:
    Avoir le Trident et la Couronne au Palais d'Ursula
    """
    
    def __init__(self):
        super().__init__("Avoir le Trident et la Couronne au Palais d'Ursula")
    
    def check_victory(self, player: Player) -> bool:
        """Vérifie les conditions de victoire d'Ursula"""
        # Trouve le Palais d'Ursula
        palace_location = None
        for location in player.board_locations:
            if "ursula_palace" in location.id.lower() or "palace" in location.name.lower():
                palace_location = location
                break
        
        if not palace_location:
            return False
        
        # Vérifie la présence du Trident et de la Couronne
        has_trident = any(
            "trident" in item_id.lower() 
            for item_id in palace_location.items_present
        )
        
        has_crown = any(
            "crown" in item_id.lower() 
            for item_id in palace_location.items_present
        )
        
        return has_trident and has_crown
    
    def get_progress(self, player: Player) -> Dict[str, Any]:
        """Retourne le progrès d'Ursula"""
        palace_location = None
        for location in player.board_locations:
            if "ursula_palace" in location.id.lower() or "palace" in location.name.lower():
                palace_location = location
                break
        
        has_trident = False
        has_crown = False
        
        if palace_location:
            has_trident = any(
                "trident" in item_id.lower() 
                for item_id in palace_location.items_present
            )
            has_crown = any(
                "crown" in item_id.lower() 
                for item_id in palace_location.items_present
            )
        
        return {
            "has_trident": has_trident,
            "has_crown": has_crown,
            "palace_found": palace_location is not None,
            "palace_location": palace_location.name if palace_location else "Non trouvé",
            "items_collected": sum([has_trident, has_crown]),
            "items_needed": 2
        }


class VictoryManager:
    """
    Gestionnaire centralisé des conditions de victoire
    """
    
    def __init__(self):
        """Initialise le gestionnaire avec toutes les conditions"""
        self.victory_conditions: Dict[VillainType, VictoryCondition] = {
            VillainType.MALEFICENT: MaleficentVictory(),
            VillainType.JAFAR: JafarVictory(),
            VillainType.CAPTAIN_HOOK: CaptainHookVictory(),
            VillainType.PRINCE_JOHN: PrinceJohnVictory(),
            VillainType.QUEEN_OF_HEARTS: QueenOfHeartsVictory(),
            VillainType.URSULA: UrsulaVictory()
        }
    
    def check_victory(self, player: Player) -> bool:
        """Vérifie si un joueur a gagné"""
        condition = self.victory_conditions.get(player.villain_type)
        if condition:
            result = condition.check_victory(player)
            if result:
                player.has_won = True
            return result
        return False
    
    def get_victory_progress(self, player: Player) -> Dict[str, Any]:
        """Retourne le progrès vers la victoire"""
        condition = self.victory_conditions.get(player.villain_type)
        if condition:
            progress = condition.get_progress(player)
            progress["description"] = condition.description
            progress["villain"] = player.villain_type.value
            return progress
        
        return {
            "description": "Condition de victoire non définie",
            "villain": player.villain_type.value
        }
    
    def get_victory_description(self, villain_type: VillainType) -> str:
        """Retourne la description de la condition de victoire"""
        condition = self.victory_conditions.get(villain_type)
        return condition.description if condition else "Condition non définie"
    
    def register_custom_victory(self, villain_type: VillainType, condition: VictoryCondition) -> None:
        """Enregistre une condition de victoire personnalisée"""
        self.victory_conditions[villain_type] = condition
    
    def __str__(self) -> str:
        """Représentation textuelle du gestionnaire"""
        return f"VictoryManager({len(self.victory_conditions)} conditions)"