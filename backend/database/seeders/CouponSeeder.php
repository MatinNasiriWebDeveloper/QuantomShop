<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            ['code' => 'WELCOME10', 'percent' => 10, 'max_discount' => 200000],
            ['code' => 'QUANTOM20', 'percent' => 20, 'max_discount' => 500000],
        ];

        foreach ($coupons as $data) {
            Coupon::updateOrCreate(
                ['code' => $data['code']],
                [
                    'percent' => $data['percent'],
                    'max_discount' => $data['max_discount'],
                    'usage_limit' => null,
                    'expires_at' => now()->addMonths(6),
                    'is_active' => true,
                ]
            );
        }
    }
}
