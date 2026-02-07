//1.2.1
const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const configPath = path.join(app.getPath('userData'), 'config.json');
console.log(configPath)
const defaults = {
    "bar_color": "#0f0f0f",
    "text_color": "#ff0000",
    "oled": true,
    "show_splash": false,
    "replace_shorts": false,
    "always_on_top": false,
    "start_on_boot": false,
    "enable_adblock": true,
    "show_splash": true,
    "use_av1": false,
    "UseSkiaRenderer": false,
    "use_vaapi": false,
    "force_angle_d3d11": false,
    "enable_gpu": false,
    "enable_zero_copy": false,
    "ignore_gpu_blocklist": false,
    "enable_quic": false
};

function loadConfig() {
    try {
        if (!fs.existsSync(configPath)) {
            saveConfig(defaults);
            return defaults;
        }
        return JSON.parse(fs.readFileSync(configPath));
    } catch (e) {
        return defaults;
    }
}

function saveConfig(data) {
    fs.writeFileSync(configPath, JSON.stringify(data, null, 4));
}

module.exports = { loadConfig, saveConfig };