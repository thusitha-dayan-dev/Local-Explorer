<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'category_name',
    ];

    public function subCategory()
    {
        return $this->hasMany(SubCategory::class);
    }

    public function place()
    {
        return $this->hasMany(Place::class);
    }

    public static function booted()
    {
        static::deleting(function ($category) {
            $category->subCategory()->each(function ($sub) {
                $sub->delete();
            });

        });
    }
}
