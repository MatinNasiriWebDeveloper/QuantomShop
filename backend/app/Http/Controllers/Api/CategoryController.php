<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryImageResource;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\CategoryImage;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->whereNull('parent_id')
            ->withCount('products')
            ->with(['children' => fn ($q) => $q->withCount('products')])
            ->orderBy('order')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function activeCategoryImages()
    {
        $images = CategoryImage::query()
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return CategoryImageResource::collection($images);
    }
}
