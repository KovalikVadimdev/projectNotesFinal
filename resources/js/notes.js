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
      const index = notesByDate[currentDate].findIndex(n => n.id === Number(noteId));
      if (index !== -1) {
        notesByDate[currentDate][index] = {
          id: Number(noteId),
          text: encoded_text,
          hash: hash_text
        };
      }

      const allNotes = JSON.parse(localStorage.getItem("all_notes")) || {};
      if (allNotes[currentDate]) {
        const allNotesIndex = allNotes[currentDate].findIndex(n => n.id === Number(noteId));
        if (allNotesIndex !== -1) {
          allNotes[currentDate][allNotesIndex].text = encoded_text;
          allNotes[currentDate][allNotesIndex].hash = hash_text;
          localStorage.setItem("all_notes", JSON.stringify(allNotes));
        }
      }

      try {
        const updatedNoteData = await editNote(Number(noteId), encoded_text, hash_text);

        // Оновлення в localStorage "all_notes_synced"
        const syncedNotes = JSON.parse(localStorage.getItem("all_notes_synced")) || {};
        if (syncedNotes[currentDate]) {
          const syncedIndex = syncedNotes[currentDate].findIndex(n => n.id === Number(noteId));
          if (syncedIndex !== -1) {
            // Використовуємо дані, що прийшли у відповідь від сервера
            syncedNotes[currentDate][syncedIndex].id = Number(updatedNoteData.id); // Оновлюємо id, якщо сервер його повернув
            syncedNotes[currentDate][syncedIndex].hash = updatedNoteData.hash; // Оновлюємо hash_text з відповіді
            localStorage.setItem("all_notes_synced", JSON.stringify(syncedNotes));
          }
        }
      } catch (error) {
        console.error("Не вдалося оновити замітку на сервері:", error);
      } finally {
        // Завжди закриваємо вікно редагування
        dayEvent.replaceChild(note, container);
      }

    } else {
      const noteId = Date.now().toString();
      note.dataset.noteId = noteId;
      notesByDate[currentDate].push({
        id: Number(noteId),
        text: encoded_text,
        hash: hash_text
      });

      const allNotes = JSON.parse(localStorage.getItem("all_notes")) || {};

      if (!allNotes[currentDate]) {
        allNotes[currentDate] = [];
      }

      allNotes[currentDate].push({
        id: Number(noteId),
        text: encoded_text,
        hash: hash_text
      });

      localStorage.setItem("all_notes", JSON.stringify(allNotes));

      try {
        const addNotes = await addNote(Number(noteId), Number(idUser), currentDate, encoded_text, hash_text);
        console.log("addNotes response:", addNotes);
        const syncedNotes = JSON.parse(localStorage.getItem("all_notes_synced")) || {};

        if (!syncedNotes[currentDate]) {
          syncedNotes[currentDate] = [];
        }

        syncedNotes[currentDate].push({
          id: Number(addNotes.id_note),
          hash: addNotes.text_hash
        });

        localStorage.setItem("all_notes_synced", JSON.stringify(syncedNotes));
      } catch (error) {
        console.error("Не вдалося синхронізувати замітку з сервером:", error);
      } finally {
        // Закриваємо вікно редагування незалежно від результату
        dayEvent.replaceChild(note, container);
      }
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
          notesByDate[currentDate] = notesByDate[currentDate].filter(note => note.id !== Number(noteId));
          console.log(notesByDate); // Перевірка після фільтрації

          if (notesByDate[currentDate].length === 0) {
            delete notesByDate[currentDate];
          }
        }

        let allNotes = JSON.parse(localStorage.getItem("all_notes")) || {};
        if (allNotes[currentDate]) {
          allNotes[currentDate] = allNotes[currentDate].filter(note => String(note.id) !== noteId);
          if (allNotes[currentDate].length === 0) {
            delete allNotes[currentDate];
          }
          localStorage.setItem("all_notes", JSON.stringify(allNotes));
        }

        try {
          const delNote = await deleteNote(Number(noteId));

          if (delNote.status === 200) {
            let syncedNotes = JSON.parse(localStorage.getItem("all_notes_synced")) || {};
            if (syncedNotes[currentDate]) {
              syncedNotes[currentDate] = syncedNotes[currentDate].filter(note => String(note.id) !== noteId);
              if (syncedNotes[currentDate].length === 0) {
                delete syncedNotes[currentDate];
              }
              localStorage.setItem("all_notes_synced", JSON.stringify(syncedNotes));
            }
          }

          // Видалення з DOM
          const target = document.querySelector(`.note-display[data-note-id="${noteId}"]`);
          if (target) target.remove();
        } catch (error) {
          console.error("Помилка під час видалення замітки:", error);
        } finally {
          // У будь-якому випадку прибираємо контейнер редагування
          container.remove();
          renderTaskList(new Date());
        }
      }
    } else {
      container.remove();
      renderTaskList(new Date());
    }
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


