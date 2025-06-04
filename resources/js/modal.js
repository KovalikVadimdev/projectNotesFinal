"use strict"

import { createUser }  from './createNewUser.js';
import { authUser } from "./authUser.js";
import { handleUserLogin } from './profileName.js';

class ModalSignin {
  constructor(modal) {
    this.modal = modal;
    this.blocks = modal.querySelectorAll(".js-signin-modal-block");
    this.switchers = modal.querySelectorAll(".js-signin-modal-switcher a");
    this.triggers = document.querySelectorAll(".js-signin-modal-trigger");
    this.hidePasswordBtns = modal.querySelectorAll(".js-hide-password");
    this.init();
  }

  init() {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        const signinTarget = e.target.closest("[data-signin]");
        if (signinTarget) {
          e.preventDefault();
          const type = signinTarget.getAttribute("data-signin");
          this.showForm(type);
        }
      });
    });

    this.modal.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("js-signin-modal") ||
        e.target.classList.contains("js-close")
      ) {
        e.preventDefault();
        this.modal.classList.remove("signin-modal--is-visible");
      }
    });

    this.hidePasswordBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.togglePassword(btn));
    });
  }

  togglePassword(button) {
    const input = button.previousElementSibling;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    button.textContent = isPassword ? "Hide" : "Show";
    this.putCursorAtEnd(input);
  }

  showForm(type) {
    this.modal.classList.add("signin-modal--is-visible");

    this.blocks.forEach((block) => {
      block.classList.toggle(
        "signin-modal__block--is-selected",
        block.getAttribute("data-type") === type
      );
    });

    const switcherType = type === "signup" ? "signup" : "login";
    this.switchers.forEach((switcher) => {
      switcher.classList.toggle(
        "selected",
        switcher.getAttribute("data-type") === switcherType
      );
    });
  }

  putCursorAtEnd(input) {
    input.focus();
    const len = input.value.length;
    input.setSelectionRange(len, len);
  }
}

const modalElement = document.querySelector(".js-signin-modal");
if (modalElement) new ModalSignin(modalElement);

const mainNav = document.querySelector(".js-main-nav");
if (mainNav) {
  mainNav.addEventListener("click", (e) => {
    if (e.target.classList.contains("js-main-nav")) {
      const navList = mainNav.querySelector("ul");
      navList.classList.toggle("main-nav__list--is-visible");
    }
  });
}

const signinBtn = document.getElementById("signin");


signinBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#signin-email")?.value.trim();
    const password = document.querySelector("#signin-password")?.value.trim();

    try {
      const user = await authUser(email, password);

      if (user && user.id_user) {
        const { id_user, email, password, nickname, fullname, gender, country, notes } = user;
        
        // Store full notes
        localStorage.setItem("all_notes", JSON.stringify(notes));
        
        // Create synced notes object with only id and hash
        const syncedNotes = {};
        for (const [date, dateNotes] of Object.entries(notes)) {
          syncedNotes[date] = dateNotes.map(note => ({
            id: note.id,
            hash: note.hash
          }));
        }
        localStorage.setItem("all_notes_synced", JSON.stringify(syncedNotes));

        localStorage.setItem("id_user", id_user);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("nickname", nickname);
        localStorage.setItem("fullname", fullname);
        localStorage.setItem("gender", gender);
        localStorage.setItem("country", country);

        // За потреби можна закрити модальне вікно:
        document.querySelector(".js-signin-modal")?.classList.remove("signin-modal--is-visible");

        handleUserLogin({ username: nickname, fullName: fullname }, true);

        document.querySelector(".calendar__controls-profile")?.removeAttribute("data-signin");
        location.reload();
      } else {
        alert("Неправильні облікові дані");
      }
    } catch (error) {
      console.error("Помилка під час авторизації:", error);
      alert("Сталася помилка під час авторизації");
    }
  });


const userNamingRaw = localStorage.getItem('nickname');
const fullNameRaw = localStorage.getItem('fullname');

const userNaming = userNamingRaw && userNamingRaw !== '' ? userNamingRaw : '';
const fullName = fullNameRaw && fullNameRaw !== '' ? fullNameRaw : '';

handleUserLogin({ fullName: fullName, username: userNaming }, true);


const profile = document.getElementById('drop-down-menu-profile');
const dropdown = document.getElementById('dropdown-menu');

profile.addEventListener('click', (e) => {
  if(!document.querySelector(".calendar__controls-profile").dataset.signIn) {
    dropdown.classList.toggle('hidden');
    e.stopPropagation();
  }
});

document.addEventListener('click', () => {
    if (!dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
    }
});

dropdown.addEventListener('click', (e) => {
  e.stopPropagation();
});

const accountBtn = document.getElementById('dropdown-menu__account');

accountBtn.addEventListener('click', () => {
  window.location.href = 'http://localhost:8000/profile';
});

const signupBtn = document.getElementById('signup');


signupBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const nickname = document.querySelector("#signup-username")?.value.trim();
  const email = document.querySelector("#signup-email")?.value.trim();
  const password = document.querySelector("#signup-password")?.value.trim();
  console.log(nickname, email, password);

  try {
    const user = await createUser(email, password, nickname);

    if (user && user.id_user) {
      const { id_user, email, password, nickname, fullname, gender, country } = user;

      localStorage.setItem("id_user", id_user);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("fullname", fullname);
      localStorage.setItem("gender", gender);
      localStorage.setItem("country", country);

      // За потреби можна закрити модальне вікно:
      document.querySelector(".js-signin-modal")?.classList.remove("signin-modal--is-visible");

      handleUserLogin({ username: nickname, fullName: fullname }, true);

      document.querySelector(".calendar__controls-profile")?.removeAttribute("data-signin");


    } else {
      alert("Неправильні облікові дані");
    }
  } catch (error) {
    console.error("Помилка під час авторизації:", error);
    alert("Сталася помилка під час авторизації");
  }
});


const logoutBtn = document.getElementById('dropdown-menu__logout');

logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
})







