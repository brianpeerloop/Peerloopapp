@echo off
cd /d c:\Alpha\q-vibe-coder
echo === GIT REMOTE ===
git remote -v
echo.
echo === GIT BRANCH ===
git branch -vv
echo.
echo === GIT STATUS ===
git status
echo.
echo === GIT FETCH TEST ===
git fetch origin 2>&1
echo.
echo === DONE ===












