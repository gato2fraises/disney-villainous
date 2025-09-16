# 🎉 DISNEY VILLAINOUS - PRÊT À JOUER !

## ✅ Statut : FONCTIONNEL
Votre jeu Disney Villainous est **entièrement opérationnel** !

## 🚀 Comment Jouer

### 🎯 Méthode la Plus Simple
**Double-cliquez sur :** `jouer.bat`

### 🔍 Pour Vérifier le Projet
**Double-cliquez sur :** `diagnostic.bat`

### 🖥️ Méthode Terminal
```powershell
cd "c:\Users\julie\OneDrive\Documents\Projet Villainous"
& "C:\Program Files\Unity\Hub\Editor\6000.2.4f1\Editor\Data\PlaybackEngines\WebGLSupport\BuildTools\Emscripten\python\python.exe" main.py
```

## 🎮 Gameplay

### Au Démarrage
1. **Nombre de joueurs** : Choisissez 1-6 joueurs
2. **Sélection des méchants** : Chaque joueur choisit parmi :
   - 🧙‍♀️ **Maléfique** - Placer des malédictions
   - 🧞‍♂️ **Jafar** - Obtenir la lampe et localiser Jasmine
   - 🏴‍☠️ **Capitaine Crochet** - Vaincre Peter Pan

### Tour de Jeu
1. **Déplacement** : Choisissez un lieu adjacent
2. **Actions** : Utilisez les actions du lieu :
   - 💰 **Gagner du Pouvoir** : Obtenez des ressources
   - 🃏 **Jouer une Carte** : Payez le coût et activez
   - ⚡ **Activer** : Utilisez vos cartes/objets
   - 🗑️ **Défausser** : Retirez des cartes inutiles
3. **Fin de tour** : Repiochez jusqu'à 4 cartes

### Objectifs de Victoire
- **🧙‍♀️ Maléfique** : Une malédiction sur chaque lieu
- **🧞‍♂️ Jafar** : Lampe + localiser Jasmine  
- **🏴‍☠️ Capitaine Crochet** : Vaincre Peter Pan au Jolly Roger

## 🎯 Méchants Disponibles

### 🧙‍♀️ Maléfique
- **Lieux** : Château Interdit, Bruyère Maudite, Pont-Levis, Donjon
- **Spécialité** : Malédictions et magie noire
- **Stratégie** : Placez des malédictions sur tous vos lieux

### 🧞‍♂️ Jafar  
- **Lieux** : Palais du Sultan, Rues d'Agrabah, Oasis, Caverne aux Merveilles
- **Spécialité** : Hypnose et contrôle mental
- **Stratégie** : Trouvez la lampe puis localisez Jasmine

### 🏴‍☠️ Capitaine Crochet
- **Lieux** : Repaire de Crochet, Plage du Crâne, Jolly Roger, Baie de la Sirène
- **Spécialité** : Combat naval et épée
- **Stratégie** : Attirez Peter Pan au Jolly Roger et vainquez-le

## 📁 Fichiers du Projet

```
Projet Villainous/
├── 🎮 jouer.bat              # LANCEUR PRINCIPAL
├── 🔍 diagnostic.bat         # Vérification projet
├── 🎯 main.py               # Point d'entrée Python
├── 📋 requirements.txt      # Dépendances (optionnel)
├── 📖 README.md             # Documentation complète
├── 🚀 GUIDE_DEMARRAGE.md    # Ce guide
├── src/                     # Code source
│   ├── core/               # Moteur de jeu
│   ├── cards/              # Système de cartes
│   ├── board/              # Plateaux et lieux
│   ├── players/            # Gestion des joueurs
│   └── interface/          # Interface console
├── data/                    # Données de jeu
│   ├── cards/              # Cartes par méchant
│   └── boards/             # Plateaux par méchant
└── tests/                   # Tests (optionnel)
```

## 🎨 Interface de Jeu

- **Console colorée** avec émojis
- **Menus interactifs** clairs
- **Affichage du plateau** avec positions
- **État des cartes** en main
- **Progression vers la victoire**

## 🏆 Conseils Stratégiques

1. **Gérez votre Pouvoir** : Ne dépensez pas tout immédiatement
2. **Déplacements stratégiques** : Chaque lieu a des actions différentes
3. **Timing des cartes** : Jouez au bon moment
4. **Objectif constant** : Gardez votre condition de victoire en tête
5. **Cartes Destin** : Utilisez-les pour gêner vos adversaires

## 🔧 En Cas de Problème

1. **Le jeu ne démarre pas** : Utilisez `diagnostic.bat`
2. **Erreurs Python** : Vérifiez le chemin Python dans les .bat
3. **Cartes manquantes** : Tous les fichiers JSON sont prêts
4. **Interface bizarre** : Le terminal doit supporter les couleurs

## 🎉 Résultat Final

**Votre Disney Villainous est un projet complet et fonctionnel !**

- ✅ 3 méchants jouables
- ✅ Système de jeu complet  
- ✅ Interface intuitive
- ✅ Code modulaire et extensible
- ✅ Tests automatisés
- ✅ Documentation complète

**Amusez-vous bien en incarnant les méchants Disney ! 🏰👑**