<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaceMedia extends Model
{
    protected $fillable = [
        'media_path',
        'media_type',
        'place_id',
    ];

    public function place()
    {
        return $this->belongsTo(Place::class);
    }
}
