@ECHO OFF
CLS
SETLOCAL ENABLEDELAYEDEXPANSION

ECHO ===============================================================================
ECHO %~nx0
ECHO ===============================================================================

SET _currentDir=%~dp0&&SET _currentDir=!_currentDir:~0,-1!

ECHO.
ECHO Starting local dev server...
ECHO.
ECHO %_currentDir%^>yarn run start-dev-server
ECHO.
CALL yarn run start-dev-server

ECHO.
ECHO Press any key to exit...
PAUSE>NUL
