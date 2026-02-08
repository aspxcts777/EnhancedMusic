const {contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    // 1. Create the Custom Title Bar Container
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
        width: 100%;
        height: 32px; /* Matches your CSS offset */
        background: #000000; 
        display: flex;
        align-items: center;
        padding-left: 10px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999999; /* Higher than everything */
        -webkit-app-region: drag; /* Makes it draggable */
        border-bottom: 1px solid rgba(255,255,255,0.1);
    `;

    // 2. Create the "Menu" Button
    const menuBtn = document.createElement('button');
    menuBtn.innerText = 'Enhanced Music';
    menuBtn.style.cssText = `
        background: transparent;
        color: white;
        border: none;
        cursor: pointer;
        font-family: Roboto, sans-serif;
        font-size: 13px;
        font-weight: 500;
        -webkit-app-region: no-drag; /* Buttons must be CLICKABLE, not draggable */
        padding: 5px 10px;
        margin-right: 10px;
        opacity: 0.9;
    `;
    
    // 3. When clicked, signal the Main Process
    menuBtn.onclick = () => {
        ipcRenderer.send('show-context-menu');
    };

    // 4. Inject into the page
    titleBar.appendChild(menuBtn);
    document.body.prepend(titleBar);

    let audioContext = null;
let source = null;
let eqBands = [];
const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

// 1. DEEP SEARCH HELPER (Drills through Shadow DOM)
function findVideoRecursive(root) {
    if (!root) return null;
    let video = root.querySelector('video');
    if (video) return video;

    // Check all children for Shadow Roots
    const children = root.querySelectorAll('*');
    for (const child of children) {
        if (child.shadowRoot) {
            const found = findVideoRecursive(child.shadowRoot);
            if (found) return found;
        }
    }
    return null;
}

// 2. INITIALIZE ENGINE
function initEqualizer() {
    if (audioContext && eqBands.length > 0) return; // Already running

    // Use deep search to find the player
    const videoElement = findVideoRecursive(document.body);

    if (!videoElement) {
        console.log("EQ: Waiting for video player...");
        return;
    }

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        
        // Connect to YouTube's video element
        source = audioContext.createMediaElementSource(videoElement);

        // Create the 10 Bands
        eqBands = frequencies.map(freq => {
            const filter = audioContext.createBiquadFilter();
            filter.type = 'peaking';
            filter.frequency.value = freq;
            filter.Q.value = 1.4;
            filter.gain.value = 0;
            return filter;
        });

        // Connect Chain: Source -> Bands -> Destination
        let previousNode = source;
        eqBands.forEach(band => {
            previousNode.connect(band);
            previousNode = band;
        });
        previousNode.connect(audioContext.destination);

        console.log("%c EQ ATTACHED SUCCESSFULLY! ", "background: #00ff00; color: black; font-weight: bold; padding: 4px;");

    } catch (e) {
        console.error("EQ Connection Error (Check CORS settings in main.js):", e);
    }
}

// 3. AGGRESSIVE SEARCH LOOP
// We check every second until we find the video.
const checkInterval = setInterval(() => {
    if (eqBands.length > 0) {
        clearInterval(checkInterval); // Stop searching once found
    } else {
        initEqualizer();
    }
}, 1000);

// 4. THE CONTROL FUNCTION
function updateGains(gains) {
    if (!eqBands.length) {
        console.warn("EQ Not Ready: Still looking for video player. Ensure music is loaded.");
        initEqualizer();
        return;
    }

    // Resume if browser paused it (Autoplay Policy)
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
// This allows you to use 'window.enhancedAudio.setEQ(...)'
contextBridge.exposeInMainWorld('enhancedAudio', {
    setEQ: (gains) => updateGains(gains)
});

ipcRenderer.on('apply-eq', (event, gains) => {
    
    // Send to the audio engine we built earlier
    if (window.enhancedAudio) {
        window.enhancedAudio.setEQ(gains);
    } else {
        updateGains(gains); 
    }
});

});