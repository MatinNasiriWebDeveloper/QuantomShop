<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            'apple' => 'اپل',
            'samsung' => 'سامسونگ',
            'sony' => 'سونی',
            'lg' => 'ال‌جی',
            'haylou' => 'هایلو',
            'jbl' => 'جی‌بی‌ال',
            'nokia' => 'نوکیا',
            'tp-link' => 'تی‌پی‌لینک',
            'tesco' => 'تسکو',
            'anker' => 'انکر',
            'acer' => 'ایسر',
            'asus' => 'ایسوس',
        ];

        foreach ($brands as $nameEn => $name) {
            Brand::updateOrCreate(
                ['name_en' => $nameEn],
                ['name' => $name, 'slug' => $nameEn]
            );
        }
    }
}
