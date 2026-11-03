<?php

use App\Models\Place;
use App\Models\TripPlan;
use App\Models\User;

test('authenticated user can toggle a place to wishlist', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create();

    $response = $this->actingAs($user, 'user')
        ->post(route('wishlist.toggle'), [
            'place_id' => $place->id,
        ]);

    $response->assertSessionHas('success', 'Added to wishlist');
    $this->assertDatabaseHas('wishlists', [
        'user_id' => $user->id,
        'place_id' => $place->id,
    ]);

    // Toggling again removes it
    $removeResponse = $this->actingAs($user, 'user')
        ->post(route('wishlist.toggle'), [
            'place_id' => $place->id,
        ]);

    $removeResponse->assertSessionHas('success', 'Removed from wishlist');
    $this->assertDatabaseMissing('wishlists', [
        'user_id' => $user->id,
        'place_id' => $place->id,
    ]);
});

test('guest cannot toggle wishlist', function () {
    $place = Place::factory()->create();

    $response = $this->post(route('wishlist.toggle'), [
        'place_id' => $place->id,
    ]);

    $response->assertRedirect(route('login'));
});

test('wishlist toggle validates that place_id exists', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'user')
        ->post(route('wishlist.toggle'), [
            'place_id' => 999999,
        ]);

    $response->assertSessionHasErrors(['place_id']);
});

test('user can submit review for a place', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create();

    $response = $this->actingAs($user, 'user')
        ->post(route('reviews.store'), [
            'place_id' => $place->id,
            'title' => 'Spectacular Sunrise Experience',
            'message' => 'The climb was totally worth it. The view at dawn is unforgettable.',
            'rating' => 5,
        ]);

    $this->assertDatabaseHas('place_reviews', [
        'place_id' => $place->id,
        'user_id' => $user->id,
        'rating' => 5,
        'title' => 'Spectacular Sunrise Experience',
    ]);
});

test('review submission validation fails when message is too short or rating is invalid', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create();

    $response = $this->actingAs($user, 'user')
        ->post(route('reviews.store'), [
            'place_id' => $place->id,
            'title' => 'Good',
            'message' => 'Short', // min: 10
            'rating' => 6, // max: 5
        ]);

    $response->assertSessionHasErrors(['message', 'rating']);
});

test('user can quick add place to an existing trip plan', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create();
    $trip = TripPlan::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user, 'user')
        ->post(route('quick.add.trip'), [
            'placeId' => $place->id,
            'tripPlanId' => $trip->id,
        ]);

    $this->assertDatabaseHas('selected_places', [
        'trip_plan_id' => $trip->id,
        'place_id' => $place->id,
    ]);
});
