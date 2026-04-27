<?php

use App\Http\Controllers\APIController;
use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/weather', function (Request $requesr, WeatherService $weatherService) {
    return $weatherService->getWeather($requesr->lat, $requesr->lon);
});

Route::get('/get-details', [APIController::class, 'getDetails'])
    ->name('api.get.details');

Route::get('/get-popular-places', [APIController::class, 'getPoularPlaces'])
    ->name('api.get.popular.places');
