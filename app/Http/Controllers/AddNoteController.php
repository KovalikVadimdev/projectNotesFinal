<?php
namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddNoteController extends Controller {
  public function addNote(Request $request) {
    $validator = Validator::make($request->all(), [
      'fid_user' => 'required|integer|exists:users,id_user',
      'text' => 'required|string',
      'date' => 'required|string',
      'text_hash' => 'required|string'
    ]);

    if ($validator->fails()) {
      return response()->json($validator->errors(), 422);
    }
    $note = Note::create([
      'id_note' => $request->input('id_note'),
      'fid_user' => $request->input('fid_user'),
      'text' => $request->input('text'),
      'date' => $request->input('date'),
      'text_hash' => $request->input('text_hash')
    ]);

    return response()->json([
      'message' => 'Note added',
      'id_note' => $note->id_note,
      'text_hash' => $note->text_hash,
    ], 200);
  }
}