<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items');

        return [
            'id' => (string) $this->id,
            'items' => CartItemResource::collection($items),
            'totalItems' => $items === null ? 0 : $items->sum('quantity'),
            'totalPrice' => $items === null ? 0 : $items->sum(fn ($item) => $item->product->final_price * $item->quantity),
        ];
    }
}
