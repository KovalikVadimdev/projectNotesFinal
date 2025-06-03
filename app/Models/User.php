<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable {
  /** @use HasFactory<\Database\Factories\UserFactory> */
  use HasFactory, Notifiable;

  public $timestamps = false;

  protected $primaryKey = 'id_user';

  protected $fillable = [
    'email',
    'password',
    'nickname',
    'name',
    'surname',
    'middlename',
    'gender',
    'country',
  ];

  protected $hidden = [
    'password'
  ];

  public function notes() {
    return $this->hasMany(Note::class, 'fid_user', 'id_user');
  }
}
