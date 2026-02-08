const { ipcRenderer } = require('electron');

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
});