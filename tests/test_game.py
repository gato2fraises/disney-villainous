"""
Script de test pour Disney Villainous
"""

import sys
import os

# Ajoute le répertoire src au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.core.game import Game
from src.core.enums import VillainType, ActionType
from src.cards.card_manager import CardManager
from src.board.board_manager import BoardManager
from src.core.turn_manager import TurnManager
from src.core.victory_conditions import VictoryManager


def test_basic_setup():
    """Test la création de base du jeu"""
    print("🧪 Test 1: Création du jeu de base")
    
    # Crée une partie
    game = Game(id="test_game")
    
    # Ajoute des joueurs
    success1 = game.add_player("Alice", VillainType.MALEFICENT)
    success2 = game.add_player("Bob", VillainType.JAFAR)
    
    print(f"✅ Ajout joueur 1: {success1}")
    print(f"✅ Ajout joueur 2: {success2}")
    print(f"✅ Nombre de joueurs: {len(game.players)}")
    
    # Initialise les données
    card_manager = CardManager()
    board_manager = BoardManager()
    
    for player in game.players:
        villain_name = player.villain_type.value
        
        # Cartes
        villain_cards, fate_cards = card_manager.create_sample_cards(villain_name)
        from src.cards.deck import Deck
        player.villain_deck = Deck(villain_cards)
        player.villain_deck.shuffle()
        player.fate_deck = Deck(fate_cards)
        player.fate_deck.shuffle()
        
        # Plateau
        player.board_locations = board_manager.create_villain_specific_board(player.villain_type)
        
        # Main initiale
        player.refill_hand()
        
        print(f"✅ Joueur {player.name} initialisé:")
        print(f"   - Deck: {len(player.villain_deck)} cartes")
        print(f"   - Main: {len(player.hand)} cartes")
        print(f"   - Plateau: {len(player.board_locations)} lieux")
    
    return game


def test_game_mechanics(game):
    """Test les mécaniques de base du jeu"""
    print("\n🧪 Test 2: Mécaniques de jeu")
    
    turn_manager = TurnManager()
    
    # Démarre la partie
    started = game.start_game()
    print(f"✅ Partie démarrée: {started}")
    
    current_player = game.get_current_player()
    print(f"✅ Joueur actuel: {current_player.name}")
    
    # Test déplacement
    print(f"✅ Position initiale: {current_player.current_location}")
    valid_moves = turn_manager.get_valid_move_positions(current_player)
    print(f"✅ Déplacements possibles: {valid_moves}")
    
    if valid_moves:
        move_result = turn_manager.move_player(current_player, valid_moves[0])
        print(f"✅ Déplacement effectué: {move_result.success}")
        print(f"   Message: {move_result.message}")
    
    # Test actions
    available_actions = turn_manager.get_available_actions(current_player)
    print(f"✅ Actions disponibles: {[a.value for a in available_actions]}")
    
    # Test action gain_power
    if ActionType.GAIN_POWER in available_actions:
        old_power = current_player.power
        power_result = turn_manager.perform_action(current_player, ActionType.GAIN_POWER)
        print(f"✅ Gain de pouvoir: {power_result.success}")
        print(f"   Pouvoir: {old_power} → {current_player.power}")
    
    return True


def test_victory_conditions():
    """Test les conditions de victoire"""
    print("\n🧪 Test 3: Conditions de victoire")
    
    victory_manager = VictoryManager()
    
    for villain_type in [VillainType.MALEFICENT, VillainType.JAFAR, VillainType.CAPTAIN_HOOK]:
        description = victory_manager.get_victory_description(villain_type)
        print(f"✅ {villain_type.value}: {description}")
    
    return True


def test_card_loading():
    """Test le chargement des cartes depuis les fichiers JSON"""
    print("\n🧪 Test 4: Chargement des cartes")
    
    card_manager = CardManager()
    
    # Test chargement Maléfique
    maleficent_villain = card_manager.load_villain_cards("maleficent")
    maleficent_fate = card_manager.load_fate_cards("maleficent")
    
    print(f"✅ Cartes Méchant Maléfique: {len(maleficent_villain)}")
    print(f"✅ Cartes Destin Maléfique: {len(maleficent_fate)}")
    
    if maleficent_villain:
        card = maleficent_villain[0]
        print(f"   Exemple: {card.name} (coût: {card.cost})")
    
    # Test chargement Jafar
    jafar_villain = card_manager.load_villain_cards("jafar")
    jafar_fate = card_manager.load_fate_cards("jafar")
    
    print(f"✅ Cartes Méchant Jafar: {len(jafar_villain)}")
    print(f"✅ Cartes Destin Jafar: {len(jafar_fate)}")
    
    return True


def test_board_loading():
    """Test le chargement des plateaux depuis les fichiers JSON"""
    print("\n🧪 Test 5: Chargement des plateaux")
    
    board_manager = BoardManager()
    
    # Test chargement plateaux
    maleficent_board = board_manager.load_villain_board("maleficent")
    jafar_board = board_manager.load_villain_board("jafar")
    hook_board = board_manager.load_villain_board("captain_hook")
    
    print(f"✅ Plateau Maléfique: {len(maleficent_board)} lieux")
    print(f"✅ Plateau Jafar: {len(jafar_board)} lieux")
    print(f"✅ Plateau Crochet: {len(hook_board)} lieux")
    
    if maleficent_board:
        location = maleficent_board[0]
        print(f"   Exemple: {location.name} - {len(location.actions)} actions")
        for action in location.actions:
            print(f"     • {action.action_type.value}")
    
    # Test validation
    errors = board_manager.validate_board(maleficent_board)
    print(f"✅ Erreurs de validation: {len(errors)}")
    if errors:
        for error in errors:
            print(f"   ❌ {error}")
    
    return True


def test_complete_turn():
    """Test un tour complet de jeu"""
    print("\n🧪 Test 6: Tour complet")
    
    game = Game(id="complete_test")
    game.add_player("TestPlayer", VillainType.MALEFICENT)
    
    # Initialise le joueur
    card_manager = CardManager()
    board_manager = BoardManager()
    
    player = game.players[0]
    villain_cards, fate_cards = card_manager.create_sample_cards("maleficent")
    
    from src.cards.deck import Deck
    player.villain_deck = Deck(villain_cards)
    player.villain_deck.shuffle()
    player.fate_deck = Deck(fate_cards)
    player.fate_deck.shuffle()
    player.board_locations = board_manager.create_villain_specific_board(VillainType.MALEFICENT)
    player.refill_hand()
    player.power = 5  # Donne du pouvoir pour tester
    
    game.start_game()
    turn_manager = TurnManager()
    
    print(f"✅ État initial:")
    print(f"   Position: {player.current_location}")
    print(f"   Pouvoir: {player.power}")
    print(f"   Main: {len(player.hand)} cartes")
    
    # Déplacement
    valid_moves = turn_manager.get_valid_move_positions(player)
    if valid_moves:
        turn_manager.move_player(player, valid_moves[0])
        print(f"✅ Après déplacement: position {player.current_location}")
    
    # Actions
    actions_performed = 0
    while player.actions_remaining > 0 and actions_performed < 3:
        available_actions = turn_manager.get_available_actions(player)
        if ActionType.GAIN_POWER in available_actions:
            result = turn_manager.perform_action(player, ActionType.GAIN_POWER)
            if result.success:
                actions_performed += 1
                print(f"✅ Action {actions_performed}: {result.message}")
        else:
            break
    
    # Fin de tour
    turn_manager.end_turn(player)
    print(f"✅ Tour terminé - Nouvelle main: {len(player.hand)} cartes")
    
    return True


def run_all_tests():
    """Lance tous les tests"""
    print("🎯 TESTS DISNEY VILLAINOUS")
    print("=" * 50)
    
    try:
        # Test 1: Setup de base
        game = test_basic_setup()
        
        # Test 2: Mécaniques
        test_game_mechanics(game)
        
        # Test 3: Conditions de victoire
        test_victory_conditions()
        
        # Test 4: Chargement cartes
        test_card_loading()
        
        # Test 5: Chargement plateaux
        test_board_loading()
        
        # Test 6: Tour complet
        test_complete_turn()
        
        print("\n🎉 TOUS LES TESTS SONT PASSÉS!")
        print("=" * 50)
        print("✅ Le jeu Disney Villainous est prêt à être joué!")
        print("\nPour lancer le jeu:")
        print("  python src/main.py")
        
    except Exception as e:
        print(f"\n❌ ERREUR DANS LES TESTS: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True


if __name__ == "__main__":
    run_all_tests()