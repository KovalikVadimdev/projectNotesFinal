"use strict"
import { notesByDate } from "./notesData.js";
import { renderTaskList } from './asideTask.js';

const notes = document.getElementById("add-note");

notes.addEventListener("click", () => {
  createNoteBox();
});

export function createNoteBox(existingNoteElement = null) {
  const container = document.createElement("div");
  container.id = "editor";
  container.className = "note-box__container";


  const editor = document.createElement("textarea");
  editor.className = "note-box__editor";
  editor.rows = 5;

  const buttons = document.createElement("div");
  buttons.className = "note-box__buttons";
  buttons.innerHTML = `
    <div class="note-box__tool">
        <div class="note-box__tool-formatting">
          <button class="note-btn bold"><b>Bold</b></button>
          <button class="note-btn italic"><i>Italic</i></button>
          <button class="note-btn underline"><u>Underline</u></button>
        </div>
        <div class="note-box__action">
          <button class="note-btn note-save">Save</button>
          <button class="note-btn note-cancel">Cancel</button>
          <button class="note-btn note-remove">Remove</button>
        </div>
      </div>
  `;

  container.appendChild(editor);
  container.appendChild(buttons);

  const dayEvent = document.getElementById("day-event");
  if (existingNoteElement) {
    editor.value = existingNoteElement.dataset.raw || existingNoteElement.innerText;
    container.dataset.existing = "true";
    container.dataset.noteId = existingNoteElement.dataset.noteId;
    container.dataset.original = editor.value;
    dayEvent.replaceChild(container, existingNoteElement);
  } else {
    container.dataset.original = "";
    dayEvent.appendChild(container);
  }

  // Format buttons
  buttons.querySelector(".bold").onclick = () => wrapSelection(editor, "**");
  buttons.querySelector(".italic").onclick = () => wrapSelection(editor, "*");
  buttons.querySelector(".underline").onclick = () => wrapSelection(editor, "_");

  // Save
  buttons.querySelector(".note-save").onclick = () => {
    const text = editor.value;
    const formattedHTML = parseMarkdownToHTML(text);
    const note = document.createElement("div");
    note.className = "note-display";
    note.innerHTML = formattedHTML;
    note.dataset.raw = text;
    note.onclick = () => createNoteBox(note);

    const currentDate = document.getElementById("day-event").dataset.date;
    if (!notesByDate[currentDate]) {
      notesByDate[currentDate] = [];
    }

    if (container.dataset.existing === "true") {
      const noteId = container.dataset.noteId;
      note.dataset.noteId = noteId;

      // Заміна в notesByDate
      const index = notesByDate[currentDate].findIndex(n => n.id === noteId);
      if (index !== -1) {
        notesByDate[currentDate][index].text = text;
      }
      dayEvent.replaceChild(note, container);
    } else {
      const noteId = Date.now().toString();
      note.dataset.noteId = noteId;
      notesByDate[currentDate].push({ id: noteId, text });
      dayEvent.replaceChild(note, container);
    }
    renderTaskList(new Date())
  };

  // Cancel
  buttons.querySelector(".note-cancel").onclick = () => {
    if (container.dataset.existing === "true") {
      const note = document.createElement("div");
      note.className = "note-display";
      note.dataset.noteId = container.dataset.noteId;
      note.dataset.raw = container.dataset.original;
      note.innerHTML = parseMarkdownToHTML(container.dataset.original);
      note.onclick = () => createNoteBox(note);
      dayEvent.replaceChild(note, container);
    } else {
      dayEvent.removeChild(container);
    }
  };

  // Remove
  buttons.querySelector(".note-remove").onclick = () => {
    const currentDate = dayEvent.dataset.date;

    if (container.dataset.existing === "true") {
      const confirmDel = confirm("Чи дійсно ви хочете видалити дану замітку?");
      if (confirmDel) {
        const noteId = container.dataset.noteId;

        // Видалення з notesByDate
        if (notesByDate[currentDate]) {
          notesByDate[currentDate] = notesByDate[currentDate].filter(note => note.id !== noteId);

          // Якщо більше немає заміток у дні — видалити день із notesByDate (не обов’язково, але красиво)
          if (notesByDate[currentDate].length === 0) {
            delete notesByDate[currentDate];
          }
        }

        // Видалення з DOM
        const target = document.querySelector(`.note-display[data-note-id="${noteId}"]`);
        if (target) target.remove();
        else container.remove();
      }
    } else {
      container.remove();
    }
    renderTaskList(new Date())
  };
}

// Markdown to styled HTML
export function parseMarkdownToHTML(text) {
  return text
    .replace(/</g, "&lt;") // avoid HTML injection
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/gs, '<span class="bold">$1</span>') // Додано 's'
    .replace(/\*(.*?)\*/gs, '<span class="italic">$1</span>')   // Додано 's'
    .replace(/_(.*?)_/gs, '<span class="underline">$1</span>') // Додано 's'
    .replace(/\n/g, "<br>");
}

// Format helper
function wrapSelection(textarea, wrapper) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end);
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  textarea.value = before + wrapper + selected + wrapper + after;
  textarea.focus();
  textarea.selectionStart = start + wrapper.length;
  textarea.selectionEnd = end + wrapper.length;
}
