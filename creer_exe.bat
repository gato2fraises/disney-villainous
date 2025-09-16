@echo off
title 🏰 Disney Villainous - Créateur d'Exécutable
color 0B

echo.
echo 🏰 Disney Villainous - Créateur d'Exécutable 🏰
echo ===============================================
echo.
echo Ce script va créer Disney_Villainous.exe
echo qui fonctionnera sans Python installé !
echo.

:: Tester si Python est disponible
python --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Python détecté
    set PYTHON_CMD=python
    goto :install_pyinstaller
)

py --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Python (py) détecté  
    set PYTHON_CMD=py
    goto :install_pyinstaller
)

:: Utiliser le Python Unity si disponible
set "UNITY_PYTHON=C:\Program Files\Unity\Hub\Editor\6000.2.4f1\Editor\Data\PlaybackEngines\WebGLSupport\BuildTools\Emscripten\python\python.exe"
if exist "%UNITY_PYTHON%" (
    echo ✅ Python Unity détecté
    set PYTHON_CMD="%UNITY_PYTHON%"
    goto :install_pyinstaller
)

echo ❌ Python non trouvé !
echo.
echo 📋 Solutions :
echo 1. Installez Python depuis python.org
echo 2. Ou utilisez JOUER.bat pour jouer directement
echo.
pause
exit /b 1

:install_pyinstaller
echo.
echo 🔧 Installation de PyInstaller...
%PYTHON_CMD% -m pip install pyinstaller
if %ERRORLEVEL% neq 0 (
    echo ❌ Erreur installation PyInstaller
    echo 💡 Utilisez JOUER.bat pour jouer
    pause
    exit /b 1
)

echo.
echo 🏗️ Création de l'exécutable...
echo ⏳ Cela peut prendre quelques minutes...
echo.

%PYTHON_CMD% -m PyInstaller ^
    --onefile ^
    --console ^
    --name "Disney_Villainous" ^
    --add-data "data;data" ^
    --add-data "src;src" ^
    --hidden-import "src.core.game" ^
    --hidden-import "src.interface.console" ^
    --hidden-import "src.players.player" ^
    --hidden-import "src.cards.card" ^
    --hidden-import "src.board.location" ^
    --hidden-import "src.core.enums" ^
    --hidden-import "src.cards.deck" ^
    --hidden-import "src.cards.card_manager" ^
    --hidden-import "src.board.board_manager" ^
    --hidden-import "src.core.turn_manager" ^
    --hidden-import "src.core.victory_conditions" ^
    main_standalone.py

if %ERRORLEVEL% eq 0 (
    echo.
    echo ✅ SUCCÈS ! Exécutable créé !
    echo.
    
    if exist "dist\Disney_Villainous.exe" (
        echo 📁 Fichier : dist\Disney_Villainous.exe
        
        :: Copier à la racine
        copy "dist\Disney_Villainous.exe" "Disney_Villainous.exe" >nul
        echo 🎮 Copie créée : Disney_Villainous.exe
        
        echo.
        echo 🎯 COMMENT UTILISER :
        echo 1. Double-cliquez sur Disney_Villainous.exe
        echo 2. Copiez-le sur n'importe quel PC Windows
        echo 3. Aucune installation Python requise !
        echo.
        echo 📦 TAILLE : 
        for %%A in ("Disney_Villainous.exe") do echo    %%~zA octets
        echo.
    )
) else (
    echo ❌ Erreur lors de la création
    echo.
    echo 💡 Solutions alternatives :
    echo 1. Utilisez JOUER.bat pour jouer
    echo 2. Partagez tout le dossier projet
    echo 3. Essayez avec un autre Python
)

echo.
echo 🧹 Nettoyage...
if exist "build" rmdir /s /q "build" 2>nul
if exist "__pycache__" rmdir /s /q "__pycache__" 2>nul
if exist "Disney_Villainous.spec" del "Disney_Villainous.spec" 2>nul

echo.
echo ✅ Terminé !
echo.
if exist "Disney_Villainous.exe" (
    echo 🎮 Votre jeu standalone est prêt !
    echo    Double-cliquez sur Disney_Villainous.exe
) else (
    echo 💡 Utilisez JOUER.bat pour jouer en attendant
)
echo.
pause