"use strict"


export async function editNote(id_note, text, text_hash) {
  const payload = {
    id_note: id_note,
    text: text,
    text_hash: text_hash,
  };

  try {
    const response = await fetch('http://localhost:8000/api/editNote', {
      method: 'PATCH',
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
    console.error('Помилка зміни замітки:', error);
    throw error;
  }
}