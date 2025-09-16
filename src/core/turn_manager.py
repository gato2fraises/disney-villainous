"""
Turn Manager - Gestionnaire des tours et actions
"""

from typing import Dict, List, Optional, Any, Callable
from ..core.enums import ActionType, TurnPhase
from ..players.player import Player
from ..cards.card import Card
from ..board.location import Location


class ActionResult:
    """Résultat d'une action exécutée"""
    
    def __init__(self, success: bool, message: str = "", data: Any = None):
        self.success = success
        self.message = message
        self.data = data
    
    def __bool__(self) -> bool:
        return self.success


class TurnManager:
    """
    Gestionnaire centralisé des tours et des actions
    """
    
    def __init__(self):
        """Initialise le gestionnaire"""
        self.action_handlers: Dict[ActionType, Callable] = {
            ActionType.GAIN_POWER: self._handle_gain_power,
            ActionType.PLAY_CARD: self._handle_play_card,
            ActionType.ACTIVATE: self._handle_activate,
            ActionType.DISCARD: self._handle_discard,
            ActionType.VANQUISH: self._handle_vanquish,
            ActionType.FATE: self._handle_fate,
            ActionType.MOVE_ITEM: self._handle_move_item,
            ActionType.MOVE_HERO: self._handle_move_hero
        }
    
    def start_turn(self, player: Player) -> ActionResult:
        """Démarre le tour d'un joueur"""
        if player.turn_phase != TurnPhase.MOVE:
            return ActionResult(False, "Le joueur n'est pas en phase de déplacement")
        
        # Réinitialise les actions
        player.actions_remaining = 0
        
        return ActionResult(True, f"Tour de {player.name} commencé - Phase de déplacement")
    
    def move_player(self, player: Player, new_position: int) -> ActionResult:
        """Déplace un joueur vers un nouveau lieu"""
        if player.turn_phase != TurnPhase.MOVE:
            return ActionResult(False, "Ce n'est pas la phase de déplacement")
        
        if not player.can_move_to(new_position):
            return ActionResult(False, f"Impossible de se déplacer vers la position {new_position}")
        
        old_location = player.get_current_location()
        old_name = old_location.name if old_location else "?"
        
        # Effectue le déplacement
        if player.move_to_location(new_position):
            new_location = player.get_current_location()
            new_name = new_location.name if new_location else "?"
            
            # Passe à la phase d'actions
            player.turn_phase = TurnPhase.ACTIONS
            if new_location:
                available_actions = new_location.get_available_actions()
                player.actions_remaining = len(available_actions)
            
            return ActionResult(
                True, 
                f"{player.name} se déplace de {old_name} vers {new_name}",
                {"old_position": old_location.position if old_location else -1, 
                 "new_position": new_position,
                 "actions_available": player.actions_remaining}
            )
        
        return ActionResult(False, "Échec du déplacement")
    
    def perform_action(self, player: Player, action_type: ActionType, **kwargs) -> ActionResult:
        """Effectue une action spécifique"""
        # Vérifications générales
        if player.turn_phase != TurnPhase.ACTIONS:
            return ActionResult(False, "Ce n'est pas la phase d'actions")
        
        if player.actions_remaining <= 0:
            return ActionResult(False, "Plus d'actions disponibles")
        
        current_location = player.get_current_location()
        if not current_location:
            return ActionResult(False, "Aucun lieu actuel")
        
        if not current_location.can_perform_action(action_type):
            return ActionResult(False, f"Action {action_type.value} non disponible ici")
        
        # Exécute l'action spécifique
        handler = self.action_handlers.get(action_type)
        if not handler:
            return ActionResult(False, f"Action {action_type.value} non implémentée")
        
        result = handler(player, current_location, **kwargs)
        
        if result.success:
            player.actions_remaining -= 1
            
            # Fin du tour si plus d'actions
            if player.actions_remaining <= 0:
                player.turn_phase = TurnPhase.END
        
        return result
    
    def end_turn(self, player: Player) -> ActionResult:
        """Termine le tour d'un joueur"""
        # Remet la main à 4 cartes
        player.refill_hand()
        
        # Réinitialise pour le prochain tour
        player.turn_phase = TurnPhase.MOVE
        player.actions_remaining = 0
        
        return ActionResult(True, f"Tour de {player.name} terminé")
    
    def can_perform_action(self, player: Player, action_type: ActionType) -> bool:
        """Vérifie si une action peut être effectuée"""
        if player.turn_phase != TurnPhase.ACTIONS:
            return False
        
        if player.actions_remaining <= 0:
            return False
        
        current_location = player.get_current_location()
        if not current_location:
            return False
        
        return current_location.can_perform_action(action_type)
    
    def get_available_actions(self, player: Player) -> List[ActionType]:
        """Retourne la liste des actions disponibles"""
        if player.turn_phase != TurnPhase.ACTIONS:
            return []
        
        if player.actions_remaining <= 0:
            return []
        
        current_location = player.get_current_location()
        if not current_location:
            return []
        
        available_actions = current_location.get_available_actions()
        return [action.action_type for action in available_actions]
    
    def get_valid_move_positions(self, player: Player) -> List[int]:
        """Retourne les positions vers lesquelles le joueur peut se déplacer"""
        if player.turn_phase != TurnPhase.MOVE:
            return []
        
        valid_positions = []
        for pos in range(4):
            if player.can_move_to(pos):
                valid_positions.append(pos)
        
        return valid_positions
    
    # === Handlers d'actions spécifiques ===
    
    def _handle_gain_power(self, player: Player, location: Location, **kwargs) -> ActionResult:
        """Gère l'action de gagner du pouvoir"""
        action = location.get_action_by_type(ActionType.GAIN_POWER)
        if not action or action.value is None:
            return ActionResult(False, "Action gain_power mal configurée")
        
        old_power = player.power
        player.gain_power(action.value)
        
        return ActionResult(
            True, 
            f"{player.name} gagne {action.value} pouvoir(s) ({old_power} → {player.power})",
            {"power_gained": action.value, "total_power": player.power}
        )
    
    def _handle_play_card(self, player: Player, location: Location, **kwargs) -> ActionResult:
        """Gère l'action de jouer une carte"""
        card_id = kwargs.get('card_id')
        if not card_id:
            return ActionResult(False, "ID de carte manquant")
        
        # Trouve la carte dans la main
        card = None
        for c in player.hand:
            if c.id == card_id:
                card = c
                break
        
        if not card:
            return ActionResult(False, f"Carte {card_id} non trouvée dans la main")
        
        if player.power < card.cost:
            return ActionResult(False, f"Pas assez de pouvoir ({player.power} < {card.cost})")
        
        # Joue la carte
        if player.play_card(card, location.id):
            return ActionResult(
                True, 
                f"{player.name} joue {card.name} (coût: {card.cost})",
                {"card": card, "power_remaining": player.power}
            )
        
        return ActionResult(False, "Impossible de jouer la carte")
    
    def _handle_activate(self, player: Player, location: Location, **kwargs) -> ActionResult:
        """Gère l'action d'activation de capacités"""
        target_id = kwargs.get('target_id')
        
        if not target_id:
            return ActionResult(False, "Cible d'activation manquante")
        
        # Cherche dans les alliés en jeu
        for ally in player.allies_in_play:
            if ally.id == target_id:
                # TODO: Implémenter les effets d'activation
                return ActionResult(
                    True, 
                    f"{player.name} active {ally.name}",
                    {"activated_card": ally}
                )
        
        # Cherche dans les objets en jeu
        for item in player.items_in_play:
            if item.id == target_id:
                # TODO: Implémenter les effets d'activation
                return ActionResult(
                    True, 
                    f"{player.name} active {item.name}",
                    {"activated_card": item}
                )
        
        return ActionResult(False, f"Aucune carte à activer avec l'ID {target_id}")
    
    def _handle_discard(self, player: Player, location: Location, **kwargs) -> ActionResult:
        """Gère l'action de défausser des cartes"""
        card_ids = kwargs.get('card_ids', [])
        
        if not card_ids:
            return ActionResult(False, "Aucune carte à défausser spécifiée")
        
        discarded_cards = []
        for card_id in card_ids:
            card = None
            for c in player.hand:
                if c.id == card_id:
                    card = c
                    break
            
            if card and player.discard_card(card):
                discarded_cards.append(card)
        
        if discarded_cards:
            card_names = [card.name for card in discarded_cards]
            return ActionResult(
                True, 
                f"{player.name} défausse {len(discarded_cards)} carte(s): {', '.join(card_names)}",
                {"discarded_cards": discarded_cards}
            )
        
        return ActionResult(False, "Aucune carte n'a pu être défaussée")
    
    def _handle_vanquish(self, player: Player, location: Location, **kwargs) -> ActionResult:
        """Gère l'action de vaincre un héros"""
        hero_id = kwargs.get('hero_id')
        
        if not hero_id:
            return ActionResult(False, "ID du héros à vaincre manquant")
        
        # Vérifie que le héros est présent sur ce lieu
        if hero_id not in location.heroes_present:
            return ActionResult(False, f"Héros {hero_id} non présent sur ce lieu")
        
        # TODO: Calculer la force nécessaire et vérifier
        total_strength = player.get_total_strength(location.id)
        
        # Pour l'instant, on suppose que le héros peut être vaincu
        location.remove_hero(hero_id)
        
        return ActionResult(
            True, 
            f"{player.name} vainc le héros {hero_id}",
            {"vanquished_hero": hero_id, "strength_used": total_strength}
        )
    
    def _handle_fate(self, player: Player, location: Location, **kwargs) -> ActionResult:
        """Gère l'action de jouer le Destin contre un adversaire"""
        target_player = kwargs.get('target_player')
        
        if not target_player:
            return ActionResult(False, "Joueur cible manquant")
        
        # Pioche 2 cartes Destin
        cards_drawn = []
        for _ in range(2):
            card = target_player.draw_card(from_fate=True)
            if card:
                cards_drawn.append(card)
        
        if not cards_drawn:
            return ActionResult(False, "Aucune carte Destin à piocher")
        
        # Pour l'instant, joue automatiquement la première carte
        card_to_play = cards_drawn[0]
        
        # TODO: Implémenter le placement et les effets des cartes Destin
        
        return ActionResult(
            True, 
            f"{player.name} joue le Destin contre {target_player.name}: {card_to_play.name}",
            {"fate_card": card_to_play, "target": target_player}
        )
    
    def _handle_move_item(self, player: Player, location: Location, **kwargs) -> ActionResult:
        """Gère l'action de déplacer un objet"""
        item_id = kwargs.get('item_id')
        target_location = kwargs.get('target_location')
        
        if not item_id or target_location is None:
            return ActionResult(False, "ID d'objet ou lieu cible manquant")
        
        # TODO: Implémenter le déplacement d'objets
        
        return ActionResult(
            True, 
            f"{player.name} déplace un objet",
            {"item_id": item_id, "target_location": target_location}
        )
    
    def _handle_move_hero(self, player: Player, location: Location, **kwargs) -> ActionResult:
        """Gère l'action de déplacer un héros"""
        hero_id = kwargs.get('hero_id')
        target_location = kwargs.get('target_location')
        
        if not hero_id or target_location is None:
            return ActionResult(False, "ID de héros ou lieu cible manquant")
        
        # TODO: Implémenter le déplacement de héros
        
        return ActionResult(
            True, 
            f"{player.name} déplace un héros",
            {"hero_id": hero_id, "target_location": target_location}
        )
    
    def __str__(self) -> str:
        """Représentation textuelle du gestionnaire"""
        return f"TurnManager({len(self.action_handlers)} handlers d'actions)"