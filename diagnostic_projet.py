"""
Validation des fichiers du projet Disney Villainous
Script de diagnostic simple sans dépendances
"""

import os
import sys

def check_file_exists(filepath, description):
    """Vérifie qu'un fichier existe"""
    if os.path.exists(filepath):
        print(f"✅ {description}: OK")
        return True
    else:
        print(f"❌ {description}: MANQUANT")
        return False

def check_directory_structure():
    """Vérifie la structure des dossiers"""
    print("🔍 Vérification de la structure du projet...")
    
    required_dirs = [
        ("src", "Dossier source principal"),
        ("src/core", "Modules principaux"),
        ("src/cards", "Système de cartes"),
        ("src/board", "Système de plateaux"),
        ("src/players", "Logique des joueurs"),
        ("src/interface", "Interface utilisateur"),
        ("data", "Données du jeu"),
        ("data/cards", "Cartes des méchants"),
        ("data/boards", "Plateaux des méchants"),
        ("tests", "Tests automatisés")
    ]
    
    all_good = True
    for dir_path, description in required_dirs:
        if os.path.exists(dir_path) and os.path.isdir(dir_path):
            print(f"✅ {description}: OK")
        else:
            print(f"❌ {description}: MANQUANT")
            all_good = False
    
    return all_good

def check_core_files():
    """Vérifie les fichiers principaux"""
    print("\n🔍 Vérification des fichiers principaux...")
    
    core_files = [
        ("main.py", "Point d'entrée principal"),
        ("src/main.py", "Lanceur alternatif"),
        ("src/core/game.py", "Classe Game"),
        ("src/core/enums.py", "Énumérations"),
        ("src/players/player.py", "Classe Player"),
        ("src/cards/card.py", "Classe Card"),
        ("src/board/location.py", "Classe Location"),
        ("src/interface/console.py", "Interface console"),
        ("requirements.txt", "Dépendances Python"),
        ("README.md", "Documentation"),
    ]
    
    all_good = True
    for filepath, description in core_files:
        if not check_file_exists(filepath, description):
            all_good = False
    
    return all_good

def check_data_files():
    """Vérifie les fichiers de données"""
    print("\n🔍 Vérification des données des méchants...")
    
    villains = ["maleficent", "jafar", "captain_hook"]
    all_good = True
    
    for villain in villains:
        villain_file = f"data/cards/{villain}_villain.json"
        fate_file = f"data/cards/{villain}_fate.json"
        board_file = f"data/boards/{villain}_board.json"
        
        if not check_file_exists(villain_file, f"Cartes {villain}"):
            all_good = False
        if not check_file_exists(fate_file, f"Cartes Destin {villain}"):
            all_good = False
        if not check_file_exists(board_file, f"Plateau {villain}"):
            all_good = False
    
    return all_good

def test_basic_import():
    """Test d'import basique"""
    print("\n🔍 Test d'import des modules...")
    
    try:
        sys.path.insert(0, '.')
        
        # Test d'import du module principal
        from src.core import enums
        print("✅ Import enums: OK")
        
        from src.cards import card
        print("✅ Import card: OK")
        
        from src.core import game
        print("✅ Import game: OK")
        
        print("✅ Tous les imports principaux fonctionnent")
        return True
        
    except ImportError as e:
        print(f"❌ Erreur d'import: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False

def main():
    """Fonction principale de validation"""
    print("🏰 DIAGNOSTIC DISNEY VILLAINOUS 🏰")
    print("=" * 50)
    
    print(f"📂 Dossier de travail: {os.getcwd()}")
    print(f"🐍 Version Python: {sys.version}")
    print()
    
    # Vérifications
    structure_ok = check_directory_structure()
    files_ok = check_core_files()
    data_ok = check_data_files()
    import_ok = test_basic_import()
    
    # Résumé
    print("\n" + "=" * 50)
    print("📊 RÉSUMÉ DU DIAGNOSTIC")
    print("=" * 50)
    
    if structure_ok:
        print("✅ Structure des dossiers: OK")
    else:
        print("❌ Structure des dossiers: PROBLÈMES")
    
    if files_ok:
        print("✅ Fichiers principaux: OK")
    else:
        print("❌ Fichiers principaux: MANQUANTS")
    
    if data_ok:
        print("✅ Données des méchants: OK")
    else:
        print("❌ Données des méchants: MANQUANTES")
    
    if import_ok:
        print("✅ Imports Python: OK")
    else:
        print("❌ Imports Python: ERREURS")
    
    # Conclusion
    if all([structure_ok, files_ok, data_ok, import_ok]):
        print("\n🎉 PROJET COMPLET ET FONCTIONNEL!")
        print("🎮 Vous pouvez lancer le jeu avec: python main.py")
    else:
        print("\n⚠️ PROBLÈMES DÉTECTÉS")
        print("📋 Consultez les erreurs ci-dessus pour les corriger")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    main()