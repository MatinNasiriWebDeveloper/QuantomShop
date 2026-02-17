const Product = require('./Product');
const User = require('./User');
const Order = require('./Order');

// Define associations
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

module.exports = {
  Product,
  User,
  Order
};