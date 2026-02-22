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
  runStage4Condense: (payload) => ipcRenderer.invoke('app:stage4:condense', payload),
  saveStage4CondensedMarkdown: (payload) => ipcRenderer.invoke('app:stage4:saveCondensed', payload),
  runStage4Refine: (payload) => ipcRenderer.invoke('app:stage4:refine', payload),
  saveStage5CondensedMarkdown: (payload) => ipcRenderer.invoke('app:stage5:saveCondensed', payload),
  runStage5FinalRemarks: (payload) => ipcRenderer.invoke('app:stage5:finalize', payload),
  runTemplateRephrase: (payload) => ipcRenderer.invoke('app:template:rephrase', payload),
  createProject: (payload) => ipcRenderer.invoke('projects:create', payload),
  openProject: (folderName) => ipcRenderer.invoke('projects:open', folderName),
  updateProjectState: (payload) => ipcRenderer.invoke('projects:updateState', payload),
  setAutosaveInterval: (seconds) => ipcRenderer.invoke('projects:setAutosaveInterval', seconds),
  saveNow: () => ipcRenderer.invoke('projects:saveNow'),
});
