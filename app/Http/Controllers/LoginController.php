<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller {
  public function login(Request $request) {
    $validator = Validator::make($request->all(), [
      'email' => 'required|string|email|max:255'
    ]);

    if ($validator->fails()) {
      return response()->json($validator->errors(), 422);
    }

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
      return response()->json(['error' => 'Invalid login or password'], 401);
    }

    $fullname = trim($user->surname . ' ' . $user->name . ' ' . $user->middlename);

    // Get user's notes with required fields
    $notes = Note::where('fid_user', $user->id_user)
      ->select('id_note', 'date', 'text', 'text_hash')
      ->get();

    $notesByDate = [];
    
    foreach ($notes as $note) {
      $date = $note->date;
      if (!isset($notesByDate[$date])) {
        $notesByDate[$date] = [];
      }
      $notesByDate[$date][] = [
        'id' => $note->id_note,
        'text' => $note->text,
        'hash' => $note->text_hash
      ];
    }

    return response()->json([
      'id_user' => $user->id_user,
      'email' => $user->email,
      'password' => $user->password,
      'nickname' => $user->nickname,
      'fullname' => $fullname,
      'gender' => $user->gender,
      'country' => $user->country,
      'notes' => $notesByDate
    ], 200);
  }
}
