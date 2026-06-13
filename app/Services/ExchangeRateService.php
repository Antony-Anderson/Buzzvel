<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Exception;

class ExchangeRateService
{
    private const API_URL = 'https://open.er-api.com/v6/latest/EUR';
    private const SOURCE = 'https://api.exchangerate-api.com';

    /**
     * Fetch EUR to target currency exchange rate.
     *
     * @param string $currency
     * @return array{rate: float, source: string, timestamp: int}
     * @throws ValidationException|Exception
     */
    public function getRate(string $currency): array
    {
        $currency = strtoupper($currency);

        if ($currency === 'EUR') {
            return [
                'rate' => 1.0,
                'source' => self::SOURCE,
                'timestamp' => now()->timestamp,
            ];
        }

        try {
            $response = Http::timeout(10)->get(self::API_URL);

            if ($response->failed()) {
                Log::error('Exchange rate API returned error response', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new Exception('Could not fetch exchange rates from provider.');
            }

            $data = $response->json();

            if (!isset($data['rates'])) {
                Log::error('Exchange rate API response missing rates', ['data' => $data]);
                throw new Exception('Invalid response structure from exchange rate provider.');
            }

            if (!isset($data['rates'][$currency])) {
                throw ValidationException::withMessages([
                    'currency' => "The currency code '{$currency}' is not supported."
                ]);
            }

            return [
                'rate' => (float) $data['rates'][$currency],
                'source' => self::SOURCE,
                'timestamp' => now()->timestamp,
            ];
        } catch (ValidationException $e) {
            throw $e;
        } catch (Exception $e) {
            Log::error('Exchange rate fetch exception', ['message' => $e->getMessage()]);
            throw new Exception('Failed to connect to exchange rate provider: ' . $e->getMessage());
        }
    }
}
