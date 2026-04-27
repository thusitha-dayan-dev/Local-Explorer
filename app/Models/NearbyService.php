<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NearbyService extends Model
{
    protected $fillable = [
        'service_name',
        'slug',
        'latitude',
        'longitude',
        'description',
        'short_description',
        'price_range',
        'main_image_path',
        'website_url',
        'contact_number',
        'opening_time',
        'close_time',
        'address',
        'search_tags',
        'selection_count',
        'service_type_id',
    ];

    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function selectedServices()
    {
        return $this->hasMany(SelectedService::class);
    }

    public function media()
    {
        return $this->hasMany(NearbyServiceMedia::class);
    }

    public function review()
    {
        return $this->hasMany(NearbyServiceReview::class);
    }
}
