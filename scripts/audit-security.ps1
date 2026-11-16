# ==============================================================================
# Security & Vulnerability Local Audit Script
# Run this script anytime to inspect stack vulnerabilities locally.
# ==============================================================================

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "   🔍 Local Stack Security & Vulnerability Audit  " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node/Bun package audit
if (Test-Path "package.json") {
    Write-Host "[1/2] Checking JavaScript/TypeScript Dependencies for Vulnerabilities..." -ForegroundColor Yellow
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        Write-Host "Running: npm audit..." -ForegroundColor DarkGray
        npm audit
    }
}

Write-Host ""

# 2. Check outdated packages
if (Test-Path "package.json") {
    Write-Host "[2/2] Checking Outdated Packages..." -ForegroundColor Yellow
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        npm outdated
    }
}

Write-Host ""
Write-Host "Audit completed successfully." -ForegroundColor Green
