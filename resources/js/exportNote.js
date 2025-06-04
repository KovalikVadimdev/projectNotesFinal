"use strict"

function exportNote(id) {
  fetch(`/note/${id}/export`)
    .then(response => {
      if (!response.ok) throw new Error('Помилка завантаження замітки');
      return response.blob();  // отримуємо blob з JSON
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `note_${id}_export.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch(err => {
      console.error('Export failed:', err);
    });
}

