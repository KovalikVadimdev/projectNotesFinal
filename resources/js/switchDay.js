"use strict";
import { getSelectedDate, setSelectedDate, onDateChange } from './state.js';
import { renderNotesForDate } from './notes-render.js'

const prevDay = document.getElementById('prev-day');
const todayBtn = document.getElementById('today');
const nextDay = document.getElementById('next-day');
const weekDays = document.getElementById('sidebar-days');
const dayEventElement = document.getElementById('day-event');

const titleElement = document.getElementById('month-title');
const highlightSpan = document.getElementById('month-title__highlight');

export let currentDate = getSelectedDate();

function updateMonthHeader(date) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  titleElement.firstChild.nodeValue = `${months[date.getMonth()]} `;
  highlightSpan.textContent = date.getFullYear();
}

function renderCalendar(date) {
  const today = new Date();

  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const selectedDate = getSelectedDate();

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekDay = firstDay.getDay();
  let startDate = new Date(year, month, 1 - firstWeekDay);

  weekDays.innerHTML = '';
  for (let i = 0; i < 42; i++) {
    const li = document.createElement('li');
    li.classList.add('calendar-sidebar__day');
    li.textContent = startDate.getDate().toString();

    if (startDate.getMonth() !== month) {
      li.classList.add('calendar-sidebar__day--other');
    }

    if (isSameDate(startDate, today)) {
      li.classList.add('calendar-sidebar__day--selected');
    }

    if (isSameDate(startDate, selectedDate)) {
      li.classList.add('calendar-sidebar__day--checked');
    }

    weekDays.appendChild(li);
    startDate.setDate(startDate.getDate() + 1);
  }

  const yearFormatted = selectedDate.getFullYear();
  const monthFormatted = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
  const dayFormatted = selectedDate.getDate().toString().padStart(2, '0');
  dayEventElement.dataset.date = `${yearFormatted}-${monthFormatted}-${dayFormatted}`;

  updateMonthHeader(date);
}

onDateChange((newDate) => {
  currentDate = new Date(newDate);
  const editor = document.getElementById('editor');
  if (editor) {
    editor.remove();
  }
  renderCalendar(currentDate);
  renderNotesForDate(currentDate);
});


prevDay.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 1);
  const editor = document.getElementById('editor');
  if (editor) {
    editor.remove();
  }
  setSelectedDate(currentDate);
});

nextDay.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 1);
  const editor = document.getElementById('editor');
  if (editor) {
    editor.remove();
  }
  setSelectedDate(currentDate);
});

todayBtn.addEventListener('click', () => {
  currentDate = new Date();
  const editor = document.getElementById('editor');
  if (editor) {
    editor.remove();
  }
  setSelectedDate(currentDate);
});

renderCalendar(currentDate);
