<?php

use App\Models\Admin;
use App\Models\Category;

test('guest cannot access admin manage category page', function () {
    $response = $this->get(route('admin.manage.category'));

    $response->assertRedirect(route('admin.login'));
});

test('authenticated admin can view manage category page', function () {
    $admin = Admin::factory()->create();

    $response = $this->actingAs($admin, 'admin')->get(route('admin.manage.category'));

    $response->assertStatus(200);
});

test('admin can create main category with valid name', function () {
    $admin = Admin::factory()->create();

    $response = $this->actingAs($admin, 'admin')
        ->post(route('admin.create.category'), [
            'category_name' => 'Historical Sites',
        ]);

    $response->assertRedirect(route('admin.manage.category'));
    $this->assertDatabaseHas('categories', [
        'category_name' => 'Historical Sites',
    ]);
});

test('admin can create subcategory under existing category', function () {
    $admin = Admin::factory()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin, 'admin')
        ->post(route('admin.create.category'), [
            'category_name' => 'Cave Temples',
            'category_id' => $category->id,
        ]);

    $response->assertRedirect(route('admin.manage.category'));
    $this->assertDatabaseHas('sub_categories', [
        'sub_category_name' => 'Cave Temples',
        'category_id' => $category->id,
    ]);
});

test('category creation fails when category name is missing or too short', function () {
    $admin = Admin::factory()->create();

    $emptyResponse = $this->actingAs($admin, 'admin')
        ->post(route('admin.create.category'), [
            'category_name' => '',
        ]);

    $emptyResponse->assertSessionHasErrors(['category_name']);

    $shortResponse = $this->actingAs($admin, 'admin')
        ->post(route('admin.create.category'), [
            'category_name' => 'ab', // min: 3
        ]);

    $shortResponse->assertSessionHasErrors(['category_name']);
});

test('admin can delete category', function () {
    $admin = Admin::factory()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin, 'admin')
        ->delete(route('admin.delete.category', ['id' => $category->id, 'type' => 'main']));

    $response->assertSessionHas('success');
    $this->assertDatabaseMissing('categories', [
        'id' => $category->id,
    ]);
});
