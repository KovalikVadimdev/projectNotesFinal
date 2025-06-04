<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeleteNoteController extends Controller {
  public function deleteNote(Request $request) {
    $validator = Validator::make($request->all(), [
      'id_note' => 'required|integer|exists:notes,id_note',
    ]);

    if ($validator->fails()) {
      return response()->json($validator->errors(), 422);
    }

    $note = Note::where('id_note', $request->input('id_note'))->first();

    if (!$note) {
      return response()->json(['error' => 'Note not found'], 404);
    }

    $note->delete();

    return response()->json(['message' => 'Note deleted'], 200);
  }
}