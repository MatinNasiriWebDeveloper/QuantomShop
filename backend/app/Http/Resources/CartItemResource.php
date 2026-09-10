<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'productId' => (string) $this->product_id,
            'name' => $this->product?->name,
            'imageUrl' => $this->product?->image_url,
            'price' => $this->product?->price,
            'finalPrice' => $this->product?->final_price,
            'stock' => $this->product?->stock,
            'quantity' => $this->quantity,
        ];
    }
}
