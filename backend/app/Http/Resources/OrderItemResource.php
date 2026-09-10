<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'productId' => $this->product_id ? (string) $this->product_id : null,
            'name' => $this->product_name,
            'imageUrl' => $this->product_image,
            'unitPrice' => $this->unit_price,
            'quantity' => $this->quantity,
            'total' => $this->unit_price * $this->quantity,
        ];
    }
}
