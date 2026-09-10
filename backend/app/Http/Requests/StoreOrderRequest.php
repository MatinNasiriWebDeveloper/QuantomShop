<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address_id' => ['required', 'exists:addresses,id'],
            'delivery_date' => ['required', 'date'],
            'delivery_time' => ['required', 'string'],
            'payment_method' => ['required', 'in:wallet,gateway,card_to_card'],
            'coupon_code' => ['nullable', 'string', 'exists:coupons,code'],
        ];
    }
}
