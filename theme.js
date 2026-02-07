// 1.2.1
module.exports.getThemeCss = (cfg, accent, isDark) => {
    
    // 1. DEFINE COLORS
    const bgMain = isDark ? "#0f0f0f" : "#ffffff";
    const bgSecond = isDark ? "#0f0f0f" : "#ffffff"; 
    const textMain = isDark ? "#ffffff" : "#0f0f0f";
    
    // --- MODE 1: STANDARD (Non-OLED) ---
    if (!cfg.oled) {
        return `
            /* A. UNIVERSAL VARIABLE OVERRIDE */
            /* This forces EVERY "Red" variable used by YouTube to use your Accent Color */
            html, body, :root, [dark], [light] {
                --yt-spec-static-brand-red: ${accent} !important;
                --yt-spec-static-brand-white: #fff !important;
                --yt-spec-red-500: ${accent} !important;
                --yt-spec-red-600: ${accent} !important;
                --yt-spec-red-700: ${accent} !important;
                --yt-spec-brand-background-solid: ${accent} !important;
                --yt-spec-brand-button-background: ${accent} !important;
                --yt-spec-call-to-action: ${accent} !important;
                --yt-spec-icon-active-other: ${accent} !important;
                --yt-live-chat-action-panel-background-color: ${accent} !important;
                --yt-badge-live-now-background-color: ${accent} !important; 
                --yt-spec-themed-blue: ${accent} !important;
                --yt-spec-themed-overlay: ${accent} !important;
                --paper-slider-active-color: ${accent} !important;
                --paper-slider-knob-color: ${accent} !important;
            }

            /* B. Top Bar / Masthead */
            ytd-masthead, #masthead-container { background-color: ${bgSecond} !important; }
            ytd-searchbox[has-focus] #container.ytd-searchbox { border-color: ${accent} !important; }

            /* C. VIDEO & SHORTS PROGRESS BARS */
            .ytp-play-progress, .ytp-scrubber-button, .ytp-swatch-background-color, .ytp-volume-slider-handle::before,
            .YtProgressBarLineProgressBarPlayed, .ytProgressBarLineProgressBarPlayed,
            .YtProgressBarPlayheadProgressBarPlayheadDot {
                background: ${accent} !important; 
                background-color: ${accent} !important;
            }

            /* D. THUMBNAIL RESUME BAR (Specific Target) */
            /* We use 'div' and IDs to boost specificity to the max */
            div#progress.ytd-thumbnail-overlay-resume-playback-renderer {
                background: ${accent} !important;
                background-color: ${accent} !important;
            }

            /* E. LIVE BADGES (Specific Target) */
            /* Old Style */
            ytd-thumbnail-overlay-time-status-renderer[overlay-style="LIVE"],
            ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"] {
                background: ${accent} !important;
                background-color: ${accent} !important;
                color: #ffffff !important;
            }
            /* New 'Wiz' Style (Home Page) */
            div.badge-shape-wiz--style-overlay,
            div.badge-shape-wiz--style-overlay[aria-label="LIVE"], 
            div.badge-shape-wiz--style-overlay[aria-label="Live"] {
                background: ${accent} !important;
                background-color: ${accent} !important;
                color: #ffffff !important;
            }
            /* Text Badge (Description) */
            .badge-style-type-live-now, .badge-style-type-live-now-alternate {
                color: ${accent} !important;
                border-color: ${accent} !important;
            }

            /* F. LOGO & ICONS */
            ytd-topbar-logo-renderer #logo-icon svg path { fill: ${textMain} !important; }
            ytd-topbar-logo-renderer #logo-icon svg > g:first-of-type > path:first-of-type { fill: ${accent} !important; }
            .guide-icon.ytd-guide-entry-renderer[icon="live"] { color: ${accent} !important; fill: ${accent} !important; }

            /* G. MISC */
            .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
                background-color: ${accent} !important; color: #ffffff !important;
            }
            yt-page-navigation-progress #progress { 
                background: ${accent} !important; height: 3px !important; 
            }
            ytd-rich-item-renderer:has(> .ytd-ad-slot-renderer), #masthead-ad, ytd-ad-slot-renderer { display: none !important; }
            .YtProgressBarLineProgressBarPlayed,
            .ytProgressBarLineProgressBarPlayed,
            .YtProgressBarPlayheadProgressBarPlayheadDot,
            .ytProgressBarPlayheadProgressBarPlayheadDot,
            /*2024-10-23 video progress*/
            ytd-thumbnail-overlay-resume-playback-renderer[enable-refresh-signature-moments-web] #progress.ytd-thumbnail-overlay-resume-playback-renderer,
            /*2024-10-27*/
            /*on home page hover & shorts*/
            .YtProgressBarLineProgressBarPlayedRefresh,
            .ytProgressBarLineProgressBarPlayedRefresh,
            .YtThumbnailOverlayProgressBarHostWatchedProgressBarSegmentModern,
            .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment {
            	background: ${accent} !important;
            }
        `;
    }

    // --- MODE 2: OLED (Pure Black) ---
    return `
    :root {
        --main-color: ${accent} !important;
        --main-background: #000000 !important;
        --second-background: #000000 !important;
        --hover-background: #1a1a1a !important;
        --main-text: #ffffff !important;
        --dimmer-text: #aaaaaa !important;
        
        --yt-spec-base-background: #000000 !important;
        --yt-spec-raised-background: #000000 !important;
        --yt-spec-menu-background: #000000 !important;
        --yt-spec-text-primary: #ffffff !important;
        --yt-spec-static-brand-red: ${accent} !important;
        --yt-spec-red-500: ${accent} !important;
        
        --yt-live-chat-action-panel-background-color: ${accent} !important;
        --yt-badge-live-now-background-color: ${accent} !important; 
    }

    html, body, ytd-app { background-color: #000000 !important; }
    
    ::-webkit-scrollbar { width: 8px !important; }
    ::-webkit-scrollbar-track { background: transparent !important; }
    ::-webkit-scrollbar-thumb { background: #1a1a1a !important; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${accent} !important; }

    ytd-masthead, #yt-masthead-container {
        background-color: #000000 !important;
        border-bottom: 1px solid #1a1a1a !important;
    }
    
    ytd-searchbox[mode], #container.ytd-searchbox {
        background-color: #000000 !important;
        border: 1px solid #1a1a1a !important;
    }
    ytd-searchbox[has-focus] #container.ytd-searchbox { border-color: ${accent} !important; }

    /* Fix Live Badges for OLED */
    ytd-thumbnail-overlay-time-status-renderer[overlay-style="LIVE"],
    .badge-shape-wiz--style-overlay {
        background: ${accent} !important;
        background-color: ${accent} !important;
        color: #ffffff !important;
    }

    /* Fix Thumbnail Progress for OLED */
    div#progress.ytd-thumbnail-overlay-resume-playback-renderer {
        background: ${accent} !important;
        background-color: ${accent} !important;
    }

    /* Player Progress */
    .ytp-play-progress, .ytp-scrubber-button, .ytp-swatch-background-color {
        background: ${accent} !important;
    }
    
    yt-page-navigation-progress #progress { 
        background: ${accent} !important; 
        background-color: ${accent} !important;
    }

    ytd-topbar-logo-renderer #logo-icon svg path { fill: #ffffff !important; }
    ytd-topbar-logo-renderer #logo-icon svg > g:first-of-type > path:first-of-type { fill: ${accent} !important; }
    
    ytd-rich-item-renderer:has(> .ytd-ad-slot-renderer), #masthead-ad { display: none !important; }
    ytd-rich-item-renderer:has(> .ytd-ad-slot-renderer), #masthead-ad, ytd-ad-slot-renderer { display: none !important; }
            .YtProgressBarLineProgressBarPlayed,
            .ytProgressBarLineProgressBarPlayed,
            .YtProgressBarPlayheadProgressBarPlayheadDot,
            .ytProgressBarPlayheadProgressBarPlayheadDot,
            /*2024-10-23 video progress*/
            ytd-thumbnail-overlay-resume-playback-renderer[enable-refresh-signature-moments-web] #progress.ytd-thumbnail-overlay-resume-playback-renderer,
            /*2024-10-27*/
            /*on home page hover & shorts*/
            .YtProgressBarLineProgressBarPlayedRefresh,
            .ytProgressBarLineProgressBarPlayedRefresh,
            .YtThumbnailOverlayProgressBarHostWatchedProgressBarSegmentModern,
            .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment {
            	background: ${accent} !important;
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