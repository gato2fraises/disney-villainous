@echo off
echo Demarrage du serveur local pour Disney Villainous...
echo.
echo Ouvrez votre navigateur a l'adresse : http://localhost:8000
echo Pour arreter le serveur, appuyez sur Ctrl+C
echo.

cd /d "%~dp0"
python -m http.server 8000 2>nul || (
    echo Python non trouve, tentative avec Python 3...
    python3 -m http.server 8000 2>nul || (
        echo.
        echo ERREUR: Python non installe
        echo Veuillez installer Python ou utiliser integrated.html
        echo.
        pause
        exit /b 1
    )
)