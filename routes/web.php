<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
  return view('pages.calendar.index');
})->name('calendar.index');

Route::get('/profile', function () {
  return view('pages.profile.index');
})->name('profile.index');
use Illuminate\Support\Facades\File;

Route::get('/debug-logs', function () {
    $logFile = storage_path('logs/laravel.log');
    if (File::exists($logFile)) {
        return nl2br(File::get($logFile));
    }
    return 'Log file not found.';
});
