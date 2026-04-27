<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripPlan extends Model
{
    protected $fillable = [
        'title',
        'estimated_budget',
        'estimated_duration_time',
        'total_distance',
        'travel_date',
        'travel_mode',
        'start_location',
        'status',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function selectedPlaces()
    {
        return $this->hasMany(SelectedPlace::class);
    }

    public function selectedServices()
    {
        return $this->hasMany(SelectedService::class);
    }
}
