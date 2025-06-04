<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AddNoteController;
use App\Http\Controllers\EditNoteController;
use App\Http\Controllers\DeleteNoteController;
use App\Http\Controllers\GetUserNoteController;
use App\Http\Controllers\ImportNoteController;
use App\Http\Controllers\ExportNoteController;
use App\Http\Controllers\EditUserInfo;
use App\Http\Controllers\EditEmailController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;

Route::post('/addNote', [AddNoteController::class, 'addNote']);
Route::patch('/editNote', [EditNoteController::class, 'editNote']);
Route::delete('/deleteNote', [DeleteNoteController::class, 'deleteNote']);
Route::get('/user/{userId}/notes', [GetUserNoteController::class, 'getUserNotes']);
Route::get('/note/{noteId}', [GetUserNoteController::class, 'getNoteById']);

Route::post('/import', [ImportNoteController::class, 'import']);
Route::get('/note/{id}/export', [ExportNoteController::class, 'export']);

Route::post('/user/update', [EditUserInfo::class, 'update']);
Route::post('/user/update-email', [EditEmailController::class, 'update']);

Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);
