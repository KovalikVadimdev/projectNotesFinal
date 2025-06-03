"use strict";

const prevDayBtn = document.getElementById('prev-day');
const todayBtn = document.getElementById('today');
const nextDayBtn = document.getElementById('next-day');

const mainDayName = document.getElementById('main-day-name');
const mainDayNumber = document.getElementById('main-day-number');

const daysOfWeekShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Стан: обрана дата
let selectedDate = new Date();

// Функції для форматування
function formatDate(date) {
  return `${date.getDate()}`;
}

function getDayShortName(date) {
  return daysOfWeekShort[date.getDay()];
}

// Функція оновлення відображення
function updateMainDay() {
  mainDayName.textContent = getDayShortName(selectedDate);
  mainDayNumber.textContent = formatDate(selectedDate);
}

// Обробники подій
prevDayBtn.addEventListener('click', () => {
  selectedDate.setDate(selectedDate.getDate() - 1);
  updateMainDay();
});

nextDayBtn.addEventListener('click', () => {
  selectedDate.setDate(selectedDate.getDate() + 1);
  updateMainDay();
});

todayBtn.addEventListener('click', () => {
  selectedDate = new Date(); // Скинути до сьогодні
  updateMainDay();
});

// Початкове оновлення при завантаженні
updateMainDay();
