<?php

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

test('admin login page renders correctly', function () {
    $response = $this->get(route('admin.login'));

    $response->assertStatus(200);
});

test('admin can log in with valid credentials', function () {
    $admin = Admin::factory()->create([
        'email' => 'admin@test.com',
        'password' => Hash::make('secretadmin123'),
    ]);

    $response = $this->post(route('admin.login.verification'), [
        'email' => 'admin@test.com',
        'password' => 'secretadmin123',
    ]);

    $response->assertRedirect(route('admin.dashboard'));
    $this->assertAuthenticatedAs($admin, 'admin');
});

test('admin login fails with invalid credentials', function () {
    Admin::factory()->create([
        'email' => 'admin@test.com',
        'password' => Hash::make('secretadmin123'),
    ]);

    $response = $this->post(route('admin.login.verification'), [
        'email' => 'admin@test.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertSessionHasErrors(['error']);
    $this->assertGuest('admin');
});

test('admin login requires email and password', function () {
    $response = $this->post(route('admin.login.verification'), []);

    $response->assertSessionHasErrors(['email', 'password']);
});

test('admin can update password with valid current password', function () {
    $admin = Admin::factory()->create([
        'password' => Hash::make('oldpassword123'),
    ]);

    $response = $this->actingAs($admin, 'admin')
        ->post(route('admin.update.password'), [
            'current_password' => 'oldpassword123',
            'new_password' => 'newsecretpassword123',
            'new_password_confirmation' => 'newsecretpassword123',
        ]);

    $response->assertSessionHas('success');
    $this->assertTrue(Hash::check('newsecretpassword123', $admin->fresh()->password));
});

test('admin password update fails with incorrect current password', function () {
    $admin = Admin::factory()->create([
        'password' => Hash::make('correctpassword123'),
    ]);

    $response = $this->actingAs($admin, 'admin')
        ->post(route('admin.update.password'), [
            'current_password' => 'wrongpassword',
            'new_password' => 'newsecretpassword123',
            'new_password_confirmation' => 'newsecretpassword123',
        ]);

    $response->assertSessionHasErrors(['current_password']);
});
