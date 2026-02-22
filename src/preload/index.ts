import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  saveNotes: (notes: any[]) => ipcRenderer.invoke('notes:save', notes),
  loadNotes: () => ipcRenderer.invoke('notes:load'),
})