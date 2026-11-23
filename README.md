# Whiteboard Studio (local-first MVP)

Create black-marker whiteboard animations from essays, with an optional local Ollama storyboard and optional offline Windows speech.

## Getting started (Windows)

1. Unzip the folder.
2. Double-click `start.bat` (Node.js 18+ required).
3. Open `http://localhost:4178` if the browser does not open automatically.
4. Paste your essay and select **Create scenes**. No AI or internet required.
5. Preview, edit scenes, then export a video.

No npm install or API key required. Files stay on your computer unless you choose to use an external service yourself. Ollama calls only `http://127.0.0.1:11434`.

### Video export

- The app records its canvas using your browser's MediaRecorder.
- **MP4:** install FFmpeg and put it on your system PATH, then restart the server. Test with `ffmpeg -version` in PowerShell. You can use `winget install Gyan.FFmpeg` then restart your terminal.
- **WebM:** always available in Chrome / Edge, no FFmpeg required.
- Recording happens in real time. A 5-minute animation takes 5 minutes to record. Keep the tab visible and don't allow the laptop to sleep while exporting.

### Narration

- **Generate Windows voice:** local Windows text-to-speech via built-in System.Speech. English voice depends on voices installed in Windows.
- **Import audio:** use a WAV or MP3 voiceover file. It will be embedded in the recording.
- **No narration:** the animation is exported silently.
- Narration is synchronized *approximately* by allocating scene time based on the relative word counts; precise word-level alignment is not included in this first version.
- When using Ollama to build scenes, narration still reads your original essay.

### Ollama (optional)

Ollama must already be running locally. Click "Find local models", select a model and use "AI storyboard". Small models may produce incomplete JSON; choose "Instant scenes" instead if this happens. **Instant scenes** uses rule-based splitting and works fully offline.

### Save and reopen

Use "Save project" to download a JSON project, and "Open project" to restore it. Audio files are not embedded in the project JSON: import or generate the narration again after loading. A local draft is also autosaved in the browser.

### Limits of this initial version

- The visuals are selected from a built-in library of simple SVG-style marker icons; no custom image generation.
- No music, complex characters, or automatic accurate phoneme/sentence timing.
- Changing scene durations manually only applies when there is no audio. With narration, durations are distributed automatically across scenes.
- Max 45,000 essay characters; Ollama planning output is capped to 48 scenes, and instant generation to 55 scenes.
- Do not expose this app to a public IP address. It deliberately listens only on localhost.

## Developer notes

`node server.js` starts the app. All code is plain JavaScript, HTML and CSS; no npm dependencies. Server handles optional Ollama, Windows TTS and FFmpeg conversion.
