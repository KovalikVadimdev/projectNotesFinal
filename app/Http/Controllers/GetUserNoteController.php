<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GetUserNoteController extends Controller {
  /**
   * Отримати всі замітки користувача
   */
  public function getUserNotes($userId) {
    try {
      // Отримуємо замітки користувача
      $notes = Note::where('fid_user', $userId)->get();

      return response()->json(['notes' => $notes]);

    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Failed to fetch notes',
        'error' => $e->getMessage()
      ], 500);
    }
  }
}