const { Sequelize } = require('sequelize');

// Get connection string from environment variable for security
const dbConnectionString = process.env.DATABASE_URL; 

if (!dbConnectionString) {

  if (process.env.NODE_ENV === 'production') {
      throw new Error("DATABASE_URL must be set in production.");
  } else {
       // Fallback to SQLite for local development (Optional)
       console.warn("DATABASE_URL not set, falling back to local SQLite for development.");
       const path = require('path');
       const storagePath = path.join(__dirname, 'data', 'database.sqlite');
       module.exports = new Sequelize({ dialect: 'sqlite', storage: storagePath, logging: false });
       return; 
  }
}

// Initialize Sequelize with the PostgreSQL connection string
const sequelize = new Sequelize(dbConnectionString, {
  dialect: 'postgres', 
  logging: false,
});

module.exports = sequelize;