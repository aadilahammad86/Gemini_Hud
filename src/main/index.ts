import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 850,
    height: 950,
    show: false,
    frame: false, // Frameless
    resizable: true, // Resizable
    autoHideMenuBar: false,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true // Sometimes useful but likely not needed if using loadURL directly
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load Gemini
  mainWindow.loadURL('https://gemini.google.com')

  // Hide instead of close
  mainWindow.on('close', (event) => {
    // @ts-ignore
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })

  // Global Hotkey
  globalShortcut.register('Alt+G', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  // IPC Handlers
  ipcMain.handle('minimize-window', () => {
    mainWindow.minimize()
  })

  ipcMain.handle('hide-window', () => {
    mainWindow.hide()
  })
}

// Add isQuiting property to app for proper exit handling
Object.defineProperty(app, 'isQuiting', {
  value: false,
  writable: true
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // We want to keep the app running in background (HUD style)
    // so we typically DON'T quit here if we want it persistent,
    // but the window 'close' event is already handling the "hide" logic.
    // If 'window-all-closed' fires, it means all windows are gone (shouldn't happen with hide logic).
    // If the user *really* kills the window or we force it, we might want to quit.
    // For now, let's respect the standard close behavior if the window is truly destroyed.
    // However, since we intercept 'close', this event might not fire unless we call destroy().
  }
})

app.on('before-quit', () => {
  // @ts-ignore
  app.isQuiting = true
})


