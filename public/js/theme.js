// public/js/theme.js

(function() {
    // Constants
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeKey = 'themePreference'; // Key for localStorage
    const darkClassName = 'dark-mode';  // CSS class for dark mode

    // Icons/Text for the toggle button (customize as needed)
    const lightIcon = '☀️'; // Example: Sun icon
    const darkIcon = '🌙';  // Example: Moon icon

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add(darkClassName);
            if (themeToggle) {
                themeToggle.innerHTML = darkIcon; // Show moon icon
                themeToggle.setAttribute('aria-label', 'Switch to light theme');
            }
        } else {
            body.classList.remove(darkClassName);
            if (themeToggle) {
                themeToggle.innerHTML = lightIcon; // Show sun icon
                themeToggle.setAttribute('aria-label', 'Switch to dark theme');
            }
        }
    };

    // Function to save preference
    const savePreference = (theme) => {
        localStorage.setItem(themeKey, theme);
    };

    // Function to get preference
    const getPreference = () => {
        // 1. Check localStorage first
        const savedTheme = localStorage.getItem(themeKey);
        if (savedTheme) {
            return savedTheme;
        }

        // 2. If no saved theme, check system preference
        try {
            // Check if window.matchMedia is supported
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        } catch (e) {
            // Handle potential errors with matchMedia if needed
            console.warn("Could not determine system theme preference.", e);
        }


        // 3. Default to light theme if no preference found
        return 'light';
    };

    // --- Initialize Theme on Load ---
    let currentTheme = getPreference();
    applyTheme(currentTheme);

    // --- Event Listener for Toggle Button ---
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Toggle theme
            currentTheme = body.classList.contains(darkClassName) ? 'light' : 'dark';
            
            // Apply the new theme visually
            applyTheme(currentTheme);

            // Save the new preference
            savePreference(currentTheme);
        });
    } else {
        console.warn('Theme toggle button with id="theme-toggle" not found.');
    }

})(); // IIFE to avoid polluting global scope