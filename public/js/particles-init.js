// public/js/particles-init.js
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {

        const htmlEl = document.documentElement;
        const isDarkMode = htmlEl.classList.contains('dark-mode');

        const particleColorLight = '#555555'; // Darker particles for light theme
        const lineColorLight = '#cccccc';     // Lighter lines for light theme

        const particleColorDark = '#888888';  // Lighter particles for dark theme (as before)
        const lineColorDark = '#555555';      // Darker lines for dark theme

        // Choose the correct colors based on the detected theme
        const currentParticleColor = isDarkMode ? particleColorDark : particleColorLight;
        const currentLineColor = isDarkMode ? lineColorDark : lineColorLight;

        console.log(`Initializing particles.js in ${isDarkMode ? 'Dark' : 'Light'} mode.`);

        // Initialize particlesJS with dynamic colors
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": currentParticleColor
                },
                "shape": {
                    "type": "circle",
                    "stroke": { "width": 0, "color": "#000000" },
                    "polygon": { "nb_sides": 5 }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": currentLineColor,
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 3,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "repulse" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 400, "line_linked": { "opacity": 1 } },
                    "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                    "repulse": { "distance": 100, "duration": 0.4 },
                    "push": { "particles_nb": 4 },
                    "remove": { "particles_nb": 2 }
                }
            },
            "retina_detect": true
        });

    } else {
        if (!document.getElementById('particles-js')) {
            console.error('particles-init.js: Element with id "particles-js" not found.');
        }
        if (typeof particlesJS === 'undefined') {
            console.error('particles-init.js: particlesJS library not loaded before initialization.');
        }
    }
});