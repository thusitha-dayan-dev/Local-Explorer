<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NearbyServiceMedia extends Model
{
    protected $fillable = [
        'media_path',
        'media_type',
        'nearby_service_id',
    ];

    protected $table = 'nearby_service_medias';

    public function nearbyService()
    {
        return $this->belongsTo(NearbyService::class);
    }
}
