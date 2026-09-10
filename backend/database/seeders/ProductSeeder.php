<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'گوشی موبایل اپل مدل iPhone 13 Pro Max ظرفیت 256 گیگابایت', 'price' => 52000000, 'discount' => 15, 'brand' => 'apple', 'category' => 'گوشی موبایل', 'stock' => 12, 'image' => '/images/products/iphone13promax.webp', 'description' => 'گوشی هوشمند اپل با دوربین حرفه‌ای، صفحه‌نمایش سوپر رتینا و باتری پرقدرت.', 'featured' => true],
            ['name' => 'گوشی موبایل سامسونگ مدل Galaxy S23 Ultra ظرفیت 256 گیگابایت', 'price' => 47000000, 'discount' => 0, 'brand' => 'samsung', 'category' => 'گوشی موبایل', 'stock' => 8, 'image' => '/images/products/2.webp', 'description' => 'دوربین 200 مگاپیکسلی، قلم S Pen و عملکرد فوق‌العاده در تمام شرایط.', 'featured' => true],
            ['name' => 'گوشی موبایل نوکیا مدل G42 5G', 'price' => 12500000, 'discount' => 15, 'brand' => 'nokia', 'category' => 'گوشی موبایل', 'stock' => 20, 'image' => '/images/products/1.webp', 'description' => 'گوشی مقاوم و بادوام با پشتیبانی از شبکه 5G و بدنه قابل تعمیر.', 'featured' => true],
            ['name' => 'لپ‌تاپ ایسوس مدل VivoBook 15 پردازنده Core i7', 'price' => 38500000, 'discount' => 10, 'brand' => 'asus', 'category' => 'لپ تاپ', 'stock' => 6, 'image' => '/images/products/11.webp', 'description' => 'لپ‌تاپ سبک و قدرتمند مناسب کار و طراحی، با صفحه‌نمایش فول اچ‌دی.', 'featured' => true],
            ['name' => 'لپ‌تاپ ایسر مدل Aspire 7 پردازنده Core i5', 'price' => 29900000, 'discount' => 0, 'brand' => 'acer', 'category' => 'لپ تاپ', 'stock' => 5, 'image' => '/images/products/12.webp', 'description' => 'گرافیک اختصاصی و خنک‌کنندگی مناسب برای بازی و کارهای گرافیکی سبک.', 'featured' => true],
            ['name' => 'هدفون بی‌سیم جی‌بی‌ال مدل Tune 720BT', 'price' => 4200000, 'discount' => 20, 'brand' => 'jbl', 'category' => 'هدفون و هندزفری', 'stock' => 30, 'image' => '/images/products/13.webp', 'description' => 'صدای باس قدرتمند JBL Pure Bass و باتری تا 76 ساعت پخش موسیقی.', 'featured' => true, 'bestSeller' => true],
            ['name' => 'هدفون بی‌سیم سونی مدل WH-CH520', 'price' => 3800000, 'discount' => 0, 'brand' => 'sony', 'category' => 'هدفون و هندزفری', 'stock' => 18, 'image' => '/images/products/14.webp', 'description' => 'طراحی سبک و راحت با کیفیت صدای وضوح‌بالا و میکروفون باکیفیت برای تماس.', 'bestSeller' => true],
            ['name' => 'ساعت هوشمند اپل واچ سری 9 سایز 45 میلی‌متر', 'price' => 24500000, 'discount' => 15, 'brand' => 'apple', 'category' => 'ساعت هوشمند', 'stock' => 10, 'image' => '/images/products/15.webp', 'description' => 'صفحه‌نمایش Always-On، سنجش ضربان قلب و اکسیژن خون، مقاوم در برابر آب.', 'bestSeller' => true],
            ['name' => 'ساعت هوشمند سامسونگ مدل Galaxy Watch6', 'price' => 15900000, 'discount' => 0, 'brand' => 'samsung', 'category' => 'ساعت هوشمند', 'stock' => 14, 'image' => '/images/products/16.webp', 'description' => 'طراحی شیک با قاب فلزی، پایش سلامت پیشرفته و باتری با دوام بالا.', 'bestSeller' => true],
            ['name' => 'اسپیکر بلوتوثی جی‌بی‌ال مدل Charge 5', 'price' => 6900000, 'discount' => 15, 'brand' => 'jbl', 'category' => 'اسپیکر', 'stock' => 22, 'image' => '/images/products/4545.jpg', 'description' => 'ضدآب و ضدگرد و غبار با صدای قدرتمند و قابلیت شارژ سایر دستگاه‌ها.', 'bestSeller' => true],
            ['name' => 'اسپیکر بلوتوثی انکر مدل Soundcore Motion+', 'price' => 5200000, 'discount' => 0, 'brand' => 'anker', 'category' => 'اسپیکر', 'stock' => 16, 'image' => '/images/products/qw.webp', 'description' => 'صدای Hi-Res با باس تنظیم‌شونده و طراحی جمع‌وجور برای سفر.'],
            ['name' => 'تلویزیون ال‌جی مدل 55UQ7500 هوشمند سایز 55 اینچ', 'price' => 32000000, 'discount' => 15, 'brand' => 'lg', 'category' => 'تلویزیون', 'stock' => 4, 'image' => '/images/products/eee.jpg', 'description' => 'کیفیت تصویر 4K با پردازنده هوش مصنوعی و پشتیبانی از webOS.'],
            ['name' => 'پاوربانک انکر مدل PowerCore 20000mAh', 'price' => 2100000, 'discount' => 15, 'brand' => 'anker', 'category' => 'لوازم جانبی', 'stock' => 40, 'image' => '/images/products/123.webp', 'description' => 'شارژ سریع دوگانه، ظرفیت بالا و طراحی ایمن مناسب سفر و مسافرت.'],
            ['name' => 'روتر بی‌سیم تی‌پی‌لینک مدل Archer C6', 'price' => 2450000, 'discount' => 0, 'brand' => 'tp-link', 'category' => 'لوازم جانبی', 'stock' => 25, 'image' => '/images/products/web.webp', 'description' => 'پشتیبانی از فرکانس دوگانه و سرعت بالا برای شبکه خانگی و اداری.'],
            ['name' => 'ساعت هوشمند هایلو مدل Solar Plus', 'price' => 3600000, 'discount' => 15, 'brand' => 'haylou', 'category' => 'ساعت هوشمند', 'stock' => 27, 'image' => '/images/products/images.jpg', 'description' => 'باتری با دوام تا 30 روز، پایش سلامت و صفحه‌نمایش روشن AMOLED.'],
            ['name' => 'یخچال فریزر تسکو مدل TF 350 نوفراست', 'price' => 46500000, 'discount' => 0, 'brand' => 'tesco', 'category' => 'لوازم خانگی', 'stock' => 3, 'image' => '/images/products/gg.avif', 'description' => 'سیستم نوفراست، مصرف انرژی پایین و ظرفیت مناسب برای خانواده.'],
        ];

        foreach ($products as $index => $data) {
            $slug = $data['brand'].'-'.($index + 1);

            Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => Category::where('name', $data['category'])->value('id'),
                    'brand_id' => Brand::where('name_en', $data['brand'])->value('id'),
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'price' => $data['price'],
                    'discount' => $data['discount'],
                    'stock' => $data['stock'],
                    'image_url' => $data['image'],
                    'is_featured' => $data['featured'] ?? false,
                    'is_best_seller' => $data['bestSeller'] ?? false,
                ]
            );
        }
    }
}
