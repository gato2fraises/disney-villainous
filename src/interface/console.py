"""
Console Interface - Interface console pour Disney Villainous
"""

import os
import sys
from typing import List, Optional, Dict, Any
from ..core.game import Game
from ..core.enums import VillainType, ActionType, TurnPhase
from ..players.player import Player
from ..cards.card_manager import CardManager
from ..board.board_manager import BoardManager
from ..core.turn_manager import TurnManager
from ..core.victory_conditions import VictoryManager


class ConsoleInterface:
    """
    Interface console pour jouer à Disney Villainous
    """
    
    def __init__(self):
        """Initialise l'interface"""
        self.game: Optional[Game] = None
        self.card_manager = CardManager()
        self.board_manager = BoardManager()
        self.turn_manager = TurnManager()
        self.victory_manager = VictoryManager()
    
    def clear_screen(self) -> None:
        """Efface l'écran de la console"""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def print_header(self, title: str) -> None:
        """Affiche un en-tête stylisé"""
        print("\n" + "=" * 60)
        print(f"   🏰 DISNEY VILLAINOUS - {title.upper()} 🏰")
        print("=" * 60)
    
    def print_separator(self) -> None:
        """Affiche une ligne de séparation"""
        print("-" * 60)
    
    def get_user_choice(self, prompt: str, choices: List[str]) -> str:
        """Demande à l'utilisateur de choisir parmi une liste"""
        print(f"\n{prompt}")
        for i, choice in enumerate(choices, 1):
            print(f"{i}. {choice}")
        
        while True:
            try:
                choice_num = int(input("\nVotre choix: "))
                if 1 <= choice_num <= len(choices):
                    return choices[choice_num - 1]
                else:
                    print(f"Veuillez choisir un nombre entre 1 et {len(choices)}")
            except ValueError:
                print("Veuillez entrer un nombre valide")
    
    def get_user_input(self, prompt: str) -> str:
        """Demande une saisie à l'utilisateur"""
        return input(f"{prompt}: ").strip()
    
    def confirm_action(self, message: str) -> bool:
        """Demande confirmation à l'utilisateur"""
        response = self.get_user_input(f"{message} (o/n)")
        return response.lower() in ['o', 'oui', 'y', 'yes']
    
    def display_main_menu(self) -> str:
        """Affiche le menu principal"""
        self.clear_screen()
        self.print_header("MENU PRINCIPAL")
        
        choices = [
            "Nouvelle partie",
            "Règles du jeu",
            "Quitter"
        ]
        
        return self.get_user_choice("Que voulez-vous faire?", choices)
    
    def display_rules(self) -> None:
        """Affiche les règles du jeu"""
        self.clear_screen()
        self.print_header("RÈGLES DU JEU")
        
        rules = """
🎯 OBJECTIF:
Chaque méchant a un objectif unique pour gagner la partie.

🎲 TOUR DE JEU:
1. DÉPLACEMENT: Déplacez votre pion vers un lieu adjacent
2. ACTIONS: Effectuez les actions du lieu (dans l'ordre de votre choix)
3. REMISE EN MAIN: Repiochez jusqu'à avoir 4 cartes

⚡ ACTIONS POSSIBLES:
• Gagner du Pouvoir
• Jouer une Carte (coûte du Pouvoir)
• Activer une capacité
• Défausser des cartes
• Vaincre un Héros
• Jouer le Destin (contre un adversaire)

🃏 CARTES:
• ALLIÉS: Vous aident à vaincre les héros
• OBJETS: Effets permanents ou activables
• EFFETS: Actions immédiates
• HÉROS (Destin): Gênent vos actions

🏆 VICTOIRE:
Le premier joueur à accomplir son objectif gagne!
        """
        
        print(rules)
        input("\nAppuyez sur Entrée pour continuer...")
    
    def setup_new_game(self) -> bool:
        """Configure une nouvelle partie"""
        self.clear_screen()
        self.print_header("NOUVELLE PARTIE")
        
        # Nombre de joueurs
        while True:
            try:
                num_players = int(self.get_user_input("Nombre de joueurs (2-6)"))
                if 2 <= num_players <= 6:
                    break
                else:
                    print("Le nombre de joueurs doit être entre 2 et 6")
            except ValueError:
                print("Veuillez entrer un nombre valide")
        
        # Crée la partie
        self.game = Game(id=f"game_{num_players}p")
        
        # Configuration des joueurs
        available_villains = list(VillainType)
        
        for i in range(num_players):
            print(f"\n--- Joueur {i + 1} ---")
            
            # Nom du joueur
            player_name = self.get_user_input(f"Nom du joueur {i + 1}")
            if not player_name:
                player_name = f"Joueur {i + 1}"
            
            # Choix du méchant
            villain_choices = [v.value for v in available_villains]
            chosen_villain = self.get_user_choice(
                f"Choisissez votre méchant, {player_name}",
                villain_choices
            )
            
            # Ajoute le joueur
            villain_type = VillainType(chosen_villain)
            if self.game.add_player(player_name, villain_type):
                available_villains.remove(villain_type)
                print(f"✅ {player_name} jouera {chosen_villain}")
            else:
                print("❌ Erreur lors de l'ajout du joueur")
                return False
        
        # Initialise les decks et plateaux
        self._initialize_game_data()
        
        # Démarre la partie
        if self.game.start_game():
            print("\n🎉 Partie créée avec succès!")
            self._display_victory_conditions()
            input("\nAppuyez sur Entrée pour commencer...")
            return True
        else:
            print("❌ Erreur lors du démarrage de la partie")
            return False
    
    def _initialize_game_data(self) -> None:
        """Initialise les données de jeu pour tous les joueurs"""
        for player in self.game.players:
            villain_name = player.villain_type.value
            
            # Charge ou crée les cartes
            villain_cards, fate_cards = self.card_manager.create_sample_cards(villain_name)
            
            # Crée les decks
            from ..cards.deck import Deck
            player.villain_deck = Deck(villain_cards)
            player.villain_deck.shuffle()
            player.fate_deck = Deck(fate_cards)
            player.fate_deck.shuffle()
            
            # Charge le plateau
            player.board_locations = self.board_manager.create_villain_specific_board(
                player.villain_type
            )
            
            # Main initiale
            player.refill_hand()
    
    def _display_victory_conditions(self) -> None:
        """Affiche les conditions de victoire de tous les joueurs"""
        print("\n🏆 CONDITIONS DE VICTOIRE:")
        self.print_separator()
        
        for player in self.game.players:
            condition = self.victory_manager.get_victory_description(player.villain_type)
            print(f"• {player.name} ({player.villain_type.value}):")
            print(f"  {condition}")
    
    def play_game(self) -> None:
        """Boucle principale du jeu"""
        while self.game.state.value == "in_progress":
            current_player = self.game.get_current_player()
            if not current_player:
                break
            
            self._display_game_state()
            self._play_player_turn(current_player)
            
            # Vérifie les conditions de victoire
            winner = self.game.check_victory_conditions()
            if winner:
                self._display_victory(winner)
                break
            
            # Passe au joueur suivant
            self.game.next_turn()
    
    def _display_game_state(self) -> None:
        """Affiche l'état actuel du jeu"""
        self.clear_screen()
        self.print_header(f"TOUR {self.game.turn_number}")
        
        current_player = self.game.get_current_player()
        if not current_player:
            return
        
        print(f"\n🎯 Tour de: {current_player.name} ({current_player.villain_type.value})")
        print(f"⚡ Pouvoir: {current_player.power}")
        print(f"🃏 Main: {len(current_player.hand)} cartes")
        
        # Affiche le plateau
        self._display_player_board(current_player)
        
        # Affiche la main
        self._display_player_hand(current_player)
        
        # Affiche le progrès vers la victoire
        self._display_victory_progress(current_player)
    
    def _display_player_board(self, player: Player) -> None:
        """Affiche le plateau du joueur"""
        print(f"\n🏰 PLATEAU DE {player.name.upper()}:")
        self.print_separator()
        
        for i, location in enumerate(player.board_locations):
            marker = "👑" if i == player.current_location else "  "
            print(f"{marker} {i}. {location.name}")
            
            # Affiche les actions disponibles
            actions = location.get_available_actions()
            if actions:
                for action in actions:
                    status = "🔒" if location.has_heroes() and action.blocked_by_heroes else "✅"
                    print(f"    {status} {action}")
            
            # Affiche les cartes présentes
            if location.heroes_present:
                print(f"    👹 Héros: {len(location.heroes_present)}")
            if location.items_present:
                print(f"    📦 Objets: {len(location.items_present)}")
    
    def _display_player_hand(self, player: Player) -> None:
        """Affiche la main du joueur"""
        print(f"\n🃏 MAIN DE {player.name.upper()}:")
        self.print_separator()
        
        if not player.hand:
            print("  Aucune carte")
            return
        
        for i, card in enumerate(player.hand):
            affordable = "💰" if player.power >= card.cost else "❌"
            print(f"  {i + 1}. {affordable} {card.name} ({card.cost} pouvoir)")
            print(f"      {card.description}")
    
    def _display_victory_progress(self, player: Player) -> None:
        """Affiche le progrès vers la victoire"""
        progress = self.victory_manager.get_victory_progress(player)
        
        print(f"\n🏆 OBJECTIF DE {player.name.upper()}:")
        self.print_separator()
        print(f"  {progress['description']}")
        
        # Affichage spécifique selon le méchant
        if "percentage" in progress:
            print(f"  Progrès: {progress['percentage']:.1f}%")
    
    def _play_player_turn(self, player: Player) -> None:
        """Gère le tour d'un joueur"""
        self.turn_manager.start_turn(player)
        
        # Phase de déplacement
        if player.turn_phase == TurnPhase.MOVE:
            self._handle_movement_phase(player)
        
        # Phase d'actions
        if player.turn_phase == TurnPhase.ACTIONS:
            self._handle_action_phase(player)
        
        # Fin du tour
        self.turn_manager.end_turn(player)
    
    def _handle_movement_phase(self, player: Player) -> None:
        """Gère la phase de déplacement"""
        valid_positions = self.turn_manager.get_valid_move_positions(player)
        
        if not valid_positions:
            print("❌ Aucun déplacement possible!")
            return
        
        # Affiche les choix de déplacement
        choices = []
        for pos in valid_positions:
            location = player.board_locations[pos]
            choices.append(f"{location.name} (Position {pos})")
        
        chosen_location = self.get_user_choice("Où voulez-vous vous déplacer?", choices)
        
        # Extrait la position
        chosen_pos = valid_positions[choices.index(chosen_location)]
        
        # Effectue le déplacement
        result = self.turn_manager.move_player(player, chosen_pos)
        if result:
            print(f"✅ {result.message}")
            input("Appuyez sur Entrée pour continuer...")
        else:
            print(f"❌ {result.message}")
    
    def _handle_action_phase(self, player: Player) -> None:
        """Gère la phase d'actions"""
        while player.actions_remaining > 0 and player.turn_phase == TurnPhase.ACTIONS:
            available_actions = self.turn_manager.get_available_actions(player)
            
            if not available_actions:
                print("❌ Aucune action disponible!")
                break
            
            print(f"\n⚡ Actions restantes: {player.actions_remaining}")
            
            # Prépare les choix d'actions
            action_choices = []
            for action_type in available_actions:
                action_choices.append(action_type.value)
            action_choices.append("Terminer le tour")
            
            chosen_action = self.get_user_choice("Quelle action voulez-vous effectuer?", action_choices)
            
            if chosen_action == "Terminer le tour":
                player.turn_phase = TurnPhase.END
                break
            
            # Effectue l'action
            action_type = ActionType(chosen_action)
            self._execute_chosen_action(player, action_type)
    
    def _execute_chosen_action(self, player: Player, action_type: ActionType) -> None:
        """Exécute une action choisie par le joueur"""
        if action_type == ActionType.GAIN_POWER:
            result = self.turn_manager.perform_action(player, action_type)
            print(f"✅ {result.message}")
        
        elif action_type == ActionType.PLAY_CARD:
            self._handle_play_card_action(player)
        
        elif action_type == ActionType.DISCARD:
            self._handle_discard_action(player)
        
        elif action_type == ActionType.FATE:
            self._handle_fate_action(player)
        
        else:
            # Actions simples
            result = self.turn_manager.perform_action(player, action_type)
            print(f"{'✅' if result else '❌'} {result.message}")
        
        input("Appuyez sur Entrée pour continuer...")
    
    def _handle_play_card_action(self, player: Player) -> None:
        """Gère l'action de jouer une carte"""
        playable_cards = [card for card in player.hand if player.power >= card.cost]
        
        if not playable_cards:
            print("❌ Aucune carte jouable avec votre pouvoir actuel!")
            return
        
        # Affiche les cartes jouables
        card_choices = []
        for card in playable_cards:
            card_choices.append(f"{card.name} ({card.cost} pouvoir)")
        card_choices.append("Annuler")
        
        chosen_card = self.get_user_choice("Quelle carte voulez-vous jouer?", card_choices)
        
        if chosen_card == "Annuler":
            return
        
        # Trouve la carte choisie
        card_index = card_choices.index(chosen_card)
        if card_index < len(playable_cards):
            card = playable_cards[card_index]
            result = self.turn_manager.perform_action(player, ActionType.PLAY_CARD, card_id=card.id)
            print(f"{'✅' if result else '❌'} {result.message}")
    
    def _handle_discard_action(self, player: Player) -> None:
        """Gère l'action de défausser des cartes"""
        if not player.hand:
            print("❌ Aucune carte à défausser!")
            return
        
        print("Sélectionnez les cartes à défausser (numéros séparés par des espaces):")
        for i, card in enumerate(player.hand):
            print(f"  {i + 1}. {card.name}")
        
        choice = self.get_user_input("Cartes à défausser")
        if not choice:
            return
        
        try:
            indices = [int(x) - 1 for x in choice.split()]
            card_ids = [player.hand[i].id for i in indices if 0 <= i < len(player.hand)]
            
            if card_ids:
                result = self.turn_manager.perform_action(player, ActionType.DISCARD, card_ids=card_ids)
                print(f"{'✅' if result else '❌'} {result.message}")
        except (ValueError, IndexError):
            print("❌ Sélection invalide!")
    
    def _handle_fate_action(self, player: Player) -> None:
        """Gère l'action Destin"""
        # Affiche les autres joueurs
        other_players = [p for p in self.game.players if p.id != player.id]
        
        if not other_players:
            print("❌ Aucun autre joueur disponible!")
            return
        
        player_choices = [f"{p.name} ({p.villain_type.value})" for p in other_players]
        chosen_target = self.get_user_choice("Contre qui jouer le Destin?", player_choices)
        
        target_index = player_choices.index(chosen_target)
        target_player = other_players[target_index]
        
        result = self.turn_manager.perform_action(
            player, 
            ActionType.FATE, 
            target_player=target_player
        )
        print(f"{'✅' if result else '❌'} {result.message}")
    
    def _display_victory(self, winner: Player) -> None:
        """Affiche l'écran de victoire"""
        self.clear_screen()
        self.print_header("VICTOIRE!")
        
        print(f"\n🎉 {winner.name} ({winner.villain_type.value}) a gagné!")
        
        condition = self.victory_manager.get_victory_description(winner.villain_type)
        print(f"\n🏆 Objectif accompli: {condition}")
        
        print(f"\n📊 Statistiques de la partie:")
        print(f"   • Nombre de tours: {self.game.turn_number}")
        print(f"   • Nombre de joueurs: {len(self.game.players)}")
        
        input("\nAppuyez sur Entrée pour retourner au menu principal...")
    
    def run(self) -> None:
        """Lance l'interface console"""
        while True:
            choice = self.display_main_menu()
            
            if choice == "Nouvelle partie":
                if self.setup_new_game():
                    self.play_game()
            
            elif choice == "Règles du jeu":
                self.display_rules()
            
            elif choice == "Quitter":
                print("\n👋 Merci d'avoir joué à Disney Villainous!")
                sys.exit(0)


def main():
    """Point d'entrée principal"""
    interface = ConsoleInterface()
    interface.run()


if __name__ == "__main__":
    main()