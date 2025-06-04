"use strict";

const profileTitle = document.getElementById('profile-header-title');

const profileText = document.getElementById('profile-header-text');

const profileName = document.getElementById('profile-overview-name');
const profileEmail = document.getElementById('profile-overview-email');

const fullName = document.getElementById('full_name');
const nickName = document.getElementById('nickname');
const gender = document.getElementById('gender');
const country = document.getElementById('country');

const mainEmail = document.getElementById('profile-emails-email');

const localCountry = localStorage.getItem('country');
const localEmail = localStorage.getItem('email');
const localFullName = localStorage.getItem('fullname');
const localGender = localStorage.getItem('gender');
const localNickname = localStorage.getItem('nickname');

const displayName = localFullName?.trim() || localNickname;
profileTitle.textContent = `Welcome, ${displayName}`;

const options = {
  weekday: 'short',   // 'Wed'
  year: 'numeric',    // '2025'
  month: 'long',      // 'June'
  day: '2-digit'      // '04'
};

const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', options);

profileText.textContent += `${formattedDate}`;

if (localFullName && localFullName.trim() !== '') {
  profileName.textContent = localFullName;
} else if (localNickname) {
  profileName.textContent = localNickname;
}

// Встановлюємо email
if (localEmail) {
  profileEmail.textContent = localEmail;
}

if (mainEmail && localEmail) {
  mainEmail.textContent = localEmail;
}

function updateInputValue(inputElement, storageKey) {
  const value = localStorage.getItem(storageKey);
  console.log(value)

  if (value && value.trim() !== '') {
    inputElement.value = value;
  }
}


// Оновлюємо всі поля
updateInputValue(fullName, 'fullname');
updateInputValue(nickName, 'nickname');
updateInputValue(gender, 'gender');
updateInputValue(country, 'country');


const editEmailBtn = document.getElementById('profile-emails-button');

editEmailBtn.addEventListener('click', async () => {
  const newEmail = prompt('Введіть новий email:', '');

  if (newEmail === null) {
    // Користувач натиснув "Скасувати"
    return;
  }

  const trimmedEmail = newEmail.trim();

  if (!trimmedEmail) {
    alert('Будь ласка, введіть валідний email.');
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/user/update-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        currentEmail: localEmail,
        newEmail: trimmedEmail
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 422 && data.errors) {
        const error = Object.values(data.errors)[0][0];
        alert(error);
      } else if (data.error) {
        alert(data.error);
      } else {
        alert('Сталася невідома помилка.');
      }
    } else {
      // Успішне оновлення
      localStorage.setItem('email', data.email);
      mainEmail.textContent = data.email;
      profileEmail.textContent = data.email;
      alert('Email успішно оновлено!');
    }
  } catch (err) {
    alert('Помилка мережі або сервер недоступний.');
    console.error(err);
  }
});

const editData = document.getElementById('profile-overview-edit');

const inputs = [fullName, nickName, gender, country];
let isEditing = false;
inputs.forEach(input => input.disabled = true);

editData.addEventListener('click', async () => {
  if (!isEditing) {
    // Режим редагування: розблоковуємо інпути
    inputs.forEach(input => input.disabled = false);
    editData.textContent = 'Save';
    isEditing = true;
  } else {
    inputs.forEach(input => input.disabled = true);
    const data = {
      email: localEmail,
      fullName: fullName.value.trim() || null,
      nickname: nickName.value.trim(),
      gender: gender.value?.trim() || null,
      country: country.value?.trim() || null
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Не вдалося оновити дані');
      }

      localStorage.setItem("country", data.country);
      localStorage.setItem("fullname", data.fullName);
      localStorage.setItem("gender", data.gender);
      localStorage.setItem("nickname", data.nickname);

      editData.textContent = 'Edit';
      isEditing = false;
      alert("Дані успішно оновлено");
    } catch (error) {
      console.error(error);
      alert('Сталася помилка при оновленні даних');
      // Якщо помилка — повертаємо можливість редагування
      inputs.forEach(input => input.disabled = false);
      editData.textContent = 'Save';
      isEditing = true;
    }
  }
});