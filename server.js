// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./database')
const cookieParser = require('cookie-parser');

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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Rute ---
app.use((req, res, next) => {
    req.db = sequelize;
    next();
});
app.use(cookieParser());
app.use('/', indexRoutes);
app.use('/blog', blogRoutes);

// --- Pornire Server ---
app.listen(PORT, () => {
  console.log(`Serverul rulează la adresa http://localhost:${PORT}`);
});
