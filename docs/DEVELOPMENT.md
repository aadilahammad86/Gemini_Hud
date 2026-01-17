# Development Guide 🛠️

This guide covers setting up the development environment, running the app locally, and building for production.

## Prerequisites

- **Node.js**: v18 or higher recommended.
- **npm**: Included with Node.js.

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aadilahammad86/Gemini_Hud.git
   cd gemini-hud
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running Locally

Start the development server with hot-reload:

```bash
npm run dev
```

This will launch the Electron app. Changes to `src/renderer` (Vue) will reflect instantly. Changes to `src/main` or `src/preload` restarts the Electron process.

## Building for Production

To create a standalone installers (e.g., `.exe` for Windows):

1. **Run the build script**:
   ```bash
   npm run build:win
   ```

2. **Locate the installer**:
   The output will be in the `dist/` directory.
   - `gemini-hud-x.y.z-setup.exe`: The installer.
   - `win-unpacked/`: The unpacked executable (useful for testing without installing).

### Build Troubleshooting

If the build fails:
- **Missing Dependencies**: Run `npm install` again. Sometimes `tsc` (TypeScript) binaries are missing.
- **Locked Files**: Ensure the app is not running. If `dist/` is locked, kill `gemini-hud.exe` or `electron.exe` in Task Manager.
- **Entry Point Errors**: Ensure `package.json` points to `out/main/index.js`.

## Tech Stack

- **Electron**: Desktop runtime.
- **Vue 3**: UI framework (Renderer process).
- **TypeScript**: Type safety.
- **Vite**: Build tool (Fast HMR).
- **Electron Builder**: Packaging and distribution.
