const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategorySection = sequelize.define('CategorySection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  viewAllLink: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'category_sections',
  timestamps: true
});

module.exports = CategorySection;