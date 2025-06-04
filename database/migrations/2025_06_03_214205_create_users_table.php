<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('users', function (Blueprint $table) {
      $table->bigIncrements('id_user'); // Унікальний ключ користувача
      $table->string('email'); // Електронна адреса користувача
      $table->string('password'); // Пароль в зашифрованому вигляді
      $table->string('nickname'); // Псевдоім'я
      $table->string('name')->nullable(); // Ім'я
      $table->string('surname')->nullable(); // Прізвище
      $table->string('middlename')->nullable(); // По-батькові
      $table->string('gender')->nullable(); // Стать
      $table->string('country')->nullable(); // Країна
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void {
    Schema::dropIfExists('users');

  }
};
