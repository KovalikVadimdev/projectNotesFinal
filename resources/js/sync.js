"use strict"

import { synchronizeNotes } from './syncNotes.js';
import { renderNotesForDate } from './notes-render.js';
import { notesByDate } from './notesData.js';

// Get the sync button elements
const syncButton = document.getElementById('sync');
const successSyncButton = document.getElementById('successsync');

// Add event listener to the sync button
syncButton.addEventListener('click', async () => {
    // Disable the button during synchronization
    syncButton.disabled = true;

    try {
        // Show loading state (you could add a spinner or change the button appearance)
        syncButton.classList.add('syncing');

        // Call the synchronization function
        const result = await synchronizeNotes();

        if (result.success) {
            // Show success message
            let message = `Synchronization completed successfully.`;

            if (result.conflictsResolved > 0) {
                message += ` ${result.conflictsResolved} conflicts resolved.`;
            }

            if (result.newNotesAdded > 0) {
                message += ` ${result.newNotesAdded} new notes added.`;
            }

            if (result.conflictsResolved === 0 && result.newNotesAdded === 0) {
                message += ` No changes needed.`;
            }

            alert(message);

            // Refresh the notes display if new notes were added
            if (result.newNotesAdded > 0) {
                // Update the in-memory notesByDate object from localStorage
                const allNotes = JSON.parse(localStorage.getItem("all_notes")) || {};

                // Clear existing notes and repopulate from localStorage
                for (const date in notesByDate) {
                    delete notesByDate[date];
                }

                for (const [date, notes] of Object.entries(allNotes)) {
                    notesByDate[date] = notes;
                }

                // Get the current date from the day-event element or use today's date
                const dayEvent = document.getElementById("day-event");
                const currentDate = dayEvent && dayEvent.dataset.date 
                    ? new Date(dayEvent.dataset.date) 
                    : new Date();

                // Refresh the notes display
                renderNotesForDate(currentDate);
            }

            // Show success sync button for 3 seconds
            syncButton.hidden = true;
            successSyncButton.hidden = false;

            setTimeout(() => {
                syncButton.hidden = false;
                successSyncButton.hidden = true;
            }, 3000);
        } else {
            // Show error message
            alert(`Synchronization failed: ${result.error}`);
        }
    } catch (error) {
        // Show error message
        console.error('Synchronization error:', error);
        alert(`Synchronization error: ${error.message}`);
    } finally {
        // Re-enable the button and remove loading state
        syncButton.disabled = false;
        syncButton.classList.remove('syncing');
    }
});

// Add CSS for the syncing state
const style = document.createElement('style');
style.textContent = `
.calendar__controls-sync_unsync.syncing {
    opacity: 0.5;
    cursor: not-allowed;
}
`;
document.head.appendChild(style);
