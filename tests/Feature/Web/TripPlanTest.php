<?php

use App\Models\Place;
use App\Models\TripPlan;
use App\Models\User;

test('guests are redirected to login when accessing trip planning', function () {
    $response = $this->get(route('trip.plan'));

    $response->assertRedirect(route('login'));
});

test('user can access trip planning dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'user')->get(route('trip.plan'));

    $response->assertStatus(200);
});

test('user can save a draft trip plan with valid details', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'user')
        ->post(route('trip.plan.save.draft'), [
            'title' => 'Cultural Tour Dambulla',
            'travel_date' => now()->addDays(3)->format('Y-m-d'),
            'travel_mode' => 'car',
        ]);

    $this->assertDatabaseHas('trip_plans', [
        'title' => 'Cultural Tour Dambulla',
        'travel_mode' => 'car',
        'status' => 'draft',
        'user_id' => $user->id,
    ]);

    $trip = TripPlan::where('title', 'Cultural Tour Dambulla')->first();
    $response->assertRedirect(route('trip.plan.add.detail', ['id' => $trip->id]));
});

test('draft trip plan validation requires title, valid date, and travel mode', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'user')
        ->post(route('trip.plan.save.draft'), []);

    $response->assertSessionHasErrors(['title', 'travel_date', 'travel_mode']);
});

test('draft trip plan fails if travel date is in the past', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'user')
        ->post(route('trip.plan.save.draft'), [
            'title' => 'Past Vacation',
            'travel_date' => now()->subDay()->format('Y-m-d'),
            'travel_mode' => 'bike',
        ]);

    $response->assertSessionHasErrors(['travel_date']);
});

test('draft trip plan fails if title is shorter than 3 characters', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'user')
        ->post(route('trip.plan.save.draft'), [
            'title' => 'ab',
            'travel_date' => now()->addDays(2)->format('Y-m-d'),
            'travel_mode' => 'bike',
        ]);

    $response->assertSessionHasErrors(['title']);
});

test('user can save a complete trip plan with places', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create();

    $response = $this->actingAs($user, 'user')
        ->post(route('trip.plan.save'), [
            'title' => 'Full Day Explorer',
            'travel_date' => now()->addDays(5)->format('Y-m-d'),
            'travel_mode' => 'car',
            'save_type' => 'save',
            'selected_places' => [
                [
                    'place_id' => $place->id,
                    'selected_order_number' => 1,
                    'user_note' => 'Arrive early morning',
                ],
            ],
        ]);

    $this->assertDatabaseHas('trip_plans', [
        'title' => 'Full Day Explorer',
        'user_id' => $user->id,
        'status' => 'planned',
    ]);
});

test('complete trip plan validation fails without selected places', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'user')
        ->post(route('trip.plan.save'), [
            'title' => 'Empty Plan',
            'travel_date' => now()->addDays(5)->format('Y-m-d'),
            'travel_mode' => 'car',
            'save_type' => 'save',
            'selected_places' => [],
        ]);

    $response->assertSessionHasErrors(['selected_places']);
});

test('user can delete their own trip plan', function () {
    $user = User::factory()->create();
    $plan = TripPlan::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user, 'user')
        ->from(route('trip.plan'))
        ->delete(route('trip.plan.delete', $plan->id));

    $response->assertRedirect(route('trip.plan'));
    $this->assertDatabaseMissing('trip_plans', [
        'id' => $plan->id,
    ]);
});

test('user cannot delete another users trip plan', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $plan = TripPlan::factory()->create([
        'user_id' => $owner->id,
    ]);

    $response = $this->actingAs($otherUser, 'user')
        ->from(route('trip.plan'))
        ->delete(route('trip.plan.delete', $plan->id));

    $response->assertSessionHas('error');
    $this->assertDatabaseHas('trip_plans', [
        'id' => $plan->id,
    ]);
});
