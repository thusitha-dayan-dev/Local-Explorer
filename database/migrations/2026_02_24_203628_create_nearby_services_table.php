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
        Schema::create('nearby_services', function (Blueprint $table) {
            $table->id();
            $table->string('service_name');
            $table->string('slug')->unique();
            $table->decimal('latitude', 11, 8);
            $table->decimal('longitude', 11, 8);
            $table->longText('description')->nullable();
            $table->text('short_description');
            $table->enum('price_range', ['high', 'medium', 'low', 'none'])->default('medium');
            $table->text('main_image_path');
            $table->text('website_url')->nullable();
            $table->string('contact_number')->nullable();
            $table->time('opening_time')->default('08:00:00');
            $table->time('close_time')->default('20:00:00');
            $table->text('address');
            $table->text('search_tags');
            $table->unsignedInteger('selection_count')->default(0);
            $table->foreignId('service_type_id')->constrained('service_types')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nearby_services');
    }
};
