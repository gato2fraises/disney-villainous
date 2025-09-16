# 🏰 Disney Villainous - Version Numérique

![Python](https://img.shields.io/badge/python-v3.7+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![Status](https://img.shields.io/badge/status-Stable-brightgreen.svg)

> **Une implémentation numérique complète du célèbre jeu de plateau Disney Villainous**  
> Incarnez vos méchants Disney préférés et accomplissez leurs objectifs diaboliques !

## ✨ Aperçu

Disney Villainous Digital est une version numérique fidèle du jeu de plateau asymétrique créé par Prospero Hall. Chaque joueur incarne un méchant Disney unique avec son propre plateau, ses cartes et son objectif de victoire.

### 🎭 Méchants Disponibles

| Méchant | Objectif | Difficulté |
|---------|----------|------------|
| 🧙‍♀️ **Maléfique** | Placer une Malédiction sur chaque lieu | ⭐⭐⭐ |
| 🧞‍♂️ **Jafar** | Obtenir la Lampe et localiser Jasmine | ⭐⭐⭐⭐ |
| 🏴‍☠️ **Capitaine Crochet** | Vaincre Peter Pan au Jolly Roger | ⭐⭐⭐⭐⭐ |

## 🚀 Installation et Lancement

### � Version Web (Interface Graphique)
```bash
# Ouvrez simplement le fichier dans un navigateur
web/index.html
# Ou lancez le jeu complet directement
web/complete-game.html
```

### �🎮 Méthode Rapide Console (Recommandée)
```bash
# 1. Clonez le repository
git clone https://github.com/VOTRE_USERNAME/disney-villainous.git
cd disney-villainous

# 2. Lancez le jeu (Windows)
./lancer_jeu.bat
```

### 🔧 Installation Manuelle
```bash
# 1. Clonez le repository
git clone https://github.com/VOTRE_USERNAME/disney-villainous.git
cd disney-villainous

# 2. Installez les dépendances (optionnel)
pip install -r requirements.txt

# 3. Lancez le jeu
python main.py
```

### 💎 Création d'un Exécutable Standalone
```bash
# Créez un fichier .exe qui fonctionne sans Python
./creer_exe.bat
# Résultat : Disney_Villainous.exe (portable)
```

## 🎯 Fonctionnalités

### ✅ Implémenté
- **3 méchants jouables** avec mécaniques uniques
- **Système de cartes complet** (Méchant + Destin)
- **Plateaux personnalisés** avec 4 lieux par méchant
- **Interface console interactive** avec couleurs
- **Interface graphique web** avec drag-and-drop
- **Multijoueur local** (1-6 joueurs)
- **Conditions de victoire asymétriques**
- **Gestion des tours et actions**
- **Distribution standalone** (.exe)

### 🔄 En Développement
- Méchants supplémentaires
- Mode en ligne
- IA pour joueurs automatiques

## 🎮 Comment Jouer

### 🎯 Deux Interfaces Disponibles

#### 🌐 Interface Graphique Web (Recommandée)
- **Cartes visuelles** avec drag-and-drop
- **Plateau interactif** avec 4 lieux par méchant
- **Animations fluides** et thème Disney
- **Navigation intuitive** et aide contextuelle
- **Lancement :** Ouvrez `web/complete-game.html`

#### 🖥️ Interface Console (Classique)
- **Interface texte** avec couleurs
- **Commandes clavier** pour toutes les actions
- **Compatible** avec tous les systèmes
- **Lancement :** Exécutez `lancer_jeu.bat`

### 🎯 Objectif
Chaque méchant a un objectif unique à accomplir avant ses adversaires.

### 🔄 Tour de Jeu
1. **Déplacement** : Choisissez un lieu adjacent
2. **Actions** : Effectuez toutes les actions du lieu
3. **Fin de tour** : Repiochez jusqu'à 4 cartes

### ⚡ Actions Disponibles
- 💰 **Gagner du Pouvoir** : Obtenez de la monnaie
- 🃏 **Jouer une Carte** : Payez le coût et activez
- ⚡ **Activer** : Utilisez vos cartes/objets
- 🗑️ **Défausser** : Retirez des cartes
- ⚔️ **Vaincre** : Éliminez les héros
- 💀 **Destin** : Gênez un adversaire

## 📁 Structure du Projet

```
disney-villainous/
├── 🎮 lancer_jeu.bat           # Point d'entrée principal
├── 🌐 web/                     # Interface graphique web
│   ├── index.html             # Navigation organisée
│   ├── complete-game.html     # Jeu complet (recommandé)
│   ├── tests/                 # Tests et diagnostics
│   └── versions/              # Versions alternatives
├── 🔧 creer_exe.bat            # Créateur d'exécutable
├── 📦 INSTALLER.bat            # Installation guidée
├── 🎯 main.py                  # Lanceur Python
├── 💻 src/                     # Code source
│   ├── core/                   # Moteur de jeu
│   ├── cards/                  # Système de cartes
│   ├── board/                  # Plateaux et lieux
│   ├── players/                # Gestion des joueurs
│   └── interface/              # Interface console
├── 📊 data/                    # Données du jeu
│   ├── cards/                  # Cartes par méchant
│   └── boards/                 # Plateaux par méchant
├── 🧪 tests/                   # Tests automatisés
└── 📖 docs/                    # Documentation
```

## 🛠️ Technologies Utilisées

### 🐍 Version Console
- **Python 3.7+** - Langage principal
- **JSON** - Stockage des données
- **Colorama** - Interface console colorée (optionnel)
- **PyInstaller** - Création d'exécutables

### 🌐 Version Web (Interface Graphique)
- **HTML5** - Structure de la page
- **CSS3** - Styles et animations (Grid, Flexbox)
- **JavaScript ES6+** - Logique de jeu interactive
- **Drag & Drop API** - Interaction avec les cartes
- **LocalStorage** - Sauvegarde des parties

### 🔧 Outils de Développement
- **Git** - Contrôle de version
- **VS Code** - Environnement de développement

## 🎭 Détails des Méchants

### 🧙‍♀️ Maléfique
**Lieux :** Château Interdit, Bruyère Maudite, Pont-Levis, Donjon  
**Objectif :** Placer une Malédiction sur chaque lieu  
**Stratégie :** Utilisez la magie noire pour contrôler votre domaine

### 🧞‍♂️ Jafar
**Lieux :** Palais du Sultan, Rues d'Agrabah, Oasis, Caverne aux Merveilles  
**Objectif :** Avoir la Lampe Magique à la Caverne et localiser Jasmine  
**Stratégie :** Hypnotisez vos ennemis et cherchez la lampe

### 🏴‍☠️ Capitaine Crochet
**Lieux :** Repaire de Crochet, Plage du Crâne, Jolly Roger, Baie de la Sirène  
**Objectif :** Vaincre Peter Pan lorsqu'il est au Jolly Roger  
**Stratégie :** Renforcez votre Force et attirez Peter Pan

## 🚢 Distribution

### 📦 Formats Disponibles
1. **Code source** - Clonez et lancez avec Python
2. **Exécutable Windows** - Créez avec `creer_exe.bat`
3. **Package portable** - Utilisez `INSTALLER.bat`

### 📋 Fichiers de Lancement
- `lancer_jeu.bat` - Lance le jeu console immédiatement
- `web/index.html` - Interface graphique organisée
- `web/complete-game.html` - Jeu complet avec interface graphique
- `diagnostic.bat` - Vérifie l'installation
- `AIDE.txt` - Manuel complet du jeu

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. **Créez** une branche feature (`git checkout -b feature/NouvelleFonctionnalite`)
3. **Commitez** vos changements (`git commit -m 'Ajout NouvelleFonctionnalite'`)
4. **Push** vers la branche (`git push origin feature/NouvelleFonctionnalite`)
5. **Ouvrez** une Pull Request

### 🎯 Idées de Contribution
- Nouveaux méchants (Prince Jean, Reine de Cœur, Ursula...)
- Interface graphique (Tkinter, PyQt, etc.)
- Mode réseau/multijoueur en ligne
- IA pour joueurs automatiques
- Optimisations et corrections de bugs

## 📋 TODO

- [x] Interface graphique (✅ Version web complète disponible)
- [ ] 3 méchants supplémentaires
- [ ] Mode en ligne
- [ ] IA pour solo
- [ ] Version mobile
- [ ] Animations visuelles

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Prospero Hall** et **Ravensburger** pour le jeu original Disney Villainous
- **Disney** pour l'univers des méchants iconiques
- La communauté **Python** pour les outils de développement

## 📞 Support

- 🐛 **Bugs** : Ouvrez une [issue](https://github.com/VOTRE_USERNAME/disney-villainous/issues)
- 💡 **Suggestions** : Utilisez les [discussions](https://github.com/VOTRE_USERNAME/disney-villainous/discussions)
- 📖 **Documentation** : Consultez le fichier `AIDE.txt`

---

**🎉 Amusez-vous bien en incarnant vos méchants Disney préférés ! 🏰**

> *Disney Villainous Digital - Projet éducatif non commercial*