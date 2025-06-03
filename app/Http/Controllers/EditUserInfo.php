<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EditUserInfo extends Controller {
  public function update(Request $request) {
    // Створення валідатора для перевірка полів на виконання вимог
    $validator = Validator::make($request->all(), [
      'email' => 'required|email',
      'nickname' => 'required|string|max:255',
      'fullName' => 'string|max:255',
      'gender' => 'string|in:Men,Woman,Other',
      'country' => 'string|max:255',
    ]);

    // Якщо щось пішло не так тоді відправляється код помилки 422 та саму помилку
    if ($validator->fails()) {
      return response()->json([
        'errors' => $validator->errors()
      ], 422);
    }

    try {
      // Пошук користувача у базі за email
      $user = User::where('email', $request->email)->first();
      // Якщо такого користувача немає у базі повернення помилки 404
      if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
      }

      // Розбиття рядка fullName на частини name, surname, middlename
      $fullname = explode(' ', trim($request->fullName));

      // Оновлення даних користувача
      $user->name = $fullname[0] ?? '';
      $user->surname = $fullname[1] ?? '';
      $user->middlename = $fullname[2] ?? '';
      $user->nickname = $request->nickname;
      $user->gender = $request->gender;
      $user->country = $request->country;

      // Збереження змін користувача у БД
      $user->save();

      // Повернення нової інформації користувачеві
      return response()->json([
        'nickname' => $user->nickname,
        'fullname' => trim($user->surname . ' ' . $user->name . ' ' . $user->middlename),
        'gender' => $user->gender,
        'country' => $user->country,
      ], 200);
    } catch (\Exception $e) {

      // Повернення коду помилки та повідомлення помилки
      return response()->json([
        'error' => $e->getMessage()
      ], 500);
    }
  }
}
