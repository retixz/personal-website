// public/js/nav.js
console.log('nav.js script started loading.'); // Log 1: Check if file loads

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed.'); // Log 2: Check if DOM ready event fires

    const hamburgerButton = document.getElementById('hamburger-toggle');
    const navList = document.getElementById('main-nav-list');
    const body = document.body; 

    if (hamburgerButton && navList) {

        hamburgerButton.addEventListener('click', () => { 
            navList.classList.toggle('nav-open');
            body.classList.toggle('nav-open'); 
            const isExpanded = navList.classList.contains('nav-open');
            hamburgerButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false'); 
        });
        
    } else {
        // This message indicates an ID mismatch or missing element in HTML
        console.error('CRITICAL: Hamburger button (#hamburger-toggle) or navigation list (#main-nav-list) element NOT FOUND in the HTML.'); // Log 10: Error if elements missing
    }

});