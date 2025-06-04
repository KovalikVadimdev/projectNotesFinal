"use strict";

export function handleUserLogin(user, auth) {
  if (!auth) return;

  const profileNameElement = document.getElementById('profile-user-name');

    // Обираємо ім’я: повне або нікнейм, але лише якщо воно не порожнє
    const fullName = user.fullName?.trim();
    const username = user.username?.trim();
    const nameToDisplay = fullName || username || 'User';

    profileNameElement.textContent = nameToDisplay;


  if (nameToDisplay !== 'User') {
    const element = document.querySelector(".cd-main-nav__item--signin");
    console.log(element)
    if (element) {
      element.removeAttribute('data-signin');
    }
  }
}

