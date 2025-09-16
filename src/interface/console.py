"""
Console Interface - Interface console pour Disney Villainous
"""

import os
import sys
import random
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
    
    def run(self) -> None:
        """Lance l'interface principale"""
        self.clear_screen()
        self.print_header("BIENVENUE")
        print("🏰 Bienvenue dans Disney Villainous ! 🏰")
        print("Incarnez les plus grands méchants Disney et accomplissez leur destinée maléfique !")
        
        while True:
            choice = self.main_menu()
            
            if choice == "1":
                self.new_game()
            elif choice == "2":
                self.show_rules()
            elif choice == "3":
                self.show_credits()
            elif choice == "4":
                print("\n👋 Au revoir et merci d'avoir joué à Disney Villainous !")
                break
            else:
                print("❌ Choix invalide, veuillez réessayer.")
    
    def main_menu(self) -> str:
        """Affiche le menu principal"""
        print("\n" + "🏰" * 20)
        print("   MENU PRINCIPAL")
        print("🏰" * 20)
        
        choices = [
            "🎮 Nouvelle partie",
            "📖 Règles du jeu", 
            "🏆 Crédits",
            "🚪 Quitter"
        ]
        
        return self.get_user_choice("QUE VOULEZ-VOUS FAIRE ?", choices)
    
    def new_game(self) -> None:
        """Démarre une nouvelle partie"""
        if self.setup_new_game():
            self.play_game()
    
    def show_rules(self) -> None:
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
• Gagner du Pouvoir 💰
• Jouer une Carte 🃏 (coûte du Pouvoir)
• Activer une capacité 🔧
• Défausser des cartes 🗑️
• Vaincre un Héros ⚔️
• Jouer le Destin 🔮 (contre un adversaire)

🃏 CARTES:
• ALLIÉS: Vous aident à vaincre les héros
• OBJETS: Effets permanents ou activables
• EFFETS: Actions immédiates
• HÉROS (Destin): Gênent vos actions

🏆 VICTOIRE:
Le premier joueur à accomplir son objectif gagne!

🦹 MÉCHANTS DISPONIBLES:
• Maléfique: Placer une malédiction sur chaque lieu
• Jafar: Avoir la Lampe Magique et vaincre Aladdin
• Capitaine Crochet: Vaincre Peter Pan au Jolly Roger
• Prince Jean: Accumuler 20 pouvoirs
• Reine de Cœur: Placer une tête tranchée sur chaque lieu
• Ursula: Avoir le Trident et la Couronne au palais
        """
        
        print(rules)
        input("\nAppuyez sur Entrée pour continuer...")
    
    def show_credits(self) -> None:
        """Affiche les crédits"""
        self.clear_screen()
        self.print_header("CRÉDITS")
        
        credits = """
🏰 DISNEY VILLAINOUS - VERSION NUMÉRIQUE 🏰

🎮 Basé sur le jeu de société original de:
   Ravensburger & Wonder Forge

🎯 Développé avec passion pour recréer
   l'expérience Disney Villainous

⚡ Fonctionnalités:
   • 6 méchants jouables
   • Conditions de victoire uniques
   • Système de cartes complet
   • Interface console interactive

🏆 Merci de jouer !

        """
        
        print(credits)
        input("\nAppuyez sur Entrée pour continuer...")
    
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
    
    def _display_victory(self, winner: Player) -> None:
        """Affiche l'écran de victoire"""
        self.clear_screen()
        self.print_header("VICTOIRE !")
        
        print(f"\n🎉🎉🎉 {winner.name} ({winner.villain_type.value}) A GAGNÉ ! 🎉🎉🎉")
        print(f"\nCondition remplie: {self.victory_manager.get_victory_description(winner.villain_type)}")
        
        # Affiche le classement final
        print(f"\n🏆 CLASSEMENT FINAL:")
        self.print_separator()
        
        for i, player in enumerate(self.game.players, 1):
            position = "🥇" if player == winner else f"{i}."
            progress = self.victory_manager.get_victory_progress(player)
            percentage = progress.get('percentage', 0)
            print(f"{position} {player.name} ({player.villain_type.value}) - {percentage:.1f}% accompli")
        
        print(f"\nPartie terminée en {self.game.turn_number} tours")
        input("\nAppuyez sur Entrée pour revenir au menu principal...")
    
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
        """Affiche le plateau du joueur avec encadrés et disposition horizontale"""
        print(f"\n🏰 PLATEAU DE {player.name.upper()} :")
        self.print_separator()

        # Construction ASCII horizontale
        board_lines = [[], [], [], [], []]  # 5 lignes pour chaque lieu
        for i, location in enumerate(player.board_locations):
            marker = "👑" if i == player.current_location else "  "
            name = f"{marker} {i}. {location.name}"
            actions = location.get_available_actions()
            actions_str = " | ".join([
                ("🔒 " if location.has_heroes() and action.blocked_by_heroes else "✅ ") + str(action)
                for action in actions
            ]) if actions else "aucune action"
            heroes_str = f"👹 {len(location.heroes_present)}" if location.heroes_present else ""
            items_str = f"📦 {len(location.items_present)}" if location.items_present else ""

            # Encadré ASCII
            width = max(18, len(name), len(actions_str), len(heroes_str + items_str))
            board_lines[0].append("┌" + "─" * (width) + "┐")
            board_lines[1].append(f"│{name.ljust(width)}│")
            board_lines[2].append(f"│{actions_str.ljust(width)}│")
            board_lines[3].append(f"│{(heroes_str + ' ' + items_str).strip().ljust(width)}│")
            board_lines[4].append("└" + "─" * (width) + "┘")

        # Affichage horizontal
        for line in board_lines:
            print("  ".join(line))
    
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
        """Gère le tour complet d'un joueur de manière interactive"""
        print(f"\n🎮 C'est le tour de {player.name} !")
        
        # Phase 1: DÉPLACEMENT (obligatoire)
        self._handle_move_phase(player)
        
        # Phase 2: ACTIONS
        self._handle_action_phase(player)
        
        # Phase 3: REMISE EN MAIN (automatique)
        player.refill_hand()
        
        print(f"\n✅ Fin du tour de {player.name}")
        input("Appuyez sur Entrée pour continuer...")
    
    def _handle_move_phase(self, player: Player) -> None:
        """Gère la phase de déplacement interactive"""
        print("\n🚶 PHASE DE DÉPLACEMENT")
        print("Vous devez vous déplacer vers un lieu adjacent.")
        
        # Affiche les options de déplacement
        valid_positions = []
        for i, location in enumerate(player.board_locations):
            if player.can_move_to(i):
                valid_positions.append(i)
                marker = "👑" if i == player.current_location else "🎯"
                print(f"  {marker} {i + 1}. {location.name}")
        
        if not valid_positions:
            print("❌ Aucun déplacement possible!")
            return
        
        # Demande le choix
        while True:
            try:
                choice = int(input("\nOù voulez-vous aller? (numéro): ")) - 1
                if choice in valid_positions:
                    if self.game.move_player(player, choice):
                        current_location = player.get_current_location()
                        print(f"✅ {player.name} se déplace vers {current_location.name}")
                        break
                    else:
                        print("❌ Déplacement impossible")
                else:
                    print("❌ Position invalide")
            except ValueError:
                print("❌ Veuillez entrer un nombre valide")
    
    def _handle_action_phase(self, player: Player) -> None:
        """Gère la phase d'actions interactive"""
        current_location = player.get_current_location()
        if not current_location:
            return
        
        print(f"\n⚡ PHASE D'ACTIONS - {current_location.name}")
        print(f"Pouvoir disponible: {player.power}")
        
        actions_performed = 0
        max_actions = len(current_location.get_available_actions())
        
        while actions_performed < max_actions:
            print(f"\nAction {actions_performed + 1}/{max_actions}")
            
            # Affiche les actions disponibles
            available_actions = current_location.get_available_actions()
            action_choices = []
            
            for i, action in enumerate(available_actions):
                blocked = current_location.has_heroes() and action.blocked_by_heroes
                status = "🔒" if blocked else "✅"
                action_choices.append(f"{status} {action.description}")
            
            action_choices.append("⏭️ Passer cette action")
            
            choice_idx = self.get_user_choice("Quelle action voulez-vous effectuer?", action_choices)
            choice_num = action_choices.index(choice_idx) + 1
            
            if choice_num > len(available_actions):  # Passer l'action
                print("⏭️ Action passée")
                actions_performed += 1
                continue
            
            # Exécute l'action choisie
            selected_action = available_actions[choice_num - 1]
            
            # Vérifie si l'action est bloquée
            if current_location.has_heroes() and selected_action.blocked_by_heroes:
                print("🔒 Cette action est bloquée par la présence de héros!")
                continue
            
            success = self._execute_player_action(player, selected_action, current_location)
            
            if success:
                actions_performed += 1
                print(f"✅ Action '{selected_action.description}' effectuée!")
            else:
                print(f"❌ Impossible d'effectuer l'action '{selected_action.description}'")
        
        print("\n🏁 Toutes les actions ont été effectuées!")
    
    def _execute_player_action(self, player: Player, action, location) -> bool:
        """Exécute une action spécifique du joueur"""
        action_type = action.type
        
        if action_type == ActionType.GAIN_POWER:
            power_gain = getattr(action, 'value', 1)
            player.gain_power(power_gain)
            print(f"💰 {player.name} gagne {power_gain} pouvoir(s)! Total: {player.power}")
            return True
        
        elif action_type == ActionType.PLAY_CARD:
            return self._handle_play_card_action(player)
        
        elif action_type == ActionType.DISCARD:
            return self._handle_discard_action(player)
        
        elif action_type == ActionType.VANQUISH:
            return self._handle_vanquish_action(player, location)
        
        elif action_type == ActionType.FATE:
            return self._handle_fate_action(player)
        
        elif action_type == ActionType.ACTIVATE:
            return self._handle_activate_action(player, location)
        
        else:
            print(f"⚠️ Action '{action_type.value}' non implémentée")
            return False
    
    def _handle_play_card_action(self, player: Player) -> bool:
        """Gère l'action 'Jouer une carte' de manière interactive"""
        if not player.hand:
            print("❌ Aucune carte en main!")
            return False
        
        print("\n🃏 JOUER UNE CARTE")
        
        # Affiche les cartes jouables
        playable_cards = []
        card_choices = []
        
        for i, card in enumerate(player.hand):
            if player.power >= card.cost:
                playable_cards.append(card)
                card_choices.append(f"💰 {card.name} ({card.cost} pouvoir) - {card.description}")
            else:
                card_choices.append(f"❌ {card.name} ({card.cost} pouvoir) - Pas assez de pouvoir")
        
        card_choices.append("🚫 Annuler")
        
        if not playable_cards:
            print("❌ Aucune carte jouable avec votre pouvoir actuel!")
            return False
        
        choice = self.get_user_choice("Quelle carte voulez-vous jouer?", card_choices)
        choice_idx = card_choices.index(choice)
        
        if choice_idx >= len(player.hand):  # Annuler
            return False
        
        selected_card = player.hand[choice_idx]
        
        if player.power >= selected_card.cost:
            # Dépense le pouvoir et joue la carte
            player.power -= selected_card.cost
            player.hand.remove(selected_card)
            
            # Applique les effets de la carte
            self._apply_card_effects(player, selected_card)
            
            print(f"✅ {selected_card.name} jouée! Pouvoir restant: {player.power}")
            return True
        
        return False
    
    def _apply_card_effects(self, player: Player, card) -> None:
        """Applique les effets d'une carte jouée"""
        for effect in getattr(card, 'effects', []):
            description = effect.get('description', '')
            trigger = effect.get('trigger', 'play')
            
            if trigger == 'play':
                print(f"  🌟 Effet: {description}")
                
                # Exemples d'effets simples
                if 'gagne' in description.lower() and 'pouvoir' in description.lower():
                    # Extrait le nombre de pouvoirs à gagner
                    words = description.split()
                    for i, word in enumerate(words):
                        if word.isdigit():
                            power_gain = int(word)
                            player.gain_power(power_gain)
                            print(f"    💰 +{power_gain} pouvoir!")
                            break
                
                elif 'pioche' in description.lower():
                    # Pioche des cartes
                    cards_to_draw = 1
                    words = description.split()
                    for word in words:
                        if word.isdigit():
                            cards_to_draw = int(word)
                            break
                    
                    for _ in range(cards_to_draw):
                        card = player.draw_card()
                        if card:
                            player.hand.append(card)
                    print(f"    🃏 +{cards_to_draw} carte(s) piochée(s)!")
        
        # Place la carte sur le plateau (alliés et objets)
        current_location = player.get_current_location()
        if current_location and hasattr(card, 'type'):
            if card.type in ['ally', 'item']:
                current_location.items_present.append(card.id)
                print(f"    📍 {card.name} placé(e) à {current_location.name}")
    
    def _handle_discard_action(self, player: Player) -> bool:
        """Gère l'action 'Défausser des cartes' de manière interactive"""
        if not player.hand:
            print("❌ Aucune carte en main!")
            return False
        
        print("\n🗑️ DÉFAUSSER DES CARTES")
        print("Choisissez les cartes à défausser (vous pouvez en choisir plusieurs)")
        
        cards_to_discard = []
        
        while True:
            print(f"\nMain actuelle ({len(player.hand)} cartes):")
            for i, card in enumerate(player.hand):
                if card not in cards_to_discard:
                    print(f"  {i + 1}. {card.name} - {card.description}")
            
            if cards_to_discard:
                print(f"\nCartes sélectionnées pour défausse ({len(cards_to_discard)}):")
                for card in cards_to_discard:
                    print(f"  • {card.name}")
            
            print(f"\nOptions:")
            print(f"  1-{len(player.hand)}. Ajouter/Retirer une carte")
            print(f"  0. Confirmer la défausse")
            print(f"  -1. Annuler")
            
            try:
                choice = int(input("Votre choix: "))
                
                if choice == -1:  # Annuler
                    return False
                elif choice == 0:  # Confirmer
                    if cards_to_discard:
                        for card in cards_to_discard:
                            player.hand.remove(card)
                        print(f"✅ {len(cards_to_discard)} carte(s) défaussée(s)!")
                        return True
                    else:
                        print("❌ Aucune carte sélectionnée!")
                elif 1 <= choice <= len(player.hand):
                    card = player.hand[choice - 1]
                    if card in cards_to_discard:
                        cards_to_discard.remove(card)
                        print(f"➖ {card.name} retirée de la sélection")
                    else:
                        cards_to_discard.append(card)
                        print(f"➕ {card.name} ajoutée à la sélection")
                else:
                    print("❌ Choix invalide")
            
            except ValueError:
                print("❌ Veuillez entrer un nombre valide")
    
    def _handle_vanquish_action(self, player: Player, location) -> bool:
        """Gère l'action 'Vaincre un héros'"""
        if not location.heroes_present:
            print("❌ Aucun héros à vaincre ici!")
            return False
        
        print("\n⚔️ VAINCRE UN HÉROS")
        print("Héros présents:")
        
        for i, hero_id in enumerate(location.heroes_present):
            print(f"  {i + 1}. {hero_id}")  
        
        print("⚠️ Système de combat simplifié - les héros sont automatiquement vaincus!")
        
        # Supprime le premier héros (système simplifié)
        removed_hero = location.heroes_present.pop(0)
        print(f"✅ {removed_hero} a été vaincu!")
        
        # Récompense de base
        player.gain_power(1)
        print("💰 +1 pouvoir pour avoir vaincu un héros!")
        
        return True
    
    def _handle_fate_action(self, player: Player) -> bool:
        """Gère l'action 'Jouer le Destin' de manière interactive"""
        # Trouve les adversaires
        opponents = [p for p in self.game.players if p != player]
        
        if not opponents:
            print("❌ Aucun adversaire disponible!")
            return False
        
        print("\n🔮 JOUER LE DESTIN")
        
        opponent_choices = [f"{p.name} ({p.villain_type.value})" for p in opponents]
        choice = self.get_user_choice("Contre qui voulez-vous jouer le Destin?", opponent_choices)
        
        target_opponent = opponents[opponent_choices.index(choice)]
        
        # Pioche 2 cartes Destin de l'adversaire
        fate_cards = []
        for _ in range(2):
            card = target_opponent.draw_card(from_fate=True)
            if card:
                fate_cards.append(card)
        
        if not fate_cards:
            print("❌ Aucune carte Destin disponible!")
            return False
        
        print(f"\nCartes Destin piochées contre {target_opponent.name}:")
        card_choices = []
        for i, card in enumerate(fate_cards):
            card_choices.append(f"{card.name} - {card.description}")
        
        choice = self.get_user_choice("Quelle carte voulez-vous jouer?", card_choices)
        selected_card = fate_cards[card_choices.index(choice)]
        
        # Place un héros sur le plateau de l'adversaire (simplifié)
        if target_opponent.board_locations:
            random_location = target_opponent.board_locations[0]  # Simplifié
            random_location.heroes_present.append(selected_card.id)
            print(f"🔮 {selected_card.name} placé(e) chez {target_opponent.name} à {random_location.name}!")
        
        # Défausse les autres cartes
        for card in fate_cards:
            if card != selected_card:
                print(f"  🗑️ {card.name} défaussée")
        
        return True
    
    def _handle_activate_action(self, player: Player, location) -> bool:
        """Gère l'action 'Activer une capacité'"""
        # Trouve les objets activables dans le lieu
        activatable_items = []
        
        for item_id in location.items_present:
            activatable_items.append(item_id)
        
        if not activatable_items:
            print("❌ Aucun objet activable ici!")
            return False
        
        print("\n🔧 ACTIVER UNE CAPACITÉ")
        print("Objets activables:")
        
        for i, item_id in enumerate(activatable_items):
            print(f"  {i + 1}. {item_id}")  
        
        choice = self.get_user_choice("Quel objet voulez-vous activer?", activatable_items)
        selected_item = choice
        
        # Activation simplifiée
        print(f"🔧 {selected_item} activé(e)!")
        player.gain_power(2)  # Effet générique
        print("💰 +2 pouvoirs grâce à l'activation!")
        
        return True
    
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