const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setConfig: (config) => ipcRenderer.send('set-config', config),
  onVoltageUpdate: (callback) => ipcRenderer.on('voltage-update', (_e, v) => callback(v)),
  onLogMessage: (callback) => ipcRenderer.on('log-message', (_e, msg) => callback(msg)),
  onInitialConfig: (cb) => ipcRenderer.on('initial-config', (_e, cfg) => cb(cfg)),
});

