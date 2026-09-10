<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'nameEn' => $this->name_en,
            'slug' => $this->slug,
            'logo' => $this->logo,
            'productCount' => $this->whenCounted('products'),
        ];
    }
}
