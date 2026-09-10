<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'recipientName' => $this->recipient_name,
            'recipientPhone' => $this->recipient_phone,
            'deliveryAddress' => $this->delivery_address,
            'deliveryDate' => $this->delivery_date?->toDateString(),
            'deliveryTime' => $this->delivery_time,
            'subtotal' => $this->subtotal,
            'discount' => $this->discount,
            'tax' => $this->tax,
            'deliveryCost' => $this->delivery_cost,
            'total' => $this->total,
            'couponCode' => $this->coupon_code,
            'paymentMethod' => $this->payment_method,
            'status' => $this->status,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
