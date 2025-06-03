"use strict";

const titleElement = document.getElementById('month-title');
const highlightSpan = document.getElementById('month-title__highlight');

const month = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const date = new Date();
const currentMonth = month[date.getMonth()];
const currentYear = date.getFullYear();

titleElement.firstChild.nodeValue = `${currentMonth} `;
highlightSpan.textContent = currentYear;
