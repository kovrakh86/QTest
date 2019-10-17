@ECHO OFF
CLS
SETLOCAL ENABLEDELAYEDEXPANSION

ECHO ===============================================================================
ECHO %~nx0
ECHO ===============================================================================

SET _currentDir=%~dp0&&SET _currentDir=!_currentDir:~0,-1!

ECHO.
ECHO Building website...
ECHO.
ECHO %_currentDir%^>yarn run build-website
ECHO.
CALL yarn run build-website

ECHO.
ECHO Press any key to exit...
PAUSE>NUL
