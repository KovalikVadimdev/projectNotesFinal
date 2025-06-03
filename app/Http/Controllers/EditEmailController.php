<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EditEmailController extends Controller {
  // Оголошення публічного методу update, який приймає HTTP-запит
  public function update(Request $request) {

    // Створення валідатора, який валідує дані на правильність
    $validator = Validator::make($request->all(), [
      'currentEmail' => 'required|email',
      'newEmail' => 'required|email|unique:users,email'
    ]);

    // Якщо валідація не пройшла, повертається помилка, та код 422
    if ($validator->fails()) {
      return response()->json([
        'errors' => $validator->errors()
      ], 422);
    }

    try {
      // Пошук такого користувача в БД
      $user = User::where('email', $request->currentEmail)->first();

      // Якщо користувача не було знайдено, повертається помилка та код 404
      if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
      }

      // Присвоєння нового email в БД
      $user->email = $request->newEmail;
      // Зберігання змін у БД
      $user->save();


      // Повернення нового email та код статус 200
      return response()->json([
        'email' => $user->email
      ], 200);
    } catch (\Exception $e) {
      // Якщо виникла помилка в ході виконання блока try повертається відповідь у вигляді помилки та 500 коду
      return response()->json([
        'error' => $e->getMessage()
      ], 500);
    }
  }
} 