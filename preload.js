// preload.js
// 预加载脚本：暴露必要的 IPC 接口给渲染进程（安全）
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onIconPath: (callback) => ipcRenderer.on('icon-path', (_event, url) => callback(url)),
  closeApp: () => ipcRenderer.send('close-app')
});
