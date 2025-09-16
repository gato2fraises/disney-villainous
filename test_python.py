"""
Test simple pour vérifier la syntaxe Python
"""

def test_basic_syntax():
    """Test de base de la syntaxe Python"""
    print("🧪 Test de syntaxe Python...")
    
    # Test d'import des modules standards
    try:
        import json
        import os
        import sys
        print("✅ Modules standards OK")
    except ImportError as e:
        print(f"❌ Erreur d'import: {e}")
        return False
    
    # Test de classes simples
    try:
        from enum import Enum
        
        class TestEnum(Enum):
            VALUE = "test"
        
        print("✅ Classes et énumérations OK")
    except Exception as e:
        print(f"❌ Erreur de classe: {e}")
        return False
    
    # Test de dataclasses (si disponible)
    try:
        from dataclasses import dataclass
        
        @dataclass
        class TestClass:
            name: str = "test"
        
        obj = TestClass()
        print("✅ Dataclasses OK")
    except ImportError:
        print("⚠️ Dataclasses non disponibles (Python < 3.7)")
    except Exception as e:
        print(f"❌ Erreur dataclass: {e}")
        return False
    
    print("🎉 Tous les tests de syntaxe sont passés!")
    return True

if __name__ == "__main__":
    success = test_basic_syntax()
    if success:
        print("\n✅ Python fonctionne correctement!")
        print("🎮 Vous pouvez maintenant lancer Disney Villainous!")
    else:
        print("\n❌ Problèmes détectés avec Python")
    
    input("\nAppuyez sur Entrée pour continuer...")