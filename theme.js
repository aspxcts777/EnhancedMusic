
module.exports.getThemeCss = (cfg, accent, isDark) => {
    
    // 1. DEFINE COLORS
    const bgMain = isDark ? "#0f0f0f" : "#ffffff";
    const bgSecond = isDark ? "#0f0f0f" : "#ffffff"; 
    const textMain = isDark ? "#ffffff" : "#0f0f0f";
    
    // --- MODE 1: STANDARD (Non-OLED) ---
    if (!cfg.oled) {
        return `
            html, body, :root, ytmusic-app {
    /* Main Accent Variables */
    --ytmusic-color-white1: #ffffff !important;
    --ytmusic-brand-background-solid: ${bgSecond} !important;
    
    /* Force Polymer Sliders (Volume & Progress) to use accent */
    --paper-slider-active-color: ${accent} !important;
    --paper-slider-knob-color: ${accent} !important;
    --paper-slider-knob-start-color: ${accent} !important;
    --paper-slider-knob-start-border-color: ${accent} !important;
    
    /* Toggle Switches (Settings) */
    --ytmusic-setting-item-toggle-active: ${accent} !important;
    
    /* Links & Buttons */
    --ytmusic-detail-header: ${accent} !important;
    --ytmusic-play-button-icon-color: #ffffff !important; 
}

ytmusic-nav-bar .logo,
ytmusic-nav-bar #logo,
ytmusic-logo {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    width: 0px !important;
    margin-right: 0px !important;
}

/* B. TOP BAR / NAVIGATION */
ytmusic-nav-bar,
--ytmusic-search-background: #000000 !important;
ytmusic-app-layout > ytmusic-nav-bar {
    background: ${bgSecond} !important;
    background-color: ${bgSecond} !important;
    border-bottom: 1px solid ${bgSecond} !important; /* Removes the ugly line */
    box-shadow: none !important; /* Removes default shadow */
}

/* 2. Override the variable controls (Double check) */
html, body, ytmusic-app {
    --ytmusic-nav-bar-background: ${bgSecond} !important;
    --ytmusic-nav-bar-stuck-background: ${bgSecond} !important;
}

/* 3. Fix the Search Box so it doesn't look like a "hole" */
/* We give it a slight semi-transparent tint so it works on ANY background color */
ytmusic-search-box,
.search-box.ytmusic-search-box {
    background: rgba(255, 255, 255, 0.07) !important; 
    border-radius: 8px !important;
}

/* 4. Fix the Search Input Field Text Color */
ytmusic-search-box input {
    color: var(--ytmusic-text-primary) !important;
    font-weight: 500 !important;
}

/* C. PLAYER PROGRESS BAR & VOLUME */
/* The main scrubber bar */
#progress-bar.ytmusic-player-bar {
    --paper-slider-active-color: ${accent} !important;
    --paper-slider-knob-color: ${accent} !important;
    --paper-slider-container-color: rgba(255,255,255,0.2) !important;
}

/* The Volume Slider */
#volume-slider {
    --paper-slider-active-color: ${accent} !important;
    --paper-slider-knob-color: ${accent} !important;
}

yt-icon,
yt-icon svg,
tp-yt-paper-icon-button,
tp-yt-paper-icon-button yt-icon {
    color: ${accent} !important;
    fill: ${accent} !important;
}

/* D. PLAY BUTTONS (FAB & HOVER) */
/* The big Play button on Album/Playlist pages */
.play-button.ytmusic-detail-header-renderer,
ytmusic-fab-renderer.ytmusic-detail-header-renderer,
#fab.ytmusic-detail-header-renderer {
    background-color: ${accent} !important;
    color: #ffffff !important;
}

/* The Play/Pause button inside the bottom player bar */
ytmusic-player-bar #play-pause-button {
    background: ${accent} !important;
    border-radius: 50% !important;
    color: #ffffff !important;
    box-shadow: 0 0 10px ${accent}40; /* Optional: adds a slight glow */
}
/* Fix icon color inside the player button */
ytmusic-player-bar #play-pause-button path {
    fill: #ffffff !important;
}

/* Overlay Play Button (hovering over tracks/albums) */
ytmusic-play-button-renderer {
    --ytmusic-play-button-icon-color: ${accent} !important;
    --ytmusic-play-button-background-color: #00000000 !important; 
    /* OR invert it: background ${accent}, icon white */
}

/* E. BADGES & ICONS */
/* "Live" Badge */
ytmusic-badge-renderer.live-badge {
    color: ${accent} !important;
    border-color: ${accent} !important;
}

/* Explicit "E" Badge */
yt-icon.ytmusic-inline-badge-renderer {
    fill: ${accent} !important;
    color: ${accent} !important;
}

/* F. LOGO RECOLOR (Top Left) */
/* This targets the circle part of the logo */
ytmusic-nav-bar #logo svg g > path:nth-child(1) {
    fill: ${accent} !important;
}
/* This targets the triangle (play symbol) in the logo */
ytmusic-nav-bar #logo svg g > path:nth-child(2) {
    fill: #ffffff !important; /* Keep the triangle white */
}

/* G. MISC / SCROLLBARS */
/* Custom Scrollbar to match */
::-webkit-scrollbar-thumb {
    background: ${accent} !important;
    border-radius: 10px;
}
::-webkit-scrollbar-track {
    background: ${bgSecond} !important;
}

/* Loading Spinner (The red circular loader) */
paper-spinner-lite {
    --paper-spinner-color: ${accent} !important;
}

/* Active Sidebar Items (Left Menu) */
ytmusic-guide-entry-renderer[active] .guide-icon {
    color: ${accent} !important;
}
ytmusic-guide-entry-renderer[active] .title {
    color: ${accent} !important;
    font-weight: 700 !important;
}
            }
        `;
    }

    // --- MODE 2: OLED (Pure Black) ---
    return `
   /* =========================
   1. OLED VARIABLES
   ========================= */
html, body, :root, ytmusic-app {
    --ytmusic-background: #000000 !important;
    --ytmusic-brand-background-solid: #000000 !important;
    --ytmusic-general-background-a: #000000 !important;
    --ytmusic-general-background-c: #000000 !important;
    --ytmusic-search-background: #000000 !important;
    --ytmusic-content-background: #000000 !important;

    /* Accent */
    --paper-slider-active-color: ${accent} !important;
    --paper-slider-knob-color: ${accent} !important;
    --paper-slider-knob-start-color: ${accent} !important;
    --paper-slider-knob-start-border-color: ${accent} !important;
    --ytmusic-setting-item-toggle-active: ${accent} !important;
    --ytmusic-detail-header: ${accent} !important;
    --ytmusic-play-button-icon-color: #ffffff !important;
}
    ytmusic-nav-bar #logo svg g > path:nth-child(1) {
    fill: ${accent} !important;
}

/* 2. The Inner Triangle (Keep it White for contrast) */
ytmusic-nav-bar #logo svg g > path:nth-child(2) {
    fill: #ffffff !important;
}

/* 3. The "Music" Text (Optional: Keep it white) */
/* Paths 3+ are usually the letters. We ensure they stay white. */
ytmusic-nav-bar #logo svg g > path:nth-child(n+3) {
    fill: #ffffff !important;
}

/* =========================
   2. KILL AMBIENT MODE (SAFE WAY)
   ========================= */
.background-gradient {
    background: #000000 !important;
    background-image: none !important;
}

/* =========================
   3. FORCE TRUE OLED AFTER AMBIENT
   ========================= */
ytmusic-app,
ytmusic-app-layout,
ytmusic-browse-response {
    background-color: #000000 !important;
}

/* =========================
   4. TOP BAR
   ========================= */
yt-page-navigation-progress {
    /* 1. Force the container to be visible */
    display: block !important;
    opacity: 1 !important;
    z-index: 99999 !important;
    
    /* 2. Override the variables YouTube uses for this specific component */
    --yt-spec-static-brand-red: ${accent} !important;
    --yt-spec-brand-background-solid: ${accent} !important;
    --yt-progress-bar-color: ${accent} !important;
}

/* B. TARGET THE INNER BAR DIRECTLY */
yt-page-navigation-progress #progress,
yt-page-navigation-progress .id-progress {
    /* 3. Force the background color on the moving element */
    background: ${accent} !important;
    background-color: ${accent} !important;
    
    /* 4. Ensure no gradients or images interfere */
    background-image: none !important;
    
    /* 5. Thickness */
    height: 3px !important;
}
    yt-icon,
yt-icon svg,
tp-yt-paper-icon-button,
tp-yt-paper-icon-button yt-icon {
    color: ${accent} !important;
    fill: ${accent} !important;
}
    /* Sidebar icons (Home / Explore / Library) */
ytd-guide-entry-renderer yt-icon,
ytmusic-guide-entry-renderer yt-icon {
    color: ${accent} !important;
    fill: ${accent} !important;
}

/* Active sidebar item (stronger emphasis) */
ytd-guide-entry-renderer[active] yt-icon,
ytmusic-guide-entry-renderer[active] yt-icon {
    color: ${accent} !important;
    fill: ${accent} !important;
}

/* Top bar action icons (menu, cast, more) */
ytd-masthead yt-icon,
ytmusic-nav-bar yt-icon {
    color: ${accent} !important;
    fill: ${accent} !important;
}

/* Player controls (like, shuffle, repeat, next, prev) */
ytmusic-player-bar yt-icon,
ytmusic-player-bar tp-yt-paper-icon-button {
    color: ${accent} !important;
    fill: ${accent} !important;
}

/* Explicit SVG paths fallback */
yt-icon svg path {
    fill: ${accent} !important;
}

/* C. NAVIGATION BAR BACKGROUND (Black) */
ytmusic-nav-bar,
ytmusic-app-layout > ytmusic-nav-bar {
    background: #000000 !important;
    border-bottom: 1px solid #000000 40 !important; /* Accent border */
    box-shadow: none !important;
}

/* D. SEARCH BAR FIXES */
ytmusic-search-box {
    background: rgba(255,255,255,0.1) !important;
    border-radius: 8px !important;
}

/* =========================
   5. SEARCH BOX
   ========================= */
ytmusic-search-box,
.search-box.ytmusic-search-box {
    background: rgba(255,255,255,0.08) !important;
    border-radius: 8px !important;
}

ytmusic-search-box input {
    color: var(--ytmusic-text-primary) !important;
}

/* =========================
   6. PLAYER SLIDERS
   ========================= */
#progress-bar.ytmusic-player-bar,
#volume-slider {
    --paper-slider-active-color: ${accent} !important;
    --paper-slider-knob-color: ${accent} !important;
    --paper-slider-container-color: rgb(0, 0, 0) !important;
}

/* =========================
   7. PLAY BUTTONS
   ========================= */
ytmusic-player-bar #play-pause-button {
    background: ${accent} !important;
    border-radius: 50% !important;
    color: #ffffff !important;
}

ytmusic-player-bar #play-pause-button path {
    fill: #ffffff !important;
}

/* =========================
   8. SIDEBAR ACTIVE
   ========================= */
ytmusic-guide-entry-renderer[active] .guide-icon,
ytmusic-guide-entry-renderer[active] .title {
    color: ${accent} !important;
    font-weight: 700 !important;
}

/* =========================
   9. SCROLLBAR + LOADER
   ========================= */
::-webkit-scrollbar-thumb {
    background: ${accent} !important;
}

paper-spinner-lite {
    --paper-spinner-color: ${accent} !important;
}
    /* =========================
   REMOVE SIDEBAR SEPARATOR
   ========================= */
ytmusic-guide-renderer,
#guide-wrapper,
#guide-content {
    border-right: none !important;
    box-shadow: none !important; /* Just in case it's a shadow */
}
ytmusic-guide-section-renderer {
    border-bottom: none !important;
}

/* Removes any specific separator elements if they exist */
ytmusic-guide-renderer #separator {
    display: none !important;
}
ytmusic-guide-renderer #divider,
ytmusic-guide-renderer .separator,
ytmusic-guide-section-renderer #separator {
    display: none !important;
    visibility: hidden !important;
    background: transparent !important;
    height: 0px !important;
    border: none !important;
}
ytmusic-mini-guide-renderer #separator {
    display: none !important;
}
ytmusic-mini-guide-renderer #divider,
ytmusic-mini-guide-renderer .separator,
ytmusic-mini-guide-section-renderer #separator {
    display: none !important;
    visibility: hidden !important;
    background: transparent !important;
    height: 0px !important;
    border: none !important;
}
    ytmusic-mini-guide-renderer #separator {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

ytmusic-mini-guide-renderer #items {
    border-bottom: none !important;
}

ytmusic-mini-guide-signin-promo-renderer {
    border: none !important;
    margin-top: 0px !important; 
}

ytmusic-nav-bar .logo,
ytmusic-nav-bar #logo,
ytmusic-logo {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    width: 0px !important;
    margin-right: 0px !important;
}

    `;
};

module.exports.getThemeJs = (accent) => {
    return `
        (function() {
            // --- PART 1: THEME HUNTER (Fixes Red Colors) ---
            const accent = "${accent}";
            const targets = [
                "#progress.ytd-thumbnail-overlay-resume-playback-renderer",
                ".badge-shape-wiz--style-overlay", 
                "ytd-thumbnail-overlay-time-status-renderer[overlay-style='LIVE']",
                ".ytp-play-progress", 
                ".ytp-swatch-background-color",
                ".YtProgressBarLineProgressBarPlayed"
            ];

            function forceColor() {
                targets.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        if (el.style.backgroundColor !== accent) {
                            el.style.backgroundColor = accent;
                            el.style.background = accent;
                        }
                        if (selector.includes('badge')) el.style.color = "#ffffff";
                    });
                });
            }

            // --- PART 2: THE AD NUKE (Simple & No-Install) ---
            function nukeAds() {
                // 1. Click "Skip Ad" buttons immediately
                const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .videoAdUiSkipButton');
                if (skipBtn) { 
                    skipBtn.click(); 
                    console.log("Skipped Ad via Click");
                }

                // 2. Close overlay banners
                const overlayBtn = document.querySelector('.ytp-ad-overlay-close-button');
                if (overlayBtn) overlayBtn.click();

                // 3. Handle "Unskippable" Video Ads
                const video = document.querySelector('video');
                const adElement = document.querySelector('.ad-showing'); // YouTube class when ad is active
                
                if (adElement && video) {
                    // Force the video to the end
                    if (!isNaN(video.duration) && video.duration > 0) {
                        video.currentTime = video.duration; 
                    }
                    // Speed it up insanely fast just in case
                    video.playbackRate = 16.0;
                    video.muted = true; // Mute it so you don't hear the blip
                }
            }

            // Run both loops efficiently
            setInterval(() => {
                forceColor(); // Keep theme colors correct
                nukeAds();    // Keep ads away
            }, 50); // Checks 20 times per second

        })();
    `;
};