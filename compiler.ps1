# Disney Villainous - Compilateur automatique
# Ce script utilise auto-py-to-exe pour créer un exécutable

Write-Host "🏰 Disney Villainous - Compilateur Automatique 🏰" -ForegroundColor Cyan
Write-Host "=" * 50
Write-Host ""

# Vérifier si Python est disponible
$pythonPath = $null
$pythonCommands = @("python", "py", "python3")

foreach ($cmd in $pythonCommands) {
    try {
        $version = & $cmd --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $pythonPath = $cmd
            Write-Host "✅ Python trouvé: $version" -ForegroundColor Green
            break
        }
    } catch {}
}

if (-not $pythonPath) {
    Write-Host "❌ Python non trouvé dans le PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Solutions :"
    Write-Host "1. Installez Python depuis python.org"
    Write-Host "2. Ou utilisez 'jouer.bat' pour jouer directement"
    Write-Host "3. Ou téléchargez Python portable"
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

# Installer auto-py-to-exe
Write-Host ""
Write-Host "🔧 Installation d'auto-py-to-exe..." -ForegroundColor Yellow
try {
    & $pythonPath -m pip install auto-py-to-exe
    if ($LASTEXITCODE -ne 0) {
        throw "Erreur d'installation"
    }
    Write-Host "✅ auto-py-to-exe installé" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de l'installation d'auto-py-to-exe" -ForegroundColor Red
    Write-Host "💡 Essayez manuellement: pip install auto-py-to-exe"
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

# Créer le fichier de configuration JSON pour auto-py-to-exe
$config = @{
    "onefile" = $true
    "console" = $true
    "name" = "Disney_Villainous"
    "script" = "main_standalone.py"
    "additionalFiles" = @("data", "src")
    "hiddenImports" = @(
        "src.core.game",
        "src.interface.console", 
        "src.players.player",
        "src.cards.card",
        "src.board.location"
    )
} | ConvertTo-Json -Depth 3

$config | Out-File -FilePath "auto-py-to-exe-config.json" -Encoding UTF8

Write-Host ""
Write-Host "🏗️ Création de l'exécutable..." -ForegroundColor Yellow
Write-Host ""

# Méthode 1: Essayer avec PyInstaller directement
try {
    Write-Host "📦 Tentative avec PyInstaller..."
    & $pythonPath -m pip install pyinstaller
    
    & $pythonPath -m PyInstaller `
        --onefile `
        --console `
        --name "Disney_Villainous" `
        --add-data "data;data" `
        --add-data "src;src" `
        --hidden-import "src.core.game" `
        --hidden-import "src.interface.console" `
        --hidden-import "src.players.player" `
        --hidden-import "src.cards.card" `
        --hidden-import "src.board.location" `
        main_standalone.py
    
    if (Test-Path "dist\Disney_Villainous.exe") {
        Write-Host ""
        Write-Host "✅ Exécutable créé avec succès !" -ForegroundColor Green
        Write-Host "📁 Fichier: dist\Disney_Villainous.exe" -ForegroundColor Cyan
        
        # Copier à la racine pour faciliter l'accès
        Copy-Item "dist\Disney_Villainous.exe" "Disney_Villainous.exe" -Force
        Write-Host "🎮 Raccourci créé: Disney_Villainous.exe" -ForegroundColor Cyan
        
        Write-Host ""
        Write-Host "🎯 Comment utiliser :" -ForegroundColor Yellow
        Write-Host "1. Double-cliquez sur Disney_Villainous.exe"
        Write-Host "2. Ou copiez-le sur n'importe quel PC Windows"
        Write-Host "3. Aucune installation Python requise !"
        
    } else {
        Write-Host "❌ Fichier exécutable non créé" -ForegroundColor Red
        Write-Host ""
        Write-Host "🔄 Tentative avec auto-py-to-exe (interface graphique)..."
        
        try {
            Write-Host "🌐 Lancement d'auto-py-to-exe..."
            Write-Host "📋 Instructions dans l'interface :"
            Write-Host "1. Script: main_standalone.py"
            Write-Host "2. Onefile: OUI"
            Write-Host "3. Console: OUI"
            Write-Host "4. Additional Files: ajoutez 'data' et 'src'"
            Write-Host "5. Cliquez sur 'Convert .py to .exe'"
            Write-Host ""
            
            & $pythonPath -m auto_py_to_exe
            
        } catch {
            Write-Host "❌ Erreur avec auto-py-to-exe: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "❌ Erreur avec PyInstaller: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔄 Tentative avec auto-py-to-exe (interface graphique)..."
    
    try {
        Write-Host "🌐 Lancement d'auto-py-to-exe..."
        Write-Host "📋 Instructions dans l'interface :"
        Write-Host "1. Script: main_standalone.py"
        Write-Host "2. Onefile: OUI"
        Write-Host "3. Console: OUI"
        Write-Host "4. Additional Files: ajoutez 'data' et 'src'"
        Write-Host "5. Cliquez sur 'Convert .py to .exe'"
        Write-Host ""
        
        & $pythonPath -m auto_py_to_exe
        
    } catch {
        Write-Host "❌ Erreur avec auto-py-to-exe: $($_.Exception.Message)" -ForegroundColor Red
    }
}
}

Write-Host ""
Write-Host "🧹 Nettoyage..." -ForegroundColor Yellow
if (Test-Path "build") { Remove-Item -Recurse -Force "build" }
if (Test-Path "__pycache__") { Remove-Item -Recurse -Force "__pycache__" }
if (Test-Path "auto-py-to-exe-config.json") { Remove-Item "auto-py-to-exe-config.json" }

Write-Host ""
Write-Host "✅ Processus terminé !" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Si l'exécutable n'a pas été créé :" -ForegroundColor Yellow
Write-Host "1. Utilisez 'jouer.bat' pour jouer"
Write-Host "2. Ou essayez manuellement avec PyInstaller"
Write-Host "3. Ou partagez tout le dossier projet"
Write-Host ""

Read-Host "Appuyez sur Entrée pour terminer"