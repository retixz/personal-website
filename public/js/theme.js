// public/js/theme.js

(function() {
    // --- Constants ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeKey = 'themePreference'; 
    const darkClassName = 'dark-mode';  

    // --- Theme Colors for Vanta CLOUDS ---
    // Match hex values (0x...) to your CSS variables
    const vantaCloudColors = {
        light: {
            skyColor: 0x007BFF,       // --bg-light-mode (White sky)
            cloudColor: 0xE9ECEF,     // --accent-subtle-light (Light gray clouds)
            // cloudShadowColor: 0xDEE2E6, // --border-color-light (Optional subtle shadow)
            sunColor: 0x007BFF,        // --accent-blue (Blue sun)
            // sunGlareColor: 0x?????? 
            sunlightColor: 0x007BFF    // --accent-blue (Blue sunlight)
        },
        dark: {
            skyColor: 0x0D1117,        // --bg-dark (Dark sky)
            cloudColor: 0x161B22,      // --bg-card (Darker clouds)
            // cloudShadowColor: 0x000000, // Optional black shadow
            sunColor: 0xBE54CF,        // --accent-purple (Purple sun)
            // sunGlareColor: 0x??????
            sunlightColor: 0xBE54CF     // --accent-purple (Purple sunlight)
        }
    };

    // --- Icons/Text for Toggle Button ---
    const lightIcon = '☀️'; 
    const darkIcon = '🌙';  

    // --- Function to update Vanta CLOUDS colors ---
    window.updateVantaTheme = () => {
        if (window.vantaEffect && typeof window.vantaEffect.setOptions === 'function') {
            const isDarkMode = body.classList.contains(darkClassName);
            // Get the correct set of colors based on current theme
            const newOptions = isDarkMode ? vantaCloudColors.dark : vantaCloudColors.light;
            
            // Check if update is needed (only checking main colors)
            if (window.vantaEffect.options.skyColor !== newOptions.skyColor || 
                window.vantaEffect.options.cloudColor !== newOptions.cloudColor ||
                window.vantaEffect.options.sunColor !== newOptions.sunColor) {
                
                // Update Vanta CLOUDS colors
                window.vantaEffect.setOptions({
                     skyColor: newOptions.skyColor,
                     cloudColor: newOptions.cloudColor,
                     // cloudShadowColor: newOptions.cloudShadowColor, // Uncomment if using
                     sunColor: newOptions.sunColor,
                     // sunGlareColor: newOptions.sunGlareColor, // Uncomment if using
                     sunlightColor: newOptions.sunlightColor
                });
                 // console.log("Vanta CLOUDS theme updated to:", isDarkMode ? 'dark' : 'light');
            }
        }
    }

    // --- Function to apply CSS theme and update toggle ---
    const applyTheme = (theme) => {
        // Apply CSS class
        if (theme === 'dark') {
            body.classList.add(darkClassName);
        } else {
            body.classList.remove(darkClassName);
        }
        
        // Update toggle button appearance
        if (themeToggle) {
            const isDarkMode = (theme === 'dark');
            themeToggle.innerHTML = isDarkMode ? darkIcon : lightIcon;
            themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to light theme' : 'Switch to dark theme');
        }

        // Update Vanta colors AFTER changing the body class
        window.updateVantaTheme(); 
    };

    // --- Function to save preference ---
    const savePreference = (theme) => {
        localStorage.setItem(themeKey, theme);
    };

    // --- Function to get preference ---
    const getPreference = () => {
        const savedTheme = localStorage.getItem(themeKey);
        if (savedTheme) { return savedTheme; }
        try {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        } catch (e) { console.warn("Could not determine system theme preference.", e); }
        return 'light'; // Default to light
    };

    // --- Initialize Theme on Load ---
    let currentTheme = getPreference();
    // Apply theme (CSS class and Vanta colors)
    applyTheme(currentTheme); 

    // --- Event Listener for Toggle Button ---
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Determine the new theme
            currentTheme = body.classList.contains(darkClassName) ? 'light' : 'dark';
            
            // Apply the new theme visually (CSS class and Vanta colors)
            applyTheme(currentTheme);

            // Save the new preference
            savePreference(currentTheme);
        });
    } else {
        console.warn('Theme toggle button with id="theme-toggle" not found.');
    }

})();