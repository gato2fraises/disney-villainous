@echo off
title 🏰 Disney Villainous - Installation Portable
color 0A

echo.
echo    🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰
echo    🏰                                          🏰
echo    🏰       DISNEY VILLAINOUS PORTABLE        🏰  
echo    🏰         Version Sans Installation       🏰
echo    🏰                                          🏰
echo    🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰🏰
echo.
echo.
echo    📋 Ce package contient TOUT ce qu'il faut pour jouer :
echo.
echo    ✅ Jeu Disney Villainous complet
echo    ✅ 3 méchants jouables (Maléfique, Jafar, Capitaine Crochet)
echo    ✅ Interface graphique en console
echo    ✅ Multijoueur (1-6 joueurs)
echo    ✅ Aucune installation requise
echo.
echo    🎮 COMMENT JOUER :
echo.
echo    1️⃣  Double-cliquez sur "JOUER.bat"
echo    2️⃣  Choisissez votre méchant
echo    3️⃣  Suivez les instructions à l'écran
echo.
echo    📁 CONTENU DU PACKAGE :
echo.
echo    🎮 JOUER.bat           - Lance le jeu directement
echo    🔍 DIAGNOSTIC.bat      - Vérifie que tout fonctionne  
echo    📖 AIDE.txt           - Manuel complet du jeu
echo    🎯 Disney_Villainous.exe - Version exécutable (si disponible)
echo    📂 data/              - Cartes et plateaux des méchants
echo    💻 src/               - Code source du jeu
echo.
echo    🚀 AUTRES OPTIONS :
echo.
echo    ⚡ Mode Rapide     : Double-clic sur JOUER.bat
echo    🔧 Mode Expert     : Lancez compiler.ps1 pour créer .exe
echo    📚 Documentation  : Lisez AIDE.txt pour les règles
echo    🐛 Problèmes      : Lancez DIAGNOSTIC.bat
echo.
echo    🎭 MÉCHANTS DISPONIBLES :
echo.
echo    🧙‍♀️ Maléfique        : Placez des malédictions partout
echo    🧞‍♂️ Jafar            : Trouvez la lampe et Jasmine
echo    🏴‍☠️ Capitaine Crochet : Vainquez Peter Pan en duel
echo.
echo.
echo    🏆 Votre mission : Accomplir l'objectif de votre méchant
echo       avant vos adversaires !
echo.
echo.
pause

echo.
echo 🔍 Vérification du système...
echo.

:: Vérifier que les fichiers principaux existent
set "errors=0"

if not exist "jouer.bat" (
    echo ❌ JOUER.bat manquant
    set /a errors+=1
)

if not exist "diagnostic.bat" (
    echo ❌ DIAGNOSTIC.bat manquant  
    set /a errors+=1
)

if not exist "main.py" (
    echo ❌ main.py manquant
    set /a errors+=1
)

if not exist "src\" (
    echo ❌ Dossier src/ manquant
    set /a errors+=1
)

if not exist "data\" (
    echo ❌ Dossier data/ manquant
    set /a errors+=1
)

if %errors% gtr 0 (
    echo.
    echo ❌ %errors% fichier(s) manquant(s) détecté(s)
    echo 📥 Retéléchargez le package complet
    echo.
    pause
    exit /b 1
)

echo ✅ Tous les fichiers principaux sont présents
echo.

:: Créer un raccourci sur le bureau (optionnel)
echo 🖥️ Voulez-vous créer un raccourci sur le bureau ? (o/n)
set /p desktop="Votre choix: "

if /i "%desktop%"=="o" (
    echo 🔗 Création du raccourci...
    
    :: Créer un fichier batch sur le bureau qui lance le jeu
    set "desktop_path=%USERPROFILE%\Desktop"
    set "shortcut_path=%desktop_path%\Disney Villainous.bat"
    
    echo @echo off > "%shortcut_path%"
    echo title Disney Villainous >> "%shortcut_path%"
    echo cd /d "%CD%" >> "%shortcut_path%"
    echo call jouer.bat >> "%shortcut_path%"
    
    if exist "%shortcut_path%" (
        echo ✅ Raccourci créé sur le bureau
    ) else (
        echo ⚠️ Impossible de créer le raccourci
    )
)

echo.
echo ✅ Installation portable terminée !
echo.
echo 🎮 Pour jouer maintenant : 
echo    👆 Double-cliquez sur JOUER.bat
echo.
echo 🎉 Amusez-vous bien avec Disney Villainous !
echo.
pause