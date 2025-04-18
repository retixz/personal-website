const { Sequelize } = require('sequelize');
const path = require('path');

const storagePath = path.join(__dirname, 'data', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false // Sau true pentru debug
});

module.exports = sequelize;