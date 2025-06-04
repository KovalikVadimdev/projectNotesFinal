"use strict";

export function handleUserLogin(user, auth) {
  if (!auth) return;

  const profileNameElement = document.getElementById('profile-user-name');
  if (profileNameElement) {
    // Обираємо ім’я: повне або нікнейм, але лише якщо воно не порожнє
    const fullName = user.fullName?.trim();
    const username = user.username?.trim();
    const nameToDisplay = fullName || username || 'Гість'; // fallback якщо нічого немає

    profileNameElement.textContent = nameToDisplay;
  }

  const dropdownElement = document.getElementById('drop-down-menu-profile');
  if (dropdownElement) {
    dropdownElement.classList.remove('js-signin-modal-trigger');
  }
}
