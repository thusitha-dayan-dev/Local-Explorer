<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NearbyServiceReview extends Model
{
    protected $fillable = [
        'title',
        'message',
        'rating',
        'status',
        'nearby_service_id',
        'user_id',
    ];

    public function nearbyService()
    {
        return $this->belongsTo(NearbyService::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function nearbyServiceReviewMedia()
    {
        return $this->hasMany(NearbyServiceReviewMedia::class);
    }
}
