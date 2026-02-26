const fetch = require('cross-fetch');

const GRAPHQL_URL = 'http://localhost:4000/graphql';

// لیست عکس‌های محصولات
const productImages = [
  {
    id: 1,
    name: "گوشی موبایل اپل آیفون ۱۴ پرو مکس",
    price: 68900000,
    stock: 10,
    imageUrl: "https://dkstatics-public.digikala.com/digikala-products/iphone14.jpg"
  },
  {
    id: 2,
    name: "گوشی موبایل سامسونگ گلکسی S23 اولترا",
    price: 52900000,
    stock: 12,
    imageUrl: "https://dkstatics-public.digikala.com/digikala-products/s23ultra.jpg"
  },
  {
    id: 3,
    name: "گوشی موبایل شیائومی ۱۳ اولترا",
    price: 42900000,
    stock: 9,
    imageUrl: "https://dkstatics-public.digikala.com/digikala-products/xiaomi13.jpg"
  },
  {
    id: 4,
    name: "گوشی موبایل هواوی P60 پرو",
    price: 35900000,
    stock: 8,
    imageUrl: "https://dkstatics-public.digikala.com/digikala-products/huaweip60.jpg"
  },
  {
    id: 5,
    name: "هدفون بی‌سیم سونی WH-1000XM5",
    price: 14900000,
    stock: 18,
    imageUrl: "https://dkstatics-public.digikala.com/digikala-products/sonywh1000xm5.jpg"
  },
  {
    id: 6,
    name: "هدفون بی‌سیم اپل ایرپادز پرو",
    price: 14900000,
    stock: 25,
    imageUrl: "https://dkstatics-public.digikala.com/digikala-products/airpodspro2.jpg"
  },
  {
    id: 7,
    name: "ساعت هوشمند سامسونگ گلکسی واچ ۶",
    price: 12900000,
    stock: 15,
    imageUrl: "https://dkstatics-public.digikala.com/digikala-products/galaxywatch6.jpg"
  },
  {
    id: 8,
    name: "ساعت هوشمند اپل واچ سری ۹",
    price: 29900000,
    stock: 8,
    imageUrl: "https://dkstatics-public.digikala.com/digikala-products/applewatch9.jpg"
  },
  {
    id: 9,
    name: "لپ تاپ اپل مک‌بوک پرو",
    price: 89900000,
    stock: 5,
    imageUrl: "https://dkstatics-public.digikala.com/digikala-products/macbookpro.jpg"
  },
  {
    id: 10,
    name: "تبلت اپل آیپد پرو",
    price: 65900000,
    stock: 6,
    imageUrl: "https://dkstatics-public.digikala.com/digikala-products/ipadpro.jpg"
  }
];

async function updateProductImage(product) {
  const mutation = `
    mutation UpdateProduct($id: ID!, $input: ProductInput!) {
      updateProduct(id: $id, input: $input) {
        id
        name
        imageUrl
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
          id: product.id.toString(),
          input: {
            name: product.name,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl
          }
        }
      })
    });

    const result = await response.json();
    if (result.errors) {
      console.error(`❌ خطا در آپدیت محصول ${product.id}:`, result.errors[0].message);
    } else {
      console.log(`✅ محصول ${product.id} (${product.name}) با عکس آپدیت شد`);
    }
    return result;
  } catch (error) {
    console.error(`❌ خطا در آپدیت محصول ${product.id}:`, error.message);
  }
}

async function updateAllProducts() {
  console.log('🚀 شروع آپدیت عکس محصولات...\n');
  console.log(`📊 تعداد محصولات: ${productImages.length}\n`);
  
  for (let i = 0; i < productImages.length; i++) {
    console.log(`در حال آپدیت محصول ${i + 1} از ${productImages.length}...`);
    await updateProductImage(productImages[i]);
    
    // کمی صبر کن تا سرور تحت فشار قرار نگیره
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🎉 آپدیت عکس همه محصولات با موفقیت به پایان رسید!');
}

// اجرا
updateAllProducts();