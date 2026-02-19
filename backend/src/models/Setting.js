const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('text', 'image', 'color', 'number'),
    defaultValue: 'text'
  }
}, {
  tableName: 'settings',
  timestamps: true,
  underscored: false // این مهمه - می‌گه از createdAt استفاده کن نه created_at
});

module.exports = Setting;