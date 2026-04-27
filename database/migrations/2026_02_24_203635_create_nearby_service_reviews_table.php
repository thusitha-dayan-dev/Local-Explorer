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
        Schema::create('nearby_service_reviews', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->decimal('rating', 2, 1);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');
            $table->foreignId('nearby_service_id')->constrained('nearby_services')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nearby_service_reviews');
    }
};
