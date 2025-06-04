"use strict";

import { decryptString, encryptString } from './encode.js';
import { editNote } from './editNote.js';

/**
 * Fetches all notes (hashes and IDs) from the server for the current user
 * @returns {Promise<Object>} Object containing notes with their hashes
 */
export async function fetchAllNotesHashes() {
    const userId = localStorage.getItem('id_user');
    if (!userId) {
        throw new Error("User ID not found in localStorage");
    }

    try {
        const response = await fetch(`http://localhost:8000/api/user/${userId}/notes`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return processNotesFromServer(data.notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
}

/**
 * Processes notes from server into a format matching localStorage
 * @param {Array} notes Array of notes from server
 * @returns {Object} Object with dates as keys and arrays of notes as values
 */
function processNotesFromServer(notes) {
    const processedNotes = {};

    notes.forEach(note => {
        const date = note.date;
        if (!processedNotes[date]) {
            processedNotes[date] = [];
        }

        processedNotes[date].push({
            id: Number(note.id_note),
            hash: note.text_hash
        });
    });

    return processedNotes;
}

/**
 * Fetches a single note from the server by ID
 * @param {Number} noteId The ID of the note to fetch
 * @returns {Promise<Object>} The note object
 */
export async function fetchNoteById(noteId) {
    try {
        const response = await fetch(`http://localhost:8000/api/note/${noteId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data.note;
    } catch (error) {
        console.error('Error fetching note:', error);
        throw error;
    }
}

/**
 * Compares local notes with server notes and identifies conflicts
 * @param {Object} serverNotes Notes from server
 * @returns {Array} Array of conflicts
 */
function findNoteConflicts(serverNotes) {
    const localNotes = JSON.parse(localStorage.getItem("all_notes")) || {};
    const conflicts = [];

    // Check each date in server notes
    for (const [date, dateNotes] of Object.entries(serverNotes)) {
        if (!localNotes[date]) {
            // Date exists on server but not locally - these are new notes
            continue;
        }

        // Check each note for this date
        dateNotes.forEach(serverNote => {
            const localNote = localNotes[date].find(note => note.id === serverNote.id);

            // If note exists locally but hash is different, it's a conflict
            if (localNote && localNote.hash !== serverNote.hash) {
                conflicts.push({
                    date,
                    noteId: serverNote.id,
                    serverHash: serverNote.hash,
                    localHash: localNote.hash
                });
            }
        });
    }

    return conflicts;
}

/**
 * Creates a modal for resolving note conflicts
 * @param {Object} localNote The local version of the note
 * @param {Object} serverNote The server version of the note
 * @param {String} date The date of the note
 * @returns {Promise<Object>} The resolved note
 */
function createConflictResolutionModal(localNote, serverNote, date) {
    return new Promise((resolve, reject) => {
        const modal = document.createElement('div');
        modal.className = 'sync-modal';

        // Combine both versions with clear separation
        const combinedText = `=== LOCAL VERSION ===\n${localNote.decryptedText}\n\n=== SERVER VERSION ===\n${serverNote.decryptedText}`;

        modal.innerHTML = `
            <div class="sync-modal__content">
                <h2>Note Synchronization</h2>

                <div class="sync-modal__versions">
                    <div class="sync-modal__version">
                        <textarea class="sync-modal__textarea combined-version">${combinedText}</textarea>
                    </div>
                </div>

                <div class="sync-modal__actions">
                    <button class="sync-modal__button use-merged">Save Edited Content</button>
                    <button class="sync-modal__button cancel">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.use-merged').addEventListener('click', () => {
            const combinedText = modal.querySelector('.combined-version').value;
            const password = localStorage.getItem('password');
            const encryptedText = encryptString(combinedText, password);

            // We need to calculate the hash for the combined text
            const crypto = window.crypto || window.msCrypto;
            const encoder = new TextEncoder();
            const data = encoder.encode(combinedText);

            crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                resolve({ text: encryptedText, hash: hashHex, decryptedText: combinedText });
                document.body.removeChild(modal);
            });
        });

        modal.querySelector('.cancel').addEventListener('click', () => {
            reject(new Error('User cancelled conflict resolution'));
            document.body.removeChild(modal);
        });
    });
}

/**
 * Main function to synchronize notes
 * @returns {Promise<void>}
 */
export async function synchronizeNotes() {
    try {
        // Step 1: Fetch all notes (hashes and IDs) from server
        const serverNotes = await fetchAllNotesHashes();

        // Step 2: Update all_notes_synced in localStorage
        localStorage.setItem("all_notes_synced", JSON.stringify(serverNotes));

        // Step 3: Compare hashes with local notes
        const conflicts = findNoteConflicts(serverNotes);

        // Step 4: If conflicts found, resolve them one by one
        for (const conflict of conflicts) {
            // Step 5: Fetch the encrypted note from the server
            const serverNote = await fetchNoteById(conflict.noteId);

            // Step 6: Get the local note
            const localNotes = JSON.parse(localStorage.getItem("all_notes"));
            const localNote = localNotes[conflict.date].find(note => note.id === conflict.noteId);

            // Step 7: Decrypt both notes
            const password = localStorage.getItem('password');
            const decryptedLocalNote = {
                ...localNote,
                decryptedText: decryptString(localNote.text, password)
            };

            const decryptedServerNote = {
                ...serverNote,
                decryptedText: decryptString(serverNote.text, password)
            };

            // Step 8: Show modal for user to resolve conflict
            const resolvedNote = await createConflictResolutionModal(
                decryptedLocalNote,
                decryptedServerNote,
                conflict.date
            );

            // Step 9: User edits and saves the note

            // Step 10: Update local storage
            localNotes[conflict.date] = localNotes[conflict.date].map(note => {
                if (note.id === conflict.noteId) {
                    return {
                        ...note,
                        text: resolvedNote.text,
                        hash: resolvedNote.hash
                    };
                }
                return note;
            });

            localStorage.setItem("all_notes", JSON.stringify(localNotes));

            // Step 11: Send to server
            await editNote(conflict.noteId, resolvedNote.text, resolvedNote.hash);
        }

        // Handle new notes from server that don't exist locally
        const localNotes = JSON.parse(localStorage.getItem("all_notes")) || {};
        let newNotesCount = 0;

        // Find notes that exist on server but not locally
        for (const [date, dateNotes] of Object.entries(serverNotes)) {
            if (!localNotes[date]) {
                // This date doesn't exist locally, create it
                localNotes[date] = [];
            }

            // Check each note for this date
            for (const serverNote of dateNotes) {
                // Check if note exists locally
                const localNoteExists = localNotes[date].some(note => note.id === serverNote.id);

                if (!localNoteExists) {
                    // This is a new note, fetch it from server
                    const fullServerNote = await fetchNoteById(serverNote.id);

                    // Add to local notes
                    localNotes[date].push({
                        id: serverNote.id,
                        text: fullServerNote.text,
                        hash: serverNote.hash
                    });

                    newNotesCount++;
                }
            }
        }

        // Save updated local notes
        if (newNotesCount > 0) {
            localStorage.setItem("all_notes", JSON.stringify(localNotes));
        }

        // Step 12: Fetch updated hashes
        const updatedServerNotes = await fetchAllNotesHashes();
        localStorage.setItem("all_notes_synced", JSON.stringify(updatedServerNotes));

        return {
            success: true,
            conflictsResolved: conflicts.length,
            newNotesAdded: newNotesCount
        };
    } catch (error) {
        console.error('Error during synchronization:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Add CSS for the sync modal
const style = document.createElement('style');
style.textContent = `
.sync-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.sync-modal__content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.sync-modal__versions {
    margin: 20px 0;
}

.sync-modal__version {
    width: 100%;
}

.sync-modal__textarea {
    width: 100%;
    height: 300px; /* Increased height for better visibility */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
    font-family: monospace; /* Better for displaying formatted text */
    font-size: 14px;
    line-height: 1.5;
}

.sync-modal__actions {
    display: flex;
    justify-content: center; /* Center the buttons */
    flex-wrap: wrap;
    gap: 15px; /* Increased gap between buttons */
    margin-top: 20px;
}

.sync-modal__button {
    padding: 10px 20px; /* Larger buttons */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    transition: background-color 0.2s;
}

.sync-modal__button:hover {
    background-color: #45a049; /* Darker green on hover */
}

.sync-modal__button.cancel {
    background-color: #f44336;
}

.sync-modal__button.cancel:hover {
    background-color: #d32f2f; /* Darker red on hover */
}
`;

document.head.appendChild(style);
