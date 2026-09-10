<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request)
    {
        $cart = $request->user()->cart()->firstOrCreate([]);

        return new CartResource($cart->load('items.product'));
    }

    public function addItem(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($data['product_id']);
        $quantity = $data['quantity'] ?? 1;

        $cart = $request->user()->cart()->firstOrCreate([]);
        $item = $cart->items()->firstOrNew(['product_id' => $product->id]);
        $item->quantity = min($product->stock, ($item->exists ? $item->quantity : 0) + $quantity);
        $item->save();

        return new CartResource($cart->load('items.product'));
    }

    public function updateItem(Request $request, int $itemId)
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $request->user()->cart()->firstOrCreate([]);
        $item = $cart->items()->findOrFail($itemId);
        $item->update(['quantity' => min($item->product->stock, $data['quantity'])]);

        return new CartResource($cart->load('items.product'));
    }

    public function removeItem(Request $request, int $itemId)
    {
        $cart = $request->user()->cart()->firstOrCreate([]);
        $cart->items()->where('id', $itemId)->delete();

        return new CartResource($cart->load('items.product'));
    }

    public function clear(Request $request)
    {
        $cart = $request->user()->cart()->firstOrCreate([]);
        $cart->items()->delete();

        return new CartResource($cart->load('items.product'));
    }
}
