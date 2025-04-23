// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./database')
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const Post = require('./models/Post');

// Importă rutele
const indexRoutes = require('./routes/index');
const blogRoutes = require('./routes/blog');

// --- Testare Conexiune și Sincronizare Modele ---
async function testConnectionAndSync() {
  try {
    await sequelize.authenticate();
    console.log('Database connection success.');
    // Sync DB model
    // 'force: false' means that the tables will not be deleted if they already exists
    await sequelize.sync({ force: false });
    console.log('Modelele au fost sincronizate cu baza de date.');
  } catch (error) {
    console.error('Error on connecting or synchronizing with Database', error);
  }
}
testConnectionAndSync();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": [
            "'self'",
            "cdnjs.cloudflare.com",
            "cdn.jsdelivr.net"

        ],
      },
    },
  })
);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d'
}));
app.use(compression());

// --- Rute ---
app.use((req, res, next) => {
    req.db = sequelize;
    next();
});
app.use(cookieParser());
app.use('/', indexRoutes);
app.use('/blog', blogRoutes);

// Sitemap Route
app.get('/sitemap.xml', async (req, res) => {

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Get base URL from env or default

  try {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // Helper function to format date as YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];

    // 1. Add Static Pages
    const staticPages = [
      { loc: '/', changefreq: 'weekly', priority: '1.0', lastmod: new Date() },
      { loc: '/blog', changefreq: 'weekly', priority: '0.8', lastmod: new Date() },
      { loc: '/contact', changefreq: 'monthly', priority: '0.7', lastmod: new Date() }
    ];

    staticPages.forEach(page => {
      xml += '<url>';
      xml += `<loc><span class="math-inline">${baseUrl}</span>${page.loc}</loc>`;
      xml += `<lastmod>${formatDate(page.lastmod)}</lastmod>`;
      xml += `<changefreq>${page.changefreq}</changefreq>`;
      xml += `<priority>${page.priority}</priority>`;
      xml += '</url>';
    });

    // 2. Add Dynamic Blog Post Pages
    const posts = await Post.findAll({
      attributes: ['id', 'updatedAt'],
      order: [['updatedAt', 'DESC']]
    });

    posts.forEach(post => {
      xml += '<url>';
      xml += `<loc><span class="math-inline">${baseUrl}/blog/</span>${post.id}</loc>`;
      xml += `<lastmod>${formatDate(post.updatedAt)}</lastmod>`;
      xml += `<changefreq>monthly</changefreq>`;
      xml += `<priority>0.9</priority>`; // High priority for content
      xml += '</url>';
    });

    xml += '</urlset>';

    // Set header and send response
    res.header('Content-Type', 'application/xml');
    res.send(xml);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// --- Pornire Server ---
app.listen(PORT, () => {
  console.log(`Serverul rulează la adresa http://localhost:${PORT}`);
});
