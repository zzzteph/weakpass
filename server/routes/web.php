<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;

Route::get('/api',[MainController::class, 'api'])->name('static.api');
Route::get('/',[MainController::class, 'index'])->name('static.main');