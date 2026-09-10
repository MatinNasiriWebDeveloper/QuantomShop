<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoneResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'origin' => $this->origin,
            'price' => $this->price,
            'imageUrl' => $this->image_url,
            'description' => $this->description,
        ];
    }
}
