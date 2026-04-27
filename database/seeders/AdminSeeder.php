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
        Admin::create([
            'user_name' => 'Local Explorer Admim',
            'email' => 'thusithadayan25@gmail.com',
            'password' => Hash::make('8654871Aa@'),
        ]);
    }
}
