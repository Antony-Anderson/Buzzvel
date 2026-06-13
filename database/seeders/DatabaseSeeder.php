<?php

namespace Database\Seeders;

use App\Models\PaymentRequest;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user1 = User::updateOrCreate(
            ['email' => 'user@buzzvel.com'],
            [
                'name' => 'Antony Anderson',
                'password' => 'test123',
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        $user2 = User::updateOrCreate(
            ['email' => 'client@buzzvel.com'],
            [
                'name' => 'Client User',
                'password' => 'test123',
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        $finance1 = User::updateOrCreate(
            ['email' => 'finance@buzzvel.com'],
            [
                'name' => 'Finance Director',
                'password' => 'test123',
                'role' => 'finance',
                'email_verified_at' => now(),
            ]
        );

        $finance2 = User::updateOrCreate(
            ['email' => 'finance2@buzzvel.com'],
            [
                'name' => 'Finance Analyst',
                'password' => 'test123',
                'role' => 'finance',
                'email_verified_at' => now(),
            ]
        );

        PaymentRequest::create([
            'user_id' => $user1->id,
            'amount' => 600.00,
            'currency' => 'BRL',
            'exchange_rate' => 6.00,
            'exchange_rate_source' => 'https://api.exchangerate-api.com',
            'exchange_rate_timestamp' => now(),
            'converted_amount_eur' => 100.00,
            'status' => 'pending',
            'description' => 'Serviços de desenvolvimento backend',
        ]);

        PaymentRequest::create([
            'user_id' => $user1->id,
            'amount' => 110.00,
            'currency' => 'USD',
            'exchange_rate' => 1.10,
            'exchange_rate_source' => 'https://api.exchangerate-api.com',
            'exchange_rate_timestamp' => now(),
            'converted_amount_eur' => 100.00,
            'status' => 'approved',
            'description' => 'Servidor da AWS (Maio)',
        ]);

        PaymentRequest::create([
            'user_id' => $user2->id,
            'amount' => 250.00,
            'currency' => 'EUR',
            'exchange_rate' => 1.00,
            'exchange_rate_source' => 'https://api.exchangerate-api.com',
            'exchange_rate_timestamp' => now(),
            'converted_amount_eur' => 250.00,
            'status' => 'rejected',
            'description' => 'Curso de capacitação Vue.js',
        ]);

        PaymentRequest::create([
            'user_id' => $user1->id,
            'amount' => 85.00,
            'currency' => 'GBP',
            'exchange_rate' => 0.85,
            'exchange_rate_source' => 'https://api.exchangerate-api.com',
            'exchange_rate_timestamp' => now()->subDays(3),
            'converted_amount_eur' => 100.00,
            'status' => 'expired',
            'description' => 'Assinatura Jira software',
            'created_at' => now()->subDays(3),
        ]);
        
        PaymentRequest::factory(5)->create([
            'user_id' => $user2->id,
        ]);
    }
}
