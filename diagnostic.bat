@echo off
echo 🔍 Diagnostic Disney Villainous 🔍
echo.

set PYTHON_PATH="C:\Program Files\Unity\Hub\Editor\6000.2.4f1\Editor\Data\PlaybackEngines\WebGLSupport\BuildTools\Emscripten\python\python.exe"

cd /d "c:\Users\julie\OneDrive\Documents\Projet Villainous"

echo 📍 Dossier: %CD%
echo 🐍 Python: %PYTHON_PATH%
echo.

echo 🧪 Lancement du diagnostic...
%PYTHON_PATH% diagnostic_projet.py

echo.
pause