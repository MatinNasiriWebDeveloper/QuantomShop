<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplyCouponRequest;
use App\Models\Coupon;

class CouponController extends Controller
{
    public function apply(ApplyCouponRequest $request)
    {
        $coupon = Coupon::where('code', $request->validated('code'))->firstOrFail();

        if (! $coupon->isValid()) {
            return response()->json(['message' => 'کد تخفیف معتبر نیست یا منقضی شده است'], 422);
        }

        $amount = $request->validated('amount');

        return response()->json([
            'code' => $coupon->code,
            'percent' => $coupon->percent,
            'discount' => $coupon->discountFor($amount),
        ]);
    }
}
