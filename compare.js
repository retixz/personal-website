document.addEventListener('DOMContentLoaded', () => {
    // Verificăm lățimea ecranului ÎNAINTE de a inițializa Vanta
    if (window.innerWidth > 768) { // Rulează Vanta doar pe ecrane mai mari de 768px
        if (typeof VANTA !== 'undefined' && typeof VANTA.CLOUDS !== 'undefined') {
            let initialTheme = 'light'; // Default
            try {
               const saved = localStorage.getItem('themePreference');
               if (saved) {
                   initialTheme = saved;
               } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                   initialTheme = 'dark';
               }
            } catch(e) { console.warn("Could not determine initial theme preference for Vanta.")}

            const initialBgColor = (initialTheme === 'dark') ? 0x0D1117 : 0xFFFFFF;
            const initialSunColor = (initialTheme === 'dark') ? 0xBE54CF : 0x007BFF;
            const initialCloudColor = (initialTheme === 'dark') ? 0x161B22 : 0xE9ECEF;

            window.vantaEffect = VANTA.CLOUDS({
                el: "body",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: initialBgColor,
                cloudColor: initialCloudColor,
                sunColor: initialSunColor,
                sunlightColor: initialSunColor,
                // --- Parametru nou adăugat ---
                speed: 0.8 // Încearcă o valoare mai mică (ex: 1.0, 0.8, 0.5). Valoarea default nu e specificată clar, dar 1.3 e folosit în exemple
            });
            console.log("Vanta.js CLOUDS effect initialized on body (desktop).");

        } else {
            console.error("Vanta.js or VANTA.CLOUDS effect not loaded.");
        }
    } else {
        console.log("Vanta.js effect disabled on smaller screens.");
        // Asigură-te că ai un background solid setat în CSS pentru ecranele mici
        // ca fallback, dacă Vanta nu rulează.
    }

    // Modificăm și funcția de update din theme.js să verifice dacă vantaEffect există
    // (Codul pentru theme.js rămâne în fișierul său, dar funcția de update trebuie ajustată)
});

// --- Ajustare necesară în public/js/theme.js ---
// În funcția window.updateVantaTheme, adaugă o verificare la început:
// window.updateVantaTheme = () => {
//     if (!window.vantaEffect) return; // Ieși dacă Vanta nu e activ (ecran mic)
//     if (typeof window.vantaEffect.setOptions === 'function') {
//         // ... restul codului funcției ...
//     }
// }