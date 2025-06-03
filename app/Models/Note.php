<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model {
  protected $table = 'notes';

  protected $fillable = [
    'fid_user',
    'date',
    'text',
    'text_hash',
  ];

  public $timestamps = false;

  public function user() {
    return $this->belongsTo(User::class, 'fid_user', 'id_user');
  }
}
