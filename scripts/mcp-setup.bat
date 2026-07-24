@echo off
echo ============================================
echo  PhytoFlex Gold - Firebase MCP Setup
echo ============================================
echo.
echo Step 1: Install Firebase CLI
call npm install -g firebase-tools
echo.
echo Step 2: Login to Firebase
call firebase login --no-localhost
echo.
echo Step 3: Create Firebase project
echo   -> Go to https://console.firebase.google.com and create a project named "phytoflex-gold"
echo   -> Enable Firestore (Native mode), Authentication (Email/Password + Google), Storage
echo.
echo Step 4: Get Service Account Key
echo   -> Firebase Console ^> Project Settings ^> Service Accounts ^> Generate New Private Key
echo   -> Save as serviceAccount.json in the project root
echo.
echo Step 5: Set environment variables in .env.local
echo   Copy .env.local.template and fill in your Firebase config values
echo.
echo Step 6: Initialize Firebase in your project
call npx firebase-tools@latest init
echo   Select: Firestore, Authentication, Storage
echo.
echo Step 7: Seed the database
echo   Set FIREBASE_SERVICE_ACCOUNT_KEY env var then run:
echo   node scripts/seed.js
echo.
echo ============================================
echo  OR use MCP with Antigravity:
echo  1. In Antigravity, click menu ^> MCP Servers
echo  2. Select Firebase ^> Install
echo  3. The MCP server will auto-configure
echo ============================================
pause
