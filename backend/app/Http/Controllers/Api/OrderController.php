<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('items')->latest()->get();

        return OrderResource::collection($orders);
    }

    public function show(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        return new OrderResource($order->load('items'));
    }

    public function store(StoreOrderRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        $cart = $user->cart()->with('items.product')->firstOrCreate([]);

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'سبد خرید شما خالی است'], 422);
        }

        $address = Address::where('user_id', $user->id)->findOrFail($data['address_id']);

        $subtotal = $cart->items->sum(fn ($item) => $item->product->final_price * $item->quantity);
        $tax = (int) round($subtotal * 0.09);
        $deliveryCost = 29000;

        $discount = 0;
        $coupon = null;
        if (! empty($data['coupon_code'])) {
            $coupon = Coupon::where('code', $data['coupon_code'])->first();
            if ($coupon && $coupon->isValid()) {
                $discount = $coupon->discountFor($subtotal);
            }
        }

        $total = $subtotal - $discount + $tax + $deliveryCost;

        if ($data['payment_method'] === 'wallet' && $user->wallet_balance < $total) {
            return response()->json(['message' => 'موجودی کیف پول کافی نیست'], 422);
        }

        $order = DB::transaction(function () use ($user, $address, $cart, $subtotal, $discount, $tax, $deliveryCost, $total, $data, $coupon) {
            $order = Order::create([
                'user_id' => $user->id,
                'address_id' => $address->id,
                'recipient_name' => $address->recipient_name,
                'recipient_phone' => $address->recipient_phone,
                'delivery_address' => $address->full_address,
                'delivery_date' => $data['delivery_date'],
                'delivery_time' => $data['delivery_time'],
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'delivery_cost' => $deliveryCost,
                'total' => $total,
                'coupon_code' => $coupon?->code,
                'payment_method' => $data['payment_method'],
                'status' => 'paid',
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_image' => $item->product->image_url,
                    'unit_price' => $item->product->final_price,
                    'quantity' => $item->quantity,
                ]);

                $item->product->decrement('stock', $item->quantity);
            }

            if ($data['payment_method'] === 'wallet') {
                $user->decrement('wallet_balance', $total);
                WalletTransaction::create([
                    'user_id' => $user->id,
                    'order_id' => $order->id,
                    'type' => 'payment',
                    'amount' => $total,
                    'description' => "پرداخت سفارش #{$order->id}",
                ]);
            }

            if ($coupon) {
                $coupon->increment('used_count');
            }

            $cart->items()->delete();

            return $order;
        });

        return new OrderResource($order->load('items'));
    }
}
