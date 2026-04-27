<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceType extends Model
{
    protected $fillable = [
        'id',
        'service_type_name',
    ];

    public function nearbyService()
    {
        return $this->hasMany(NearbyService::class);
    }
}
