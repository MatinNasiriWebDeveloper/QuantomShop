<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'walletBalance' => $this->wallet_balance,
            'isAdmin' => $this->is_admin,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
