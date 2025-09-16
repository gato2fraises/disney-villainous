"""
Script de correction pour la compatibilité Python 3.7
Corrige les annotations de type modernes
"""

import os
import re

def fix_type_annotations(filepath):
    """Corrige les annotations de type pour Python 3.7"""
    if not os.path.exists(filepath):
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remplace Tuple[...] par Tuple[...]
        content = re.sub(r'\btuple\[', 'Tuple[', content)
        
        # Remplace List[...] par List[...]
        content = re.sub(r'\blist\[', 'List[', content)
        
        # Remplace Dict[...] par Dict[...]
        content = re.sub(r'\bdict\[', 'Dict[', content)
        
        # Ajoute l'import Tuple si nécessaire
        if 'Tuple[' in content and 'from typing import' in content:
            # Trouve la ligne d'import typing
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if line.startswith('from typing import'):
                    # Ajoute Tuple si pas déjà présent
                    if 'Tuple' not in line:
                        # Retire le \n de fin et ajoute Tuple
                        imports = line.replace('from typing import ', '').split(', ')
                        if 'Tuple' not in imports:
                            imports.append('Tuple')
                            lines[i] = 'from typing import ' + ', '.join(sorted(imports))
                    break
            content = '\n'.join(lines)
        
        # Sauvegarde seulement si des changements ont été faits
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Corrigé: {filepath}")
            return True
        else:
            print(f"⏭️ Pas de changement: {filepath}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur avec {filepath}: {e}")
        return False

def fix_all_python_files():
    """Corrige tous les fichiers Python du projet"""
    print("🔧 Correction des annotations de type pour Python 3.7...")
    print("=" * 60)
    
    files_to_fix = []
    
    # Parcourt tous les fichiers .py du projet
    for root, dirs, files in os.walk('.'):
        # Ignore les dossiers cachés et __pycache__
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__']
        
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                files_to_fix.append(filepath)
    
    fixed_count = 0
    for filepath in files_to_fix:
        if fix_type_annotations(filepath):
            fixed_count += 1
    
    print("=" * 60)
    print(f"📊 Résumé: {fixed_count} fichiers corrigés sur {len(files_to_fix)} traités")
    print("🐍 Votre projet est maintenant compatible Python 3.7!")

if __name__ == "__main__":
    fix_all_python_files()