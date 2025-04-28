const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Post extends Model { }

Post.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Ensure slugs are unique
  },
  viewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'view_count' // IMPORTANT: This forces the DB column name to be snake_case
  }
}, {
  sequelize,
  modelName: 'Post',
});

module.exports = Post;