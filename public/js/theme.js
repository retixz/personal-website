(function () {
    // --- Constants ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeKey = 'themePreference'; // Key for localStorage
    const darkClassName = 'dark-mode'; // CSS class for dark mode
    const lightIcon = '☀️';
    const darkIcon = '🌙';
    const CONSENT_COOKIE_NAME = 'cookie_consent_status';

    // --- Get references to Prism theme links ---
    const prismLightThemeLink = document.getElementById('prism-light-theme');
    const prismDarkThemeLink = document.getElementById('prism-dark-theme');

    // --- Helper Function to Read Consent Cookie ---
    function getConsentStatus() {
        const match = document.cookie.match(new RegExp('(^|;) ?' + CONSENT_COOKIE_NAME + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }

    // --- Function to update toggle button appearance ---
    const updateToggleButton = (theme) => {
        if (themeToggle) {
            const isDarkMode = (theme === 'dark');
            themeToggle.innerHTML = isDarkMode ? darkIcon : lightIcon;
            themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to light theme' : 'Switch to dark theme');
        }
    };

    // --- Function to update Prism theme ---
    const updatePrismTheme = (theme) => {
        if (!prismLightThemeLink || !prismDarkThemeLink) {
            return;
        }

        if (theme === 'dark') {
            prismDarkThemeLink.disabled = false;
            prismLightThemeLink.disabled = true;
        } else {
            prismLightThemeLink.disabled = false;
            prismDarkThemeLink.disabled = true;
        }

        console.log(`Prism theme set to: ${theme}`);
    };

    // --- Function to apply theme changes (called by click handler) ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.add(darkClassName);
        } else {
            htmlElement.classList.remove(darkClassName);
        }

        updateToggleButton(theme);
        updatePrismTheme(theme);

    };

    // --- Function to save preference (called by click handler) ---
    const savePreference = (theme) => {
        // Always save to localStorage
        try {
             localStorage.setItem(themeKey, theme);
        } catch (e) {
             console.warn("Could not save theme preference to localStorage.", e);
        }

        // Only save to cookie if consent was given
        if (getConsentStatus() === 'accepted') {
            const maxAgeSeconds = 365 * 24 * 60 * 60;
            const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
            const themeCookieName = themeKey;

            // Use encodeURIComponent for the theme value
            document.cookie = `${themeCookieName}=${encodeURIComponent(theme)};path=/;max-age=${maxAgeSeconds};SameSite=Lax${secureFlag}`;
            console.log("Theme preference cookie updated (consent accepted).");
        } else {
            console.log("Theme preference cookie NOT updated (consent not accepted).");
        }
    };

    // --- Function to get preference (Only needed for click handler now) ---
    // This function checks localStorage first, then system preference.
    const getClientSidePreference = () => {
        const savedTheme = localStorage.getItem(themeKey);
        if (savedTheme) { return savedTheme; }
        try {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        } catch (e) { console.warn("Could not determine system theme preference.", e); }
        return 'light'; // Default to light if no setting found client-side
    };


    // --- Initialize UI on Load (Using DOMContentLoaded) ---
    document.addEventListener('DOMContentLoaded', () => {
        // Determine initial theme based *only* on the class NOW PRESENT on <html>
        // (Set either by server via cookie OR by the inline script via localStorage/matchMedia)
        const isInitiallyDark = htmlElement.classList.contains(darkClassName);
        const initialTheme = isInitiallyDark ? 'dark' : 'light';
    
        updateToggleButton(initialTheme);
        updatePrismTheme(initialTheme);
    
        // 3. Reveal content (remove js-loading, add js-loaded)
        htmlElement.classList.remove('js-loading');
        htmlElement.classList.add('js-loaded');
        console.log(`Initial theme ('${initialTheme}') confirmed. Content revealed.`);
    });


    // --- Event Listener for Toggle Button ---
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {

            const isCurrentlyDark = htmlElement.classList.contains(darkClassName);
            const newTheme = isCurrentlyDark ? 'light' : 'dark';

            savePreference(newTheme);
            applyTheme(newTheme);

        });
    } else {
        console.warn('Theme toggle button with id="theme-toggle" not found.');
    }

})();