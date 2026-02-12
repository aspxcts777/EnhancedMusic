
module.exports.getThemeCss = (cfg, accent, isDark) => {
    
    // 1. DEFINE COLORS
    const bgMain = isDark ? "#0f0f0f" : "#ffffff";
    const bgSecond = isDark ? "#0f0f0f" : "#ffffff"; 
    const textMain = isDark ? "#ffffff" : "#0f0f0f";
    
    // --- MODE 1: STANDARD (Non-OLED) ---
    if (!cfg.oled) {
        return `
           /* =========================
   1. NON-OLED VARIABLES (STANDARD DARK)
   ========================= */
html, body, :root, ytmusic-app {

    /* Accent */
    --paper-slider-active-color: ${accent} !important;
    --paper-slider-knob-color: ${accent} !important;
    --paper-slider-knob-start-color: ${accent} !important;
    --paper-slider-knob-start-border-color: ${accent} !important;
    --ytmusic-setting-item-toggle-active: ${accent} !important;
    --ytmusic-detail-header: ${accent} !important;
    --ytmusic-play-button-icon-color: #ffffff !important;
}



/* =========================
   4. TOP BAR
   ========================= */
yt-page-navigation-progress {
    display: block !important;
    opacity: 1 !important;
    z-index: 99999 !important;
    --yt-spec-static-brand-red: ${accent} !important;
    --yt-spec-brand-background-solid: ${accent} !important;
    --yt-progress-bar-color: ${accent} !important;
}

yt-page-navigation-progress #progress,
yt-page-navigation-progress .id-progress {
    background: ${accent} !important;
    background-color: ${accent} !important;
    background-image: none !important;
    height: 3px !important;
}

yt-icon,
yt-icon svg,
tp-yt-paper-icon-button,
tp-yt-paper-icon-button yt-icon {
    color: ${accent} !important;
    fill: ${accent} !important;
}

/* Sidebar icons */
ytd-guide-entry-renderer yt-icon,
ytmusic-guide-entry-renderer yt-icon {
    color: ${accent} !important;
    fill: ${accent} !important;
}

/* Active sidebar item */
ytd-guide-entry-renderer[active] yt-icon,
ytmusic-guide-entry-renderer[active] yt-icon {
    color: ${accent} !important;
    fill: ${accent} !important;
}

/* Top bar action icons */
ytd-masthead yt-icon,
ytmusic-nav-bar yt-icon {
    color: ${accent} !important;
    fill: ${accent} !important;
}

/* Player controls */
ytmusic-player-bar yt-icon,
ytmusic-player-bar tp-yt-paper-icon-button {
    color: ${accent} !important;
    fill: ${accent} !important;
}

yt-icon svg path {
    fill: ${accent} !important;
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
    --paper-slider-container-color: #212121 !important; /* Lighter gray track */
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
    box-shadow: none !important;
}
ytmusic-guide-section-renderer {
    border-bottom: none !important;
}

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

/* HIDE ORIGINAL LOGO */
ytmusic-nav-bar .logo,
ytmusic-nav-bar #logo,
ytmusic-logo {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    width: 0px !important;
    margin-right: 0px !important;
}

/* =========================
   LAYOUT FIXES (EXACT COPY)
   ========================= */

ytmusic-nav-bar,
ytmusic-app-layout > ytmusic-nav-bar {
    /* 1. POSITIONING */
    position: fixed !important;
    top: 32px !important;        /* Pushed down 32px */
    left: 0 !important;
    width: 100% !important;
    height: 64px !important;     /* Force standard height */
    z-index: 1000 !important;

    /* 2. THE BACKGROUND COLOR */
    /* We apply the color directly here so it moves WITH the bar */
    background: #000000 !important; /* Standard Dark Mode Color */
    background-color: #000000 !important;
    
    /* 3. CLEANUP */
    border-bottom: 1px solid rgba(255,255,255,0.1) !important; /* Optional separator line */
    box-shadow: none !important;
    margin-top: 0 !important;
}

/* 2. Push the Side Menu (Home/Explore) down */
ytmusic-guide-renderer,
#guide-wrapper {
    top: 24px !important; /* Kept your requested offset */
    height: calc(100vh - 96px) !important;
    z-index: 999 !important;
}

/* 3. Push the main scrolling content area down */
#browse-page,
ytmusic-browse-response {
    padding-top: 32px !important;
}

/* 4. Fix Search Suggestions Dropdown position */
ytmusic-search-box ytmusic-search-suggestions-section {
    top: 85px !important; 
}

/* 5. Additional Spacing for Sidebar Sections */
ytmusic-guide-section-renderer {
    margin-top: 30px !important;
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



            /* 1. Push the Search Bar / Header down */
            ytmusic-nav-bar,
            ytmusic-app-layout > ytmusic-nav-bar {
                top: 32px !important; /* Height of your custom bar */
                position: fixed !important;
                z-index: 1000 !important;
                width: 100% !important;
            }

            /* 2. Push the Side Menu (Home/Explore) down */
            /* 32px (Custom Bar) + 64px (Nav Bar) = 96px */
            ytmusic-guide-renderer,
            #guide-wrapper {
                top: 24px !important;
                height: calc(100vh - 96px) !important;
                z-index: 999 !important;
            }

            /* 3. Push the main scrolling content area down */
            #browse-page,
            ytmusic-browse-response {
                padding-top: 32px !important;
            }

            /* 4. Fix Search Suggestions Dropdown position */
            ytmusic-search-box ytmusic-search-suggestions-section {
                top: 85px !important; 
            }
            ytmusic-guide-section-renderer {
                margin-top: 30px !important;
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