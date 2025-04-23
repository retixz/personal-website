document.addEventListener('DOMContentLoaded', () => {

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
        console.error('CRITICAL: Hamburger button (#hamburger-toggle) or navigation list (#main-nav-list) element NOT FOUND in the HTML.'); // Log 10: Error if elements missing
    }

});