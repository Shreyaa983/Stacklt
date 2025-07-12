const { app, BrowserWindow, ipcMain, Notification, Menu } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), // You'll need to add an icon
    titleBarStyle: 'default',
    show: false
  });

  // Maximize the window on startup
  mainWindow.maximize();

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, '../frontend-2/dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Don't open DevTools automatically (comment out for production)
    // if (isDev) {
    //   mainWindow.webContents.openDevTools();
    // }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Menu template removed for cleaner app-like experience

// App event handlers
app.whenReady().then(() => {
  createWindow();
  
  // Remove application menu for a cleaner app-like experience
  Menu.setApplicationMenu(null);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for notifications
ipcMain.handle('show-notification', async (event, { title, body, icon }) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title,
      body,
      icon: icon || path.join(__dirname, 'assets', 'icon.png'),
      silent: false
    });
    
    notification.show();
    
    notification.on('click', () => {
      mainWindow.show();
      mainWindow.focus();
    });
    
    return true;
  }
  return false;
});

ipcMain.handle('check-notification-permission', async () => {
  return Notification.isSupported();
});

// Menu actions removed for cleaner app-like experience 