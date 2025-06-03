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
