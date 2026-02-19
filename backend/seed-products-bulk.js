const fetch = require('cross-fetch');

const GRAPHQL_URL = 'http://localhost:4000/graphql';

// لیست برندها با نام فارسی و انگلیسی
const brands = [
  { name: 'اپل', nameEn: 'apple', category: 'گوشی موبایل' },
  { name: 'سامسونگ', nameEn: 'samsung', category: 'گوشی موبایل' },
  { name: 'شیائومی', nameEn: 'xiaomi', category: 'گوشی موبایل' },
  { name: 'هوآوی', nameEn: 'huawei', category: 'گوشی موبایل' },
  { name: 'نوکیا', nameEn: 'nokia', category: 'گوشی موبایل' },
  { name: 'سونی', nameEn: 'sony', category: 'گوشی موبایل' },
  { name: 'الجی', nameEn: 'lg', category: 'گوشی موبایل' },
  { name: 'گوگل', nameEn: 'google', category: 'گوشی موبایل' },
  { name: 'وان‌پلاس', nameEn: 'oneplus', category: 'گوشی موبایل' },
  { name: 'ریلمی', nameEn: 'realme', category: 'گوشی موبایل' }
];

// تابع ایجاد محصولات برای یک برند
async function createProductsForBrand(brand, count = 20) {
  console.log(`\n📱 شروع ایجاد ${count} محصول برای برند ${brand.name}...`);

  for (let i = 1; i <= count; i++) {
    // تولید قیمت تصادفی بین 5 تا 50 میلیون
    const price = Math.floor(Math.random() * (50000000 - 5000000) + 5000000);
    // تخفیف تصادفی بین 0 تا 25 درصد
    const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 25) : 0;
    // موجودی تصادفی بین 5 تا 50
    const stock = Math.floor(Math.random() * 45) + 5;
    
    // تاریخ تصادفی برای createdAt (بین 1 تا 365 روز قبل)
    const daysAgo = Math.floor(Math.random() * 365);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    // انتخاب تصادفی دسته‌بندی
    const categories = ['گوشی موبایل', 'تبلت', 'لپ تاپ', 'هدفون', 'ساعت هوشمند', 'لوازم جانبی'];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const product = {
      name: `${brand.name} مدل ${brand.nameEn} ${i} ${category === 'گوشی موبایل' ? 'پرو' : 'اولترا'} ${Math.floor(Math.random() * 1000)}`,
      price: price,
      description: `${brand.name} ${category} با کیفیت عالی و طراحی منحصر به فرد. مناسب برای کاربری روزمره و حرفه‌ای.`,
      category: category,
      brand: brand.nameEn,
      discount: discount,
      stock: stock,
      imageUrl: `https://via.placeholder.com/300x300?text=${brand.name}+${i}`,
      originalPrice: price,
      createdAt: createdAt
    };

    await createProduct(product);
    
    // نمایش پیشرفت
    if (i % 5 === 0 || i === count) {
      console.log(`   ✅ ${i}/${count} محصول ایجاد شد`);
    }
    
    // کمی صبر کن تا سرور تحت فشار قرار نگیره
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// تابع ایجاد یک محصول
async function createProduct(product) {
  const mutation = `
    mutation CreateProduct($input: ProductInput!) {
      createProduct(input: $input) {
        id
        name
        brand
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            brand: product.brand,
            discount: product.discount,
            stock: product.stock,
            imageUrl: product.imageUrl,
            originalPrice: product.originalPrice
          }
        }
      })
    });

    const result = await response.json();
    if (result.errors) {
      console.error(`   ❌ خطا: ${result.errors[0].message}`);
      return null;
    }
    return result.data?.createProduct;
  } catch (error) {
    console.error(`   ❌ خطا: ${error.message}`);
    return null;
  }
}

// تابع اصلی
async function seedAllProducts() {
  console.log('🚀 ===== شروع ایجاد محصولات برای تمام برندها =====\n');
  
  const totalProducts = brands.length * 20;
  console.log(`📊 تعداد کل محصولات: ${totalProducts}`);
  console.log(`📊 تعداد برندها: ${brands.length}`);
  console.log(`📊 محصولات هر برند: ۲۰ عدد\n`);

  let totalCreated = 0;

  for (const brand of brands) {
    await createProductsForBrand(brand, 20);
    totalCreated += 20;
    console.log(`   ✨ مجموع محصولات ایجاد شده تا کنون: ${totalCreated}\n`);
  }

  console.log('\n🎉 ===== ایجاد همه محصولات با موفقیت به پایان رسید =====');
  console.log(`📦 مجموع محصولات ایجاد شده: ${totalCreated}`);
}

// اجرا
seedAllProducts();