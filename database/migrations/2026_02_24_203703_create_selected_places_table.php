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
        Schema::create('selected_places', function (Blueprint $table) {
            $table->id();
            $table->integer('selected_order_number')->nullable(); // for store user custom list
            $table->string('arrival_time')->nullable();
            $table->text('user_note')->nullable();
            $table->integer('stay_duration')->nullable();
            $table->foreignId('place_id')->constrained('places')->cascadeOnDelete();
            $table->foreignId('trip_plan_id')->constrained('trip_plans')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('selected_places');
    }
};
