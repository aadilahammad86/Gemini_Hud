# Architecture & Design 🏗️

Gemini HUD is built as an Electron application with a clear separation of concerns between the Main process and Renderer process.

## Project Structure

```
gemini-hud/
├── src/
│   ├── main/          # Electron Main Process (Node.js)
│   │   └── index.ts   # Entry point: Window creation, IPC handling
│   ├── preload/       # Preload Scripts
│   │   └── index.ts   # Bridge: Injects UI, exposes Safe IPC
│   └── renderer/      # Vue 3 App (Web Content)
│       └── src/       # Vue Components (Standard Vue structure)
├── resources/         # Static assets (Icon, etc.)
├── electron-builder.yml # Packaging configuration
└── package.json       # Dependencies and scripts
```

## Key Components

### 1. Main Process (`src/main/index.ts`)
- **Window Management**: Creates a frameless `BrowserWindow`.
- **Global Hotkey**: Registers `Alt+G` using Electron's `globalShortcut` module.
- **Event Handling**: 
  - Intercepts the `close` event to **hide** the window instead of quitting.
  - Listen for IPC events (`minimize-window`, `hide-window`).

### 2. Preload Script (`src/preload/index.ts`)
- **UI Injection**: Since we load `https://gemini.google.com` directly (not a local Vue app for the main view), the preload script injects the **Custom Header** (Drag region, Minimize, Close).
- **IPC Bridge**: Exposes safe methods to the renderer context (if needed) and handles button clicks to send messages to Main.

### 3. Window Behavior
- **Frameless**: `frame: false` removes system chrome.
- **Draggable**: CSS property `-webkit-app-region: drag` applied to the custom header allows moving the window.
- **Persistence**: session data is handled automatically by Electron's partition/session storage.

## Building & packaging

We use **electron-builder** to package the app.
- Config: `electron-builder.yml`
- Output: `dist/`
- **Important**: The `out/` directory (Vite build output) must be explicitly included in the ASAR package via the `files` config.
