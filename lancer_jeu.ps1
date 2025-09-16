# Script PowerShell pour lancer Disney Villainous
# Lancer_jeu.ps1

Write-Host "Disney Villainous - Script PowerShell de lancement" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# Fonction pour tester Python
function Test-Python {
    $pythonCommands = @("python", "py", "python3", "python.exe")
    
    foreach ($cmd in $pythonCommands) {
        try {
            $version = & $cmd --version 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Python trouve: $cmd" -ForegroundColor Green
                Write-Host "   Version: $version" -ForegroundColor Green
                return $cmd
            }
        }
        catch {
            # Commande non trouvee, continue
        }
    }
    
    return $null
}

# Recherche Python
$pythonCmd = Test-Python

if (-not $pythonCmd) {
    Write-Host "Python n'est pas installe ou accessible" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installation de Python requise:" -ForegroundColor Yellow
    Write-Host "   1. Allez sur https://www.python.org/downloads/" -ForegroundColor White
    Write-Host "   2. Telechargez Python 3.8+ pour Windows" -ForegroundColor White
    Write-Host "   3. IMPORTANT: Cochez 'Add Python to PATH' pendant l'installation" -ForegroundColor White
    Write-Host "   4. Ou installez depuis le Microsoft Store: 'Python 3.11'" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuyez sur Entree pour quitter"
    exit 1
}

# Test rapide de Python
Write-Host ""
Write-Host "Test rapide de Python..." -ForegroundColor Yellow
try {
    & $pythonCmd test_python.py
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur lors du test Python" -ForegroundColor Red
        Read-Host "Appuyez sur Entree pour quitter"
        exit 1
    }
}
catch {
    Write-Host "Impossible de lancer le test Python" -ForegroundColor Red
    Read-Host "Appuyez sur Entree pour quitter"
    exit 1
}

# Installation des dependances (optionnel)
Write-Host ""
Write-Host "Installation des dependances..." -ForegroundColor Yellow
try {
    & $pythonCmd -m pip install -r requirements.txt
}
catch {
    Write-Host "Erreur lors de l'installation des dependances (optionnel)" -ForegroundColor Yellow
}

# Lance les tests
Write-Host ""
Write-Host "Lancement des tests du jeu..." -ForegroundColor Yellow
try {
    & $pythonCmd tests\test_game.py
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Les tests ont echoue" -ForegroundColor Red
        Write-Host "Le jeu peut quand meme fonctionner, voulez-vous continuer?" -ForegroundColor Yellow
        $continue = Read-Host "Continuer? (o/n)"
        if ($continue -notlike "o*") {
            exit 1
        }
    }
}
catch {
    Write-Host "Erreur lors des tests" -ForegroundColor Yellow
}

# Lance le jeu
Write-Host ""
Write-Host "Lancement de Disney Villainous..." -ForegroundColor Green
Write-Host ""

try {
    & $pythonCmd main.py
}
catch {
    Write-Host "Erreur lors du lancement du jeu" -ForegroundColor Red
}

Read-Host "Appuyez sur Entree pour quitter"