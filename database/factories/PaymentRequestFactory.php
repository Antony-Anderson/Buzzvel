<?php

namespace Database\Factories;

use App\Models\PaymentRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentRequest>
 */
class PaymentRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'amount' => fake()->randomFloat(2, 10, 1000),
            'currency' => fake()->randomElement(['USD', 'BRL', 'GBP']),
            'exchange_rate' => 1.0,
            'exchange_rate_source' => 'https://api.exchangerate-api.com',
            'exchange_rate_timestamp' => now(),
            'converted_amount_eur' => fn (array $attributes) => $attributes['amount'],
            'status' => 'pending',
            'description' => fake()->sentence(),
        ];
    }
}
