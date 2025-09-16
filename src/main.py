"""
Point d'entrée principal pour Disney Villainous
"""

import sys
import os

# Ajoute le répertoire src au path pour les imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.interface.console import main

if __name__ == "__main__":
    main()