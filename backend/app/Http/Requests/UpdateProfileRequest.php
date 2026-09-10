<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($this->user()?->id)],
            'phone' => ['sometimes', 'required', 'regex:/^09[0-9]{9}$/', Rule::unique('users', 'phone')->ignore($this->user()?->id)],
            'avatar' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
