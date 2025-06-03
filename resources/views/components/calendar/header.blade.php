<header class="calendar__header">
  <div class="calendar__controls-day">
    <button
      class="calendar__controls-day-button calendar__controls-day-button--left"
      id="prev-day"
    >
      <img
        src="{{ asset('icons/arrow-left-alt.svg') }}"
        alt="Previous day"
        class="calendar__controls-day-image"
        width="6"
        height="10"
      />
    </button>
    <button
      class="calendar__controls-day-button calendar__controls-day-button--current"
      id="today"
    >
      <p class="calendar__controls-day-text">Today</p>
    </button>
    <button
      class="calendar__controls-day-button calendar__controls-day-button--right"
      id="next-day"
    >
      <img
        src="{{ asset('icons/arrow-right-alt.svg') }}"
        alt="Next day"
        class="calendar__controls-day-image"
        width="6"
        height="10"
      />
    </button>
  </div>

  <div class="calendar__controls-info">
    <div class="calendar__controls-sync">
      <button
        class="calendar__controls-sync_unsync"
        id="sync"
      >
        <img
          src="{{ asset('icons/sync.svg') }}"
          alt="Not synchronized"
        />
      </button>
      <button
        class="calendar__controls-sync_successsync"
        id="successsync"
        hidden
      >
        <img
          src="{{ asset('icons/successsync.svg') }}"
          alt="Synchronized"
        />
      </button>
    </div>

    <div
      class="calendar__controls-profile js-signin-modal-trigger"
      id="drop-down-menu-profile"
    >
      <a
        class="calendar__controls-profile cd-main-nav__item cd-main-nav__item--signin"
        href="#0"
        data-signin="login"
      >
        <img
          src="{{ asset('images/user.png') }}"
          alt="User image"
          class="calendar__controls-profile-image"
          width="24"
          height="24"
        />
        <p
          class="calendar__controls-profile-name"
          id="profile-user-name"
        >User
        </p>
      </a>
    </div>
  </div>
</header>
