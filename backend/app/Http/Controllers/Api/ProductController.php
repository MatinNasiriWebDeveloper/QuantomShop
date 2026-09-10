<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with(['category', 'brand']);

        if ($request->filled('brand')) {
            $query->whereHas('brand', fn ($q) => $q->where('name_en', $request->string('brand')));
        }

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('name', $request->string('category')));
        }

        if ($request->boolean('discount')) {
            $query->discounted();
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', (int) $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (int) $request->input('max_price'));
        }

        if ($request->boolean('in_stock')) {
            $query->inStock();
        }

        if ($request->filled('q')) {
            $query->search($request->string('q'));
        }

        match ($request->input('sort')) {
            'price-asc' => $query->orderBy('price'),
            'price-desc' => $query->orderByDesc('price'),
            'discount' => $query->orderByDesc('discount'),
            'name-asc' => $query->orderBy('name'),
            'name-desc' => $query->orderByDesc('name'),
            default => $query->latest(),
        };

        $products = $query->paginate($request->integer('per_page', 24));

        return ProductResource::collection($products);
    }

    public function featured()
    {
        return ProductResource::collection(
            Product::query()->with(['category', 'brand'])->featured()->inStock()->limit(8)->get()
        );
    }

    public function bestSellers(Request $request)
    {
        return ProductResource::collection(
            Product::query()->with(['category', 'brand'])->bestSellers()->limit($request->integer('limit', 18))->get()
        );
    }

    public function newest(Request $request)
    {
        return ProductResource::collection(
            Product::query()->with(['category', 'brand'])->latest()->limit($request->integer('limit', 4))->get()
        );
    }

    public function bestDiscounts(Request $request)
    {
        return ProductResource::collection(
            Product::query()->with(['category', 'brand'])->discounted()->orderByDesc('discount')->limit($request->integer('limit', 5))->get()
        );
    }

    public function search(Request $request)
    {
        return ProductResource::collection(
            Product::query()->with(['category', 'brand'])->search($request->string('q'))->limit(20)->get()
        );
    }

    public function show(Product $product)
    {
        $product->load(['category', 'brand', 'reviews.user'])->loadCount('reviews');

        return new ProductResource($product);
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        return new ProductResource($product);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return new ProductResource($product->fresh());
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $product->delete();

        return response()->json(['message' => 'محصول حذف شد']);
    }
}
