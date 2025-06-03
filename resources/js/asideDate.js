"use strict";

const titleElement = document.getElementById('month-title');
const highlightSpan = document.getElementById('month-title__highlight');

const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let currentDate = new Date(); // початкова дата

function updateTitle(date) {
  const currentMonth = monthNames[date.getMonth()];
  const currentYear = date.getFullYear();

  titleElement.firstChild.nodeValue = `${currentMonth} `;
  highlightSpan.textContent = currentYear;
}

prevMonth.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateTitle(currentDate);
});

nextMonth.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateTitle(currentDate);
});

// Перший рендер
updateTitle(currentDate);
