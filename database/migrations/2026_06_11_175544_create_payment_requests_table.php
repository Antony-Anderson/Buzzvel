<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2)->unsigned();
            $table->string('currency', 3)->index();
            $table->decimal('exchange_rate', 18, 6);
            $table->string('exchange_rate_source');
            $table->timestamp('exchange_rate_timestamp');
            $table->decimal('converted_amount_eur', 15, 2);
            $table->string('status')->default('pending')->index();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_requests');
    }
};
