@echo off
echo ====================================================
echo    Sarthii Travels GitHub Deployer
echo ====================================================
echo.
echo 1. Initializing Git repository...
"C:\Users\rnfle\.gemini\antigravity-ide\brain\086937a0-182f-49e1-872e-d0d77b8552de\scratch\git\cmd\git.exe" init

echo 2. Configuring local Git identity...
"C:\Users\rnfle\.gemini\antigravity-ide\brain\086937a0-182f-49e1-872e-d0d77b8552de\scratch\git\cmd\git.exe" config user.name "Sarthii Travels Deployer"
"C:\Users\rnfle\.gemini\antigravity-ide\brain\086937a0-182f-49e1-872e-d0d77b8552de\scratch\git\cmd\git.exe" config user.email "deployer@sarthiitravels.com"

echo 3. Setting remote repository URL...
"C:\Users\rnfle\.gemini\antigravity-ide\brain\086937a0-182f-49e1-872e-d0d77b8552de\scratch\git\cmd\git.exe" remote remove origin 2>nul
"C:\Users\rnfle\.gemini\antigravity-ide\brain\086937a0-182f-49e1-872e-d0d77b8552de\scratch\git\cmd\git.exe" remote add origin https://github.com/joshidinesh42-svg/DNJoshi-sarthii.git

echo 4. Staging files...
"C:\Users\rnfle\.gemini\antigravity-ide\brain\086937a0-182f-49e1-872e-d0d77b8552de\scratch\git\cmd\git.exe" add -A

echo 5. Committing changes...
"C:\Users\rnfle\.gemini\antigravity-ide\brain\086937a0-182f-49e1-872e-d0d77b8552de\scratch\git\cmd\git.exe" commit -m "Configure Hostinger Node.js deployment, remove secondary header banner, and beautify FAQ page"

echo 6. Setting branch to main...
"C:\Users\rnfle\.gemini\antigravity-ide\brain\086937a0-182f-49e1-872e-d0d77b8552de\scratch\git\cmd\git.exe" branch -M main

echo 7. Pushing files to GitHub...
echo ----------------------------------------------------
echo Note: A browser window will open now. 
echo Please click "Sign in with your browser" to authorize Git.
echo ----------------------------------------------------
echo.
"C:\Users\rnfle\.gemini\antigravity-ide\brain\086937a0-182f-49e1-872e-d0d77b8552de\scratch\git\cmd\git.exe" push -u origin main --force

echo.
echo ====================================================
echo Done! Verify your GitHub repo at:
echo https://github.com/joshidinesh42-svg/DNJoshi-sarthii
echo ====================================================
echo.
pause
