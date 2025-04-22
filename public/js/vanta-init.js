document.addEventListener('DOMContentLoaded', () => {
    // Check if VANTA and the specific effect are loaded
    if (typeof VANTA !== 'undefined' && typeof VANTA.CLOUDS !== 'undefined') {
        
        // Determine initial theme to set correct initial background for Vanta
        let initialTheme = 'light'; // Default
        try {
           const saved = localStorage.getItem('themePreference');
           if (saved) {
               initialTheme = saved;
           } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
               initialTheme = 'dark';
           }
        } catch(e) { console.warn("Could not determine initial theme preference for Vanta.")}

        const initialBgColor = (initialTheme === 'dark') ? 0x0D1117 : 0xFFFFFF; // Dark or Light BG
        const initialSunColor = (initialTheme === 'dark') ? 0xBE54CF : 0x007BFF; // Dark or Light Sun
        const initialCloudColor = (initialTheme === 'dark') ? 0x161B22 : 0xE9ECEF; // Dark or Light Cloud

        // Store the effect instance globally
        window.vantaEffect = VANTA.CLOUDS({
            // CHANGE THIS: Target the body element
            el: "body", 
            // Ensure other settings are kept:
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            
            // --- Set Initial Colors based on detected theme ---
            skyColor: initialBgColor,        
            cloudColor: initialCloudColor,      
            sunColor: initialSunColor,       
            sunlightColor: initialSunColor    
        });
        console.log("Vanta.js CLOUDS effect initialized on body.");

        // No need to call updateVantaTheme immediately IF theme.js also runs on load
        // and sets the correct body class AND calls updateVantaTheme itself.
        // If theme.js might run *after* this, keep the call here. Let's remove for now.
        // if(window.updateVantaTheme) {
        //     window.updateVantaTheme(); // Let theme.js handle the initial update call
        // }

    } else {
        console.error("Vanta.js or VANTA.CLOUDS effect not loaded. Check script tags in footer.");
    }
});