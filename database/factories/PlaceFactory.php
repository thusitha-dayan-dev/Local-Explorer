<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Place;
use App\Models\SubCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Place>
 */
class PlaceFactory extends Factory
{
    protected $model = Place::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true).' '.fake()->randomNumber(4);

        return [
            'place_name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(5),
            'short_description' => fake()->sentence(10),
            'address' => fake()->address(),
            'latitude' => fake()->latitude(7.0, 8.5),
            'longitude' => fake()->longitude(80.0, 81.5),
            'base_distance' => '10km',
            'local_ticket_price' => 500.00,
            'foreign_ticket_price' => 2500.00,
            'estimated_duration' => 60,
            'opening_time' => '08:00:00',
            'closing_time' => '18:00:00',
            'best_visit_time' => '09:00:00',
            'contact_number' => '+94771234567',
            'website_url' => 'https://example.com',
            'main_image_path' => 'places/sample.jpg',
            'search_tags' => '#ancient #nature',
            'selection_count' => 0,
            'crowd_level' => 'medium',
            'status' => 'active',
            'category_id' => Category::factory(),
            'sub_category_id' => SubCategory::factory(),
        ];
    }
}
