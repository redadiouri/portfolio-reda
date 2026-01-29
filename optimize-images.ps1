# Script d'optimisation automatique des images avec ImageMagick
# Utilisez : .\optimize-images.ps1

param(
    [string]$ImagePath = "img",
    [int]$Quality = 80
)

Write-Host "🖼️ Optimisation des images..." -ForegroundColor Green

# Vérifier si ImageMagick est installé
try {
    $magick = Get-Command magick -ErrorAction Stop
    Write-Host "✅ ImageMagick trouvé : $($magick.Source)" -ForegroundColor Green
} catch {
    Write-Host "❌ ImageMagick n'est pas installé !" -ForegroundColor Red
    Write-Host "Installez-le avec : choco install imagemagick" -ForegroundColor Yellow
    exit 1
}

# Fonction pour optimiser une image
function Optimize-Image {
    param(
        [string]$InputFile,
        [string]$OutputFile,
        [string]$Resize,
        [int]$QualityLevel
    )
    
    if (Test-Path $InputFile) {
        Write-Host "  📝 Optimisation de $InputFile..." -ForegroundColor Cyan
        
        if ($Resize) {
            & magick convert $InputFile -resize $Resize -quality $QualityLevel $OutputFile
        } else {
            & magick convert $InputFile -quality $QualityLevel $OutputFile
        }
        
        $inputSize = (Get-Item $InputFile).Length / 1MB
        $outputSize = (Get-Item $OutputFile).Length / 1MB
        $reduction = [Math]::Round((1 - ($outputSize / $inputSize)) * 100, 1)
        
        Write-Host "    ✓ Terminé : $inputSize MB → $outputSize MB (réduction de $reduction%)" -ForegroundColor Green
    } else {
        Write-Host "    ⚠️ Fichier non trouvé : $InputFile" -ForegroundColor Yellow
    }
}

# Fonction pour créer version WebP
function Create-WebP {
    param(
        [string]$InputFile,
        [string]$OutputFile,
        [int]$QualityLevel
    )
    
    if (Test-Path $InputFile) {
        Write-Host "  🌐 Création de version WebP : $OutputFile..." -ForegroundColor Cyan
        & magick convert $InputFile -quality $QualityLevel $OutputFile
        Write-Host "    ✓ Terminé" -ForegroundColor Green
    }
}

Write-Host "`n📦 1️⃣ Optimisation des images JPEG..." -ForegroundColor Yellow

Optimize-Image -InputFile "img/reda.JPG" -OutputFile "img/reda.jpg" -Resize "300x300" -QualityLevel $Quality
Optimize-Image -InputFile "img/maison.JPG" -OutputFile "img/maison.jpg" -Resize "252x180" -QualityLevel $Quality

Write-Host "`n🎨 2️⃣ Optimisation de l'image PNG..." -ForegroundColor Yellow

Optimize-Image -InputFile "img/MLA.png" -OutputFile "img/mla.png" -Resize "270x180" -QualityLevel 85

Write-Host "`n🌐 3️⃣ Création des versions WebP..." -ForegroundColor Yellow

Create-WebP -InputFile "img/reda.jpg" -OutputFile "img/reda.webp" -QualityLevel $Quality
Create-WebP -InputFile "img/mla.png" -OutputFile "img/mla.webp" -QualityLevel 85
Create-WebP -InputFile "img/maison.jpg" -OutputFile "img/maison.webp" -QualityLevel $Quality

Write-Host "`n📊 Résumé des fichiers créés :" -ForegroundColor Green
Write-Host "  ✓ img/reda.jpg (300x300)" -ForegroundColor Green
Write-Host "  ✓ img/reda.webp" -ForegroundColor Green
Write-Host "  ✓ img/mla.png (270x180)" -ForegroundColor Green
Write-Host "  ✓ img/mla.webp" -ForegroundColor Green
Write-Host "  ✓ img/maison.jpg (252x180)" -ForegroundColor Green
Write-Host "  ✓ img/maison.webp" -ForegroundColor Green

Write-Host "`n✅ Optimisation terminée ! Vous pouvez commiter les changes." -ForegroundColor Green
