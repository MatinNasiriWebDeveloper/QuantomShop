<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return AddressResource::collection($request->user()->addresses()->latest()->get());
    }

    public function store(StoreAddressRequest $request)
    {
        $data = $request->validated();

        if ($request->boolean('is_default')) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = $request->user()->addresses()->create($data);

        return new AddressResource($address);
    }

    public function update(StoreAddressRequest $request, Address $address)
    {
        $this->authorize('update', $address);

        if ($request->boolean('is_default')) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address->update($request->validated());

        return new AddressResource($address->fresh());
    }

    public function destroy(Request $request, Address $address)
    {
        $this->authorize('delete', $address);

        $address->delete();

        return response()->json(['message' => 'آدرس حذف شد']);
    }
}
