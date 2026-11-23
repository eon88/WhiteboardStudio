@echo off
cd /d "%~dp0"
echo.
echo Whiteboard Studio - MP4 Export Setup
where ffmpeg >nul 2>nul
if not errorlevel 1 (
  echo FFmpeg is already available on PATH.
  ffmpeg -version | findstr /b "ffmpeg version"
  pause
  exit /b 0
)
where winget >nul 2>nul
if errorlevel 1 (
  echo Windows Package Manager ^(winget^) was not found.
  echo Install FFmpeg from https://ffmpeg.org/download.html
  echo Then restart this app.
  pause
  exit /b 1
)
echo Installing free FFmpeg through Windows Package Manager...
winget install --id Gyan.FFmpeg --exact --accept-package-agreements --accept-source-agreements
if errorlevel 1 (
 echo FFmpeg setup reported an error. You can still export WebM without it.
) else (
 echo FFmpeg installed. Close and reopen Whiteboard Studio to enable MP4 export.
 echo If MP4 is still unavailable, sign out and in again to refresh PATH.
)
pause
