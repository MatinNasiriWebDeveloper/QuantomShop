<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'finalPrice' => $this->final_price,
            'discount' => $this->discount,
            'stock' => $this->stock,
            'imageUrl' => $this->image_url,
            'category' => $this->whenLoaded('category', fn () => $this->category?->name),
            'brand' => $this->whenLoaded('brand', fn () => $this->brand?->name_en),
            'brandName' => $this->whenLoaded('brand', fn () => $this->brand?->name),
            'isFeatured' => $this->is_featured,
            'isBestSeller' => $this->is_best_seller,
            'rating' => $this->average_rating,
            'reviewsCount' => $this->whenCounted('reviews'),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
