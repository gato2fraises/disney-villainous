@echo off
echo 🏰 Disney Villainous - Script d'installation et de lancement 🏰
echo ================================================================

:: Teste différentes commandes Python
set PYTHON_CMD=
python --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python
    goto :python_found
)

py --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py
    goto :python_found
)

python3 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python3
    goto :python_found
)

:: Si aucune commande Python ne fonctionne
echo ❌ Python n'est pas installé ou accessible
echo.
echo 📥 Installation de Python requise:
echo    1. Allez sur https://www.python.org/downloads/
echo    2. Téléchargez Python 3.8+ pour Windows
echo    3. IMPORTANT: Cochez "Add Python to PATH" pendant l'installation
echo    4. Ou installez depuis le Microsoft Store: "Python 3.11"
echo.
echo 💡 Après installation, redémarrez ce script
echo.
pause
exit /b 1

:python_found

echo ✅ Python trouvé: %PYTHON_CMD%
%PYTHON_CMD% --version

:: Test rapide de Python
echo.
echo 🧪 Test rapide de Python...
%PYTHON_CMD% test_python.py

if errorlevel 1 (
    echo ❌ Erreur lors du test Python
    pause
    exit /b 1
)

:: Installation des dépendances (optionnel)
echo.
echo 📦 Installation des dépendances...
%PYTHON_CMD% -m pip install -r requirements.txt

:: Lance les tests
echo.
echo 🧪 Lancement des tests du jeu...
%PYTHON_CMD% tests\test_game.py

if errorlevel 1 (
    echo ❌ Les tests ont échoué
    echo 💡 Le jeu peut quand même fonctionner, voulez-vous continuer?
    pause
)

:: Lance le jeu
echo.
echo 🎮 Lancement de Disney Villainous...
echo.
%PYTHON_CMD% main.py

pause