# TRACE-X Unified Service Launcher (PowerShell)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " TRACE-X: Temporal Risk & Activity Correlation Engine" -ForegroundColor Yellow
Write-Host " Financial Crime & Insider Risk Investigation OS" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start FastAPI Backend in background
Write-Host "`n[1/2] Starting Python FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Green
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\.venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

Start-Sleep -Seconds 2

# 2. Start Next.js Frontend
Write-Host "[2/2] Starting Next.js Investigation Cockpit on http://localhost:3000 ..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\frontend"
npm run dev
