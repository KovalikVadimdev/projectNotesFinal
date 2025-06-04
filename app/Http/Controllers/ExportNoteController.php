<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExportNoteController extends Controller {
  public function export($id) {
    $note = Note::findOrFail($id);
    $json = $note->toJson(JSON_PRETTY_PRINT);

    $filename = "note_{$id}_export.json";
    Storage::disk('local')->put($filename, $json);

    //return response()->download(storage_path("app/private/{$filename}"), 200);
    return response($note->toJson(JSON_PRETTY_PRINT))
      ->header('Content-Type', 'application/json')
      ->header('Content-Disposition', 'attachment; filename="note_1_export.json"');
  }
}
