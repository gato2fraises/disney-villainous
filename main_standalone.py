"""
Disney Villainous - Version Exécutable Standalone
Version optimisée pour compilation avec auto-py-to-exe ou PyInstaller
"""

import os
import sys
import json
from pathlib import Path

def get_resource_path(relative_path):
    """Obtient le chemin des ressources, compatible avec PyInstaller"""
    try:
        # PyInstaller crée un dossier temporaire et stocke le chemin dans _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    
    return os.path.join(base_path, relative_path)

def check_data_files():
    """Vérifie que tous les fichiers de données sont présents"""
    required_files = [
        'data/cards/maleficent_villain.json',
        'data/cards/maleficent_fate.json',
        'data/boards/maleficent_board.json',
        'data/cards/jafar_villain.json',
        'data/cards/jafar_fate.json',
        'data/boards/jafar_board.json',
        'data/cards/captain_hook_villain.json',
        'data/cards/captain_hook_fate.json',
        'data/boards/captain_hook_board.json'
    ]
    
    missing_files = []
    for file_path in required_files:
        full_path = get_resource_path(file_path)
        if not os.path.exists(full_path):
            missing_files.append(file_path)
    
    return missing_files

def main():
    """Point d'entrée principal pour l'exécutable"""
    try:
        print("🏰 Disney Villainous - Version Standalone 🏰")
        print("=" * 50)
        
        # Vérification des fichiers
        missing = check_data_files()
        if missing:
            print("❌ Fichiers manquants:")
            for file in missing:
                print(f"   - {file}")
            print("\n📁 Assurez-vous que le dossier 'data' est présent")
            input("Appuyez sur Entrée pour quitter...")
            return
        
        # Ajout du chemin des ressources au sys.path
        resource_path = get_resource_path("")
        if resource_path not in sys.path:
            sys.path.insert(0, resource_path)
        
        # Import des modules du jeu
        print("🔄 Chargement des modules...")
        from src.interface.console import ConsoleInterface
        from src.core.game import Game
        
        print("✅ Modules chargés avec succès")
        print()
        
        # Lancement du jeu
        interface = ConsoleInterface()
        interface.run()
        
    except ImportError as e:
        print(f"❌ Erreur d'import: {e}")
        print("\n📋 Vérifiez que tous les modules sont présents")
        input("Appuyez sur Entrée pour quitter...")
    
    except FileNotFoundError as e:
        print(f"❌ Fichier introuvable: {e}")
        print("\n📁 Vérifiez que les dossiers 'src' et 'data' sont présents")
        input("Appuyez sur Entrée pour quitter...")
    
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        print("\n🔧 Contactez le support ou utilisez jouer.bat")
        input("Appuyez sur Entrée pour quitter...")

if __name__ == "__main__":
    main()