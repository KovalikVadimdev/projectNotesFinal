<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AddNoteController;
use App\Http\Controllers\EditNoteController;
use App\Http\Controllers\DeleteNoteController;


// ДОДАТИ СЮДИ КОНТРОЛЛЕРИ ТА МОДУЛІ

Route::post('/addNote', [AddNoteController::class, 'addNote']);
Route::patch('/editNote', [EditNoteController::class, 'editNote']);
Route::delete('/deleteNote', [DeleteNoteController::class, 'deleteNote']);