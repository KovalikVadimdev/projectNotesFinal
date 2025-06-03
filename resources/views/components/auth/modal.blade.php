<div class="modal">
  <div class="signin-modal js-signin-modal">
    <div class="signin-modal__container">
      <ul class="signin-modal__switcher js-signin-modal-switcher js-signin-modal-trigger">
        <li>
          <a
            href=""
            data-signin="login"
            data-type="login"
          >Sign in
          </a>
        </li>
        <li>
          <a
            href=""
            data-signin="signup"
            data-type="signup"
          >New account
          </a>
        </li>
      </ul>

      <div
        class="signin-modal__block js-signin-modal-block"
        data-type="login"
      >
        <form class="signin-modal__form">
          <p class="signin-modal__fieldset">
            <label
              class="signin-modal__label signin-modal__label--email signin-modal__label--image-replace"
              for="signin-email"
            >E-mail
            </label>
            <input
              class="signin-modal__input signin-modal__input--full-width signin-modal__input--has-padding signin-modal__input--has-border"
              id="signin-email"
              type="email"
              placeholder="E-mail"
            />
          </p>

          <p class="signin-modal__fieldset">
            <label
              class="signin-modal__label signin-modal__label--password signin-modal__label--image-replace"
              for="signin-password"
            >Password
            </label>
            <input
              class="signin-modal__input signin-modal__input--full-width signin-modal__input--has-padding signin-modal__input--has-border"
              id="signin-password"
              type="text"
              placeholder="Password"
            />
            <a
              href=""
              class="signin-modal__hide-password js-hide-password"
            >Hide
            </a>
          </p>

          <p class="signin-modal__fieldset">
            <input
              class="signin-modal__input signin-modal__input--full-width"
              type="button"
              value="Login"
              id="signin"
            />
          </p>
        </form>
      </div>

      <div
        class="signin-modal__block js-signin-modal-block"
        data-type="signup"
      >
        <form class="signin-modal__form">
          <p class="signin-modal__fieldset">
            <label
              class="signin-modal__label signin-modal__label--username signin-modal__label--image-replace"
              for="signup-username"
            >Username
            </label>
            <input
              class="signin-modal__input signin-modal__input--full-width signin-modal__input--has-padding signin-modal__input--has-border"
              id="signup-username"
              type="text"
              placeholder="Username"
            />
          </p>

          <p class="signin-modal__fieldset">
            <label
              class="signin-modal__label signin-modal__label--email signin-modal__label--image-replace"
              for="signup-email"
            >E-mail
            </label>
            <input
              class="signin-modal__input signin-modal__input--full-width signin-modal__input--has-padding signin-modal__input--has-border"
              id="signup-email"
              type="email"
              placeholder="E-mail"
            />
          </p>

          <p class="signin-modal__fieldset">
            <label
              class="signin-modal__label signin-modal__label--password signin-modal__label--image-replace"
              for="signup-password"
            >Password
            </label>
            <input
              class="signin-modal__input signin-modal__input--full-width signin-modal__input--has-padding signin-modal__input--has-border"
              id="signup-password"
              type="text"
              placeholder="Password"
            />
            <a
              href=""
              class="signin-modal__hide-password js-hide-password"
            >Hide
            </a>
          </p>

          <p class="signin-modal__fieldset">
            <input
              class="signin-modal__input signin-modal__input--full-width signin-modal__input--has-padding"
              type="button"
              value="Create account"
              id="signup"
            />
          </p>
        </form>
      </div>
      <a
        href=""
        class="signin-modal__close js-close"
      >Close
      </a>
    </div>
  </div>
</div>
