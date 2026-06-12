<?php

use App\Models\User;
use App\Models\PaymentRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Fake the exchange rate API
    Http::fake([
        'open.er-api.com/*' => Http::response([
            'rates' => [
                'USD' => 1.10,
                'BRL' => 6.00,
                'GBP' => 0.85,
            ]
        ], 200)
    ]);
});

test('authenticated user can create a payment request with automatic exchange rate conversion', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)
        ->postJson('/api/payment-requests', [
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
        ->assertJsonPath('data.converted_amount_eur', 20.00) // 120.00 / 6.00 = 20.00
        ->assertJsonPath('data.exchange_rate', 6.00)
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
});

test('creating payment request in EUR uses rate of 1.0 without fetching external API', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/payment-requests', [
            'amount' => 50.00,
            'currency' => 'EUR',
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.converted_amount_eur', 50.00)
        ->assertJsonPath('data.exchange_rate', 1.0);
});

test('payment request validation checks for invalid inputs', function () {
    $user = User::factory()->create();

    // Invalid amount (negative)
    $response = $this->actingAs($user)
        ->postJson('/api/payment-requests', [
            'amount' => -10.00,
            'currency' => 'USD',
        ]);
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['amount']);

    // Invalid currency format
    $response = $this->actingAs($user)
        ->postJson('/api/payment-requests', [
            'amount' => 100.00,
            'currency' => 'US',
        ]);
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['currency']);

    // Unsupported currency code by API
    $response = $this->actingAs($user)
        ->postJson('/api/payment-requests', [
            'amount' => 100.00,
            'currency' => 'XYZ',
        ]);
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['currency']);
});

test('users can only list their own requests while finance can list all', function () {
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

    // Regular user 1 list
    $response = $this->actingAs($user1)->getJson('/api/payment-requests');
    $response->assertStatus(200);
    $data = $response->json('data.data');
    expect($data)->toHaveCount(1);
    expect($data[0]['id'])->toBe($req1->id);

    // Finance list
    $response = $this->actingAs($finance)->getJson('/api/payment-requests');
    $response->assertStatus(200);
    $data = $response->json('data.data');
    expect($data)->toHaveCount(2);
});

test('payment requests list can be filtered by status', function () {
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
    expect($data)->toHaveCount(1);
    expect($data[0]['status'])->toBe('approved');
});

test('only owner and finance can view details of a payment request', function () {
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

    // Owner can view
    $this->actingAs($owner)->getJson("/api/payment-requests/{$req->id}")
        ->assertStatus(200);

    // Finance can view
    $this->actingAs($finance)->getJson("/api/payment-requests/{$req->id}")
        ->assertStatus(200);

    // Other user cannot view
    $this->actingAs($other)->getJson("/api/payment-requests/{$req->id}")
        ->assertStatus(403);
});

test('only finance role can approve or reject a pending payment request', function () {
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

    // Regular user attempts to approve
    $this->actingAs($user)->patchJson("/api/payment-requests/{$req->id}", ['status' => 'approved'])
        ->assertStatus(403);

    // Finance user approves
    $this->actingAs($finance)->patchJson("/api/payment-requests/{$req->id}", ['status' => 'approved'])
        ->assertStatus(200)
        ->assertJsonPath('data.status', 'approved');

    $this->assertDatabaseHas('payment_requests', [
        'id' => $req->id,
        'status' => 'approved',
    ]);
});

test('cannot update status of non-pending requests', function () {
    $finance = User::factory()->create(['role' => 'finance']);

    $req = PaymentRequest::factory()->create([
        'user_id' => $finance->id,
        'amount' => 100,
        'currency' => 'USD',
        'exchange_rate' => 1,
        'converted_amount_eur' => 100,
        'exchange_rate_source' => 'test',
        'exchange_rate_timestamp' => now(),
        'status' => 'approved', // already approved
    ]);

    $this->actingAs($finance)->patchJson("/api/payment-requests/{$req->id}", ['status' => 'rejected'])
        ->assertStatus(422)
        ->assertJsonPath('message', 'Only pending payment requests can be approved or rejected.');
});

test('immutable fields cannot be modified on update', function () {
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

    // Force update through model to test immutable logic
    $req->update([
        'amount' => 999.00,
        'currency' => 'EUR',
        'exchange_rate' => 2.0,
        'status' => 'approved'
    ]);

    // Reload from database and assert immutable fields remained unchanged, but status was updated
    $req->refresh();
    expect($req->amount)->toEqual('100.00');
    expect($req->currency)->toBe('USD');
    expect($req->exchange_rate)->toEqual('1.100000');
    expect($req->status)->toBe('approved');
});

test('scheduled command expires pending payment requests older than 48 hours', function () {
    $user = User::factory()->create();

    // Pending and older than 48 hours -> Should expire
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

    // Pending and newer than 48 hours -> Should NOT expire
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

    // Approved and older than 48 hours -> Should NOT expire
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

    // Run the artisan command
    Artisan::call('payment-requests:expire');

    // Check states
    expect($oldPending->refresh()->status)->toBe('expired');
    expect($newPending->refresh()->status)->toBe('pending');
    expect($oldApproved->refresh()->status)->toBe('approved');
});
