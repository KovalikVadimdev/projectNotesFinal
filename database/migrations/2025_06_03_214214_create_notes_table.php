<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('notes', function (Blueprint $table) {
      $table->bigInteger('id_note')->primary(); // Унікальний ключ замітки
      $table->unsignedBigInteger('fid_user');
      $table->string('date');
      $table->string('text');
      $table->string('text_hash');
      $table->foreign('fid_user')->references('id_user')->on('users')->onDelete('cascade');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void {
    Schema::dropIfExists('notes');

  }
};