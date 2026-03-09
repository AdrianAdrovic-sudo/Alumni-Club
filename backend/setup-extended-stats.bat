@echo off
echo ========================================
echo Postavljanje prosirene statistike
echo ========================================
echo.

echo [1/3] Generisanje Prisma klijenta...
call npx prisma generate
if %errorlevel% neq 0 (
    echo GRESKA: Prisma generate nije uspeo!
    echo Molim te zaustavi backend server i pokusaj ponovo.
    pause
    exit /b 1
)
echo.

echo [2/3] Dodavanje test podataka...
call npx ts-node src/script/seed-extended-theses.ts
if %errorlevel% neq 0 (
    echo GRESKA: Seed skripta nije uspela!
    pause
    exit /b 1
)
echo.

echo [3/3] Sve je spremno!
echo.
echo ========================================
echo Sada pokreni backend server:
echo npm run dev
echo ========================================
pause
