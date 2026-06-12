<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;

Route::post('/register', [AuthController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
   
    Route::controller(AuthController::class)
    ->prefix('users')
    ->group(function () {
        Route::get('show', 'show');
    });

    Route::controller(PaymentController::class)
    ->prefix('payment-requests')
    ->group(function () {
        Route::get('/', 'index');
        Route::get('/{id}/show', 'show');
        Route::post('/create', 'store');
        Route::patch('/{id}/update', 'update');
    });
});