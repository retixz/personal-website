const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Review extends Model {}

Review.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Reviewer name cannot be empty."
      }
    }
  },
  roleCompany: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'role_company',
    validate: {
      notEmpty: {
        msg: "Reviewer role/company cannot be empty."
      }
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Review content cannot be empty."
      }
    }
  },
  linkedinUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'linkedin_url',
    validate: {
      isUrl: {
        msg: "Please provide a valid URL for the LinkedIn profile."
      }
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Default status for new reviews
    validate: {
      isIn: {
        args: [['pending', 'approved', 'rejected']], // Allowed values
        msg: "Invalid status value."
      }
    }
  }
  // createdAt and updatedAt fields are added automatically by Sequelize by default
}, {
  sequelize,
  modelName: 'Review',      
  tableName: 'Reviews',     
  timestamps: true          
});


module.exports = Review;