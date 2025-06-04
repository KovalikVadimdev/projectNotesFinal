"use strict"

import { notesByDate } from "./notesData.js";

import { parseMarkdownToHTML, createNoteBox } from "./notes.js"

import { decryptString } from './encode.js';

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function renderNotesForDate(date) {
  const dateStr = formatDate(date);
  const notesContainer = document.getElementById("day-event");
  notesContainer.innerHTML = "";
  notesContainer.dataset.date = dateStr;

  if (notesByDate?.[dateStr]) {
    for (const note of notesByDate[dateStr]) {
      const noteEl = document.createElement("div");
      noteEl.className = "note-display";
      noteEl.dataset.noteId = note.id;

      const password = localStorage.getItem('password');
      const decryptNoteText = decryptString(note.text, password);

      noteEl.dataset.raw = decryptNoteText;
      noteEl.innerHTML = parseMarkdownToHTML(decryptNoteText);
      noteEl.onclick = () => createNoteBox(noteEl);
      notesContainer.appendChild(noteEl);
    }
  }
}