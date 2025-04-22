const { Sequelize } = require('sequelize');
const path = require('path');

// Use environment variable for production path, fallback to local path
const storagePath = process.env.SQLITE_STORAGE_PATH || path.join(__dirname, 'data', 'database.sqlite'); 
console.log(`Using SQLite database at: ${storagePath}`); // Log the path being used

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath, // Use the determined path
  logging: false 
});

module.exports = sequelize;