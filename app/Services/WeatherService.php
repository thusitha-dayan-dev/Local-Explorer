<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WeatherService
{
    /**
     * Create a new class instance.
     */
    public function getWeather($last, $lon)
    {
        $apikey = config('services.openweather.key');
        $response = Http::get('https://api.openweathermap.org/data/2.5/weather', [
            'lat' => $last,
            'lon' => $lon,
            'appid' => $apikey,
            'units' => 'metric',
        ]);

        return $response->json();
    }
}
