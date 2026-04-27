<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaceReview extends Model
{
    protected $fillable = [
        'title',
        'message',
        'rating',
        'place_id',
        'user_id',
        'user_name',
        'status',
    ];

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function placeReviewMedia()
    {
        return $this->hasMany(PlaceReviewMedia::class);
    }
}
