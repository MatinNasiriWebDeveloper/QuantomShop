<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoneResource;
use App\Models\Stone;

class StoneController extends Controller
{
    public function index()
    {
        return StoneResource::collection(Stone::query()->latest()->get());
    }

    public function show(Stone $stone)
    {
        return new StoneResource($stone);
    }
}
