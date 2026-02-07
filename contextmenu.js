//1.2.1
const { app, Menu, BrowserWindow } = require('electron');

const isMac = process.platform === 'darwin';

const menuTemplate = [
  // --- 1. macOS System Menu ---
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { 
        label: 'About ' + app.name, 
        click: (item, focusedWindow) => {
            if(focusedWindow) focusedWindow.emit('open-about');
        }
      },
      { type: 'separator' },
      { 
        label: 'Preferences...', 
        accelerator: 'CmdOrCtrl+,', 
        click: (item, focusedWindow) => {
            if(focusedWindow) focusedWindow.emit('open-options');
        }
      },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),

  // --- 2. Main Menu ---
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Appearance',
        click: (item, focusedWindow) => { 
            if(focusedWindow) focusedWindow.emit('open-appearance'); 
        }
      },
      {
        label: 'Options',
        accelerator: 'CmdOrCtrl+,', 
        click: (item, focusedWindow) => { 
            if(focusedWindow) focusedWindow.emit('open-options'); 
        }
      },
      { type: 'separator' },
      {
        label: 'About',
        click: (item, focusedWindow) => { 
            if(focusedWindow) focusedWindow.emit('open-about'); 
        }
      }
    ]
  },

 {
        label: 'Navigation', 
        submenu: [
            { label: 'Go Back', accelerator: 'Alt+Left', click: (item, window) => { if (window.webContents.canGoBack()) window.webContents.goBack(); } },
            { label: 'Go Forward', accelerator: 'Alt+Right', click: (item, window) => { if (window.webContents.canGoForward()) window.webContents.goForward(); } },
            { type: 'separator' },
            { label: 'Reload', role: 'reload' },
            { label: 'Home', click: (item, window) => window.loadURL('https://music.youtube.com') }
        ]
    }
];

module.exports.mainMenu = Menu.buildFromTemplate(menuTemplate);