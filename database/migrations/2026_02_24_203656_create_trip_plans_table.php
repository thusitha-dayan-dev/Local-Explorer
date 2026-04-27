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
        Schema::create('trip_plans', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->decimal('estimated_budget', 10, 2)->nullable();
            $table->string('estimated_duration_time')->nullable();
            $table->integer('total_distance')->nullable();
            $table->date('travel_date')->nullable();
            $table->string('travel_mode')->nullable();
            $table->string('start_location')->nullable();
            $table->enum('status', ['planned', 'on-going', 'completed', 'cancelled', 'draft'])->default('draft');
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trip_plans');
    }
};
