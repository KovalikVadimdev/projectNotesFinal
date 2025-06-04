"use strict"
import {notesByDate} from "./notesData.js";
import {renderTaskList} from './asideTask.js';
import {hashTextSHA256, encryptString} from './encode.js';
import {addNote} from './addNote.js';
import {editNote} from './editNote.js';
import {deleteNote} from "./deleteNote.js";

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
  console.log(dayEvent.dataset.date);
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
  buttons.querySelector(".note-save").onclick = async () => {
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

    const password = localStorage.getItem('password'); // припускаємо, що збережений
    if (!password) {
      alert("Шифрувальний ключ не знайдено!");
      return;
    }

    const encoded_text = encryptString(text, password);
    const hash_text = hashTextSHA256(text);
    const idUser = localStorage.getItem('id_user');

    if (container.dataset.existing === "true") {
      const noteId = container.dataset.noteId;
      note.dataset.noteId = noteId;

      // Заміна в notesByDate
      const index = notesByDate[currentDate].findIndex(n => n.id === noteId);
      if (index !== -1) {
        notesByDate[currentDate][index] = {
          id: Number(noteId),
          text: encoded_text,
          hash: hash_text
        };
      }

      const allNotes = JSON.parse(localStorage.getItem("all_notes")) || {};
      if (allNotes[currentDate]) {
        const i = allNotes[currentDate].findIndex(n => n.id === noteId);
        if (i !== -1) {
          allNotes[currentDate][i] = {
            id: Number(noteId),
            text: encoded_text,
            hash: hash_text
          };
        }
        localStorage.setItem("all_notes", JSON.stringify(allNotes));
      }

      const editNotes = await editNote(Number(noteId), encoded_text, hash_text);

      // ДОРОБИТИ НОРМАЛЬНУ ЗМІНУ HASH ЗАМІТКИ У ALL_NOTES_SYNCED, і так само і для видалення
      const syncedNotes = JSON.parse(localStorage.getItem("all_notes_synced")) || {};
      if (!syncedNotes[currentDate]) syncedNotes[currentDate] = [];

      // Діагностування: перевіряємо структуру існуючих нотаток
      console.log("Існуючі нотатки:", syncedNotes[currentDate]);
      console.log("Шукаємо noteId:", noteId);

      // Спробуємо різні варіанти пошуку
      const existingNoteIndex = syncedNotes[currentDate].findIndex(n => {
        // Перевіряємо різні можливі поля для ID
        return n.id === noteId || n.noteId === noteId || n.note_id === noteId;
      });

      console.log("Знайдений індекс:", existingNoteIndex);

      const newHash = editNotes?.text_hash || hash_text;

      if (existingNoteIndex !== -1) {
        // Оновити існуючу нотатку
        console.log("Оновлюємо існуючу нотатку");
        syncedNotes[currentDate][existingNoteIndex].hash = newHash;
      } else {
        // Додати нову нотатку
        console.log("Додаємо нову нотатку");
        syncedNotes[currentDate].push({
          id: Number(noteId),
          noteId: noteId, // Додаємо обидва поля для сумісності
          hash: newHash
        });
      }

      localStorage.setItem("all_notes_synced", JSON.stringify(syncedNotes));
      console.log("Оновлені нотатки:", syncedNotes[currentDate]);

      dayEvent.replaceChild(note, container);

    } else {
      const noteId = Date.now().toString();
      note.dataset.noteId = noteId;
      notesByDate[currentDate].push({
        id: noteId,
        text: encoded_text,
        hash: hash_text
      });

      const allNotes = JSON.parse(localStorage.getItem("all_notes")) || {};

      if (!allNotes[currentDate]) {
        allNotes[currentDate] = [];
      }

      allNotes[currentDate].push({
        id: noteId,
        text: encoded_text,
        hash: hash_text
      });

      localStorage.setItem("all_notes", JSON.stringify(allNotes));

      const addNotes = await addNote(Number(noteId), Number(idUser), currentDate, encoded_text, hash_text);

      const syncedNotes = JSON.parse(localStorage.getItem("all_notes_synced")) || {};

      if (!syncedNotes[currentDate]) {
        syncedNotes[currentDate] = [];
      }

      syncedNotes[currentDate].push({
        id: addNotes.id_note,
        hash: addNotes.text_hash
      });
      localStorage.setItem("all_notes_synced", JSON.stringify(syncedNotes));

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
  buttons.querySelector(".note-remove").onclick = async () => {
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

        const allNotesStr = localStorage.getItem("all_notes");
        console.log(allNotesStr)
        if (allNotesStr) {
          const allNotes = JSON.parse(allNotesStr);

          // Перебираємо всі дати
          for (const dateKey in allNotes) {
            if (Array.isArray(allNotes[dateKey])) {
              allNotes[dateKey] = allNotes[dateKey].filter(note => note.id !== noteId);

              // Якщо масив порожній, видаляємо дату
              if (allNotes[dateKey].length === 0) {
                delete allNotes[dateKey];
              }
            }
          }

          localStorage.setItem("all_notes", JSON.stringify(allNotes));
        }

        const delNote = await deleteNote(noteId);

        const allNotesSyncedStr = localStorage.getItem("all_notes_synced");
        console.log(allNotesSyncedStr)
        if (allNotesSyncedStr) {
          const allNotesSynced = JSON.parse(allNotesSyncedStr);

          // Перебираємо всі дати
          for (const dateKey in allNotesSynced) {
            if (Array.isArray(allNotesSynced[dateKey])) {
              allNotesSynced[dateKey] = allNotesSynced[dateKey].filter(note => note.id !== noteId);

              // Якщо масив порожній, видаляємо дату
              if (allNotesSynced[dateKey].length === 0) {
                delete allNotesSynced[dateKey];
              }
            }
          }

          localStorage.setItem("all_notes_synced", JSON.stringify(allNotesSynced));
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


