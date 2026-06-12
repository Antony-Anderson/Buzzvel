<?php

namespace App\Console\Commands;

use App\Models\PaymentRequest;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ExpirePendingPaymentRequests extends Command
{
    /**
     * @var string
     */
    protected $signature = 'payment-requests:expire';

    /**
     * @var string
     */
    protected $description = 'Automatically expire payment requests that remain pending for more than 48 hours';

    public function handle(): int
    {
        $this->info('Starting check for expired payment requests...');

        $cutoff = now()->subHours(48);

        $expiredCount = PaymentRequest::where('status', 'pending')
            ->where('created_at', '<=', $cutoff)
            ->update(['status' => 'expired']);

        $message = "Expired {$expiredCount} payment request(s) that were pending for more than 48 hours.";
        $this->info($message);
        Log::info($message);

        return 0;
    }
}
