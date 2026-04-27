<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    protected $fillable = [
        'place_name',
        'slug',
        'description',
        'short_description',
        'address',
        'latitude',
        'longitude',
        'base_distance',
        'local_ticket_price',
        'foreign_ticket_price',
        'estimated_duration',
        'opening_time',
        'closing_time',
        'best_visit_time',
        'contact_number',
        'website_url',
        'main_image_path',
        'search_tags',
        'selection_count',
        'crowd_level',
        'status',
        'category_id',
        'sub_category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function media()
    {
        return $this->hasMany(PlaceMedia::class);
    }

    public function review()
    {
        return $this->hasMany(PlaceReview::class);
    }

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }
}
