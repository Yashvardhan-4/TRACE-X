@echo off
title TRACE-X Launcher
echo ==========================================================
echo  TRACE-X: Temporal Risk & Activity Correlation Engine
echo  Financial Crime & Insider Risk Investigation OS
echo ==========================================================

echo.
echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "TRACE-X Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/2] Launching Next.js Cockpit on http://localhost:3000 ...
cd /d %~dp0frontend
npm run dev
