"use strict"

import {notesByDate} from "./notesData.js";

import {parseMarkdownToHTML, createNoteBox} from "./notes.js"

export function renderNotesForDate(date) {
  const dateStr = date.toISOString().split("T")[0];
  const notesContainer = document.getElementById("day-event");
  notesContainer.innerHTML = "";
  notesContainer.dataset.date = dateStr;

  if (notesByDate?.[dateStr]) {
    for (const note of notesByDate[dateStr]) {
      const noteEl = document.createElement("div");
      noteEl.className = "note-display";
      noteEl.dataset.noteId = note.id;
      noteEl.dataset.raw = note.text;
      noteEl.innerHTML = parseMarkdownToHTML(note.text);
      noteEl.onclick = () => createNoteBox(noteEl);
      notesContainer.appendChild(noteEl);
    }
  }
}