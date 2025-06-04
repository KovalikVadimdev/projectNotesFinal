"use strict"

import { notesByDate } from "./notesData.js";
import { renderTaskList } from './asideTask.js';
import { currentDate } from "./switchDay.js";
import { renderNotesForDate } from "./notes-render.js";
 
const importButton = document.getElementById('dropdown-menu__import');

if (importButton) {
  importButton.addEventListener('click', () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    // Handle file selection
    fileInput.addEventListener('change', async function() {
      const file = this.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importedData = JSON.parse(text);

        // Validate the imported data structure
        if (!importedData.version || !importedData.notes) {
          throw new Error('Invalid file format');
        }

        let importedCount = 0;
        let skippedCount = 0;

        // Process each date's notes
        for (const [date, notes] of Object.entries(importedData.notes)) {
          if (!notesByDate[date]) {
            notesByDate[date] = [];
          }

          // Process each note
          for (const importedNote of notes) {
            // Check if note with same hash already exists
            const isDuplicate = notesByDate[date].some(
              existingNote => existingNote.hash === importedNote.hash
            );

            if (!isDuplicate) {
              notesByDate[date].push(importedNote);
              importedCount++;
            } else {
              skippedCount++;
            }
          }
        }

        // Update localStorage
        const allNotes = JSON.parse(localStorage.getItem("all_notes")) || {};
        Object.assign(allNotes, importedData.notes);
        localStorage.setItem("all_notes", JSON.stringify(allNotes));

        // Refresh the task list
        renderTaskList(new Date());
        renderNotesForDate(currentDate);

        // Show results to user
        alert(`Import completed!\nImported: ${importedCount} notes\nSkipped: ${skippedCount} duplicate notes`);

      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing notes: ' + error.message);
      }
    });

    // Trigger file selection
    fileInput.click();
  });
} 