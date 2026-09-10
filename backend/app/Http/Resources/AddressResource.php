<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'fullAddress' => $this->full_address,
            'plaque' => $this->plaque,
            'unit' => $this->unit,
            'floor' => $this->floor,
            'postalCode' => $this->postal_code,
            'recipientName' => $this->recipient_name,
            'recipientPhone' => $this->recipient_phone,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'isDefault' => $this->is_default,
        ];
    }
}
