"use strict"

import { createUser }  from './createNewUser.js';
import { authUser } from "./authUser.js";
import { editEmail } from "./editEmailUser.js";
import { editInfo } from './editInfoUser.js';
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
    const password = document.querySelector("#signin-password")?.value;

    try {
      const user = await authUser(email, password);

      if (user && user.id_user) {
        const { id_user, email, password, nickname, fullname, gender, country } = user;

        localStorage.setItem("id_user", JSON.stringify(id_user));
        localStorage.setItem("email", JSON.stringify(email));
        localStorage.setItem("password", JSON.stringify(password));
        localStorage.setItem("nickname", JSON.stringify(nickname));
        localStorage.setItem("fullname", JSON.stringify(fullname));
        localStorage.setItem("gender", JSON.stringify(gender));
        localStorage.setItem("country", JSON.stringify(country));

        // За потреби можна закрити модальне вікно:
        document.querySelector(".js-signin-modal")?.classList.remove("signin-modal--is-visible");

        handleUserLogin({ username: nickname, fullName: fullname }, true);
      } else {
        alert("Неправильні облікові дані");
      }
    } catch (error) {
      console.error("Помилка під час авторизації:", error);
      alert("Сталася помилка під час авторизації");
    }
  });

