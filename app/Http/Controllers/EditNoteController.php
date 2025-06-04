<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EditNoteController extends Controller {
  public function editNote(Request $request) {
    $validator = Validator::make($request->all(), [
      'id_note' => 'required|integer|exists:notes,id_note',
      'text' => 'required|string',
      'text_hash' => 'required|string'
    ]);

    if ($validator->fails()) {
      return response()->json($validator->errors(), 422);
    }

    $note = Note::where('id_note', $request->input('id_note'))->first();

    if (!$note) {
      return response()->json(['error' => 'Note not found'], 404);
    }

    $note->text = $request->input('text');
    $note->text_hash = $request->input('text_hash');

    $note->save();

    return response()->json([
      'message' => 'Note edited',
      'text_hash' => $note->text_hash
    ], 200);
  }
}