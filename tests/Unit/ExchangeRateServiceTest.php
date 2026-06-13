<?php

namespace Tests\Unit;

use App\Services\ExchangeRateService;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Exception;
use Tests\TestCase;

class ExchangeRateServiceTest extends TestCase
{
    private ExchangeRateService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ExchangeRateService();
    }

    public function test_eur_returns_one_immediately_without_http_call(): void
    {
        Http::fake();

        $result = $this->service->getRate('EUR');

        $this->assertEquals(1.0, $result['rate']);
        $this->assertEquals('https://api.exchangerate-api.com', $result['source']);
        $this->assertLessThanOrEqual(now()->timestamp, $result['timestamp']);

        Http::assertNothingSent();
    }

    public function test_fetches_valid_currency_rate(): void
    {
        Http::fake([
            'open.er-api.com/*' => Http::response([
                'rates' => [
                    'USD' => 1.09,
                    'BRL' => 5.95,
                ]
            ], 200)
        ]);

        $result = $this->service->getRate('BRL');

        $this->assertEquals(5.95, $result['rate']);
        $this->assertEquals('https://api.exchangerate-api.com', $result['source']);
    }

    public function test_throws_validation_exception_for_unsupported_currency(): void
    {
        Http::fake([
            'open.er-api.com/*' => Http::response([
                'rates' => [
                    'USD' => 1.09,
                ]
            ], 200)
        ]);

        $this->expectException(ValidationException::class);
        $this->service->getRate('XYZ');
    }

    public function test_throws_exception_on_api_failure(): void
    {
        Http::fake([
            'open.er-api.com/*' => Http::response('Service unavailable', 503)
        ]);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Failed to connect to exchange rate provider: Could not fetch exchange rates from provider.');
        
        $this->service->getRate('USD');
    }

    public function test_throws_exception_on_invalid_json_structure(): void
    {
        Http::fake([
            'open.er-api.com/*' => Http::response(['invalid_key' => 'no_rates'], 200)
        ]);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Failed to connect to exchange rate provider: Invalid response structure from exchange rate provider.');
        
        $this->service->getRate('USD');
    }
}
