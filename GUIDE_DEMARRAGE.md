# 🏰 Disney Villainous - Guide de Démarrage Rapide

## 🎯 État du Projet

Votre projet Disney Villainous est **COMPLET** et prêt à jouer ! 

✅ **Tout est implémenté :**
- 3 méchants jouables (Maléfique, Jafar, Capitaine Crochet)
- Système de cartes complet
- Mécaniques de plateau
- Interface de jeu en console
- Tests automatisés

## ⚠️ Problème Actuel

**Python n'est pas accessible** depuis la ligne de commande, même si vous l'avez installé.

## 🔧 Installation de Python requise

Pour faire fonctionner Disney Villainous, vous devez configurer Python correctement :

### Option 1: Microsoft Store (Recommandé)
```powershell
# Ouvrez le Microsoft Store et installez "Python 3.11"
# Puis testez:
python --version
```

### Option 2: Python.org
```powershell
# Si vous avez installé depuis python.org, ajoutez au PATH:
# Paramètres > Système > Informations système > Paramètres système avancés > Variables d'environnement
# Ajoutez C:\Python311 et C:\Python311\Scripts au PATH
```

### Option 3: Vérification Manuelle
```powershell
# Trouvez Python sur votre système:
Get-ChildItem -Path C:\ -Name "python.exe" -Recurse -ErrorAction SilentlyContinue

# Utilisez le chemin complet trouvé:
C:\Users\julie\AppData\Local\Programs\Python\Python311\python.exe --version
```

## 🎮 Une Fois Python Configuré

### 🚀 Méthode Rapide (Recommandée)
```batch
# Double-cliquez sur ces fichiers :
jouer.bat           # 🎮 Lance le jeu directement
diagnostic.bat      # 🔍 Vérifie le projet
```

### 🔧 Méthode Manuelle
```bash
# Utilisez le Python détecté :
& "C:\Program Files\Unity\Hub\Editor\6000.2.4f1\Editor\Data\PlaybackEngines\WebGLSupport\BuildTools\Emscripten\python\python.exe" main.py

# Ou installez Python standard et utilisez :
python main.py
```

### 1. Testez le projet
```bash
python diagnostic_projet.py
```

### 2. Lancez le jeu
```bash
python main.py
```

## � Comment Jouer

Le jeu vous proposera :
1. **Choix du méchant** (Maléfique, Jafar, ou Capitaine Crochet)
2. **Menu d'actions** à chaque tour :
   - Déplacer vers un lieu
   - Jouer une carte
   - Activer un lieu
   - Utiliser un objet
   - Voir l'état du jeu
3. **Victoire** quand vous atteignez l'objectif de votre méchant

## 📁 Structure du Projet

```
Projet Villainous/
├── main.py                 # 🎮 Lancer le jeu
├── diagnostic_projet.py    # � Vérifier l'installation
├── src/                    # 💻 Code source
│   ├── core/              # ⚙️  Moteur de jeu
│   ├── cards/             # 🃏 Système de cartes
│   ├── board/             # 🗺️  Plateaux et lieux
│   ├── players/           # 👤 Joueurs
│   └── interface/         # 🖥️  Interface console
├── data/                   # 📊 Données du jeu
│   ├── cards/             # 🃏 Cartes par méchant
│   └── boards/            # 🗺️  Plateaux par méchant
└── tests/                  # 🧪 Tests automatisés
```

## � Méchants Disponibles

### 🧙‍♀️ Maléfique
- **Objectif :** Placer une malédiction sur chaque lieu
- **Spécialité :** Magie noire et malédictions

### 🧞‍♂️ Jafar
- **Objectif :** Obtenir la lampe et localiser Jasmine
- **Spécialité :** Hypnose et contrôle

### 🏴‍☠️ Capitaine Crochet
- **Objectif :** Vaincre Peter Pan au Jolly Roger
- **Spécialité :** Combat et navigation

## � Support

Si vous avez des problèmes :
1. Consultez `DIAGNOSTIC_PYTHON.md` pour l'installation Python
2. Lancez `diagnostic_projet.py` pour vérifier les fichiers
3. Tous les fichiers de jeu sont prêts et testés

**Amusez-vous bien dans l'univers des méchants Disney ! �**