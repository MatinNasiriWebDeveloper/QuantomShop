<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $products = $request->user()->favorites()->with('product.category', 'product.brand')->get()
            ->pluck('product');

        return ProductResource::collection($products);
    }

    public function toggle(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
        ]);

        $favorite = Favorite::where('user_id', $request->user()->id)
            ->where('product_id', $data['product_id'])
            ->first();

        if ($favorite) {
            $favorite->delete();

            return response()->json(['isFavorite' => false]);
        }

        Favorite::create([
            'user_id' => $request->user()->id,
            'product_id' => $data['product_id'],
        ]);

        return response()->json(['isFavorite' => true]);
    }
}
