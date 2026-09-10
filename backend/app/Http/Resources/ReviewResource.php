<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'userName' => $this->whenLoaded('user', fn () => $this->user?->name),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
