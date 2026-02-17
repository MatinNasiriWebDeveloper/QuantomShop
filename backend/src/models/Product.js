const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING(100)
  },
  imageUrl: {
    type: DataTypes.STRING(500)
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  brand: {
    type: DataTypes.STRING(100)
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  originalPrice: {  // این فیلد رو اضافه کن
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'products'
});

module.exports = Product;