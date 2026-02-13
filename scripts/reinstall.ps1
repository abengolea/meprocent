# Script para reinstalación limpia en Windows
# Ejecutar con: .\scripts\reinstall.ps1
# O desde PowerShell: pwsh -File scripts\reinstall.ps1

Write-Host "=== Reinstalación limpia de dependencias ===" -ForegroundColor Cyan
Write-Host ""

# 1. Limpiar caché de npm
Write-Host "1. Limpiando caché de npm..." -ForegroundColor Yellow
npm cache clean --force
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\npm-cache\_cacache" -ErrorAction SilentlyContinue
Write-Host "   Cache limpiada." -ForegroundColor Green

# 2. Borrar node_modules
Write-Host "2. Eliminando node_modules..." -ForegroundColor Yellow
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    if (Test-Path node_modules) {
        Write-Host "   ADVERTENCIA: No se pudo eliminar completamente. Cierra Cursor y vuelve a ejecutar." -ForegroundColor Red
    } else {
        Write-Host "   node_modules eliminado." -ForegroundColor Green
    }
} else {
    Write-Host "   node_modules no existia." -ForegroundColor Green
}

# 3. Instalar
Write-Host "3. Instalando dependencias..." -ForegroundColor Yellow
npm install
Write-Host ""
Write-Host "=== Listo. Ejecuta: npm run dev ===" -ForegroundColor Cyan
