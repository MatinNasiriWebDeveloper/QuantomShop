const Product = require('../../models/Product');
const User = require('../../models/User');
const Order = require('../../models/Order');
const Otp = require('../../models/Otp');
const Stone = require('../../models/Stone');
const Category = require('../../models/Category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { GraphQLUpload } = require('graphql-upload');
const { createWriteStream } = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const sendSms = async (phone, code) => {
  try {
    console.log(`📱 SMS sent to ${phone}: Your code is ${code}`);
    return true;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
};

const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const resolvers = {
  Upload: GraphQLUpload,

  Product: {
    finalPrice: (parent) => {
      const discount = parent.discount || 0;
      return parent.price * (1 - discount / 100);
    }
  },

  Query: {
    // ========== PRODUCT QUERIES ==========
    products: async () => {
      try {
        return await Product.findAll({
          order: [['createdAt', 'DESC']]
        });
      } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
      }
    },

    product: async (_, { id }) => {
      try {
        const product = await Product.findByPk(id);
        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      } catch (error) {
        throw new Error('Error fetching product: ' + error.message);
      }
    },

    productsByCategory: async (_, { category }) => {
      try {
        return await Product.findAll({
          where: { category }
        });
      } catch (error) {
        throw new Error('Error fetching products by category: ' + error.message);
      }
    },

    searchProducts: async (_, { keyword }) => {
      try {
        return await Product.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: `%${keyword}%` } },
              { description: { [Op.like]: `%${keyword}%` } },
              { brand: { [Op.like]: `%${keyword}%` } }
            ]
          }
        });
      } catch (error) {
        throw new Error('Error searching products: ' + error.message);
      }
    },

    discountedProducts: async () => {
      try {
        return await Product.findAll({
          where: {
            discount: {
              [Op.gt]: 0
            }
          },
          order: [['discount', 'DESC']]
        });
      } catch (error) {
        throw new Error('Error fetching discounted products: ' + error.message);
      }
    },

    // ========== USER QUERIES ==========
    me: async (_, __, context) => {
      try {
        const user = getUser(context.token);
        if (!user) {
          throw new Error('Not authenticated');
        }
        return await User.findByPk(user.userId, {
          attributes: { exclude: ['password'] }
        });
      } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
      }
    },

    user: async (_, { id }) => {
      try {
        return await User.findByPk(id, {
          attributes: { exclude: ['password'] }
        });
      } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
      }
    },

    users: async (_, __, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        return await User.findAll({
          attributes: { exclude: ['password'] }
        });
      } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
      }
    },

    // ========== ORDER QUERIES ==========
    orders: async (_, { userId }) => {
      try {
        return await Order.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']]
        });
      } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
      }
    },

    order: async (_, { id }) => {
      try {
        return await Order.findByPk(id);
      } catch (error) {
        throw new Error('Error fetching order: ' + error.message);
      }
    },

    allOrders: async (_, __, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        return await Order.findAll({
          order: [['createdAt', 'DESC']]
        });
      } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
      }
    },

    // ========== SETTING QUERIES ==========
    getSetting: async (_, { key }) => {
      try {
        const Setting = require('../../models/Setting');
        return await Setting.findOne({ where: { key } });
      } catch (error) {
        throw new Error('Error fetching setting: ' + error.message);
      }
    },

    getAllSettings: async () => {
      try {
        const Setting = require('../../models/Setting');
        return await Setting.findAll();
      } catch (error) {
        throw new Error('Error fetching settings: ' + error.message);
      }
    },

    // ========== STONE QUERIES ==========
    stones: async () => {
      try {
        return await Stone.findAll({
          order: [['createdAt', 'DESC']]
        });
      } catch (error) {
        throw new Error('Error fetching stones: ' + error.message);
      }
    },

    stone: async (_, { id }) => {
      try {
        const stone = await Stone.findByPk(id);
        if (!stone) {
          throw new Error('Stone not found');
        }
        return stone;
      } catch (error) {
        throw new Error('Error fetching stone: ' + error.message);
      }
    },

    stonesByCategory: async (_, { category }) => {
      try {
        return await Stone.findAll({
          where: { category }
        });
      } catch (error) {
        throw new Error('Error fetching stones by category: ' + error.message);
      }
    },

    // ========== CATEGORY QUERIES ==========
    categories: async () => {
      try {
        const categories = await Category.findAll();
        
        const categoriesWithCount = await Promise.all(
          categories.map(async (cat) => {
            const productCount = await Product.count({
              where: { category: cat.name }
            });
            return {
              ...cat.toJSON(),
              productCount
            };
          })
        );
        
        return categoriesWithCount;
      } catch (error) {
        throw new Error('Error fetching categories: ' + error.message);
      }
    },

    // ========== DISCOUNT QUERIES ==========
    bestDiscounts: async (_, { limit = 5 }) => {
      try {
        const products = await Product.findAll({
          where: {
            discount: {
              [Op.gt]: 0
            }
          },
          order: [['discount', 'DESC']],
          limit
        });

        const discounts = products.reduce((acc, product) => {
          const percent = product.discount;
          if (!acc[percent]) {
            acc[percent] = {
              title: `${percent}% تخفیف ویژه`,
              description: `محصولات با ${percent} درصد تخفیف`,
              discountPercent: percent,
              validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              products: []
            };
          }
          acc[percent].products.push(product);
          return acc;
        }, {});

        return Object.values(discounts).slice(0, limit);
      } catch (error) {
        throw new Error('Error fetching best discounts: ' + error.message);
      }
    },

    // ========== NEWEST PRODUCTS QUERIES ==========
    newestProducts: async (_, { limit = 8 }) => {
      try {
        return await Product.findAll({
          order: [['createdAt', 'DESC']],
          limit
        });
      } catch (error) {
        throw new Error('Error fetching newest products: ' + error.message);
      }
    },

    // ========== STORE INFO QUERIES ==========
    storeInfo: async () => {
      try {
        const Setting = require('../../models/Setting');
        
        const address = await Setting.findOne({ where: { key: 'store_address' } });
        const phone = await Setting.findOne({ where: { key: 'store_phone' } });
        const email = await Setting.findOne({ where: { key: 'store_email' } });
        const instagram = await Setting.findOne({ where: { key: 'social_instagram' } });
        const telegram = await Setting.findOne({ where: { key: 'social_telegram' } });
        const twitter = await Setting.findOne({ where: { key: 'social_twitter' } });
        const linkedin = await Setting.findOne({ where: { key: 'social_linkedin' } });

        return {
          address: address?.value || 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
          phone: phone?.value || '۰۲۱-۱۲۳۴۵۶۷۸',
          email: email?.value || 'info@quantomshop.com',
          socialLinks: {
            instagram: instagram?.value || '#',
            telegram: telegram?.value || '#',
            twitter: twitter?.value || '#',
            linkedin: linkedin?.value || '#'
          }
        };
      } catch (error) {
        throw new Error('Error fetching store info: ' + error.message);
      }
    }
  },

  Mutation: {
    // ========== PRODUCT MUTATIONS ==========
    createProduct: async (_, { input }) => {
      try {
        if (!input.originalPrice) {
          input.originalPrice = input.price;
        }
        return await Product.create(input);
      } catch (error) {
        throw new Error('Error creating product: ' + error.message);
      }
    },

    updateProduct: async (_, { id, input }) => {
      try {
        const product = await Product.findByPk(id);
        if (!product) {
          throw new Error('Product not found');
        }
        await product.update(input);
        return product;
      } catch (error) {
        throw new Error('Error updating product: ' + error.message);
      }
    },

    deleteProduct: async (_, { id }) => {
      try {
        const deleted = await Product.destroy({ where: { id } });
        return deleted > 0;
      } catch (error) {
        throw new Error('Error deleting product: ' + error.message);
      }
    },

    updateProductStock: async (_, { id, quantity }) => {
      try {
        const product = await Product.findByPk(id);
        if (!product) {
          throw new Error('Product not found');
        }
        await product.update({ stock: quantity });
        return product;
      } catch (error) {
        throw new Error('Error updating stock: ' + error.message);
      }
    },

    // ========== USER MUTATIONS ==========
    registerUser: async (_, { input }) => {
      try {
        const existingUser = await User.findOne({ where: { email: input.email } });
        if (existingUser) {
          throw new Error('User already exists');
        }

        const existingPhone = await User.findOne({ where: { phone: input.phone } });
        if (existingPhone) {
          throw new Error('Phone number already exists');
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        const user = await User.create({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          phone: input.phone,
          avatar: input.avatar || null,
          role: 'user'
        });

        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        user.password = undefined;

        return { token, user };
      } catch (error) {
        throw new Error('Error registering user: ' + error.message);
      }
    },

    loginUser: async (_, { input }) => {
      try {
        const user = await User.findOne({ 
          where: { 
            [Op.or]: [
              { email: input.email },
              { phone: input.email }
            ]
          } 
        });
        
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const validPassword = await bcrypt.compare(input.password, user.password);
        if (!validPassword) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        user.password = undefined;

        return { token, user };
      } catch (error) {
        throw new Error('Error logging in: ' + error.message);
      }
    },

    updateUser: async (_, { id, input }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || (user.userId !== parseInt(id) && user.role !== 'admin')) {
          throw new Error('Not authorized');
        }

        const userToUpdate = await User.findByPk(id);
        if (!userToUpdate) {
          throw new Error('User not found');
        }

        if (input.password) {
          input.password = await bcrypt.hash(input.password, 10);
        }

        await userToUpdate.update(input);
        userToUpdate.password = undefined;
        return userToUpdate;
      } catch (error) {
        throw new Error('Error updating user: ' + error.message);
      }
    },

    deleteUser: async (_, { id }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }

        const deleted = await User.destroy({ where: { id } });
        return deleted > 0;
      } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
      }
    },

    // ========== ORDER MUTATIONS ==========
    createOrder: async (_, { userId, products, shippingAddress, paymentMethod }) => {
      try {
        const totalAmount = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = await Order.create({
          userId,
          products,
          totalAmount,
          shippingAddress,
          paymentMethod,
          status: 'pending'
        });

        for (const item of products) {
          const product = await Product.findByPk(item.productId);
          if (product) {
            await product.update({
              stock: product.stock - item.quantity
            });
          }
        }

        return order;
      } catch (error) {
        throw new Error('Error creating order: ' + error.message);
      }
    },

    updateOrderStatus: async (_, { id, status }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }

        const order = await Order.findByPk(id);
        if (!order) {
          throw new Error('Order not found');
        }
        await order.update({ status });
        return order;
      } catch (error) {
        throw new Error('Error updating order status: ' + error.message);
      }
    },

    cancelOrder: async (_, { id }, context) => {
      try {
        const user = getUser(context.token);
        if (!user) {
          throw new Error('Not authenticated');
        }

        const order = await Order.findByPk(id);
        if (!order) {
          throw new Error('Order not found');
        }

        if (order.userId !== user.userId && user.role !== 'admin') {
          throw new Error('Not authorized');
        }

        if (order.status === 'shipped' || order.status === 'delivered') {
          throw new Error('Order cannot be cancelled');
        }

        await order.update({ status: 'cancelled' });

        const products = order.products;
        for (const item of products) {
          const product = await Product.findByPk(item.productId);
          if (product) {
            await product.update({
              stock: product.stock + item.quantity
            });
          }
        }

        return order;
      } catch (error) {
        throw new Error('Error cancelling order: ' + error.message);
      }
    },

    deleteOrder: async (_, { id }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }

        const deleted = await Order.destroy({ where: { id } });
        return deleted > 0;
      } catch (error) {
        throw new Error('Error deleting order: ' + error.message);
      }
    },

    // ========== SETTING MUTATIONS ==========
    updateSetting: async (_, { key, value, type }) => {
      try {
        const Setting = require('../../models/Setting');
        const [setting, created] = await Setting.findOrCreate({
          where: { key },
          defaults: { key, value, type }
        });
        
        if (!created) {
          await setting.update({ value, type });
        }
        
        return setting;
      } catch (error) {
        throw new Error('Error updating setting: ' + error.message);
      }
    },

    // ========== UPLOAD MUTATIONS ==========
    uploadAvatar: async (_, { file }) => {
      try {
        const { createReadStream, filename, mimetype } = await file;
        
        const uniqueFilename = `${uuidv4()}-${filename}`;
        const uploadPath = path.join(__dirname, '../../../public/uploads', uniqueFilename);
        
        return new Promise((resolve, reject) => {
          createReadStream()
            .pipe(createWriteStream(uploadPath))
            .on('finish', () => {
              resolve({
                filename: uniqueFilename,
                mimetype,
                url: `/uploads/${uniqueFilename}`
              });
            })
            .on('error', reject);
        });
      } catch (error) {
        throw new Error('Error uploading avatar: ' + error.message);
      }
    },

    // ========== OTP MUTATIONS ==========
    forgotPassword: async (_, { phone }) => {
      try {
        const user = await User.findOne({ where: { phone } });
        if (!user) {
          throw new Error('کاربری با این شماره موبایل یافت نشد');
        }

        await Otp.update(
          { isUsed: true },
          { 
            where: { 
              phone, 
              isUsed: false,
              expiresAt: { [Op.gt]: new Date() }
            } 
          }
        );

        const code = generateOtpCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 2);

        await Otp.create({
          phone,
          code,
          expiresAt,
          isUsed: false,
          attempts: 0
        });

        const smsSent = await sendSms(phone, code);
        
        if (!smsSent) {
          throw new Error('خطا در ارسال پیامک');
        }

        return {
          success: true,
          message: 'کد تأیید با موفقیت ارسال شد',
          expiresIn: 120
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    verifyOtp: async (_, { phone, code }) => {
      try {
        const otpRecord = await Otp.findOne({
          where: {
            phone,
            code,
            isUsed: false,
            expiresAt: { [Op.gt]: new Date() }
          }
        });

        if (!otpRecord) {
          throw new Error('کد وارد شده نامعتبر است یا منقضی شده');
        }

        otpRecord.attempts += 1;
        await otpRecord.save();

        if (otpRecord.attempts > 3) {
          await otpRecord.update({ isUsed: true });
          throw new Error('تعداد تلاش‌های ناموفق بیش از حد مجاز است');
        }

        await otpRecord.update({ isUsed: true });

        const tempToken = jwt.sign(
          { phone, purpose: 'reset-password' },
          process.env.JWT_SECRET,
          { expiresIn: '5m' }
        );

        return {
          success: true,
          message: 'کد با موفقیت تأیید شد',
          token: tempToken
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    resetPassword: async (_, { phone, token, newPassword }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.phone !== phone || decoded.purpose !== 'reset-password') {
          throw new Error('توکن نامعتبر است');
        }

        const user = await User.findOne({ where: { phone } });
        if (!user) {
          throw new Error('کاربر یافت نشد');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await user.update({ password: hashedPassword });

        const newToken = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        user.password = undefined;

        return {
          token: newToken,
          user
        };
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw new Error('زمان توکن منقضی شده است. دوباره تلاش کنید');
        }
        throw new Error(error.message);
      }
    },

    // ========== STONE MUTATIONS ==========
    createStone: async (_, { input }) => {
      try {
        return await Stone.create(input);
      } catch (error) {
        throw new Error('Error creating stone: ' + error.message);
      }
    },

    updateStone: async (_, { id, input }) => {
      try {
        const stone = await Stone.findByPk(id);
        if (!stone) {
          throw new Error('Stone not found');
        }
        await stone.update(input);
        return stone;
      } catch (error) {
        throw new Error('Error updating stone: ' + error.message);
      }
    },

    deleteStone: async (_, { id }) => {
      try {
        const deleted = await Stone.destroy({ where: { id } });
        return deleted > 0;
      } catch (error) {
        throw new Error('Error deleting stone: ' + error.message);
      }
    },

    // ========== CATEGORY MUTATIONS ==========
    createCategory: async (_, { input }) => {
      try {
        return await Category.create(input);
      } catch (error) {
        throw new Error('Error creating category: ' + error.message);
      }
    },

    updateCategory: async (_, { id, input }) => {
      try {
        const category = await Category.findByPk(id);
        if (!category) {
          throw new Error('Category not found');
        }
        await category.update(input);
        return category;
      } catch (error) {
        throw new Error('Error updating category: ' + error.message);
      }
    },

    deleteCategory: async (_, { id }) => {
      try {
        const deleted = await Category.destroy({ where: { id } });
        return deleted > 0;
      } catch (error) {
        throw new Error('Error deleting category: ' + error.message);
      }
    }
  }
};

module.exports = resolvers;