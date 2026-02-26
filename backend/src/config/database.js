const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'quantom_shop',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: false,
      charset: 'utf8mb4',
      dialectOptions: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_persian_ci'
      }
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ اتصال به دیتابیس با موفقیت برقرار شد.');
  } catch (error) {
    console.error('❌ خطا در اتصال به دیتابیس:', error.message);
    process.exit(1);
  }
};

testConnection();

module.exports = sequelize;