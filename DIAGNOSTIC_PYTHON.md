# Guide de diagnostic Python pour Disney Villainous

## 🔍 Diagnostic Python

Votre message indique que Python est installé, mais il n'est pas détecté par nos scripts.
Voici comment diagnostiquer et résoudre le problème :

## 🧪 Tests à effectuer

### 1. Test manuel dans PowerShell
Ouvrez PowerShell et testez ces commandes une par une :

```powershell
python --version
py --version  
python3 --version
python.exe --version
```

**Une de ces commandes doit fonctionner.**

### 2. Localisation de Python
```powershell
Get-Command python -ErrorAction SilentlyContinue
where.exe python
```

### 3. Test avec chemin complet
Si Python est trouvé, notez le chemin et testez :
```powershell
# Remplacez par le chemin trouvé
"C:\Program Files\Python311\python.exe" --version
```

## 🔧 Solutions possibles

### Solution 1: Installation Microsoft Store
1. Ouvrez le **Microsoft Store**
2. Recherchez **"Python 3.11"** ou **"Python 3.10"**
3. Installez la version officielle
4. Redémarrez PowerShell

### Solution 2: Installation python.org
1. Allez sur https://www.python.org/downloads/
2. Téléchargez **Python 3.8+** pour Windows
3. **CRUCIAL**: Cochez "Add Python to PATH" pendant l'installation
4. Redémarrez votre ordinateur

### Solution 3: Réparation du PATH
Si Python est installé mais pas dans le PATH :

1. **Ouvrez les Variables d'environnement** :
   - Win + R → `sysdm.cpl` → Avancé → Variables d'environnement
   
2. **Modifiez la variable PATH** :
   - Sélectionnez PATH → Modifier
   - Ajoutez le dossier Python (ex: `C:\Program Files\Python311\`)
   - Ajoutez aussi `C:\Program Files\Python311\Scripts\`

3. **Redémarrez PowerShell**

## 🏃‍♂️ Test rapide manuel

Une fois Python fonctionnel, testez notre projet :

```powershell
# Naviguez vers le projet
cd "c:\Users\julie\OneDrive\Documents\Projet Villainous"

# Test simple
python test_python.py

# Si ça marche, testez le jeu
python main.py
```

## 🆘 Si rien ne fonctionne

### Option A: Version portable
1. Téléchargez Python Portable depuis python.org
2. Extrayez dans un dossier (ex: `C:\Python311\`)
3. Testez avec le chemin complet :
   ```powershell
   C:\Python311\python.exe main.py
   ```

### Option B: Anaconda
1. Installez Anaconda depuis anaconda.com
2. Utilisez "Anaconda Prompt" au lieu de PowerShell
3. Naviguez vers le projet et lancez :
   ```bash
   python main.py
   ```

## 📋 Diagnostic complet

Créez un fichier `diagnostic.txt` avec ces informations :

```powershell
# Copiez-collez les résultats de ces commandes :
python --version 2>&1
py --version 2>&1
where.exe python 2>&1
$env:PATH
Get-Command python -ErrorAction SilentlyContinue
```

## 🎯 Test final

Une fois Python fonctionnel :

1. **Test de base** : `python --version`
2. **Test du projet** : `python test_python.py`
3. **Test complet** : `python tests\test_game.py`
4. **Lancement** : `python main.py`

---

**💡 Astuce** : Après toute modification du PATH, redémarrez PowerShell ou votre ordinateur.

**🎮 Objectif** : Voir s'afficher "Python X.X.X" quand vous tapez `python --version`