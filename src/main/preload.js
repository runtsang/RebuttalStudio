const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('studioApi', {
  listProjects: () => ipcRenderer.invoke('projects:list'),
  getAppSettings: () => ipcRenderer.invoke('app:settings:get'),
  updateDefaultInterval: (seconds) => ipcRenderer.invoke('app:settings:updateDefaultInterval', seconds),
  getApiSettings: () => ipcRenderer.invoke('app:api:getSettings'),
  updateApiSettings: (payload) => ipcRenderer.invoke('app:api:updateSettings', payload),
  listProviderModels: (payload) => ipcRenderer.invoke('app:api:listModels', payload),
  runStage1Breakdown: (payload) => ipcRenderer.invoke('app:stage1:breakdown', payload),
  runStage2Refine: (payload) => ipcRenderer.invoke('app:stage2:refine', payload),
  runTemplateRephrase: (payload) => ipcRenderer.invoke('app:template:rephrase', payload),
  createProject: (payload) => ipcRenderer.invoke('projects:create', payload),
  openProject: (folderName) => ipcRenderer.invoke('projects:open', folderName),
  updateProjectState: (payload) => ipcRenderer.invoke('projects:updateState', payload),
  setAutosaveInterval: (seconds) => ipcRenderer.invoke('projects:setAutosaveInterval', seconds),
  saveNow: () => ipcRenderer.invoke('projects:saveNow'),
});
