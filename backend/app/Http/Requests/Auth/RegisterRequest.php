<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'regex:/^09[0-9]{9}$/', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'avatar' => ['nullable', 'image', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'شماره موبایل معتبر نیست (مثال: 09123456789)',
            'phone.unique' => 'این شماره موبایل قبلاً ثبت شده است',
            'email.unique' => 'این ایمیل قبلاً ثبت شده است',
            'password.confirmed' => 'رمز عبور و تکرار آن مطابقت ندارند',
        ];
    }
}
