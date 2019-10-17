@ECHO OFF
CLS
SETLOCAL ENABLEDELAYEDEXPANSION

ECHO ===============================================================================
ECHO %~nx0
ECHO ===============================================================================

SET _currentDir=%~dp0&&SET _currentDir=!_currentDir:~0,-1!
SET _contentDir=..\S4S.CMS.Web\Content

ECHO.
ECHO Building website...
ECHO.
ECHO %_currentDir%^>yarn run build-website
ECHO.
CALL yarn run build-website

IF %ERRORLEVEL% EQU 0 (
    ECHO.
    ECHO Cleaning up target directory:

    FOR /D %%D IN (%_currentDir%\%_contentDir%\*) DO (
        ECHO ...deleting folder: %_contentDir%\%%~nD
        RMDIR /S /Q "%%~fD"
    )

    FOR %%F IN (%_currentDir%\%_contentDir%\*.*) DO (
        ECHO ...deleting file: %_contentDir%\%%~nxF
        DEL /F /Q "%%~fF"
    )

    ECHO.
    ECHO Copying front-end content:
    %SystemRoot%\System32\XCOPY "%_currentDir%\dist\content" "%_currentDir%\%_contentDir%" /E /F /H /R /Y
)

ECHO.
ECHO Press any key to exit...
PAUSE>NUL
