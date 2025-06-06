require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./database')
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const Post = require('./models/Post');

// Import routes
const indexRoutes = require('./routes/index');
const blogRoutes = require('./routes/blog');
const reviewRoutes = require('./routes/reviews');

// --- Test conexion and sync database ---
async function testConnectionAndSync() {
  try {
    await sequelize.authenticate();
    console.log('Database connection success.');
    // 'force: false' means that the tables will not be deleted if they already exists
    await sequelize.sync({ force: false });
    console.log('The models have been synchronized with the database.');
  } catch (error) {
    console.error('Error on connecting or synchronizing with Database', error);
  }
}

testConnectionAndSync();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Define Middleware for Common Locals ---
function setCommonLocals(req, res, next) {
  res.locals.linkedinProfile = process.env.LINKEDIN_PROFILE_URL || '#';
  res.locals.githubProfileUrl = process.env.GITHUB_PROFILE_URL || '#';
  res.locals.email = process.env.CONTACT_EMAIL || '';
  res.locals.cvPath = process.env.CV_PATH || '';
  res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
  res.locals.currentTheme = req.cookies.themePreference || 'light';
  res.locals.gaMeasurementId = process.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
  res.locals.phone = process.env.CONTACT_PHONE || '';

  next();
}

// --- Trust Proxy ---
// Session middleware for behind a proxy like Render/Heroku/etc.
app.set('trust proxy', 1);

app.use(cookieParser());

// --- Session Configuration ---
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    store: sessionStore, // Use persistent store
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    }
}));

sessionStore.sync();

// --- Middleware ---

app.use((req, res, next) => {
  res.locals.NODE_ENV = process.env.NODE_ENV;
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": [
            "'self'",
            "cdnjs.cloudflare.com",
            "cdn.jsdelivr.net",
            "www.googletagmanager.com",
            "'unsafe-inline'"
        ],
        // Also good to allow connections to Google Analytics
        "connect-src": [
            "'self'",
            "*.google-analytics.com",
            "*.analytics.google.com"
        ],
        "img-src": ["'self'", "data:", "*.google-analytics.com", "*.analytics.google.com", "www.googletagmanager.com"]
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
app.use(setCommonLocals);

// --- Routes ---
app.use((req, res, next) => {
  req.db = sequelize;
  next();
});
app.use('/', indexRoutes);
app.use('/blog', blogRoutes);
app.use('/reviews', reviewRoutes);

// Sitemap Route
app.get('/sitemap.xml', async (req, res) => {

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Get base URL from env or default

  try {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    const formatDate = (date) => date.toISOString().split('T')[0];

    // 1. Add Static Pages
    const staticPages = [
      { loc: '/', changefreq: 'weekly', priority: '1.0', lastmod: new Date() },
      { loc: '/blog', changefreq: 'weekly', priority: '0.8', lastmod: new Date() },
      { loc: '/reviews', changefreq: 'weekly', priority: '0.7', lastmod: new Date() },
      { loc: '/contact', changefreq: 'monthly', priority: '0.7', lastmod: new Date() }
    ];

    staticPages.forEach(page => {
      xml += '<url>';
      xml += `<loc>${baseUrl}${page.loc}</loc>`;
      xml += `<lastmod>${formatDate(page.lastmod)}</lastmod>`;
      xml += `<changefreq>${page.changefreq}</changefreq>`;
      xml += `<priority>${page.priority}</priority>`;
      xml += '</url>';
    });

    // 2. Add Dynamic Blog Post Pages
    const posts = await Post.findAll({
      attributes: ['slug', 'updatedAt'],
      order: [['updatedAt', 'DESC']]
    });

    posts.forEach(post => {
      xml += '<url>';
      xml += `<loc>${baseUrl}/blog/${post.slug}</loc>`;
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

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server runs on adress: http://localhost:${PORT}`);
});
