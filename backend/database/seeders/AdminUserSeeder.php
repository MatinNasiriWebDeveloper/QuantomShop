<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@quantomshop.ir'],
            [
                'name' => 'مدیر فروشگاه',
                'phone' => '09120000000',
                'password' => Hash::make('Admin@12345'),
                'is_admin' => true,
                'wallet_balance' => 0,
            ]
        );
    }
}
