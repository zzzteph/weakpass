<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

Route::prefix('v1')->group(function () {

Route::get('/range/{prefix}.{ext}',[ApiController::class, 'getRange'])->whereIn('ext', ['json', 'txt'])->name('api.range.ext');
Route::get('/range/{prefix}',[ApiController::class, 'getRange'])->name('api.range');


Route::get('/search/{hash}.{ext}',[ApiController::class, 'search'])->whereIn('ext', ['json', 'txt'])->name('api.search.ext');
Route::get('/search/{hash}',[ApiController::class, 'search'])->name('api.search');


Route::get('/lookup/{hash}.{ext}',[ApiController::class, 'search'])->whereIn('ext', ['json', 'txt'])->name('api.lookup.ext');
Route::get('/lookup/{hash}',[ApiController::class, 'search'])->name('api.lookup');


});

