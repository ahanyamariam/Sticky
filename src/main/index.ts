import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
const Store = require('electron-store').default
const store = new Store()

ipcMain.handle('notes:save', (_e, notes) => store.set('notes', notes))
ipcMain.handle('notes:load', () => store.get('notes', []))

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 620,
    height: 520,
    frame: false,
    transparent: true,
    titleBarStyle: 'customButtonsOnHover',
    backgroundColor: '#00000000',
    resizable: false,
    show: false,
    icon: join(__dirname, '../../resources/sticky_logo.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})