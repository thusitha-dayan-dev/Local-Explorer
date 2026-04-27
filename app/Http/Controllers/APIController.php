<?php

namespace App\Http\Controllers;

use App\Models\Place;
use App\Models\TripPlan;

class APIController extends Controller
{
    public function getDetails()
    {
        return response()->json([
            'place_count' => Place::count(),
            'trip_count' => TripPlan::count(),
        ]);
    }

    public function getPoularPlaces()
    {
        $popularPlaces = Place::withCount(['review' => function ($query) {
            $query->where('status', 'approved');
        }])
            ->withAvg(['review' => function ($query) {
                $query->where('status', 'approved');
            }], 'rating')
            ->orderBy('review_avg_rating', 'desc')
            ->orderBy('review_count', 'desc')
            ->orderByDesc('selection_count')
            ->orderBy('selection_count', 'desc')
            ->limit(6)
            ->get();

        return response()->json($popularPlaces);
    }
}
