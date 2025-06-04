"use strict";

import { renderNotesForDate } from './notes-render.js';
export const notesByDate = {};

// Завантаження заміток із localStorage у notesByDate
const savedNotes = JSON.parse(localStorage.getItem("all_notes")) || {};

for (const [date, notes] of Object.entries(savedNotes)) {
  notesByDate[date] = notes;
}

renderNotesForDate(new Date());
