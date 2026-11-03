<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = env('ADMIN_SEED_EMAIL', 'admin@localexplorer.com');
        $password = env('ADMIN_SEED_PASSWORD', 'Admin@123456');

        Admin::firstOrCreate(
            ['email' => $email],
            [
                'user_name' => 'Local Explorer Admin',
                'password' => Hash::make($password),
            ]
        );
    }
}
