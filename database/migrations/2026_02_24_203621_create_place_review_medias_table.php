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
        Schema::create('place_review_medias', function (Blueprint $table) {
            $table->id();
            $table->text('media_path');
            $table->enum('media_type', ['image', 'video']);
            $table->foreignId('place_review_id')->constrained('place_reviews')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('place_review_medias');
    }
};
