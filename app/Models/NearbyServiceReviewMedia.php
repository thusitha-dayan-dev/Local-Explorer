<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NearbyServiceReviewMedia extends Model
{
    protected $table = 'nearby_service_review_medias';

    protected $fillable = [
        'media_path',
        'media_type',
        'nearby_service_review_id',
    ];

    public function nearbyServiceReview()
    {
        return $this->belongsTo(NearbyServiceReview::class);
    }
}
