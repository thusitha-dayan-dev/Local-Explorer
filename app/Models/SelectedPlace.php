<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SelectedPlace extends Model
{
    protected $fillable = [
        'selected_order_number',
        'arrival_time',
        'user_note',
        'stay_duration',
        'trip_plan_id',
        'place_id',
    ];

    public function tripPlan()
    {
        return $this->belongsTo(TripPlan::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }
}
