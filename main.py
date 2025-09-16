"""
Lanceur principal pour Disney Villainous
Point d'entrée simplifié à la racine du projet
"""

import sys
import os

# Ajoute le répertoire actuel au path pour les imports
sys.path.insert(0, os.path.dirname(__file__))

def main():
    """Point d'entrée principal"""
    print("🏰 Bienvenue dans Disney Villainous! 🏰")
    print("=" * 50)
    
    try:
        # Importe et lance l'interface console
        from src.interface.console import ConsoleInterface
        
        interface = ConsoleInterface()
        interface.run()
        
    except ImportError as e:
        print(f"❌ Erreur d'import: {e}")
        print("\nAssurez-vous que tous les modules sont correctement installés.")
        print("Essayez: pip install -r requirements.txt")
        
    except KeyboardInterrupt:
        print("\n\n👋 Au revoir!")
        
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()