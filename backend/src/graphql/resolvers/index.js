const Product = require('../../models/Product');
const User = require('../../models/User');
const Order = require('../../models/Order');
const Otp = require('../../models/Otp');
const Stone = require('../../models/Stone');
const CategoryImage = require('../../models/CategoryImage');
// const Chatbot = require('../../models/Chatbot');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { GraphQLUpload } = require('graphql-upload');
const { createWriteStream } = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const sequelize = require('../../config/database.js');

let FAQ;
try {
  FAQ = require('../../models/FAQ');
} catch (error) {
  console.warn('⚠️ FAQ model not found, creating dynamically');
  const { DataTypes } = require('sequelize');
  FAQ = sequelize.define('FAQ', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question: { type: DataTypes.TEXT, allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING(100) },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' }
  }, { tableName: 'faqs', timestamps: false });
}

let Category;
try {
  Category = require('../../models/Category');
} catch (error) {
  console.warn('⚠️ Category model not found, creating dynamically');
  const { DataTypes } = require('sequelize');
  Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    imageUrl: { type: DataTypes.STRING(500), field: 'image_url' },
    parentId: { type: DataTypes.INTEGER, field: 'parent_id' },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' }
  }, { tableName: 'categories', timestamps: false });
}

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
    console.log(`SMS sent to ${phone}: Your code is ${code}`);
    return true;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
};

const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const intentResponses = {
  greeting: {
    patterns: ['سلام', 'علیک', 'درود', 'خوش آمدید', 'hi', 'hello', 'سلام علیکم', 'سلام خوبی'],
    responses: [
      'سلام! به فروشگاه کوانتوم خوش آمدید. چطور می‌توانم کمک کنم؟',
      'درود! در خدمت شما هستم. چه سوالی دارید؟',
      'سلام! خوشحالم که می‌بینمتون. چه کمکی از دستم برمیاد؟',
      'علیک سلام! به فروشگاه ما خوش اومدید. چطور می‌تونم کمکتون کنم؟'
    ],
    suggestions: ['محصولات', 'قیمت‌ها', 'تماس با ما', 'تخفیفات']
  },
  farewell: {
    patterns: ['خداحافظ', 'خدا نگهدار', 'بای', 'فعلا', 'بدرود', 'خدانگهدار', 'بای بای'],
    responses: [
      'خداحافظ! روز خوبی داشته باشید. منتظر بازگشت شما هستیم',
      'موفق باشید، همیشه خوشحالیم که به ما سر می‌زنید',
      'خدانگهدار، اگر سوالی داشتید ما همیشه اینجا هستیم'
    ],
    suggestions: ['محصولات جدید', 'بهترین تخفیف‌ها', 'ارتباط با پشتیبانی']
  },
  products: {
    patterns: ['محصول', 'کالا', 'خرید', 'فروش', 'قیمت', 'اجناس', 'کالاها', 'محصولات', 'چه چیزایی دارین'],
    responses: [
      'ما محصولات متنوعی در دسته‌بندی‌های موبایل، لپتاپ، تبلت، هدفون و لوازم جانبی داریم. چه دسته‌ای مد نظر شماست؟',
      'برای دیدن همه محصولات می‌تونید به صفحه محصولات مراجعه کنید. دسته‌بندی خاصی مد نظرتان است؟',
      'محصولات ما شامل برندهای معتبر مثل اپل، سامسونگ، شیائومی و... میشه. از چه برندی علاقه دارید؟'
    ],
    suggestions: ['موبایل', 'لپتاپ', 'هدفون', 'تبلت']
  },
  price: {
    patterns: ['قیمت', 'چنده', 'چقدر', 'ارزش', 'هزینه', 'گرون', 'ارزان', 'قیمتش چنده', 'چند تومان'],
    responses: [
      'برای استعلام قیمت دقیق، لطفاً نام محصول را بفرمایید یا از قسمت جستجو استفاده کنید',
      'قیمت‌ها بسته به مدل و مشخصات متفاوت هست. چه محصولی مد نظر شماست؟',
      'می‌تونم لیست قیمت‌های به‌روز رو براتون بفرستم. محصول خاصی مد نظرتونه؟'
    ],
    suggestions: ['گرانترین محصولات', 'ارزانترین محصولات', 'تخفیف دارها', 'محبوب‌ترین‌ها']
  },
  contact: {
    patterns: ['تماس', 'شماره', 'تلفن', 'پشتیبانی', 'support', 'تماس با ما', 'چجوری تماس بگیرم', 'شماره تماس'],
    responses: [
      'شماره پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸\nساعات پاسخگویی: ۹ صبح تا ۸ شب\nتلگرام: @quantom_support',
      'راه‌های ارتباطی:\nتلفن: ۰۲۱-۱۲۳۴۵۶۷۸\nایمیل: support@quantom.com\nتلگرام: @quantom_support',
      'پشتیبانی ۲۴ ساعته از طریق تلگرام و ۹ صبح تا ۸ شب از طریق تلفن پاسخگو هستیم'
    ],
    suggestions: ['آدرس', 'ایمیل', 'ساعات کاری', 'تلگرام']
  },
  address: {
    patterns: ['آدرس', 'موقعیت', 'کجا هستید', 'مکان', 'خیابان', 'آدرستون کجاست', 'محل فروش'],
    responses: [
      'آدرس فروشگاه مرکزی: تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۳۴۵',
      'آدرس ما: تهران، خیابان ولیعصر، نبش کوچه ۱۲، پلاک ۳۴۵\nبرای مسیریابی می‌تونید از گوگل مپ استفاده کنید'
    ],
    suggestions: ['مسیریابی', 'تلفن', 'ساعات کاری', 'شعبات دیگر']
  },
  hours: {
    patterns: ['ساعت کاری', 'تعطیل', 'باز هستید', 'شیفت', 'ساعات', 'کی بازین', 'تا کی بازین'],
    responses: [
      'ساعات کاری فروشگاه:\nشنبه تا چهارشنبه: ۹ صبح تا ۸ شب\nپنجشنبه: ۹ صبح تا ۲ بعدازظهر\nجمعه‌ها تعطیل',
      'همیشه آنلاین هستیم، اما پاسخگویی تلفنی و حضوری در ساعات کاری انجام میشه'
    ],
    suggestions: ['پشتیبانی', 'آدرس', 'ایمیل', 'ارسال']
  },
  discount: {
    patterns: ['تخفیف', 'حراج', 'جشنواره', 'off', 'discount', 'ارزان', 'تخفیف دارین', 'چند درصد تخفیف'],
    responses: [
      'تخفیف‌های ویژه:\n- تا ۳۰٪ تخفیف روی محصولات منتخب\n- خرید بالای ۵۰۰ هزارتومان: ارسال رایگان\n- تخفیف ویژه اعضای جدید',
      'در حال حاضر روی برخی محصولات تا ۳۰٪ تخفیف داریم. به بخش تخفیفات ویژه سر بزنید',
      'برای دیدن آخرین تخفیف‌ها و جشنواره‌ها، صفحه تخفیفات رو چک کنید'
    ],
    suggestions: ['بهترین تخفیف‌ها', 'پرطرفدارها', 'جدیدترین‌ها', 'شگفت‌انگیز']
  },
  delivery: {
    patterns: ['ارسال', 'پست', 'تحویل', 'حمل', 'مرسوله', 'بسته', 'چقد طول میکشه', 'چجوری میرسونین'],
    responses: [
      'روش‌های ارسال:\n- پست پیشتاز: ۲ تا ۴ روز کاری (هزینه: ۵۰,۰۰۰ تومان)\n- پیک موتوری: فقط تهران (همان روز)\n- ارسال رایگان برای خریدهای بالای ۵۰۰,۰۰۰ تومان',
      'سفارش‌ها معمولاً ۲۴ ساعت بعد از ثبت، تحویل پست داده می‌شن و می‌تونید از طریق کد رهگیری پیگیری کنید'
    ],
    suggestions: ['هزینه ارسال', 'پیگیری سفارش', 'شرایط بازگشت', 'زمان تحویل']
  },
  return: {
    patterns: ['بازگشت', 'پس دادن', 'تعویض', 'مرجوع', 'عوض کردن', 'پس گرفتن', 'ضمانت بازگشت'],
    responses: [
      'شرایط بازگشت کالا:\n- تا ۷ روز پس از تحویل\n- کالا در شرایط اولیه باشه\n- با هماهنگی پشتیبانی\n- هزینه بازگشت بر عهده مشتری',
      'برای بازگشت یا تعویض کالا، لطفاً با پشتیبانی تماس بگیرید تا راهنماییتون کنن'
    ],
    suggestions: ['شرایط بازگشت', 'تماس با پشتیبانی', 'قوانین', 'گارانتی']
  },
  payment: {
    patterns: ['پرداخت', 'کارت', 'کش کارت', 'bank', 'پول', 'پرداخت آنلاین', 'چجوری پرداخت کنم', 'روش پرداخت'],
    responses: [
      'روش‌های پرداخت:\n- پرداخت آنلاین از طریق درگاه بانکی\n- کارت به کارت\n- پرداخت در محل (فقط تهران)',
      'پرداخت آنلاین از طریق درگاه امن بانکی انجام میشه و بلافاصله سفارش شما ثبت میشه'
    ],
    suggestions: ['پرداخت آنلاین', 'کارت به کارت', 'پرداخت در محل', 'خرید اقساطی']
  },
  warranty: {
    patterns: ['گارانتی', 'ضمانت', 'خرابی', 'معیوب', 'تعمیر', 'گارانتی داره', 'چند ماه گارانتی'],
    responses: [
      'کلیه محصولات ما دارای گارانتی ۱۸ ماهه هستند.\nخدمات پس از فروش در تمام نمایندگی‌های مجاز',
      'گارانتی معتبر اصالت کالا و سلامت فیزیکی محصول رو پوشش میده. برای محصولات خاص، گارانتی طلایی هم داریم'
    ],
    suggestions: ['شرایط گارانتی', 'خدمات پس از فروش', 'نمایندگی‌ها', 'تعمیرات']
  },
  shipping_cost: {
    patterns: ['هزینه ارسال', 'پست چقدر', 'هزینه پست', 'چقدر میشه', 'کرایه'],
    responses: [
      'هزینه ارسال:\n- پست پیشتاز: ۵۰,۰۰۰ تومان\n- پیک موتوری (تهران): ۸۰,۰۰۰ تومان\n- خرید بالای ۵۰۰,۰۰۰ تومان: ارسال رایگان',
      'هزینه ارسال بستگی به محل و روش ارسال داره. معمولاً ۵۰ تا ۸۰ هزار تومان متغیر هست'
    ],
    suggestions: ['ارسال رایگان', 'پیگیری سفارش', 'زمان ارسال']
  },
  track_order: {
    patterns: ['پیگیری', 'رهگیری', 'کد رهگیری', 'سفارش من', 'کجاست', 'کی میرسه'],
    responses: [
      'برای پیگیری سفارش:\n۱. کد رهگیری رو از پیامک دریافت کردید\n۲. به سایت پست مراجعه کنید\n۳. یا از بخش پیگیری سفارش در سایت ما استفاده کنید',
      'برای پیگیری وضعیت سفارش، لطفاً شماره سفارش یا کد رهگیری رو بدید تا براتون چک کنم'
    ],
    suggestions: ['پیگیری سفارش', 'تماس با پشتیبانی', 'زمان تحویل']
  },
  register: {
    patterns: ['ثبت نام', 'عضو', 'عضویت', 'اکانت', 'حساب کاربری', 'چجوری عضو بشم'],
    responses: [
      'برای ثبت نام:\n۱. کلیک روی "ثبت نام"\n۲. وارد کردن ایمیل و شماره موبایل\n۳. تایید کد پیامک شده\n۴. تکمیل اطلاعات',
      'عضویت در سایت رایگانه و با ثبت نام می‌تونید از تخفیف‌های ویژه اعضای جدید استفاده کنید'
    ],
    suggestions: ['ثبت نام', 'ورود', 'فراموشی رمز', 'مزایای عضویت']
  },
  forgot_password: {
    patterns: ['رمز عبور', 'پسورد', 'فراموش کردم', 'رمز یادم نیست', 'بازیابی رمز'],
    responses: [
      'برای بازیابی رمز عبور:\n۱. کلیک روی "فراموشی رمز عبور"\n۲. وارد کردن شماره موبایل\n۳. دریافت کد تأیید\n۴. تنظیم رمز جدید',
      'اگر رمزتون رو فراموش کردید، از طریق گزینه "فراموشی رمز" می‌تونید رمز جدید تنظیم کنید'
    ],
    suggestions: ['فراموشی رمز', 'تماس با پشتیبانی', 'ورود']
  },
  complaint: {
    patterns: ['شکایت', 'گلایه', 'ناراضی', 'مشکل', 'خراب', 'معیوب', 'کیفیت بد'],
    responses: [
      'از مشکل پیش اومده متاسفیم. لطفاً با پشتیبانی تماس بگیرید تا در اسرع وقت رسیدگی کنیم:\nتلفن: ۰۲۱-۱۲۳۴۵۶۷۸',
      'باعث تأسفه که مشکل داشتید. لطفاً شماره سفارش و توضیح مشکل رو بدید تا پیگیری کنیم'
    ],
    suggestions: ['تماس با پشتیبانی', 'شرایط بازگشت', 'گارانتی']
  },
  recommendation: {
    patterns: ['پیشنهاد', 'کدوم خوبه', 'کدوم رو بخرم', 'بهترین', 'محبوب', 'پرطرفدار'],
    responses: [
      'محصولات پرطرفدار ما:\n- آیفون ۱۳\n- هدفون سونی\n- لپتاپ MacBook Air\n- پاوربانک شیائومی',
      'بر اساس فروش و بازخورد مشتری‌ها، می‌تونم این محصولات رو پیشنهاد بدم...'
    ],
    suggestions: ['پرفروش‌ترین‌ها', 'محبوب‌ترین‌ها', 'جدیدترین‌ها']
  },
  stock: {
    patterns: ['موجود', 'دارید', 'تموم', 'انبار', 'موجودی', 'چند تا دارین'],
    responses: [
      'برای اطلاع از موجودی محصول خاصی، لطفاً نام محصول رو بفرمایید تا چک کنم',
      'موجودی محصولات به‌صورت لحظه‌ای در سایت آپدیت میشه. لطفاً صفحه محصول رو چک کنید'
    ],
    suggestions: ['محصولات موجود', 'محصولات ناموجود', 'محصولات جدید']
  },
  about_us: {
    patterns: ['درباره ما', 'درباره تون', 'کی هستین', 'چه کار می‌کنین', 'معرفی'],
    responses: [
      'فروشگاه کوانتوم از سال ۱۳۹۵ در زمینه فروش محصولات دیجیتال فعالیت می‌کنه. هدف ما ارائه بهترین کالا با مناسب‌ترین قیمته',
      'ما توی کوانتوم سعی می‌کنیم بهترین تجربه خرید رو براتون فراهم کنیم. برای اطلاعات بیشتر درباره ما می‌تونید به صفحه "درباره ما" برید'
    ],
    suggestions: ['درباره ما', 'تماس با ما', 'قوانین', 'همکاری با ما']
  }
};

const resolvers = {
  Upload: GraphQLUpload,

  Product: {
    finalPrice: (parent) => {
      const discount = parent.discount || 0;
      return parent.price * (1 - discount / 100);
    }
  },

  Category: {
    productCount: async (parent) => {
      try {
        return await Product.count({
          where: { category: parent.name }
        });
      } catch (error) {
        return 0;
      }
    },
    children: async (parent) => {
      try {
        return await Category.findAll({
          where: { parentId: parent.id, isActive: true }
        });
      } catch (error) {
        return [];
      }
    }
  },

  Query: {
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

    bestSellers: async (_, { limit = 15 }) => {
      try {
        return await Product.findAll({
          order: [
            ['discount', 'DESC'],
            ['createdAt', 'DESC']
          ],
          limit
        });
      } catch (error) {
        throw new Error('Error fetching best sellers: ' + error.message);
      }
    },

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

    categories: async () => {
      try {
        const categories = await Category.findAll({
          where: { isActive: true, parentId: null },
          order: [['order', 'ASC'], ['name', 'ASC']]
        });
        return categories || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },

    categoryImages: async () => {
      try {
        return await CategoryImage.findAll({
          order: [['order', 'ASC']]
        });
      } catch (error) {
        throw new Error('Error fetching category images: ' + error.message);
      }
    },

    activeCategoryImages: async () => {
      try {
        return await CategoryImage.findAll({
          where: { active: true },
          order: [['order', 'ASC']]
        });
      } catch (error) {
        throw new Error('Error fetching active category images: ' + error.message);
      }
    },

    categorySections: async () => {
      try {
        return [
          {
            id: '1',
            title: 'دسته‌بندی محصولات',
            viewAllLink: '/categories',
            icon: 'grid',
            categories: [
              {
                id: '1',
                name: 'موبایل',
                imageUrl: '/images/categories/mobile.jpg',
                link: '/category/mobile'
              },
              {
                id: '2',
                name: 'لپتاپ',
                imageUrl: '/images/categories/laptop.jpg',
                link: '/category/laptop'
              },
              {
                id: '3',
                name: 'هدفون',
                imageUrl: '/images/categories/headphone.jpg',
                link: '/category/headphone'
              },
              {
                id: '4',
                name: 'تبلت',
                imageUrl: '/images/categories/tablet.jpg',
                link: '/category/tablet'
              }
            ]
          }
        ];
      } catch (error) {
        throw new Error('Error fetching category sections: ' + error.message);
      }
    },

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
              id: `discount-${percent}`,
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
    },

    getFAQs: async (_, { category }) => {
      try {
        const where = { isActive: true };
        if (category) {
          where.category = category;
        }
        return await FAQ.findAll({
          where,
          order: [['order', 'ASC']]
        });
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        return [];
      }
    },

    searchFAQ: async (_, { question }) => {
      try {
        const faqs = await FAQ.findAll({
          where: {
            [Op.or]: [
              { question: { [Op.like]: `%${question}%` } },
              { answer: { [Op.like]: `%${question}%` } }
            ],
            isActive: true
          },
          order: [['order', 'ASC']],
          limit: 10
        });
        
        return faqs.map(faq => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category
        }));
      } catch (error) {
        console.error('Error searching FAQs:', error);
        return [];
      }
    },

    getChatHistory: async (_, { userId, limit = 50, offset = 0 }) => {
      try {
        const messages = await Chatbot.getChatHistory(userId, limit, offset);
        const totalCount = await Chatbot.getChatHistoryCount(userId);
        return { messages, totalCount };
      } catch (error) {
        throw new Error('خطا در دریافت تاریخچه چت: ' + error.message);
      }
    },

    getUnansweredQuestions: async (_, __, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        return await Chatbot.getUnansweredQuestions();
      } catch (error) {
        throw new Error('خطا در دریافت سوالات بی‌پاسخ: ' + error.message);
      }
    },

    getBotTrainingData: async (_, { category }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        return await Chatbot.getTrainingData(category);
      } catch (error) {
        throw new Error('خطا در دریافت داده‌های آموزشی: ' + error.message);
      }
    },

    getBotStats: async (_, __, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        return await Chatbot.getBotStats();
      } catch (error) {
        throw new Error('خطا در دریافت آمار بات: ' + error.message);
      }
    },

    searchInChatHistory: async (_, { userId, keyword }) => {
      try {
        return await Chatbot.searchMessages(userId, keyword);
      } catch (error) {
        throw new Error('خطا در جستجوی پیام‌ها: ' + error.message);
      }
    },

    getQuickReplies: async (_, { category }) => {
      try {
        return await Chatbot.getQuickReplies(category);
      } catch (error) {
        throw new Error('خطا در دریافت پاسخ‌های سریع: ' + error.message);
      }
    },

    getActiveConversations: async (_, __, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        return await Chatbot.getActiveConversations();
      } catch (error) {
        throw new Error('خطا در دریافت مکالمات فعال: ' + error.message);
      }
    },

    getBotFeedbackStats: async (_, { startDate, endDate }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        return await Chatbot.getFeedbackStats(startDate, endDate);
      } catch (error) {
        throw new Error('خطا در دریافت آمار بازخورد: ' + error.message);
      }
    }
  },

  Mutation: {
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
    },

    createCategoryImage: async (_, { input }) => {
      try {
        return await CategoryImage.create(input);
      } catch (error) {
        throw new Error('Error creating category image: ' + error.message);
      }
    },

    updateCategoryImage: async (_, { id, input }) => {
      try {
        const categoryImage = await CategoryImage.findByPk(id);
        if (!categoryImage) {
          throw new Error('Category image not found');
        }
        await categoryImage.update(input);
        return categoryImage;
      } catch (error) {
        throw new Error('Error updating category image: ' + error.message);
      }
    },

    deleteCategoryImage: async (_, { id }) => {
      try {
        const deleted = await CategoryImage.destroy({ where: { id } });
        return deleted > 0;
      } catch (error) {
        throw new Error('Error deleting category image: ' + error.message);
      }
    },

    createFAQ: async (_, { input }) => {
      try {
        return await FAQ.create(input);
      } catch (error) {
        throw new Error('Error creating FAQ: ' + error.message);
      }
    },

    updateFAQ: async (_, { id, input }) => {
      try {
        const faq = await FAQ.findByPk(id);
        if (!faq) {
          throw new Error('FAQ not found');
        }
        await faq.update(input);
        return faq;
      } catch (error) {
        throw new Error('Error updating FAQ: ' + error.message);
      }
    },

    deleteFAQ: async (_, { id }) => {
      try {
        const deleted = await FAQ.destroy({ where: { id } });
        return deleted > 0;
      } catch (error) {
        throw new Error('Error deleting FAQ: ' + error.message);
      }
    },

    saveMessage: async (_, { user_message, bot_response }) => {
      try {
        const userId = 1;
        
        await Chatbot.saveMessage(userId, user_message, false);
        await Chatbot.saveMessage(userId, bot_response, true);
        
        return {
          id: Date.now().toString(),
          user_message: user_message,
          bot_response: bot_response,
          created_at: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error in saveMessage:', error);
        throw new Error('خطا در ذخیره پیام: ' + error.message);
      }
    },

    sendChatMessage: async (_, { userId, message }) => {
      try {
        await Chatbot.saveMessage(userId, message, false);

        const response = await processIntent(message, userId);
        
        await Chatbot.saveMessage(userId, response.answer, true);

        if (response.category === 'unknown') {
          const user = await User.findByPk(userId);
          await Chatbot.saveUnansweredQuestion(userId, message, user?.name);
        }

        await Chatbot.updateIntentStats(userId, response.category);

        return response;
      } catch (error) {
        throw new Error('خطا در پردازش پیام: ' + error.message);
      }
    },

    clearChatHistory: async (_, { userId }) => {
      try {
        await Chatbot.clearHistory(userId);
        return true;
      } catch (error) {
        throw new Error('خطا در پاک کردن تاریخچه: ' + error.message);
      }
    },

    trainBot: async (_, { question, answer, category }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        return await Chatbot.addTrainingData(question, answer, category);
      } catch (error) {
        throw new Error('خطا در آموزش بات: ' + error.message);
      }
    },

    trainBotBatch: async (_, { inputs }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        
        let count = 0;
        for (const input of inputs) {
          await Chatbot.addTrainingData(input.question, input.answer, input.category);
          count++;
        }
        return count;
      } catch (error) {
        throw new Error('خطا در آموزش گروهی بات: ' + error.message);
      }
    },

    deleteTrainingData: async (_, { id }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        await Chatbot.deleteTrainingData(id);
        return true;
      } catch (error) {
        throw new Error('خطا در حذف داده آموزشی: ' + error.message);
      }
    },

    markQuestionAsAnswered: async (_, { unansweredId, answer }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }

        const unanswered = await Chatbot.getUnansweredQuestion(unansweredId);
        const training = await Chatbot.addTrainingData(
          unanswered.question,
          answer,
          'user_answered'
        );
        await Chatbot.deleteUnansweredQuestion(unansweredId);
        return training;
      } catch (error) {
        throw new Error('خطا در ثبت پاسخ: ' + error.message);
      }
    },

    rateBotResponse: async (_, { messageId, rating, comment }) => {
      try {
        if (rating < 1 || rating > 5) {
          throw new Error('امتیاز باید بین ۱ تا ۵ باشد');
        }
        await Chatbot.rateMessage(messageId, rating, comment);
        return true;
      } catch (error) {
        throw new Error('خطا در ثبت امتیاز: ' + error.message);
      }
    },

    createQuickReply: async (_, { input }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        return await Chatbot.createQuickReply(input);
      } catch (error) {
        throw new Error('خطا در ایجاد پاسخ سریع: ' + error.message);
      }
    },

    updateQuickReply: async (_, { id, input }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        return await Chatbot.updateQuickReply(id, input);
      } catch (error) {
        throw new Error('خطا در بروزرسانی پاسخ سریع: ' + error.message);
      }
    },

    deleteQuickReply: async (_, { id }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }
        await Chatbot.deleteQuickReply(id);
        return true;
      } catch (error) {
        throw new Error('خطا در حذف پاسخ سریع: ' + error.message);
      }
    },

    endConversation: async (_, { userId }) => {
      try {
        return await Chatbot.endConversation(userId);
      } catch (error) {
        throw new Error('خطا در پایان مکالمه: ' + error.message);
      }
    },

    exportChatHistory: async (_, { userId }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || (user.userId !== parseInt(userId) && user.role !== 'admin')) {
          throw new Error('Not authorized');
        }

        const messages = await Chatbot.getChatHistory(userId, 1000, 0);
        
        const exportDir = path.join(__dirname, '../../../exports');
        if (!fs.existsSync(exportDir)) {
          fs.mkdirSync(exportDir, { recursive: true });
        }
        
        const fileName = `chat_history_${userId}_${Date.now()}.csv`;
        const filePath = path.join(exportDir, fileName);
        
        let csvContent = 'تاریخ,پیام,بات,امتیاز\n';
        
        messages.forEach(m => {
          const date = m.createdAt ? new Date(m.createdAt).toLocaleString('fa-IR') : '-';
          const message = (m.message || '').replace(/,/g, '،');
          const isBot = m.isBot ? 'بله' : 'خیر';
          const rating = m.rating || '-';
          
          csvContent += `"${date}","${message}",${isBot},${rating}\n`;
        });
        
        fs.writeFileSync(filePath, csvContent, 'utf8');
        
        return filePath;
      } catch (error) {
        throw new Error('خطا در خروجی گرفتن: ' + error.message);
      }
    },

    importTrainingData: async (_, { file }, context) => {
      try {
        const user = getUser(context.token);
        if (!user || user.role !== 'admin') {
          throw new Error('Not authorized');
        }

        const { createReadStream } = await file;
        const stream = createReadStream();
        
        return new Promise((resolve, reject) => {
          const results = [];
          let buffer = '';
          
          stream.on('data', (chunk) => {
            buffer += chunk.toString();
          });
          
          stream.on('end', async () => {
            try {
              const lines = buffer.split('\n');
              const headers = lines[0].split(',');
              
              for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                const values = lines[i].split(',');
                const row = {};
                
                headers.forEach((header, index) => {
                  row[header.trim()] = values[index]?.trim() || '';
                });
                
                if (row.question && row.answer) {
                  await Chatbot.addTrainingData(
                    row.question,
                    row.answer,
                    row.category || 'imported'
                  );
                  results.push(row);
                }
              }
              
              resolve(results.length);
            } catch (error) {
              reject(error);
            }
          });
          
          stream.on('error', reject);
        });
      } catch (error) {
        throw new Error('خطا در ایمپورت داده‌ها: ' + error.message);
      }
    }
  }
};

async function processIntent(message, userId) {
  const lowerMessage = message.toLowerCase().trim();
  
  const quickReplies = await Chatbot.getQuickReplies();
  for (const reply of quickReplies) {
    const matched = reply.keywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    if (matched) {
      return {
        answer: reply.response,
        category: reply.category,
        suggestions: await getSuggestionsForCategory(reply.category)
      };
    }
  }
  
  for (const [intent, data] of Object.entries(intentResponses)) {
    const matched = data.patterns.some(pattern => 
      lowerMessage.includes(pattern.toLowerCase())
    );
    
    if (matched) {
      const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
      
      const suggestions = await getDynamicSuggestions(intent, userId);
      
      return {
        answer: randomResponse,
        category: intent,
        suggestions: suggestions.length > 0 ? suggestions : data.suggestions
      };
    }
  }

  const trainedAnswer = await Chatbot.findBestMatch(lowerMessage);
  if (trainedAnswer && trainedAnswer.relevance > 0.3) {
    return {
      answer: trainedAnswer.answer,
      category: trainedAnswer.category,
      suggestions: await Chatbot.getRelatedQuestions(trainedAnswer.category)
    };
  }

  return {
    answer: 'متوجه سوالتون نشدم. لطفاً کمی واضح‌تر بپرسید. می‌تونم در این موارد کمکتون کنم:\n\n🛍️ محصولات و قیمت‌ها\n🚚 روش‌های ارسال\n💰 تخفیف‌ها و جشنواره‌ها\n📞 تماس با پشتیبانی\n🔄 شرایط بازگشت کالا',
    category: 'unknown',
    suggestions: ['محصولات', 'تماس با پشتیبانی', 'قیمت‌ها', 'ارسال', 'تخفیف‌ها', 'شرایط بازگشت']
  };
}

async function getDynamicSuggestions(intent, userId) {
  const suggestions = [];
  
  try {
    switch(intent) {
      case 'products':
        const products = await Product.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
          limit: 3
        });
        suggestions.push(...products.map(p => p.category));
        break;
        
      case 'discount':
        const discounted = await Product.findAll({
          where: { discount: { [Op.gt]: 0 } },
          order: [['discount', 'DESC']],
          limit: 3,
          attributes: ['name']
        });
        suggestions.push(...discounted.map(p => p.name.substring(0, 20)));
        break;
        
      case 'newest':
        const newest = await Product.findAll({
          order: [['createdAt', 'DESC']],
          limit: 3,
          attributes: ['name']
        });
        suggestions.push(...newest.map(p => p.name.substring(0, 20)));
        break;
    }
  } catch (error) {
    console.error('Error in getDynamicSuggestions:', error);
  }
  
  return suggestions;
}

async function getSuggestionsForCategory(category) {
  const suggestions = [];
  
  switch(category) {
    case 'products':
      suggestions.push('موبایل', 'لپتاپ', 'هدفون');
      break;
    case 'delivery':
      suggestions.push('هزینه ارسال', 'زمان تحویل', 'پیگیری سفارش');
      break;
    case 'payment':
      suggestions.push('پرداخت آنلاین', 'کارت به کارت', 'پرداخت در محل');
      break;
    case 'price':
      suggestions.push('آیفون ۱۳', 'سامسونگ S23', 'هدفون سونی');
      break;
    case 'contact':
      suggestions.push('تلفن', 'ایمیل', 'آدرس');
      break;
    default:
      suggestions.push('محصولات', 'تماس با ما', 'تخفیف‌ها');
  }
  
  return suggestions;
}

module.exports = resolvers;