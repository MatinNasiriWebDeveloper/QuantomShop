<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WalletChargeRequest;
use App\Http\Resources\WalletTransactionResource;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function balance(Request $request)
    {
        return response()->json(['balance' => $request->user()->wallet_balance]);
    }

    public function transactions(Request $request)
    {
        return WalletTransactionResource::collection(
            $request->user()->walletTransactions()->latest()->get()
        );
    }

    public function charge(WalletChargeRequest $request)
    {
        $user = $request->user();
        $amount = $request->validated('amount');

        $user->increment('wallet_balance', $amount);

        $transaction = WalletTransaction::create([
            'user_id' => $user->id,
            'type' => 'charge',
            'amount' => $amount,
            'description' => 'شارژ کیف پول از طریق درگاه بانکی',
        ]);

        return response()->json([
            'balance' => $user->fresh()->wallet_balance,
            'transaction' => new WalletTransactionResource($transaction),
        ]);
    }
}
