const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategoryImage = sequelize.define('CategoryImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'image_url'  // مشخص کردن نام واقعی ستون در دیتابیس
  },
  link: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'category_images',
  timestamps: true,
  underscored: true,  // استفاده از snake_case برای نام ستون‌ها
  createdAt: 'created_at',  // نام ستون created_at در دیتابیس
  updatedAt: 'updated_at'   // نام ستون updated_at در دیتابیس
});

module.exports = CategoryImage;