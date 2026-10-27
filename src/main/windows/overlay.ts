import { BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { OverlayEvents } from '../../utils/events'

// let overlayWindow: BrowserWindow | null = null

// export default

class OverlayWindow {
  private static instance: OverlayWindow | null = null
  private overlayWindow: BrowserWindow | null = null

  // private constructor() {}

  public static getInstance(): OverlayWindow {
    if (!OverlayWindow.instance) {
      OverlayWindow.instance = new OverlayWindow()
    }

    return this.instance as OverlayWindow
  }

  public create(): BrowserWindow {
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
      return this.overlayWindow
    }

    const { width } = screen.getPrimaryDisplay().workAreaSize

    this.overlayWindow = new BrowserWindow({
      width: 420,
      height: 300,

      x: width - 440,
      y: 100,

      frame: false,
      transparent: true,
      backgroundColor: '#0000009b',

      alwaysOnTop: true,
      resizable: false,
      skipTaskbar: true,

      hasShadow: false,

      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    })

    this.overlayWindow.setAlwaysOnTop(true, 'screen-saver')

    if (is.dev) {
      this.overlayWindow.loadURL(`${process.env.ELECTRON_RENDERER_URL}/overlay/index.html`)
    } else {
      this.overlayWindow.loadFile(join(__dirname, '../renderer/overlay/index.html'))
    }

    this.overlayWindow.once('ready-to-show', () => {
      this.overlayWindow?.show()
    })

    this.overlayWindow.on('closed', () => {
      this.overlayWindow = null
    })

    return this.overlayWindow
  }

  public destroy(): void {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) {
      this.overlayWindow = null
      return
    }

    this.overlayWindow.destroy()
    this.overlayWindow = null
  }

  public getWindow(): BrowserWindow | null {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) {
      return null
    }

    return this.overlayWindow
  }

  public toggleOverlayWindow(): void {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) {
      this.create()
      return
    }

    if (this.overlayWindow.isVisible()) this.overlayWindow.hide()
    else this.overlayWindow.show()
  }

  public setOverlayIpcHandles(): void {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return

    ipcMain.handle(OverlayEvents.Toggle, () => {
      this.toggleOverlayWindow()
    })
  }
}

export default OverlayWindow
