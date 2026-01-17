import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Inject Custom Header
window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style')
  style.innerHTML = `
    #gemini-hud-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 32px;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(5px);
      z-index: 999999;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      -webkit-app-region: drag;
      box-sizing: border-box;
      padding-right: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .gemini-hud-btn {
      -webkit-app-region: no-drag;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-left: 5px;
      border-radius: 4px;
      transition: background 0.2s, color 0.2s;
      font-family: sans-serif;
      font-size: 14px;
    }
    .gemini-hud-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .gemini-hud-btn.close:hover {
      background: #e81123;
    }
    body {
      padding-top: 32px !important; /* Make space for header */
    }
  `
  document.head.appendChild(style)

  const header = document.createElement('div')
  header.id = 'gemini-hud-header'
  header.innerHTML = `
    <button id="gemini-hud-min" class="gemini-hud-btn">─</button>
    <button id="gemini-hud-close" class="gemini-hud-btn close">✕</button>
  `
  document.body.appendChild(header)

  document.getElementById('gemini-hud-min')?.addEventListener('click', () => {
    ipcRenderer.invoke('minimize-window')
  })

  document.getElementById('gemini-hud-close')?.addEventListener('click', () => {
    ipcRenderer.invoke('hide-window')
  })
})

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

