"""
Classe Game - Gestionnaire principal du jeu Disney Villainous
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any
import random
from ..players.player import Player
from ..core.enums import GameState, TurnPhase, VillainType
from ..cards.card import Card


@dataclass
class Game:
    """
    Classe principale gérant une partie de Disney Villainous
    """
    id: str
    players: List[Player] = field(default_factory=list)
    current_player_index: int = 0
    turn_number: int = 1
    state: GameState = GameState.WAITING
    winner: Optional[Player] = None
    
    # Configuration
    max_players: int = 6
    min_players: int = 2
    
    # Historique des actions
    action_log: List[str] = field(default_factory=list)
    
    def __post_init__(self):
        """Initialisation après création"""
        if len(self.players) > 0:
            random.shuffle(self.players)  # Ordre aléatoire des joueurs
    
    # === Gestion des joueurs ===
    
    def add_player(self, player_name: str, villain_type: VillainType) -> bool:
        """Ajoute un joueur à la partie"""
        if len(self.players) >= self.max_players:
            return False
        
        if self.state != GameState.WAITING:
            return False
        
        # Vérifie que le méchant n'est pas déjà pris
        for player in self.players:
            if player.villain_type == villain_type:
                return False
        
        player_id = f"player_{len(self.players) + 1}"
        player = Player(
            id=player_id,
            name=player_name,
            villain_type=villain_type
        )
        
        self.players.append(player)
        self.log_action(f"{player_name} rejoint la partie avec {villain_type.value}")
        
        return True
    
    def remove_player(self, player_id: str) -> bool:
        """Retire un joueur de la partie"""
        if self.state != GameState.WAITING:
            return False
        
        for i, player in enumerate(self.players):
            if player.id == player_id:
                self.players.pop(i)
                self.log_action(f"{player.name} quitte la partie")
                return True
        return False
    
    def get_current_player(self) -> Optional[Player]:
        """Retourne le joueur actuel"""
        if 0 <= self.current_player_index < len(self.players):
            return self.players[self.current_player_index]
        return None
    
    def get_player_by_id(self, player_id: str) -> Optional[Player]:
        """Trouve un joueur par son ID"""
        for player in self.players:
            if player.id == player_id:
                return player
        return None
    
    # === Gestion du jeu ===
    
    def start_game(self) -> bool:
        """Démarre la partie"""
        if len(self.players) < self.min_players:
            return False
        
        if self.state != GameState.WAITING:
            return False
        
        # Initialise chaque joueur
        for player in self.players:
            player.refill_hand()  # Main de départ
            player.turn_phase = TurnPhase.MOVE
        
        self.state = GameState.IN_PROGRESS
        self.current_player_index = 0
        self.log_action("La partie commence !")
        
        return True
    
    def end_game(self, winner: Optional[Player] = None) -> None:
        """Termine la partie"""
        self.state = GameState.FINISHED
        self.winner = winner
        
        if winner:
            self.log_action(f"{winner.name} ({winner.villain_type.value}) remporte la partie !")
        else:
            self.log_action("Partie terminée sans vainqueur")
    
    def check_victory_conditions(self) -> Optional[Player]:
        """Vérifie les conditions de victoire de tous les joueurs"""
        for player in self.players:
            if player.check_victory_condition():
                return player
        return None
    
    # === Gestion des tours ===
    
    def next_turn(self) -> None:
        """Passe au joueur suivant"""
        current_player = self.get_current_player()
        if current_player:
            # Remet la main à 4 cartes
            current_player.refill_hand()
            current_player.turn_phase = TurnPhase.MOVE
            current_player.actions_remaining = 0
        
        self.current_player_index = (self.current_player_index + 1) % len(self.players)
        
        # Nouveau tour si on revient au premier joueur
        if self.current_player_index == 0:
            self.turn_number += 1
        
        # Vérifie les conditions de victoire
        winner = self.check_victory_conditions()
        if winner:
            self.end_game(winner)
    
    def start_player_turn(self, player: Player) -> None:
        """Démarre le tour d'un joueur"""
        player.turn_phase = TurnPhase.MOVE
        # Le joueur doit bouger en premier
        self.log_action(f"Tour de {player.name} - Phase de déplacement")
    
    def start_action_phase(self, player: Player) -> None:
        """Démarre la phase d'actions"""
        player.turn_phase = TurnPhase.ACTIONS
        current_location = player.get_current_location()
        if current_location:
            player.actions_remaining = len(current_location.get_available_actions())
            self.log_action(f"{player.name} - Phase d'actions ({player.actions_remaining} actions disponibles)")
    
    # === Actions de jeu ===
    
    def move_player(self, player: Player, new_position: int) -> bool:
        """Déplace un joueur"""
        if player.turn_phase != TurnPhase.MOVE:
            return False
        
        if not player.can_move_to(new_position):
            return False
        
        old_location = player.get_current_location()
        if player.move_to_location(new_position):
            new_location = player.get_current_location()
            self.log_action(f"{player.name} se déplace de {old_location.name if old_location else '?'} vers {new_location.name if new_location else '?'}")
            
            # Passe à la phase d'actions
            self.start_action_phase(player)
            return True
        
        return False
    
    def perform_action(self, player: Player, action_type: str, **kwargs) -> bool:
        """Effectue une action générique"""
        if player.turn_phase != TurnPhase.ACTIONS:
            return False
        
        if player.actions_remaining <= 0:
            return False
        
        current_location = player.get_current_location()
        if not current_location:
            return False
        
        # Vérifie que l'action est disponible
        from ..core.enums import ActionType
        try:
            action_enum = ActionType(action_type)
        except ValueError:
            return False
        
        if not current_location.can_perform_action(action_enum):
            return False
        
        # Effectue l'action spécifique
        success = self._execute_action(player, action_enum, current_location, **kwargs)
        
        if success:
            player.actions_remaining -= 1
            self.log_action(f"{player.name} effectue l'action {action_type}")
            
            # Fin du tour si plus d'actions
            if player.actions_remaining <= 0:
                player.turn_phase = TurnPhase.END
        
        return success
    
    def _execute_action(self, player: Player, action_type, location, **kwargs) -> bool:
        """Exécute une action spécifique"""
        from ..core.enums import ActionType
        
        if action_type == ActionType.GAIN_POWER:
            action = location.get_action_by_type(action_type)
            if action and action.value:
                player.gain_power(action.value)
                return True
        
        elif action_type == ActionType.PLAY_CARD:
            card_id = kwargs.get('card_id')
            if card_id:
                # Trouve la carte dans la main
                card = None
                for c in player.hand:
                    if c.id == card_id:
                        card = c
                        break
                
                if card:
                    return player.play_card(card, location.id)
        
        elif action_type == ActionType.DISCARD:
            card_ids = kwargs.get('card_ids', [])
            if card_ids:
                for card_id in card_ids:
                    card = None
                    for c in player.hand:
                        if c.id == card_id:
                            card = c
                            break
                    if card:
                        player.discard_card(card)
                return True
        
        elif action_type == ActionType.FATE:
            target_player_id = kwargs.get('target_player_id')
            if target_player_id:
                target_player = self.get_player_by_id(target_player_id)
                if target_player:
                    return self._perform_fate(player, target_player)
        
        # TODO: Implémenter les autres actions (VANQUISH, ACTIVATE, etc.)
        
        return False
    
    def _perform_fate(self, acting_player: Player, target_player: Player) -> bool:
        """Effectue une action Destin contre un autre joueur"""
        # Pioche 2 cartes Destin
        cards_drawn = []
        for _ in range(2):
            card = target_player.draw_card(from_fate=True)
            if card:
                cards_drawn.append(card)
        
        if cards_drawn:
            # TODO: Laisser le joueur choisir quelle carte jouer
            # Pour l'instant, joue la première carte
            card_to_play = cards_drawn[0]
            
            # Place la carte sur le plateau du joueur cible
            # TODO: Implémenter la logique de placement des héros
            
            self.log_action(f"{acting_player.name} joue le Destin contre {target_player.name} : {card_to_play.name}")
            return True
        
        return False
    
    # === Utilitaires ===
    
    def log_action(self, message: str) -> None:
        """Ajoute une entrée au log d'actions"""
        log_entry = f"Tour {self.turn_number}: {message}"
        self.action_log.append(log_entry)
        # TODO: Optionnel - afficher immédiatement
    
    def get_game_state(self) -> Dict[str, Any]:
        """Retourne l'état complet du jeu"""
        return {
            "id": self.id,
            "state": self.state.value,
            "turn_number": self.turn_number,
            "current_player": self.current_player_index,
            "players": [
                {
                    "id": p.id,
                    "name": p.name,
                    "villain": p.villain_type.value,
                    "power": p.power,
                    "hand_size": len(p.hand),
                    "location": p.current_location,
                    "has_won": p.has_won
                }
                for p in self.players
            ],
            "winner": self.winner.id if self.winner else None
        }
    
    def is_player_turn(self, player_id: str) -> bool:
        """Vérifie si c'est le tour du joueur spécifié"""
        current_player = self.get_current_player()
        return current_player is not None and current_player.id == player_id
    
    def __str__(self) -> str:
        """Représentation textuelle du jeu"""
        return f"Game {self.id} - Tour {self.turn_number} - {self.state.value} - {len(self.players)} joueurs"