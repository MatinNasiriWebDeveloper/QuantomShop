<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'mobile' => 'گوشی موبایل',
            'tablet' => 'تبلت',
            'laptop' => 'لپ تاپ',
            'headphone' => 'هدفون و هندزفری',
            'watch' => 'ساعت هوشمند',
            'speaker' => 'اسپیکر',
            'tv' => 'تلویزیون',
            'appliance' => 'لوازم خانگی',
            'accessories' => 'لوازم جانبی',
        ];

        foreach (array_values($categories) as $order => $name) {
            $slug = array_search($name, $categories, true);

            Category::updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'order' => $order]
            );
        }
    }
}
