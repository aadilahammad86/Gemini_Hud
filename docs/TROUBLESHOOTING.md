# Troubleshooting 🔧

## Build Issues

### "Application entry file is corrupted"
**Error**: `Application entry file "index.js" ... is corrupted: Error: "index.js" was not found in this archive`
**Cause**: `electron-builder` cannot find the entry point specified in `package.json` inside the built ASAR.
**Fix**:
1. Ensure `package.json` main field is `"main": "out/main/index.js"`.
2. Ensure `electron-builder.yml` includes the build output:
   ```yaml
   files:
     - out/**/*
   ```

### "remove dist ... process cannot access the file"
**Cause**: The folder is locked by a running instance of the app or a hung build process.
**Fix**:
1. Close the app (check Task Manager for `gemini-hud.exe` or `electron.exe`).
2. Run `taskkill /F /IM electron.exe` and `taskkill /F /IM gemini-hud.exe` in terminal (Admin).
3. Delete the `dist` folder manually if needed.

## Runtime Issues

### Window Disappears / Won't Show
- Press `Alt + G`.
- Check if the app is running in the background.
- If stuck, open Task Manager and kill `gemini-hud.exe`, then restart.

### Login Not Persisting
- The app uses standard Electron session storage. Avoid extracting the app to a temporary folder; install it properly so User Data is preserved in `%APPDATA%`.
