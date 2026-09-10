<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => ['required', 'regex:/^09[0-9]{9}$/', 'exists:users,phone'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'شماره موبایل معتبر نیست (مثال: 09123456789)',
            'phone.exists' => 'کاربری با این شماره موبایل یافت نشد',
        ];
    }
}
