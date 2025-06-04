"use strict"

import {notesByDate} from "./notesData.js";

  const exportButton = document.getElementById('dropdown-menu__export');
  if (exportButton) {
    exportButton.addEventListener('click', () => {
      try {
        // Get notes from notesStorage
        if (!notesByDate) {
          console.error('notesStorage is not defined');
          alert('Notes storage is not available. Please try refreshing the page.');
          return false;
        }

        const notes = notesByDate;
        console.log('Current notes:', notes);

        if (!notes || Object.keys(notes).length === 0) {
          alert('No notes to export');
          return false;
        }

        // Create export data with metadata
        const exportData = {
          version: '1.0',
          exportDate: new Date().toISOString(),
          notes: notes
        };

        console.log('Export data:', exportData);

        // Create JSON string
        const jsonString = JSON.stringify(exportData, null, 2);

        // Create blob and download link
        const blob = new Blob([jsonString], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        // Create temporary link element
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `notes_export_${new Date().toISOString().split('T')[0]}.json`;

        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Cleanup
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        alert('Notes exported successfully!');
      } catch (error) {
        console.error('Export error details:', error);
        console.error('Error stack:', error.stack);
        alert('Error exporting notes. Please check the console for details.');
      }

      return false;
    });
  }

const importBtn = document.getElementById('dropdown-menu__import');
if (importBtn) {
  importBtn.addEventListener('click', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedNotes = JSON.parse(event.target.result);

        // Перевірка структури (маємо обʼєкт дата → масив заміток)
        if (typeof importedNotes === 'object' && importedNotes !== null) {
          console.log(importedNotes)
          alert('Імпорт заміток пройшов успішно!');
        } else {
          alert('Невірний формат файлу');
        }
      } catch (error) {
        alert('Помилка при читанні файлу: ' + error.message);
      }
    };
    reader.readAsText(file);
  });
}