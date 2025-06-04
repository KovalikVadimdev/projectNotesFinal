"use strict";
import { notesByDate } from './notesData.js';
import { decryptString } from './encode.js';

const taskList = document.querySelector('.calendar-sidebar__task-list');

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Функція для форматування дати в YYYY-MM-DD
function formatDateISO(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Функція для форматування дати для відображення (M/D/YYYY)
function formatDateDisplay(date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

// Функція, щоб отримати текст днів: Today, Tomorrow, або день тижня
function getDayLabel(index) {
  if (index === 0) return "TODAY";
  if (index === 1) return "TOMORROW";
  return daysOfWeek[(new Date(Date.now() + index * 86400000)).getDay()];
}

function removeMarkdownFormatting(markdownText) {
  let cleanedText = markdownText;
  cleanedText = cleanedText.replace(/\*\*(.*?)\*\*/gs, '$1');
  cleanedText = cleanedText.replace(/\*(.*?)\*/gs, '$1');
  cleanedText = cleanedText.replace(/_(.*?)_/gs, '$1');
  cleanedText = cleanedText.replace(/<br\s*\/?>/gi, '\n');
  return cleanedText;
}

function textToLinesArray(text) {
  return text.split(/\r?\n/);
}

function truncateString(str) {
  if (str.length > 20) {
    return str.slice(0, 20) + "...";
  }
  return str;
}

export function renderTaskList(startDate) {
  taskList.innerHTML = ''; // очищаємо список

  for (let i = 0; i < 9; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const dayLabel = getDayLabel(i);
    const dateISO = formatDateISO(date);

    const dateDisplay = formatDateDisplay(date);
    const tasks = notesByDate[dateISO] || [];
    // Створюємо li для дня
    const liDay = document.createElement('li');
    liDay.classList.add('calendar-sidebar__task-item');
    if (i === 0) {
      liDay.querySelector?.('h3')?.classList.add('calendar-sidebar__task-day--selected');
    }

    liDay.innerHTML = `
      <div class="calendar-sidebar__task-header">
        <div class="calendar-sidebar__task-time">
          <h3 class="calendar-sidebar__task-day ${i === 0 ? 'calendar-sidebar__task-day--selected' : ''}">${dayLabel}</h3>
          <p class="calendar-sidebar__task-date ${i === 0 ? 'calendar-sidebar__task-date--selected' : ''}">${dateDisplay}</p>
        </div>
      </div>
      <ul class="calendar-sidebar__task-tasks"></ul>
    `;

    // Додаємо замітки, якщо є
    const tasksUl = liDay.querySelector('.calendar-sidebar__task-tasks');
    tasks.forEach(task => {

      const liTask = document.createElement('li');

      const password = localStorage.getItem('password');
      const decryptNoteText = decryptString(task.text, password);

      const removedMarkdownText = removeMarkdownFormatting(decryptNoteText);
      const textTask = textToLinesArray(removedMarkdownText);
      const firstLineTextTask = textTask[0];
      const truncatedTextTask = truncateString(firstLineTextTask);

      liTask.classList.add('calendar-sidebar__task-tasks-item');
      liTask.innerHTML = `
        <div class="calendar-sidebar__task-tasks-circle"></div>
        <p class="calendar-sidebar__task-tasks-text">${truncatedTextTask}</p>
      `;
      tasksUl.appendChild(liTask);
    });

    taskList.appendChild(liDay);
  }
}

// Початкове відображення — від сьогодні
renderTaskList(new Date());
