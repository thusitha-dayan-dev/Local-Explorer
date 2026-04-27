<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaceReviewMedia extends Model
{
    protected $table = 'place_review_medias';

    protected $fillable = [
        'media_path',
        'media_type',
        'place_review_id',
    ];

    public function placeReview()
    {
        return $this->belongsTo(PlaceReview::class);
    }
}
