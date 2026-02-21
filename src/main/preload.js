const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('studioApi', {
  listProjects: () => ipcRenderer.invoke('projects:list'),
  getAppSettings: () => ipcRenderer.invoke('app:settings:get'),
  updateDefaultInterval: (seconds) => ipcRenderer.invoke('app:settings:updateDefaultInterval', seconds),
  createProject: (payload) => ipcRenderer.invoke('projects:create', payload),
  openProject: (folderName) => ipcRenderer.invoke('projects:open', folderName),
  updateProjectState: (payload) => ipcRenderer.invoke('projects:updateState', payload),
  setAutosaveInterval: (seconds) => ipcRenderer.invoke('projects:setAutosaveInterval', seconds),
  saveNow: () => ipcRenderer.invoke('projects:saveNow'),
});
