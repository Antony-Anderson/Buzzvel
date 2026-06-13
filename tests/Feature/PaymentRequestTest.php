<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\PaymentRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentRequestTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Http::fake([
            'open.er-api.com/*' => Http::response([
                'rates' => [
                    'USD' => 1.10,
                    'BRL' => 6.00,
                    'GBP' => 0.85,
                ]
            ], 200)
        ]);
    }

    public function test_authenticated_user_can_create_a_payment_request_with_automatic_exchange_rate_conversion(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)
            ->postJson('/api/payment-requests/create', [
                'amount' => 120.00,
                'currency' => 'BRL',
                'description' => 'Serviços de Desenvolvimento',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'type',
                'message',
                'data' => [
                    'id',
                    'user_id',
                    'amount',
                    'currency',
                    'exchange_rate',
                    'exchange_rate_source',
                    'exchange_rate_timestamp',
                    'converted_amount_eur',
                    'status',
                    'description',
                    'created_at',
                    'updated_at',
                ]
            ])
            ->assertJsonPath('data.converted_amount_eur', '20.00')
            ->assertJsonPath('data.exchange_rate', '6.000000')
            ->assertJsonPath('data.exchange_rate_source', 'https://api.exchangerate-api.com')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('payment_requests', [
            'user_id' => $user->id,
            'amount' => 120.00,
            'currency' => 'BRL',
            'exchange_rate' => 6.00,
            'converted_amount_eur' => 20.00,
            'status' => 'pending',
            'description' => 'Serviços de Desenvolvimento',
        ]);
    }

    public function test_creating_payment_request_in_EUR_uses_rate_of_1_0_without_fetching_external_API(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/payment-requests/create', [
                'amount' => 50.00,
                'currency' => 'EUR',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.converted_amount_eur', '50.00')
            ->assertJsonPath('data.exchange_rate', '1.000000');
    }

    public function test_payment_request_validation_checks_for_invalid_inputs(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/payment-requests/create', [
                'amount' => -10.00,
                'currency' => 'USD',
            ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);


        $response = $this->actingAs($user)
            ->postJson('/api/payment-requests/create', [
                'amount' => 100.00,
                'currency' => 'US',
            ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['currency']);

        $response = $this->actingAs($user)
            ->postJson('/api/payment-requests/create', [
                'amount' => 100.00,
                'currency' => 'XYZ',
            ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['currency']);
    }

    public function test_users_can_only_list_their_own_requests_while_finance_can_list_all(): void
    {
        $user1 = User::factory()->create(['role' => 'user']);
        $user2 = User::factory()->create(['role' => 'user']);
        $finance = User::factory()->create(['role' => 'finance']);

        $req1 = PaymentRequest::factory()->create([
            'user_id' => $user1->id,
            'amount' => 100.00,
            'currency' => 'USD',
            'exchange_rate' => 1.10,
            'converted_amount_eur' => 90.91,
            'exchange_rate_source' => 'https://api.exchangerate-api.com',
            'exchange_rate_timestamp' => now(),
        ]);

        $req2 = PaymentRequest::factory()->create([
            'user_id' => $user2->id,
            'amount' => 200.00,
            'currency' => 'USD',
            'exchange_rate' => 1.10,
            'converted_amount_eur' => 181.82,
            'exchange_rate_source' => 'https://api.exchangerate-api.com',
            'exchange_rate_timestamp' => now(),
        ]);

        $response = $this->actingAs($user1)->getJson('/api/payment-requests');
        $response->assertStatus(200);
        $data = $response->json('data.data');
        $this->assertCount(1, $data);
        $this->assertEquals($req1->id, $data[0]['id']);

        $response = $this->actingAs($finance)->getJson('/api/payment-requests');
        $response->assertStatus(200);
        $data = $response->json('data.data');
        $this->assertCount(2, $data);
    }

    public function test_payment_requests_list_can_be_filtered_by_status(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        PaymentRequest::factory()->create([
            'user_id' => $user->id,
            'amount' => 100,
            'currency' => 'USD',
            'exchange_rate' => 1,
            'converted_amount_eur' => 100,
            'exchange_rate_source' => 'test',
            'exchange_rate_timestamp' => now(),
            'status' => 'pending',
        ]);

        PaymentRequest::factory()->create([
            'user_id' => $user->id,
            'amount' => 200,
            'currency' => 'USD',
            'exchange_rate' => 1,
            'converted_amount_eur' => 200,
            'exchange_rate_source' => 'test',
            'exchange_rate_timestamp' => now(),
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)->getJson('/api/payment-requests?status=approved');
        $response->assertStatus(200);
        $data = $response->json('data.data');
        $this->assertCount(1, $data);
        $this->assertEquals('approved', $data[0]['status']);
    }

    public function test_only_owner_and_finance_can_view_details_of_a_payment_request(): void
    {
        $owner = User::factory()->create(['role' => 'user']);
        $other = User::factory()->create(['role' => 'user']);
        $finance = User::factory()->create(['role' => 'finance']);

        $req = PaymentRequest::factory()->create([
            'user_id' => $owner->id,
            'amount' => 100,
            'currency' => 'USD',
            'exchange_rate' => 1,
            'converted_amount_eur' => 100,
            'exchange_rate_source' => 'test',
            'exchange_rate_timestamp' => now(),
        ]);

        $this->actingAs($owner)->getJson("/api/payment-requests/{$req->id}/show")
            ->assertStatus(200);

        $this->actingAs($finance)->getJson("/api/payment-requests/{$req->id}/show")
            ->assertStatus(200);

        $this->actingAs($other)->getJson("/api/payment-requests/{$req->id}/show")
            ->assertStatus(403);
    }

    public function test_only_finance_role_can_approve_or_reject_a_pending_payment_request(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $finance = User::factory()->create(['role' => 'finance']);

        $req = PaymentRequest::factory()->create([
            'user_id' => $user->id,
            'amount' => 100,
            'currency' => 'USD',
            'exchange_rate' => 1,
            'converted_amount_eur' => 100,
            'exchange_rate_source' => 'test',
            'exchange_rate_timestamp' => now(),
            'status' => 'pending',
        ]);

        $this->actingAs($user)->patchJson("/api/payment-requests/{$req->id}/update", ['status' => 'approved'])
            ->assertStatus(403);

        $this->actingAs($finance)->patchJson("/api/payment-requests/{$req->id}/update", ['status' => 'approved'])
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('payment_requests', [
            'id' => $req->id,
            'status' => 'approved',
        ]);
    }

    public function test_cannot_update_status_of_non_pending_requests(): void
    {
        $finance = User::factory()->create(['role' => 'finance']);

        $req = PaymentRequest::factory()->create([
            'user_id' => $finance->id,
            'amount' => 100,
            'currency' => 'USD',
            'exchange_rate' => 1,
            'converted_amount_eur' => 100,
            'exchange_rate_source' => 'test',
            'exchange_rate_timestamp' => now(),
            'status' => 'approved',
        ]);

        $this->actingAs($finance)->patchJson("/api/payment-requests/{$req->id}/update", ['status' => 'rejected'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Only pending payment requests can be updated.');
    }

    public function test_immutable_fields_cannot_be_modified_on_update(): void
    {
        $finance = User::factory()->create(['role' => 'finance']);

        $req = PaymentRequest::factory()->create([
            'user_id' => $finance->id,
            'amount' => 100.00,
            'currency' => 'USD',
            'exchange_rate' => 1.10,
            'converted_amount_eur' => 90.91,
            'exchange_rate_source' => 'https://api.exchangerate-api.com',
            'exchange_rate_timestamp' => now(),
            'status' => 'pending',
        ]);


        $req->update([
            'amount' => 999.00,
            'currency' => 'EUR',
            'exchange_rate' => 2.0,
            'status' => 'approved'
        ]);

        $req->refresh();
        $this->assertEquals('100.00', $req->amount);
        $this->assertEquals('USD', $req->currency);
        $this->assertEquals('1.100000', $req->exchange_rate);
        $this->assertEquals('approved', $req->status);
    }

    public function test_scheduled_command_expires_pending_payment_requests_older_than_48_hours(): void
    {
        $user = User::factory()->create();

        $oldPending = PaymentRequest::factory()->create([
            'user_id' => $user->id,
            'amount' => 100,
            'currency' => 'USD',
            'exchange_rate' => 1.0,
            'converted_amount_eur' => 100,
            'exchange_rate_source' => 'test',
            'exchange_rate_timestamp' => now(),
            'status' => 'pending',
            'created_at' => now()->subHours(49),
        ]);

        $newPending = PaymentRequest::factory()->create([
            'user_id' => $user->id,
            'amount' => 100,
            'currency' => 'USD',
            'exchange_rate' => 1.0,
            'converted_amount_eur' => 100,
            'exchange_rate_source' => 'test',
            'exchange_rate_timestamp' => now(),
            'status' => 'pending',
            'created_at' => now()->subHours(47),
        ]);

        $oldApproved = PaymentRequest::factory()->create([
            'user_id' => $user->id,
            'amount' => 100,
            'currency' => 'USD',
            'exchange_rate' => 1.0,
            'converted_amount_eur' => 100,
            'exchange_rate_source' => 'test',
            'exchange_rate_timestamp' => now(),
            'status' => 'approved',
            'created_at' => now()->subHours(50),
        ]);

        Artisan::call('payment-requests:expire');

        $this->assertEquals('expired', $oldPending->refresh()->status);
        $this->assertEquals('pending', $newPending->refresh()->status);
        $this->assertEquals('approved', $oldApproved->refresh()->status);
    }
}
