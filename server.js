// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./database')

// Importă rutele
const indexRoutes = require('./routes/index');
const blogRoutes = require('./routes/blog');

// --- Configurare Sequelize ---
const storagePath = path.join(__dirname, 'data', 'database.sqlite');
console.log(`Calea către baza de date SQLite: ${storagePath}`);

// --- Testare Conexiune și Sincronizare Modele ---
async function testConnectionAndSync() {
  try {
    await sequelize.authenticate(); // Testează conexiunea
    console.log('Conexiune SQLite stabilită cu succes.');
    // Sincronizează modelele cu baza de date.
    // 'force: false' înseamnă că tabelele nu vor fi șterse și recreate dacă există deja.
    await sequelize.sync({ force: false });
    console.log('Modelele au fost sincronizate cu baza de date.');
  } catch (error) {
    console.error('Eroare la conectarea sau sincronizarea cu SQLite:', error);
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
    req.db = sequelize; // O metodă de a face sequelize disponibil în rute, dacă e necesar
    next();
});
app.use('/', indexRoutes);
app.use('/blog', blogRoutes);

// --- Pornire Server ---
app.listen(PORT, () => {
  console.log(`Serverul rulează la adresa http://localhost:${PORT}`);
});
