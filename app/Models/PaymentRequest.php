<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'amount',
    'currency',
    'exchange_rate',
    'exchange_rate_source',
    'exchange_rate_timestamp',
    'converted_amount_eur',
    'status',
    'description'
])]
class PaymentRequest extends Model
{
    use HasFactory;

    /**
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'exchange_rate' => 'decimal:6',
            'exchange_rate_timestamp' => 'datetime',
            'converted_amount_eur' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted(): void
    {
        static::updating(function ($paymentRequest) {
            $immutableFields = [
                'user_id',
                'amount',
                'currency',
                'exchange_rate',
                'exchange_rate_source',
                'exchange_rate_timestamp',
                'converted_amount_eur'
            ];

            foreach ($immutableFields as $field) {
                if ($paymentRequest->isDirty($field)) {
                    // Silently restore the original values to enforce immutability
                    $paymentRequest->setAttribute($field, $paymentRequest->getOriginal($field));
                }
            }
        });
    }
}
