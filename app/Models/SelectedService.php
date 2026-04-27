<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SelectedService extends Model
{
    protected $fillable = [
        'selected_order_number',
        'nearby_service_id',
        'trip_plan_id',
    ];

    public function nearbyService()
    {
        return $this->belongsTo(NearbyService::class);
    }

    public function tripPlan()
    {
        return $this->belongsTo(TripPlan::class);
    }
}
