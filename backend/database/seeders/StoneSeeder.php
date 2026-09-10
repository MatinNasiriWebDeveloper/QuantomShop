<?php

namespace Database\Seeders;

use App\Models\Stone;
use Illuminate\Database\Seeder;

class StoneSeeder extends Seeder
{
    public function run(): void
    {
        $stones = [
            ['name' => 'سنگ مرمر تراورتن عباس‌آباد', 'category' => 'سنگ نما', 'origin' => 'ایران', 'price' => 3200000, 'image' => '/images/banners/stone.png', 'description' => 'سنگ تراورتن با رگه‌های طلایی، مقاوم در برابر رطوبت و مناسب نمای ساختمان.'],
            ['name' => 'سنگ گرانیت مشکی نطنز', 'category' => 'سنگ کف', 'origin' => 'ایران', 'price' => 4100000, 'image' => '/images/banners/NewStoneImage.png', 'description' => 'سختی و دوام بالا، مناسب برای کف‌سازی فضاهای پرتردد و پله.'],
            ['name' => 'سنگ مصنوعی دکوراتیو کلاسیک', 'category' => 'سنگ دکوراتیو', 'origin' => 'ایران', 'price' => 1850000, 'image' => '/images/banners/part2.png', 'description' => 'وزن سبک و نصب آسان، مناسب برای دیوارپوش داخلی و نمای ویلا.'],
            ['name' => 'سنگ لاشه طبیعی رستیک', 'category' => 'سنگ دکوراتیو', 'origin' => 'ایران', 'price' => 1450000, 'image' => '/images/banners/partN.png', 'description' => 'ظاهری طبیعی و خام، انتخابی محبوب برای فضای سبز و آبنما.'],
        ];

        foreach ($stones as $data) {
            Stone::updateOrCreate(
                ['name' => $data['name']],
                [
                    'category' => $data['category'],
                    'origin' => $data['origin'],
                    'price' => $data['price'],
                    'image_url' => $data['image'],
                    'description' => $data['description'],
                ]
            );
        }
    }
}
