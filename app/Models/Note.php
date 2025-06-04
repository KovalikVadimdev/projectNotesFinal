<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model {
  protected $table = 'notes';

  protected $primaryKey = 'id_note';
  public $incrementing = false;
  protected $fillable = [
    'id_note',
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
