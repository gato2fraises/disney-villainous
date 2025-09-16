# 🤝 Guide de Contribution - Disney Villainous

Merci de votre intérêt pour contribuer au projet Disney Villainous Digital ! 🏰

## 🎯 Comment Contribuer

### 🐛 Signaler des Bugs
1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/VOTRE_USERNAME/disney-villainous/issues)
2. Créez une nouvelle issue avec :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs obtenu
   - Version Python et OS

### 💡 Proposer des Fonctionnalités
1. Ouvrez une [Discussion](https://github.com/VOTRE_USERNAME/disney-villainous/discussions) pour en parler
2. Créez une issue avec le label `enhancement`
3. Décrivez clairement la fonctionnalité et son utilité

### 🔧 Proposer du Code

#### Prérequis
- Python 3.7+
- Git
- Connaissance basique du projet

#### Processus
1. **Fork** le repository
2. **Clonez** votre fork localement
3. **Créez** une branche pour votre feature
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
4. **Développez** votre fonctionnalité
5. **Testez** votre code
6. **Commitez** avec des messages clairs
7. **Push** vers votre fork
8. **Créez** une Pull Request

## 🎭 Idées de Contribution

### 🚀 Priorités Hautes
- [ ] **Interface Graphique** (Tkinter, PyQt, ou web)
- [ ] **Nouveaux Méchants** (Prince Jean, Reine de Cœur, Ursula)
- [ ] **Mode IA** pour jouer en solo
- [ ] **Optimisations** et corrections de bugs

### 🌟 Améliorations Bienvenues
- [ ] **Animations** pour les actions
- [ ] **Sons et musiques** thématiques
- [ ] **Statistiques** de jeu
- [ ] **Replay** des parties
- [ ] **Mode réseau** multijoueur
- [ ] **Version mobile** (Kivy)

### 📚 Documentation
- [ ] **Tutoriels vidéo**
- [ ] **Guide stratégique** par méchant
- [ ] **API documentation**
- [ ] **Traductions** (anglais, espagnol, etc.)

## 🏗️ Structure du Code

### 📁 Organisation
```
src/
├── core/           # Moteur de jeu principal
├── cards/          # Système de cartes
├── board/          # Plateaux et lieux
├── players/        # Logique des joueurs
└── interface/      # Interfaces utilisateur
```

### 🎯 Conventions de Code
- **PEP 8** pour le style Python
- **Docstrings** pour toutes les fonctions publiques
- **Type hints** quand c'est utile
- **Noms explicites** en français ou anglais cohérent

### 🧪 Tests
- Ajoutez des tests pour vos nouvelles fonctionnalités
- Utilisez le dossier `tests/`
- Lancez `python -m pytest` pour vérifier

## 🎮 Ajouter un Nouveau Méchant

### 📋 Checklist
1. **Données JSON** dans `data/cards/` et `data/boards/`
2. **Enum** dans `src/core/enums.py`
3. **Condition de victoire** dans `src/core/victory_conditions.py`
4. **Tests** pour valider le méchant
5. **Documentation** des stratégies

### 📝 Template de Méchant
```python
# Dans src/core/enums.py
class VillainType(Enum):
    # ... existants
    NOUVEAU_MECHANT = "nouveau_mechant"

# Dans src/core/victory_conditions.py
def check_nouveau_mechant_victory(player: Player) -> bool:
    """Vérifie la condition de victoire du nouveau méchant"""
    # Implémentez la logique ici
    return False
```

## 🎨 Interface Graphique

Si vous voulez créer une interface graphique :

### 🛠️ Technologies Suggérées
- **Tkinter** (inclus avec Python)
- **PyQt5/6** (plus avancé)
- **Kivy** (multiplateforme, mobile)
- **Web** (Flask/Django + HTML/CSS/JS)

### 📐 Principes de Design
- **Thème Disney** avec couleurs appropriées
- **Interface intuitive** pour tous âges
- **Responsive** pour différentes tailles d'écran
- **Accessibilité** (contrastes, tailles de texte)

## 🐛 Debugging

### 🔍 Outils Utiles
```bash
# Lancer en mode debug
python -X dev main.py

# Profiling
python -m cProfile main.py

# Tests avec couverture
python -m pytest --cov=src tests/
```

### 📊 Logs
- Utilisez le module `logging` Python
- Niveaux : DEBUG, INFO, WARNING, ERROR
- Fichiers de log dans un dossier `logs/` (ignoré par git)

## 📋 Standards de Qualité

### ✅ Avant de Soumettre
- [ ] Code testé et fonctionnel
- [ ] Documentation à jour
- [ ] Pas de fichiers temporaires
- [ ] Messages de commit clairs
- [ ] Code conforme PEP 8

### 🎯 Review Process
1. **Tests automatiques** (si configurés)
2. **Review manuelle** du code
3. **Test de fonctionnement** sur Windows
4. **Validation** de la documentation

## 💬 Communication

### 📞 Où Poser des Questions
- **Issues** pour les bugs et fonctionnalités
- **Discussions** pour les questions générales
- **Pull Requests** pour le code spécifique

### 🎭 Ton et Attitude
- Soyez **respectueux** et **constructifs**
- **Amusez-vous** ! C'est Disney après tout 🎉
- **Partagez** vos idées créatives
- **Aidez** les autres contributeurs

## 🏆 Reconnaissance

Tous les contributeurs seront listés dans :
- Le fichier `CONTRIBUTORS.md`
- Les notes de version
- Le README principal

Merci de faire de Disney Villainous Digital un projet encore plus magique ! ✨

---

*"Les méchants ont plus d'amusement"* - Maléfique 🧙‍♀️