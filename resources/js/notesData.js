"use strict";

import { renderNotesForDate } from './notes-render.js';
import { synchronizeNotes } from './syncNotes.js';
export const notesByDate = {};

// Завантаження заміток із localStorage у notesByDate
const savedNotes = JSON.parse(localStorage.getItem("all_notes")) || {};

for (const [date, notes] of Object.entries(savedNotes)) {
  notesByDate[date] = notes;
}

// Check if user is authenticated
const userId = localStorage.getItem('id_user');

// Function to initialize notes display
async function initializeNotes() {
  // If user is authenticated, synchronize notes with server
  if (userId) {
    try {
      // Attempt to synchronize notes
      const result = await synchronizeNotes();

      if (result.success) {
        // If new notes were added or conflicts resolved, refresh the notes in memory
        if (result.newNotesAdded > 0 || result.conflictsResolved > 0) {
          // Get updated notes from localStorage
          const updatedNotes = JSON.parse(localStorage.getItem("all_notes")) || {};

          // Clear existing notes
          for (const date in notesByDate) {
            delete notesByDate[date];
          }

          // Repopulate with updated notes
          for (const [date, notes] of Object.entries(updatedNotes)) {
            notesByDate[date] = notes;
          }
        }
      } else {
        console.error('Auto-sync failed:', result.error);
      }
    } catch (error) {
      console.error('Error during auto-sync:', error);
    }
  }

  // Render notes for current date
  renderNotesForDate(new Date());
}

// Start initialization
initializeNotes();
