"use strict"

export async function deleteNote(id_note) {
  const payload = {
    id_note: id_note
  };

  try {
    const response = await fetch('http://localhost:8000/api/deleteNote', {
      method: 'DELETE',
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