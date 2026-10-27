import { ElectronAPI } from '@electron-toolkit/preload'

interface Overlay {
  toggleOverlay: () => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      overlay: Overlay
    }
  }
}
