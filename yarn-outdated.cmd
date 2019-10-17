@ECHO OFF
CLS
SETLOCAL ENABLEDELAYEDEXPANSION

ECHO ===============================================================================
ECHO %~nx0
ECHO ===============================================================================

SET _currentDir=%~dp0&&SET _currentDir=!_currentDir:~0,-1!

ECHO.
ECHO Checking for outdated packages...
ECHO.
ECHO %_currentDir%^>yarn outdated
ECHO.
CALL yarn outdated

ECHO.
ECHO Press any key to exit...
PAUSE>NUL
