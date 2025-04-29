// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const data = {
    pageTitle: 'Home'
  };
  res.render('index', data);
});

router.get('/contact', (req, res) => {
  const data = {
    pageTitle: 'Contact Me'
  };
  res.render('contact', data);
});

router.get('/privacy-policy', (req, res) => {
  const data = {
      pageTitle: 'Privacy Policy'
  };
  res.render('privacy-policy', data);
});

module.exports = router;