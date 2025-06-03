"use strict"

let selectedDate = new Date();
const listeners = [];

export function getSelectedDate() {
  return selectedDate;
}

export function setSelectedDate(date) {
  selectedDate = new Date(date);
  listeners.forEach(fn => fn(selectedDate));
}

export function onDateChange(callback) {
  listeners.push(callback);
}
