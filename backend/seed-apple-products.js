const fetch = require('cross-fetch');

const GRAPHQL_URL = 'http://localhost:4000/graphql';

// ۲۰ محصول برای برند اپل
const appleProducts = [
  {
    name: 'گوشی موبایل اپل آیفون ۱۴ پرو مکس ۱ ترابایت',
    price: 68900000,
    description: 'گوشی موبایل اپل آیفون ۱۴ پرو مکس با حافظه ۱ ترابایت و رم ۶ گیگابایت - نات اکتیو',
    category: 'گوشی موبایل',
    brand: 'apple',
    discount: 5,
    stock: 10,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/iphone14promax.jpg'
  },
  {
    name: 'گوشی موبایل اپل آیفون ۱۴ پرو ۵۱۲ گیگابایت',
    price: 58900000,
    description: 'گوشی موبایل اپل آیفون ۱۴ پرو با حافظه ۵۱۲ گیگابایت و رم ۶ گیگابایت',
    category: 'گوشی موبایل',
    brand: 'apple',
    discount: 7,
    stock: 12,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/iphone14pro.jpg'
  },
  {
    name: 'گوشی موبایل اپل آیفون ۱۴ پلاس ۲۵۶ گیگابایت',
    price: 45900000,
    description: 'گوشی موبایل اپل آیفون ۱۴ پلاس با حافظه ۲۵۶ گیگابایت و رم ۶ گیگابایت',
    category: 'گوشی موبایل',
    brand: 'apple',
    discount: 8,
    stock: 15,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/iphone14plus.jpg'
  },
  {
    name: 'گوشی موبایل اپل آیفون ۱۴ ۱۲۸ گیگابایت',
    price: 39900000,
    description: 'گوشی موبایل اپل آیفون ۱۴ با حافظه ۱۲۸ گیگابایت و رم ۶ گیگابایت',
    category: 'گوشی موبایل',
    brand: 'apple',
    discount: 10,
    stock: 20,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/iphone14.jpg'
  },
  {
    name: 'گوشی موبایل اپل آیفون ۱۳ پرو مکس ۱ ترابایت',
    price: 55900000,
    description: 'گوشی موبایل اپل آیفون ۱۳ پرو مکس با حافظه ۱ ترابایت و رم ۶ گیگابایت',
    category: 'گوشی موبایل',
    brand: 'apple',
    discount: 12,
    stock: 8,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/iphone13promax.jpg'
  },
  {
    name: 'گوشی موبایل اپل آیفون ۱۳ پرو ۵۱۲ گیگابایت',
    price: 49900000,
    description: 'گوشی موبایل اپل آیفون ۱۳ پرو با حافظه ۵۱۲ گیگابایت و رم ۶ گیگابایت',
    category: 'گوشی موبایل',
    brand: 'apple',
    discount: 10,
    stock: 10,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/iphone13pro.jpg'
  },
  {
    name: 'گوشی موبایل اپل آیفون ۱۳ ۲۵۶ گیگابایت',
    price: 38900000,
    description: 'گوشی موبایل اپل آیفون ۱۳ با حافظه ۲۵۶ گیگابایت و رم ۴ گیگابایت',
    category: 'گوشی موبایل',
    brand: 'apple',
    discount: 8,
    stock: 15,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/iphone13.jpg'
  },
  {
    name: 'تبلت اپل آیپد پرو ۱۲.۹ اینچ M2 ۱ ترابایت',
    price: 65900000,
    description: 'تبلت اپل آیپد پرو ۱۲.۹ اینچ با تراشه M2 و ۱ ترابایت حافظه',
    category: 'تبلت',
    brand: 'apple',
    discount: 5,
    stock: 5,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/ipadpro12.jpg'
  },
  {
    name: 'تبلت اپل آیپد پرو ۱۱ اینچ M2 ۵۱۲ گیگابایت',
    price: 45900000,
    description: 'تبلت اپل آیپد پرو ۱۱ اینچ با تراشه M2 و ۵۱۲ گیگابایت حافظه',
    category: 'تبلت',
    brand: 'apple',
    discount: 7,
    stock: 7,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/ipadpro11.jpg'
  },
  {
    name: 'تبلت اپل آیپد ایر ۵ ۲۵۶ گیگابایت',
    price: 32900000,
    description: 'تبلت اپل آیپد ایر ۵ با تراشه M1 و ۲۵۶ گیگابایت حافظه',
    category: 'تبلت',
    brand: 'apple',
    discount: 8,
    stock: 10,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/ipadair5.jpg'
  },
  {
    name: 'لپ تاپ اپل مک‌بوک پرو ۱۴ اینچ M2 پرو ۱ ترابایت',
    price: 89900000,
    description: 'لپ تاپ اپل مک‌بوک پرو ۱۴ اینچ با تراشه M2 پرو و ۱ ترابایت حافظه',
    category: 'لپ تاپ',
    brand: 'apple',
    discount: 3,
    stock: 4,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/macbookpro14.jpg'
  },
  {
    name: 'لپ تاپ اپل مک‌بوک ایر ۱۳ اینچ M2 ۵۱۲ گیگابایت',
    price: 55900000,
    description: 'لپ تاپ اپل مک‌بوک ایر ۱۳ اینچ با تراشه M2 و ۵۱۲ گیگابایت حافظه',
    category: 'لپ تاپ',
    brand: 'apple',
    discount: 5,
    stock: 6,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/macbookair13.jpg'
  },
  {
    name: 'هدفون بی‌سیم اپل ایرپادز مکس',
    price: 25900000,
    description: 'هدفون بی‌سیم اپل ایرپادز مکس با قابلیت حذف نویز فعال',
    category: 'هدفون',
    brand: 'apple',
    discount: 7,
    stock: 12,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/airpodsmax.jpg'
  },
  {
    name: 'هدفون بی‌سیم اپل ایرپادز پرو نسل ۲',
    price: 14900000,
    description: 'هدفون بی‌سیم اپل ایرپادز پرو نسل ۲ با قابلیت حذف نویز',
    category: 'هدفون',
    brand: 'apple',
    discount: 5,
    stock: 25,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/airpodspro2.jpg'
  },
  {
    name: 'هدفون بی‌سیم اپل ایرپادز نسل ۳',
    price: 9900000,
    description: 'هدفون بی‌سیم اپل ایرپادز نسل ۳ با کیفیت صدای عالی',
    category: 'هدفون',
    brand: 'apple',
    discount: 8,
    stock: 30,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/airpods3.jpg'
  },
  {
    name: 'ساعت هوشمند اپل واچ اولترا ۲',
    price: 45900000,
    description: 'ساعت هوشمند اپل واچ اولترا ۲ با قابلیت اندازه‌گیری اکسیژن خون',
    category: 'ساعت هوشمند',
    brand: 'apple',
    discount: 3,
    stock: 5,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/applewatchultra2.jpg'
  },
  {
    name: 'ساعت هوشمند اپل واچ سری ۹',
    price: 29900000,
    description: 'ساعت هوشمند اپل واچ سری ۹ با صفحه نمایش Always-On',
    category: 'ساعت هوشمند',
    brand: 'apple',
    discount: 5,
    stock: 8,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/applewatch9.jpg'
  },
  {
    name: 'ساعت هوشمند اپل واچ سری ۸',
    price: 24900000,
    description: 'ساعت هوشمند اپل واچ سری ۸ با قابلیت اندازه‌گیری دمای بدن',
    category: 'ساعت هوشمند',
    brand: 'apple',
    discount: 7,
    stock: 10,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/applewatch8.jpg'
  },
  {
    name: 'شارژر بی‌سیم اپل مگ‌سیف',
    price: 5900000,
    description: 'شارژر بی‌سیم اپل مگ‌سیف با قابلیت شارژ سریع',
    category: 'لوازم جانبی',
    brand: 'apple',
    discount: 5,
    stock: 20,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/magsafe.jpg'
  },
  {
    name: 'کیف محافظ اپل برای آیفون ۱۴ پرو',
    price: 3900000,
    description: 'کیف محافظ سیلیکونی اپل برای آیفون ۱۴ پرو با قابلیت مگ‌سیف',
    category: 'لوازم جانبی',
    brand: 'apple',
    discount: 10,
    stock: 25,
    imageUrl: 'https://dkstatics-public.digikala.com/digikala-products/applecase.jpg'
  }
];

async function createProduct(product) {
  const mutation = `
    mutation CreateProduct($input: ProductInput!) {
      createProduct(input: $input) {
        id
        name
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
            originalPrice: product.price
          }
        }
      })
    });

    const result = await response.json();
    if (result.errors) {
      console.error(`❌ خطا در ایجاد محصول "${product.name}":`, result.errors[0].message);
    } else {
      console.log(`✅ محصول "${product.name}" با موفقیت ایجاد شد`);
    }
    return result;
  } catch (error) {
    console.error(`❌ خطا در ایجاد محصول "${product.name}":`, error.message);
  }
}

async function seedAppleProducts() {
  console.log('🚀 شروع ایجاد ۲۰ محصول برای برند اپل...\n');
  
  for (let i = 0; i < appleProducts.length; i++) {
    console.log(`در حال ایجاد محصول ${i + 1} از ۲۰...`);
    await createProduct(appleProducts[i]);
    // کمی صبر کن تا سرور تحت فشار قرار نگیره
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n🎉 ایجاد محصولات برند اپل با موفقیت به پایان رسید!');
}

// اجرا
seedAppleProducts();