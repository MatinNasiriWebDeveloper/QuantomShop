<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryImage;
use Illuminate\Database\Seeder;

class CategoryImageSeeder extends Seeder
{
    public function run(): void
    {
        $images = [
            ['name' => 'گوشی موبایل', 'image' => '/images/products/iphone13promax.webp', 'link' => '/products?category=گوشی موبایل'],
            ['name' => 'لپ تاپ', 'image' => '/images/products/11.webp', 'link' => '/products?category=لپ تاپ'],
            ['name' => 'هدفون و هندزفری', 'image' => '/images/products/13.webp', 'link' => '/products?category=هدفون و هندزفری'],
            ['name' => 'ساعت هوشمند', 'image' => '/images/products/15.webp', 'link' => '/products?category=ساعت هوشمند'],
        ];

        foreach ($images as $order => $data) {
            CategoryImage::updateOrCreate(
                ['name' => $data['name']],
                [
                    'category_id' => Category::where('name', $data['name'])->value('id'),
                    'image_url' => $data['image'],
                    'link' => $data['link'],
                    'order' => $order + 1,
                    'is_active' => true,
                ]
            );
        }
    }
}
