<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->string('place_name');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->text('short_description');
            $table->string('address');
            $table->decimal('latitude', 11, 8);
            $table->decimal('longitude', 11, 8);
            $table->text('base_distance');
            $table->decimal('local_ticket_price', 10, 2)->nullable()->default('0.00');
            $table->decimal('foreign_ticket_price', 10, 2)->nullable()->default('0.00');
            $table->integer('estimated_duration');
            $table->time('opening_time')->default('00:00:00');
            $table->time('closing_time')->default('00:00:00');
            $table->time('best_visit_time')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('website_url')->nullable();
            $table->text('main_image_path');
            $table->text('search_tags');
            $table->unsignedInteger('selection_count')->default(0);
            $table->enum('crowd_level', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('sub_category_id')->constrained('sub_categories')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('places');
    }
};
