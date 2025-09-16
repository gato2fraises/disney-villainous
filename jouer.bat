@echo off
echo 🏰 Lancement de Disney Villainous 🏰
echo.

set PYTHON_PATH="C:\Program Files\Unity\Hub\Editor\6000.2.4f1\Editor\Data\PlaybackEngines\WebGLSupport\BuildTools\Emscripten\python\python.exe"

cd /d "c:\Users\julie\OneDrive\Documents\Projet Villainous"

echo 📍 Dossier: %CD%
echo 🐍 Python: %PYTHON_PATH%
echo.

echo 🎮 Démarrage du jeu...
%PYTHON_PATH% main.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Erreur lors du lancement
    echo 🔧 Essayez: diagnostic_projet.py pour plus d'informations
    pause
) else (
    echo.
    echo ✅ Jeu terminé avec succès
    pause
)