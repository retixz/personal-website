// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const data = {
    pageTitle: 'Home',
    currentTheme: req.cookies.themePreference || 'light',
    linkedinProfile: 'https://www.linkedin.com/in/stoica-alexandru/',
    email: 'r.alexandru.stoica@gmail.com',
    cvPath: '/Alexandru_Stoica_-_Software_Engineer.pdf'
  };
  res.render('index', data);
});

router.get('/contact', (req, res) => {
  const data = {
    pageTitle: 'Contact Me',
    currentTheme: req.cookies.themePreference || 'light',
    email: 'r.alexandru.stoica@gmail.com',
    phone: '+40 0733 597 787',
    linkedinProfile: 'https://www.linkedin.com/in/stoica-alexandru/',
    cvPath: '/Alexandru_Stoica_-_Software_Engineer.pdf'
  };
  res.render('contact', data);
});

module.exports = router;