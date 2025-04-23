const { Sequelize } = require('sequelize');

// Get connection string from environment variable for security
const dbConnectionString = process.env.DATABASE_URL;

if (!dbConnectionString) {
  throw new Error("DATABASE_URL must be set.");
}

// Initialize Sequelize with the PostgreSQL connection string
const sequelize = new Sequelize(dbConnectionString, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
module.exports = sequelize;