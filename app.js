
const { app, BrowserWindow, Menu, ipcMain, shell, systemPreferences, nativeTheme, nativeImage, session, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { mainMenu } = require('./contextmenu');
const { loadConfig, saveConfig } = require('./config'); 
const { getThemeCss, getThemeJs } = require('./theme'); 

const appId = 'com.aspxcts.enhancedmusic';
const GITHUB_REPO = 'aspxcts777/EnhancedMusic'; 

app.setAppUserModelId(appId);
app.setName('EnhancedMusic');

const USER_AGENT_DESKTOP = process.platform === 'darwin' 
    ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const USER_AGENT_MOBILE = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36';

app.userAgentFallback = USER_AGENT_DESKTOP;

app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
app.commandLine.appendSwitch('disable-site-isolation-trials');
if (process.platform === 'linux') { 
    app.commandLine.appendSwitch('no-sandbox');
    app.commandLine.appendSwitch('enable-transparent-visuals'); 
    app.commandLine.appendSwitch('disable-gpu');
}

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('enhancedmusic', process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient('enhancedmusic');
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    let mainWindow;
    let splashWindow; 
    let loginWindow = null; 
    let aboutWindow = null;
    let optionsWindow = null;
    let appearanceWindow = null;
    let equalizerWindow = null;
    let isPlaying = false; 
    let cfg = loadConfig();

    app.on('second-instance', (event, commandLine) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            const url = commandLine.find(arg => arg.startsWith('enhancedmusic://'));
            if (url) loadDeepLink(url);
        }
    });

    if (cfg.theme_mode === 'dark') nativeTheme.themeSource = 'dark';
    else if (cfg.theme_mode === 'light') nativeTheme.themeSource = 'light';
    else nativeTheme.themeSource = 'system';

    //HELPER FUNCTIONS
    function getIcon(name) {
    const iconPath = path.join(__dirname, 'assets', `${name}.png`);

    if (!fs.existsSync(iconPath)) {
        console.warn('Missing icon:', iconPath);
        return nativeImage.createEmpty(); 
    }

    return nativeImage.createFromPath(iconPath).resize({ width: 32, height: 32 });
}

    function loadDeepLink(deepLink) {
        let targetUrl = deepLink.replace('enhancedmusic://', 'https://');
        targetUrl = targetUrl.replace(/([^:]\/)\/+/g, "$1");
        if (targetUrl.includes('music.youtube.com')) mainWindow.loadURL(targetUrl);
    }

    //UPDATE CHECKER
    async function checkForUpdates() {
        try {
            const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
            if (!response.ok) return;
            const data = await response.json();
            const latestVersion = data.tag_name.replace('v', '');
            const currentVersion = app.getVersion();

            
            if (latestVersion !== currentVersion && latestVersion > currentVersion) {
                const { response } = await dialog.showMessageBox({
                    type: 'info',
                    buttons: ['Download Update', 'Later'],
                    title: 'Update Available',
                    message: `A new version (${latestVersion}) is available.`,
                    detail: `You are currently on v${currentVersion}. Would you like to download the update?`,
                    icon: path.join(__dirname, 'icon.png')
                });

                if (response === 0) {
                    shell.openExternal(data.html_url); 
                }
            }
        } catch (e) {
            console.log("Update check skipped:", e.message);
        }
    }

    function injectTheme() {
        if (!mainWindow) return;

        // 1. Determine if we are in Dark or Light mode
        let isDark = true;
        if (cfg.theme_mode === 'light') {
            isDark = false;
        } else if (cfg.theme_mode === 'system') {
            isDark = nativeTheme.shouldUseDarkColors;
        }

        if (!isDark) {
            // ===============================================
            // LIGHT MODE LOGIC
            // ===============================================
            
            // 1. Change Title Bar to WHITE with BLACK buttons
            try {
                mainWindow.setTitleBarOverlay({
                    color: '#ffffff',       // Background of title bar
                    symbolColor: '#000000'  // Color of Min/Max/Close icons
                });
                mainWindow.setBackgroundColor('#ffffff'); // Prevents black flashes on resize
            } catch(e) {}

            // 2. Load light-mode.css
            const lightCssPath = path.join(__dirname, 'light-mode.css');
            fs.readFile(lightCssPath, 'utf8', (err, data) => {
                if (err) {
                    console.error("Failed to load light-mode.css:", err);
                    return;
                }
                mainWindow.webContents.insertCSS(data).catch(e => console.error(e));
            });

        } else {
            // ===============================================
            // DARK / OLED MODE LOGIC
            // ===============================================

            // 1. Change Title Bar to BLACK with WHITE buttons
            try {
                mainWindow.setTitleBarOverlay({
                    color: '#000000',       // Background of title bar
                    symbolColor: '#ffffff'  // Color of Min/Max/Close icons
                });
                mainWindow.setBackgroundColor('#000000'); // Prevents white flashes
            } catch(e) {}

            // 2. Calculate Accent
            let accent = cfg.text_color || "#ff0000";
            if (cfg.sync_theme && process.platform === 'win32') {
                let sysColor = systemPreferences.getAccentColor(); 
                if (sysColor && sysColor.substring(0, 6) !== "000000") {
                    accent = '#' + sysColor.substring(0, 6);
                }
            }

            // 3. Inject Dynamic CSS
            try {
                const css = getThemeCss(cfg, accent, true);
                mainWindow.webContents.insertCSS(css).catch(e => console.error(e));
                mainWindow.webContents.executeJavaScript(getThemeJs(accent)).catch(e => {});
            } catch (error) {
                console.error("Theme Generation Error:", error);
            }
        }
    }

    function openLoginWindow(targetUrl) {
        if (loginWindow) { loginWindow.focus(); return; }
        loginWindow = new BrowserWindow({
            width: 500, height: 700, title: "Sign In", parent: mainWindow, modal: true,
            icon: path.join(__dirname, 'icon.ico'),
            webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: false }
        });
        loginWindow.webContents.setUserAgent(USER_AGENT_MOBILE);
        loginWindow.setMenu(null);
        loginWindow.loadURL(targetUrl);
        loginWindow.webContents.on('did-navigate', (event, url) => {
            const isHome = url === 'https://music.youtube.com/' || url === 'https://m.music.youtube.com/' || url.startsWith('https://music.youtube.com/?') || url.startsWith('https://m.music.youtube.com/?');
            if (isHome && !url.includes('login') && !url.includes('account')) {
                setTimeout(() => { if (loginWindow) { loginWindow.close(); mainWindow.reload(); } }, 1500);
            }
        });
        loginWindow.on('closed', () => { loginWindow = null; });
    }

    function createPopup(file, width, height, title) {
        const win = new BrowserWindow({
            width, height, title, parent: mainWindow, modal: true, autoHideMenuBar: true, resizable: false,
            backgroundColor: '#000000', webPreferences: { nodeIntegration: true, contextIsolation: false },
            icon: path.join(__dirname, 'icon.ico')
        });
        win.setMenu(null); win.loadFile(file); return win;
    }

    function createSplash() {
        splashWindow = new BrowserWindow({
            width: 300, height: 300, transparent: true, frame: false, alwaysOnTop: true, hasShadow: false,
            resizable: true, icon: path.join(__dirname, 'icon.ico'), webPreferences: { nodeIntegration: false }
        });
        splashWindow.loadFile('splash.html');
        splashWindow.center();
    }

    function updateThumbar() {
        if (!mainWindow) return;
        if (process.platform !== 'win32') return;

        const buttons = [
            {
                tooltip: 'Previous',
                icon: getIcon('previous'),
                click: () => {
                    // FIXED: Click the UI button, not the hidden player button
                    mainWindow.webContents.executeJavaScript("document.querySelector('.previous-button').click()");
                },
                flags: ['dismissonclick']
            },
            {
                tooltip: isPlaying ? 'Pause' : 'Play',
                icon: isPlaying ? getIcon('pause') : getIcon('play'),
                click: () => {
                    // FIXED: Click the main Play/Pause button
                    mainWindow.webContents.executeJavaScript("document.querySelector('#play-pause-button').click()");
                },
                flags: ['dismissonclick']
            },
            {
                tooltip: 'Next',
                icon: getIcon('next'),
                click: () => {
                    // FIXED: Click the UI button
                    mainWindow.webContents.executeJavaScript("document.querySelector('.next-button').click()");
                },
                flags: ['dismissonclick']
            }
        ];
        try { mainWindow.setThumbarButtons(buttons); } catch(e) {}
    }

    function showMenu() {
        const template = [
            { label: 'Appearance', click: () => mainWindow.emit('open-appearance') },
            { label: 'Options', click: () => mainWindow.emit('open-options') },
            { label: 'About', click: () => mainWindow.emit('open-about') },
            { type: 'separator' },
            { label: 'Restart App', click: () => { app.relaunch(); app.exit(); } },
            { label: 'Quit', role: 'quit' }
        ];
        const menu = Menu.buildFromTemplate(template);
        menu.popup(mainWindow);
    }

    app.whenReady().then(async () => {
        if (cfg.show_splash) createSplash();
        checkForUpdates();

        session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
            delete details.requestHeaders['Sec-CH-UA'];
            delete details.requestHeaders['Sec-CH-UA-Mobile'];
            delete details.requestHeaders['Sec-CH-UA-Platform'];
            delete details.requestHeaders['Sec-CH-UA-Model'];
            callback({ cancel: false, requestHeaders: details.requestHeaders });
        });


        mainWindow = new BrowserWindow({
            width: 1280, height: 720, title: "EnhancedTube", show: false,
            backgroundColor: cfg.oled ? '#000000' : '#0f0f0f',
            frame: true,
            icon: path.join(__dirname, 'icon.ico'),
            titleBarStyle: 'hidden',
            titleBarOverlay: {
            color: '#000000',      
            symbolColor: '#ffffff', 
            height: 20,
            sandbox: false              
            },
            webPreferences: { nodeIntegration: false, contextIsolation: true ,preload: path.join(__dirname, 'preload.js')},
            alwaysOnTop: cfg.always_on_top || false,
        });
        mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.destroy();
        });
        
        mainWindow.webContents.session.webRequest.onHeadersReceived(
    { urls: ['*://*.googlevideo.com/*'] },
    (details, callback) => {
        const responseHeaders = Object.assign({}, details.responseHeaders);

        // 1. REMOVE existing CORS headers to prevent conflicts
        // (Google sends its own, we must delete them to replace them)
        const keysToRemove = [
            'access-control-allow-origin',
            'access-control-allow-credentials',
            'access-control-allow-methods',
            'access-control-allow-headers'
        ];

        Object.keys(responseHeaders).forEach((header) => {
            if (keysToRemove.includes(header.toLowerCase())) {
                delete responseHeaders[header];
            }
        });

        // 2. SET the correct headers for Authenticated Requests
        // We MUST match the origin exactly. Wildcard '*' is illegal here.
        responseHeaders['Access-Control-Allow-Origin'] = ['https://music.youtube.com'];
        responseHeaders['Access-Control-Allow-Credentials'] = ['true'];
        
        // Optional: Allow common headers just in case
        responseHeaders['Access-Control-Allow-Headers'] = ['*'];
        responseHeaders['Access-Control-Allow-Methods'] = ['GET, HEAD, POST, OPTIONS'];

        callback({ 
            responseHeaders: responseHeaders,
            statusLine: details.statusLine 
        });
    }
);

        mainWindow.webContents.setUserAgent(USER_AGENT_DESKTOP);
        app.setLoginItemSettings({ openAtLogin: cfg.start_on_boot || false, path: app.getPath('exe') });
        Menu.setApplicationMenu(mainMenu);

        let startUrl = 'https://music.youtube.com';
        if (process.platform === 'win32' && process.argv.length >= 2) {
            const deepLink = process.argv.find(arg => arg.startsWith('enhancedmusic://'));
            if (deepLink) startUrl = deepLink.replace('enhancedmusic://', 'https://');
        }
        mainWindow.loadURL(startUrl);

        mainWindow.once('ready-to-show', () => {
            if (splashWindow && !splashWindow.isDestroyed()) splashWindow.close();
            mainWindow.show();
        });

        mainWindow.webContents.once('did-finish-load', () => {
           if (splashWindow && !splashWindow.isDestroyed()) splashWindow.close();
           if (!mainWindow.isVisible()) mainWindow.show();
           injectTheme(); updateThumbar();
        });

        mainWindow.webContents.on('will-navigate', (event, url) => {
            if (url.includes('/et-menu')) { event.preventDefault(); showMenu(); return; }
            const isGoogle = url.includes('accounts.google.com') || url.includes('accounts.youtube.com');
            const isSession = url.toLowerCase().match(/(logout|signout|setsid|clearsid)/);
            if (isGoogle && !isSession) { event.preventDefault(); openLoginWindow(url); }
        });

        mainWindow.webContents.setWindowOpenHandler(({ url }) => {
            const isGoogle = url.includes('accounts.google.com') || url.includes('accounts.youtube.com');
            const isSession = url.toLowerCase().match(/(logout|signout|setsid|clearsid)/);
            if (isGoogle && !isSession) { openLoginWindow(url); return { action: 'deny' }; }
            if (url.includes('youtube.com/redirect') || (!url.includes('youtube.com') && !url.includes('youtu.be'))) { shell.openExternal(url); return { action: 'deny' }; }
            return { action: 'allow' };
        });

        mainWindow.webContents.on('did-finish-load', () => { injectTheme(); updateThumbar(); });

        setInterval(async () => {
            if (!mainWindow || mainWindow.isDestroyed()) return;
            try {
                const playing = await mainWindow.webContents.executeJavaScript(
                    `!!(document.querySelector('video') && !document.querySelector('video').paused && !document.querySelector('video').ended)`
                );
                
                if (playing !== isPlaying) {
                    isPlaying = playing;
                    updateThumbar();
                }
            } catch (e) {}
        }, 500);

        mainWindow.on('open-equalizer', () => { 
            if (equalizerWindow) {
                equalizerWindow.focus();
                return;
            }

            equalizerWindow = new BrowserWindow({
                width: 400,
                height: 500,
                title: "Equalizer",
                parent: mainWindow, // floats on top of main window
                modal: false,       // false = you can still click the main window
                icon: path.join(__dirname, 'icon.ico'),
                autoHideMenuBar: true,
                backgroundColor: '#121212',
                resizable: false,
                minimizable: false,
                webPreferences: {
                    nodeIntegration: true,   // Needed for the EQ HTML script
                    contextIsolation: false  // Simplifies communication for this popup
                }
            });

            equalizerWindow.loadFile('equalizer.html');
            equalizerWindow.setMenu(null);
            
            equalizerWindow.on('closed', () => {
                equalizerWindow = null;
            });
        });

        nativeTheme.on('updated', () => { if (cfg.theme_mode === 'system') injectTheme(); });
        mainWindow.on('open-appearance', () => { 
            if (appearanceWindow) appearanceWindow.focus(); 
            else { appearanceWindow = createPopup('appearance.html', 400, 600, 'Appearance'); appearanceWindow.on('closed', () => appearanceWindow = null); }
        });
        mainWindow.on('open-options', () => { 
            if (optionsWindow) optionsWindow.focus(); 
            else { optionsWindow = createPopup('options.html', 450, 650, 'Options'); optionsWindow.on('closed', () => optionsWindow = null); }
        });
        mainWindow.on('open-about', () => { 
            if (aboutWindow) aboutWindow.focus(); 
            else { aboutWindow = createPopup('about.html', 400, 400, 'About'); aboutWindow.on('closed', () => aboutWindow = null); }
        });
        mainWindow.on('closed', () => { appearanceWindow = null; optionsWindow = null; aboutWindow = null; });
    });

    ipcMain.handle('get-system-accent', () => {
        if (process.platform === 'win32') {
            let color = systemPreferences.getAccentColor();
            if (color && color.substring(0, 6) !== "000000") return '#' + color.substring(0, 6);
        }
        return '#ff0000'; 
    });

    ipcMain.on('save-appearance', (event, newCfg) => {
        cfg = { ...cfg, ...newCfg };
        saveConfig(cfg);
        if (cfg.theme_mode === 'dark') nativeTheme.themeSource = 'dark';
        else if (cfg.theme_mode === 'light') nativeTheme.themeSource = 'light';
        else nativeTheme.themeSource = 'system';
        if (mainWindow) {
            mainWindow.setAlwaysOnTop(cfg.always_on_top || false);
            mainWindow.reload(); 
        }
        app.setLoginItemSettings({ openAtLogin: cfg.start_on_boot || false, path: app.getPath('exe') });
    });

    ipcMain.on('get-config', (event) => { event.returnValue = cfg; });
    app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

    ipcMain.on('show-context-menu', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    mainMenu.popup({ window: win });
    });
    ipcMain.on('eq-update', (event, gains) => {
    console.log("1. App.js received EQ update:", gains); // <--- DEBUG LOG

    // Save config
    if (cfg) {
        cfg.eq_settings = gains;
        saveConfig(cfg);
    }

    // Check if mainWindow exists
    if (mainWindow && !mainWindow.isDestroyed()) {
        console.log("2. Forwarding to Main Window..."); // <--- DEBUG LOG
        mainWindow.webContents.send('apply-eq', gains);
    } else {
        console.log("ERROR: Main Window is missing or destroyed!");
    }
});

    // 2. Allow Equalizer Window to request current settings on startup
    ipcMain.handle('get-eq-settings', () => {
        // Return saved settings or a default "Flat" EQ
        return cfg.eq_settings || [0,0,0,0,0,0,0,0,0,0];
    });
    ipcMain.on('save-options', (event, newOptions) => {
        // 1. Merge new options into existing config
        cfg = { ...cfg, ...newOptions };
        saveConfig(cfg);

        // 2. Apply settings immediately where possible
        if (mainWindow) {
            mainWindow.setAlwaysOnTop(cfg.always_on_top || false);
        }

        // 3. Handle "Start on Boot" logic
        app.setLoginItemSettings({ 
            openAtLogin: cfg.start_on_boot || false, 
            path: app.getPath('exe') 
        });

        // 4. Send success signal back (optional, allows window to close itself)
        // usually the window closes itself after sending, so we don't strictly need to reply
        console.log("Options saved:", newOptions);
    });
}