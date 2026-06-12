<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequestStatus;
use App\Models\PaymentRequest;
use App\Services\ExchangeRateService;
use App\Services\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class PaymentController extends Controller
{
    public function store(StorePaymentRequest $request, ExchangeRateService $rateService)
    {
        $amount = (float) $request->amount;
        $currency = $request->currency;

        $rateData = $rateService->getRate($currency);
        if($rateData['rate'] <= 0) {
            return Response::error('Exchange rate service unavailable', SymfonyResponse::HTTP_SERVICE_UNAVAILABLE);
        }

        $convertedAmount = round($amount / $rateData['rate'], 2);

        $paymentRequest = PaymentRequest::create([
            'user_id' => Auth::id(),
            'amount' => $amount,
            'currency' => $currency,
            'exchange_rate' => $rateData['rate'],
            'exchange_rate_source' => $rateData['source'],
            'exchange_rate_timestamp' => date('Y-m-d H:i:s', $rateData['timestamp']),
            'converted_amount_eur' => $convertedAmount,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return Response::success(
            'Payment request created successfully',
            SymfonyResponse::HTTP_CREATED,
            $paymentRequest
        );
    }

    public function index(Request $request)
    {
        $request->validate([
            'status' => 'nullable|string|in:pending,approved,rejected,expired',
        ]);

        $query = PaymentRequest::query()->with('user');

        if (Auth::user()->role !== 'finance') {
            $query->where('user_id', Auth::id());
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $paymentRequests = $query->latest()->paginate($request->get('per_page', 15));

        return Response::data($paymentRequests);
    }

    public function show(int $id)
    {
        $paymentRequest = PaymentRequest::with('user')->findOrFail($id);

        if (Auth::user()->role !== 'finance' && $paymentRequest->user_id !== Auth::id()) {
            return Response::error(
                'You are not authorized to view this payment request.',
                SymfonyResponse::HTTP_FORBIDDEN
            );
        }

        return Response::data($paymentRequest);
    }

    public function update(UpdatePaymentRequestStatus $request, int $id)
    {
        $paymentRequest = PaymentRequest::findOrFail($id);

        if ($paymentRequest->status !== 'pending') {
            return Response::error(
                'Only pending payment requests can be updated.',
                SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $paymentRequest->status = $request->status;
        $paymentRequest->save();

        return Response::success(
            "Payment request status updated to {$request->status} successfully",
            SymfonyResponse::HTTP_OK,
            $paymentRequest
        );
    }
}
