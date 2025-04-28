document.addEventListener('DOMContentLoaded', () => {
    const CONSENT_COOKIE_NAME = 'cookie_consent_status';
    const banner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    function getConsentStatus() {
        const match = document.cookie.match(new RegExp('(^|;) ?' + CONSENT_COOKIE_NAME + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function setConsentStatus(status) {
        const CONSENT_COOKIE_NAME = 'cookie_consent_status'; // Ensure this constant is defined or replace directly
        const maxAgeSeconds = 365 * 24 * 60 * 60; // 1 year in seconds
        const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';

        document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(status)};path=/;max-age=${maxAgeSeconds};SameSite=Lax${secureFlag}`;

        console.log(`Cookie consent set to: ${status}`);
    }

    function hideBanner() {
        if (banner) {
            banner.classList.add('cookie-consent-hidden'); // Use CSS class to hide
        }
    }

    function loadGoogleAnalytics() {
        const gaId = window.APP_CONFIG?.GA_MEASUREMENT_ID;

        // Check if GA already loaded (e.g., by mistake or previous consent)
        if (typeof window.gtag === 'function') {
            console.log("GA already loaded or loading.");
            return;
        }

        if (!gaId || gaId === 'G-XXXXXXXXXX') {
            console.warn("GA Measurement ID not set correctly.");
            return;
        }

        console.log('Consent accepted: Loading Google Analytics...');

        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
        `;

        document.head.appendChild(script1);
        document.head.appendChild(script2);

        // Set flag indicating consent allows features
        window.consentAccepted = true;
    }

    function enableThemeCookieSaving() {
        // Set flag indicating consent allows features
        window.consentAccepted = true;
        console.log("Consent accepted: Theme preference cookie saving enabled.");
    }


    // --- Main Initialization Logic ---
    if (!banner || !acceptBtn || !rejectBtn) {
        console.error("Cookie consent banner elements not found.");
        // Attempt to load analytics if consent was previously given, even if banner is missing
        if (getConsentStatus() === 'accepted') {
            enableThemeCookieSaving();
            loadGoogleAnalytics();
        }
        return;
    }

    const currentConsent = getConsentStatus();

    if (currentConsent === 'accepted') {
        hideBanner();
        enableThemeCookieSaving();
        loadGoogleAnalytics();
    } else if (currentConsent === 'rejected') {
        hideBanner();
        window.consentAccepted = false; // Ensure flag is false
    } else {
        // No consent cookie found, show the banner
        banner.style.display = 'flex'; // Make it visible using its default flex display
    }

    // Add button listeners
    acceptBtn.addEventListener('click', () => {
        setConsentStatus('accepted');
        hideBanner();
        enableThemeCookieSaving();
        loadGoogleAnalytics();
    });

    rejectBtn.addEventListener('click', () => {
        setConsentStatus('rejected');
        hideBanner();
        window.consentAccepted = false;

        const domain = window.location.hostname;
        const gaId = window.APP_CONFIG?.GA_MEASUREMENT_ID;

        const gaCookieNames = ['_ga', '_gid', '_gat', `_ga_${gaId.replace('G-', '')}`];
        gaCookieNames.forEach(name => {
            document.cookie = `<span class="math-inline">\{name\}\=; path\=/; domain\=</span>{domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        });
        console.log("Attempted to clear GA cookies on rejection.");
    });
});