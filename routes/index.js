// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const data = {
    pageTitle: 'Home',
    currentTheme: req.cookies.themePreference || 'light',
    linkedinProfile: 'https://www.linkedin.com/in/stoica-alexandru/',
    email: 'r.alexandru.stoica@gmail.com',
    cvPath: '/Alexandru_Stoica_-_Software_Engineer.pdf',
    gaMeasurementId: process.env.GA_MEASUREMENT_ID
  };
  res.render('index', data);
});

router.get('/contact', (req, res) => {
  const data = {
    pageTitle: 'Contact Me',
    currentTheme: req.cookies.themePreference || 'light',
    email: 'r.alexandru.stoica@gmail.com',
    phone: '+40733597787',
    linkedinProfile: 'https://www.linkedin.com/in/stoica-alexandru/',
    cvPath: '/Alexandru_Stoica_-_Software_Engineer.pdf',
    gaMeasurementId: process.env.GA_MEASUREMENT_ID
  };
  res.render('contact', data);
});

router.get('/privacy-policy', (req, res) => {
  const data = {
      pageTitle: 'Privacy Policy',
      currentTheme: req.cookies.themePreference || 'light',
      email: 'r.alexandru.stoica@gmail.com',
      phone: '+40733597787',
      linkedinProfile: 'https://www.linkedin.com/in/stoica-alexandru/',
      cvPath: '/Alexandru_Stoica_-_Software_Engineer.pdf',
      gaMeasurementId: process.env.GA_MEASUREMENT_ID
  };
  res.render('privacy-policy', data);
});

module.exports = router;