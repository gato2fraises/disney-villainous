# � Disney Villainous - Jeu de Plateau Digital

Une implémentation complète du jeu de société Disney Villainous en version web, avec les règles officielles et des mécaniques uniques pour chaque méchant.

![Disney Villainous](https://img.shields.io/badge/Disney-Villainous-purple?style=for-the-badge&logo=disney)
![Version](https://img.shields.io/badge/Version-2.0-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## 🌟 Aperçu

Incarnez des méchants Disney emblématiques et tentez d'accomplir vos objectifs maléfiques ! Ce jeu reproduit fidèlement l'expérience du jeu de plateau officiel avec des animations immersives et des mécaniques spécifiques à chaque personnage.

### 🎬 **Démo Live**
👉 **[Jouer maintenant](https://gato2fraises.github.io/disney-villainous/web/villainous-ultimate.html)**

## ✨ Fonctionnalités

### 🎭 **Méchants Jouables**
- **🧙‍♀️ Maleficent** - Maîtresse du Mal qui place des malédictions
- **🏴‍☠️ Captain Hook** - Pirate qui chasse Peter Pan 
- **🧞‍♂️ Jafar** - Vizir qui hypnotise et manipule

### ⚔️ **Gameplay Authentique**
- ✅ **Règles officielles** complètes du jeu de plateau
- 🔄 **Phases de tour** : Déplacement → Actions → Pioche → Défausse
- 🃏 **Système de cartes** avec decks Méchant et Fatalité
- 🎯 **Conditions de victoire** uniques par personnage
- ⚡ **Mécaniques spéciales** propres à chaque méchant

### 🎨 **Interface Moderne**
- 📱 **Responsive Design** - Jouable sur mobile et desktop
- ✨ **Animations fluides** et effets visuels immersifs
- 🎵 **Thèmes visuels** personnalisés par méchant
- 🔔 **Notifications** en temps réel pour toutes les actions

## 🚀 Installation & Lancement

### Option 1: Jouer en ligne (Recommandé)
Accédez directement au jeu via GitHub Pages : [**Jouer maintenant**](https://gato2fraises.github.io/disney-villainous/web/villainous-ultimate.html)

### Option 2: Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/gato2fraises/disney-villainous.git
cd disney-villainous

# Lancer le serveur local
cd web
npx http-server -p 8080

# Ouvrir dans le navigateur
# http://localhost:8080/villainous-ultimate.html
```

### Option 3: Serveur Python
```bash
cd web
python -m http.server 8080
```

## � Comment Jouer

### 🔰 **Démarrage**
1. Ouvrez le jeu dans votre navigateur
2. Cliquez sur **"Mode Règles Officielles"**
3. **Sélectionnez votre méchant** favori
4. Lisez attentivement votre **condition de victoire**

### 🎯 **Tour de Jeu**
Chaque tour se déroule en **4 phases** :

#### 1️⃣ **Phase de Déplacement**
- Déplacez votre figurine vers un **lieu adjacent**
- Chaque lieu offre des actions différentes

#### 2️⃣ **Phase d'Actions**
- Effectuez **toutes les actions** du lieu choisi
- Gagnez du pouvoir, jouez des cartes, utilisez des capacités spéciales

#### 3️⃣ **Phase de Pioche**
- Piochez des cartes jusqu'à avoir **4 cartes** en main
- Gérez votre stratégie avec vos nouvelles options

#### 4️⃣ **Phase de Défausse**
- Si vous avez plus de **7 cartes**, défaussez l'excédent
- Gardez les cartes les plus utiles à votre stratégie

### � **Méchants & Stratégies**

#### 🧙‍♀️ **Maleficent**
- **Objectif** : Placer une malédiction sur chaque lieu
- **Stratégie** : Utilisez vos sorts pour maudire Aurora et contrôler le plateau
- **Pouvoir spécial** : Malédictions persistantes

#### 🏴‍☠️ **Captain Hook**
- **Objectif** : Vaincre Peter Pan au Jolly Roger
- **Stratégie** : Recrutez des pirates et organisez des abordages
- **Pouvoir spécial** : Abordages tactiques

#### 🧞‍♂️ **Jafar**
- **Objectif** : Contrôler le Génie et hypnotiser le Sultan
- **Stratégie** : Manipulez les gardes et cherchez la lampe magique
- **Pouvoir spécial** : Hypnose temporaire

## 🛠️ Technologies Utilisées

- **HTML5** - Structure moderne et sémantique
- **CSS3** - Animations et design responsive
- **JavaScript ES6+** - Logique de jeu et interactions
- **GitHub Pages** - Déploiement automatique

## � Structure du Projet

```
disney-villainous/
├── web/                          # Application web principale
│   ├── villainous-ultimate.html  # Jeu complet avec règles officielles
│   ├── css/                      # Styles et animations
│   ├── js/                       # Logique JavaScript
│   └── versions/                 # Autres versions du jeu
├── src/                          # Code source Python (optionnel)
├── data/                         # Données des méchants et cartes
└── tests/                        # Tests unitaires
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. Créez une **branche feature** (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commitez** vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Pushez** la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une **Pull Request**

### 🐛 Signaler des Bugs
Utilisez les [**Issues GitHub**](https://github.com/gato2fraises/disney-villainous/issues) pour signaler des problèmes.

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour les détails.

---

<div align="center">

**⭐ N'oubliez pas de mettre une étoile si ce projet vous plaît ! ⭐**

[🎮 Jouer Maintenant](https://gato2fraises.github.io/disney-villainous/web/villainous-ultimate.html) | 
[� Signaler un Bug](https://github.com/gato2fraises/disney-villainous/issues/new)

</div>