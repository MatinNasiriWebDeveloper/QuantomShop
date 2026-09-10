<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = Storage::url($request->file('avatar')->store('avatars', 'public'));
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => Hash::make($data['password']),
            'avatar' => $avatarPath,
            'wallet_balance' => 0,
            'is_admin' => false,
        ]);

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (! Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'ایمیل یا رمز عبور اشتباه است',
            ], 401);
        }

        $user = User::where('email', $credentials['email'])->firstOrFail();
        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'با موفقیت خارج شدید']);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $data['avatar'] = Storage::url($request->file('avatar')->store('avatars', 'public'));
        }

        $user->update($data);

        return new UserResource($user->fresh());
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $phone = $request->validated('phone');
        $code = (string) random_int(100000, 999999);

        Cache::put("otp:{$phone}", $code, now()->addMinutes(2));

        return response()->json([
            'success' => true,
            'message' => 'کد تأیید ارسال شد',
            'expiresIn' => 120,
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request)
    {
        $data = $request->validated();
        $cachedCode = Cache::get("otp:{$data['phone']}");

        if (! $cachedCode || $cachedCode !== $data['code']) {
            return response()->json([
                'success' => false,
                'message' => 'کد وارد شده نامعتبر است',
            ], 422);
        }

        Cache::forget("otp:{$data['phone']}");

        $resetToken = Str::random(60);
        Cache::put("reset-token:{$data['phone']}", $resetToken, now()->addMinutes(10));

        return response()->json([
            'success' => true,
            'message' => 'کد با موفقیت تأیید شد',
            'token' => $resetToken,
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $data = $request->validated();
        $cachedToken = Cache::get("reset-token:{$data['phone']}");

        if (! $cachedToken || $cachedToken !== $data['token']) {
            return response()->json([
                'message' => 'زمان توکن منقضی شده است. دوباره تلاش کنید',
            ], 422);
        }

        $user = User::where('phone', $data['phone'])->firstOrFail();
        $user->update(['password' => Hash::make($data['password'])]);

        Cache::forget("reset-token:{$data['phone']}");

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }
}
