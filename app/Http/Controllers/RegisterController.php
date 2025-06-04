<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller {
  public function register(Request $request) {
    $validator = Validator::make($request->all(), [
      'email' => 'required|string|email|max:255|unique:users',
      'nickname' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
      return response()->json($validator->errors(), 422);
    }

    $user = User::create([
      'id' => $request->input('id'),
      'email' => $request->input('email'),
      'password' => Hash::make($request->input('password')),
      'nickname' => $request->input('nickname'),
    ]);

    $fullname = trim($user->surname . ' ' . $user->name . ' ' . $user->middlename);

    return response()->json([
      'id_user' => $user->id_user,
      'email' => $user->email,
      'password' => $user->password,
      'nickname' => $user->nickname,
      'fullname' => $fullname,
      'gender' => $user->gender,
      'country' => $user->country,
    ], 201);
  }
}