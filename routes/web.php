<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
  return view('pages.calendar.index');
})->name('calendar.index');

Route::get('/profile', function () {
  return view('pages.profile.index');
})->name('profile.index');
