"use strict";
import {getSelectedDate, setSelectedDate, onDateChange} from './state.js';

const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');
const weekDays = document.getElementById('sidebar-days');

let currentDate = new Date();

function renderCalendar(date) {
  weekDays.innerHTML = '';
  weekDays.classList.add('calendar-sidebar__days--visible');

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekDay = firstDay.getDay();

  const totalCells = 42;
  const today = new Date();

  const selectedDate = getSelectedDate();

  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  let startDate = new Date(year, month, 1 - firstWeekDay);

  for (let i = 0; i < totalCells; i++) {
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

    li.addEventListener('click', () => {
      setSelectedDate(startDate);
    });

    weekDays.appendChild(li);
    startDate.setDate(startDate.getDate() + 1);
  }
}

onDateChange((newDate) => {
  currentDate = new Date(newDate);
  renderCalendar(currentDate);
});

prevMonth.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonth.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);
