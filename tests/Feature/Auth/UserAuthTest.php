<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('registration screen can be rendered', function () {
    $response = $this->get(route('signup'));

    $response->assertStatus(200);
});

test('new users can register with valid details', function () {
    $response = $this->post(route('WSignupValidate'), [
        'full_name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'secret123',
        'confirm_password' => 'secret123',
    ]);

    $response->assertRedirect(route('home'));
    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'full_name' => 'John Doe',
    ]);
});

test('registration fails when required fields are missing', function () {
    $response = $this->post(route('WSignupValidate'), []);

    $response->assertSessionHasErrors(['email', 'password', 'full_name', 'confirm_password']);
    $this->assertGuest();
});

test('registration fails when email is invalid or already registered', function () {
    User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->post(route('WSignupValidate'), [
        'full_name' => 'Test User',
        'email' => 'existing@example.com',
        'password' => 'secret123',
        'confirm_password' => 'secret123',
    ]);

    $response->assertSessionHasErrors(['email']);

    $invalidEmailResponse = $this->post(route('WSignupValidate'), [
        'full_name' => 'Test User',
        'email' => 'not-an-email',
        'password' => 'secret123',
        'confirm_password' => 'secret123',
    ]);

    $invalidEmailResponse->assertSessionHasErrors(['email']);
});

test('registration fails when passwords do not match or are too short', function () {
    $mismatchResponse = $this->post(route('WSignupValidate'), [
        'full_name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'secret123',
        'confirm_password' => 'different123',
    ]);

    $mismatchResponse->assertSessionHasErrors(['password']);

    $shortResponse = $this->post(route('WSignupValidate'), [
        'full_name' => 'Test User',
        'email' => 'test2@example.com',
        'password' => '123',
        'confirm_password' => '123',
    ]);

    $shortResponse->assertSessionHasErrors(['password']);
});

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post(route('WLoginValidate'), [
        'email' => 'user@example.com',
        'password' => 'password123',
    ]);

    $response->assertRedirect(route('home'));
    $this->assertAuthenticatedAs($user, 'user');
});

test('users cannot authenticate with invalid password', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post(route('WLoginValidate'), [
        'email' => 'user@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors(['error']);
    $this->assertGuest('user');
});

test('login form validation requires email and password', function () {
    $response = $this->post(route('WLoginValidate'), []);

    $response->assertSessionHasErrors(['email', 'password']);
});

test('authenticated user can log out', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'user')->post(route('logout'));

    $response->assertRedirect(route('home'));
    $this->assertGuest('user');
});

test('password reset request validates email format', function () {
    $response = $this->post(route('code.send.email'), [
        'email' => 'invalid-email',
    ]);

    $response->assertSessionHasErrors(['email']);
});
