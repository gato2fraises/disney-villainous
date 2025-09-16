@echo off
title 🏰 Disney Villainous - Créateur d'Exécutable
echo.
echo 🏰 Disney Villainous - Créateur d'Exécutable 🏰
echo ================================================
echo.
echo Ce script va créer un fichier .exe standalone de Disney Villainous
echo qui pourra être exécuté sans avoir Python installé.
echo.
echo 📋 Étapes :
echo 1. Télécharger Python portable (si nécessaire)
echo 2. Installer PyInstaller
echo 3. Créer l'exécutable Disney_Villainous.exe
echo 4. Packager avec les données du jeu
echo.
pause

:: Créer le dossier pour Python portable
if not exist "python_portable" mkdir python_portable
cd python_portable

:: Vérifier si Python portable existe déjà
if exist "python.exe" (
    echo ✅ Python portable déjà présent
    goto :install_pyinstaller
)

echo 📥 Téléchargement de Python portable...
echo.
echo ⚠️ ATTENTION : Ce script nécessite une connexion Internet
echo pour télécharger Python portable (~25 MB)
echo.
echo Alternatives manuelles :
echo 1. Téléchargez Python portable depuis python.org
echo 2. Extrayez-le dans le dossier python_portable
echo 3. Relancez ce script
echo.
echo Voulez-vous continuer le téléchargement automatique ? (o/n)
set /p choice="Votre choix: "
if /i "%choice%" neq "o" goto :manual_install

:: Tentative de téléchargement avec PowerShell
echo 🌐 Téléchargement en cours...
powershell -Command "& {try { Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.0/python-3.11.0-embed-amd64.zip' -OutFile 'python_portable.zip'; echo 'Téléchargement terminé' } catch { echo 'Erreur de téléchargement. Essayez manuellement.' }}"

if exist "python_portable.zip" (
    echo 📦 Extraction de Python portable...
    powershell -Command "Expand-Archive -Path 'python_portable.zip' -DestinationPath '.' -Force"
    del python_portable.zip
    goto :install_pyinstaller
) else (
    goto :manual_install
)

:manual_install
echo.
echo ❌ Téléchargement automatique échoué
echo.
echo 📋 Installation manuelle :
echo 1. Allez sur https://www.python.org/downloads/
echo 2. Téléchargez "Windows embeddable package (64-bit)"
echo 3. Extrayez le contenu dans le dossier python_portable
echo 4. Relancez ce script
echo.
pause
exit /b 1

:install_pyinstaller
cd ..
echo.
echo 🔧 Installation de PyInstaller...

:: Utilise le Python portable pour installer PyInstaller
python_portable\python.exe -m ensurepip --default-pip
python_portable\python.exe -m pip install pyinstaller

if %ERRORLEVEL% neq 0 (
    echo ❌ Erreur lors de l'installation de PyInstaller
    echo.
    echo 💡 Solution alternative : Utilisez jouer.bat
    pause
    exit /b 1
)

echo.
echo 🏗️ Création de l'exécutable Disney Villainous...
echo.

:: Créer l'exécutable avec PyInstaller
python_portable\python.exe -m PyInstaller ^
    --onefile ^
    --noconsole ^
    --name "Disney_Villainous" ^
    --icon=data\icon.ico ^
    --add-data "data;data" ^
    --add-data "src;src" ^
    main.py

if %ERRORLEVEL% eq 0 (
    echo.
    echo ✅ Exécutable créé avec succès !
    echo.
    echo 📁 Fichier créé : dist\Disney_Villainous.exe
    echo.
    echo 🎮 Vous pouvez maintenant :
    echo 1. Copier Disney_Villainous.exe n'importe où
    echo 2. Double-cliquer dessus pour jouer
    echo 3. Le partager sans Python requis
    echo.
    
    :: Copier l'exe à la racine pour faciliter l'accès
    copy "dist\Disney_Villainous.exe" "Disney_Villainous.exe"
    
    echo 🎯 Raccourci créé : Disney_Villainous.exe
    echo.
) else (
    echo ❌ Erreur lors de la création de l'exécutable
    echo.
    echo 💡 Utilisez jouer.bat en attendant
)

echo.
echo 🧹 Nettoyage des fichiers temporaires...
if exist "build" rmdir /s /q "build"
if exist "__pycache__" rmdir /s /q "__pycache__"

echo.
echo ✅ Processus terminé !
pause