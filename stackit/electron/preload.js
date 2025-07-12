const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Notification methods
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),
  checkNotificationPermission: () => ipcRenderer.invoke('check-notification-permission'),
  
  // Navigation methods
  onNavigateTo: (callback) => ipcRenderer.on('navigate-to', callback),
  onMenuNewQuestion: (callback) => ipcRenderer.on('menu-new-question', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}); 