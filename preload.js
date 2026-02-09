const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. THEME LOGIC: Fetch Config & Determine Colors ---
    let cfg = {};
    try {
        cfg = ipcRenderer.sendSync('get-config');
    } catch (e) { console.error("Could not fetch config:", e); }

    const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDark = true; 

    if (cfg.theme_mode === 'light') isDark = false;
    else if (cfg.theme_mode === 'system') isDark = isSystemDark;

    const barBg = isDark ? '#000000' : '#ffffff';
    const barText = isDark ? '#ffffff' : '#000000';
    const barBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)';

    // --- 1. Custom Title Bar ---
    const titleBar = document.createElement('div');
    titleBar.id = 'title-bar'; 
    titleBar.style.cssText = `
        width: 100%;
        height: 32px;
        background: ${barBg};
        display: flex;
        align-items: center;
        padding-left: 10px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999999;
        -webkit-app-region: drag;
        border-bottom: ${barBorder};
        transition: background 0.3s ease;
    `;

    const menuBtn = document.createElement('button');
    menuBtn.innerText = 'Enhanced Music';
    menuBtn.id = 'menu-btn';
    menuBtn.style.cssText = `
        background: transparent;
        color: ${barText};
        border: none;
        cursor: pointer;
        font-family: 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        font-weight: 600;
        -webkit-app-region: no-drag;
        padding: 5px 10px;
        margin-right: 10px;
        opacity: 0.9;
    `;
    
    menuBtn.onclick = () => {
        ipcRenderer.send('show-context-menu');
    };

    titleBar.appendChild(menuBtn);
    document.body.prepend(titleBar);

    // =========================================================
    // AUDIO ENGINE LOGIC
    // =========================================================
    let audioContext = null;
    let source = null;
    let eqBands = [];
    const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

    function findVideoRecursive(root) {
        if (!root) return null;
        let video = root.querySelector('video');
        if (video) return video;

        const children = root.querySelectorAll('*');
        for (const child of children) {
            if (child.shadowRoot) {
                const found = findVideoRecursive(child.shadowRoot);
                if (found) return found;
            }
        }
        return null;
    }

    function initEqualizer() {
        if (audioContext && eqBands.length > 0) return;

        const videoElement = findVideoRecursive(document.body);
        if (!videoElement) {
            return;
        }

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            
            source = audioContext.createMediaElementSource(videoElement);

            eqBands = frequencies.map(freq => {
                const filter = audioContext.createBiquadFilter();
                filter.type = 'peaking';
                filter.frequency.value = freq;
                filter.Q.value = 1.4;
                filter.gain.value = 0;
                return filter;
            });

            let previousNode = source;
            eqBands.forEach(band => {
                previousNode.connect(band);
                previousNode = band;
            });
            previousNode.connect(audioContext.destination);

            console.log("%c EQ ATTACHED SUCCESSFULLY! ", "background: #00ff00; color: black; font-weight: bold; padding: 4px;");

        } catch (e) {
            console.error("EQ Connection Error:", e);
        }
    }

    // --- 3. STARTUP LOOP & AUTO-LOAD SAVE ---
    const checkInterval = setInterval(() => {
        if (eqBands.length > 0) {
            // Engine is ready! Stop checking.
            clearInterval(checkInterval);
            
            // FIX: FETCH AND APPLY SAVED SETTINGS AUTOMATICALLY
            ipcRenderer.invoke('get-eq-settings').then(savedGains => {
                if (savedGains && savedGains.length) {
                    console.log("Applying saved EQ settings:", savedGains);
                    updateGains(savedGains);
                }
            });

        } else {
            initEqualizer();
        }
    }, 1000);

    // 4. THE CONTROL FUNCTION
    function updateGains(gains) {
        if (!eqBands.length) {
            // If the user tries to set EQ before music starts, we try to init
            initEqualizer();
            return;
        }

        // Resume AudioContext if browser policy suspended it
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        gains.forEach((db, index) => {
            if (eqBands[index]) {
                eqBands[index].gain.setTargetAtTime(db, audioContext.currentTime, 0.1);
            }
        });
    }

    // 5. EXPOSE TO MAIN WORLD
    contextBridge.exposeInMainWorld('enhancedAudio', {
        setEQ: (gains) => updateGains(gains)
    });

    ipcRenderer.on('apply-eq', (event, gains) => {
        if (window.enhancedAudio) {
            window.enhancedAudio.setEQ(gains);
        } else {
            updateGains(gains); 
        }
    });

    // --- FIX TIME BUBBLE TEXT COLOR (Shadow DOM Injection) ---
    setInterval(() => {
        const slider = document.querySelector('ytmusic-player-bar tp-yt-paper-slider');
        if (slider && slider.shadowRoot) {
            if (!slider.shadowRoot.querySelector('#force-pin-black')) {
                const style = document.createElement('style');
                style.id = 'force-pin-black';
                style.textContent = `
                    .slider-knob-inner {
                        color: #000000 !important;
                        --paper-slider-font-color: #000000 !important;
                    }
                    .slider-knob-inner::after {
                        color: #000000 !important;
                    }
                `;
                slider.shadowRoot.appendChild(style);
            }
        }
    }, 1000);
});