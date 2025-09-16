@echo off
title 🚀 Disney Villainous - Upload vers GitHub
color 0A

echo.
echo    🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
echo    🚀                                          🚀
echo    🚀       DISNEY VILLAINOUS → GITHUB        🚀
echo    🚀         Publication Automatique         🚀
echo    🚀                                          🚀
echo    🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
echo.
echo.

echo 📋 Ce script va vous aider à publier Disney Villainous sur GitHub
echo.
echo ✅ Déjà fait :
echo    - Repository Git local initialisé
echo    - Premier commit effectué (53 fichiers)
echo    - Documentation GitHub-ready
echo.

echo 📝 Prérequis :
echo    1. Compte GitHub actif
echo    2. Repository créé sur github.com
echo    3. URL du repository disponible
echo.

echo 🔗 Étapes manuelles requises :
echo    1. Allez sur github.com
echo    2. Cliquez "+" puis "New repository"
echo    3. Nom: disney-villainous
echo    4. Description: 🏰 Version numérique Disney Villainous
echo    5. Public, sans fichiers initiaux
echo    6. Copiez l'URL du repository créé
echo.

pause

echo.
echo 🌐 Entrez l'URL de votre repository GitHub :
echo    Exemple: https://github.com/votre-username/disney-villainous.git
echo.
set /p repo_url="URL du repository: "

if "%repo_url%"=="" (
    echo ❌ URL requise !
    pause
    exit /b 1
)

echo.
echo 🔧 Configuration de l'origine GitHub...
git remote add origin "%repo_url%"

if %ERRORLEVEL% neq 0 (
    echo ⚠️ Origine déjà configurée, mise à jour...
    git remote set-url origin "%repo_url%"
)

echo.
echo 📤 Publication sur GitHub...
echo    Branch: main
echo    URL: %repo_url%
echo.

git branch -M main
git push -u origin main

if %ERRORLEVEL% eq 0 (
    echo.
    echo ✅ SUCCÈS ! Disney Villainous est maintenant sur GitHub !
    echo.
    echo 🌐 URL publique : %repo_url%
    echo.
    echo 🎯 Prochaines étapes recommandées :
    echo    1. Ajoutez une description sur GitHub
    echo    2. Configurez les topics (disney, python, game)
    echo    3. Partagez l'URL avec vos amis !
    echo.
    echo 📊 Statistiques du commit :
    echo    - 53 fichiers publiés
    echo    - Jeu complet fonctionnel
    echo    - Documentation complète
    echo    - Scripts de lancement inclus
    echo.
) else (
    echo.
    echo ❌ Erreur lors de la publication
    echo.
    echo 💡 Solutions possibles :
    echo    1. Vérifiez l'URL du repository
    echo    2. Vérifiez votre authentification GitHub
    echo    3. Créez d'abord le repository sur github.com
    echo.
    echo 🔧 Commandes manuelles :
    echo    git remote -v
    echo    git push -u origin main
)

echo.
echo 📖 Consultez GUIDE_GITHUB.md pour plus d'informations
echo.
pause