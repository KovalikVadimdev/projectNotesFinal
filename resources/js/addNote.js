"use strict"

export async function addNote(id_note, fid_user, date, text, text_hash) {
  const payload = {
    id_note: id_note,
    fid_user: fid_user,
    date: date,
    text: text,
    text_hash: text_hash,
  };

  try {
    const response = await fetch('http://localhost:8000/api/addNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Помилка: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Помилка додавання замітки:', error);
    throw error;
  }
}
