<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ImportNoteController extends Controller {
  public function import(Request $request) {
    $request->validate([
      'json_file' => 'required|file|mimes:json',
    ]);

    $json = file_get_contents($request->file('json_file')->getRealPath());
    $noteData = json_decode($json, true);

    if (!isset($noteData['fid_user'], $noteData['text'], $noteData['date'])) {
      return response()->json(['error' => 'Invalid note structure'], 400);
    }

    $note = Note::create([
      'fid_user' => $noteData['fid_user'],
      'text' => $noteData['text'],
      'date' => $noteData['date'],
    ]);

    return response()->json(['message' => 'Note imported successfully', 'note' => $note], 200);
  }
}
