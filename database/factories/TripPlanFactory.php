<?php

namespace Database\Factories;

use App\Models\TripPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TripPlan>
 */
class TripPlanFactory extends Factory
{
    protected $model = TripPlan::class;

    public function definition(): array
    {
        return [
            'title' => fake()->words(3, true).' Trip',
            'estimated_budget' => 5000.00,
            'estimated_duration_time' => 120,
            'total_distance' => 25.5,
            'travel_date' => now()->addDays(2)->format('Y-m-d'),
            'travel_mode' => 'car',
            'start_location' => 'Dambulla',
            'status' => 'planned',
            'user_id' => User::factory(),
        ];
    }
}
