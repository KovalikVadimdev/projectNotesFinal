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
      $table->id(); // Унікальний ключ замітки
      $table->unsignedBigInteger('fid_user'); // унікальний ключ користувача
      $table->string('date'); // Незашифрований текст дати
      $table->text('text'); // Зашифрований текст замітки
      $table->string('text_hash'); // Хеш тексту замітки
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
