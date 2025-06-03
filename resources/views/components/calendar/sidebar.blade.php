<aside class="calendar-sidebar calendar-sidebar__container">
  <div class="container-alt">
    <header class="calendar-sidebar__header">
      <p class="calendar-sidebar__title">Timely</p>
      <button
        class="calendar-sidebar__add-event"
        id="add-note"
      >
        <img
          src="{{ asset('icons/plus.svg') }}"
          alt="Add new task"
          class="calendar-sidebar__add-event-image"
          width="10"
          height="10"
        />
      </button>
    </header>

    <main class="calendar-sidebar__main">
      <section
        class="calendar-sidebar__month"
        tabindex="0"
      >
        <div class="calendar-sidebar__month-header">
          <h1
            class="calendar-sidebar__month-title"
            tabindex="0"
            id="month-title"
          >
            <span
              class="calendar-sidebar__month-title--highlight"
              id="month-title__highlight"
            ></span>
          </h1>
          <div class="calendar-sidebar__month-action">
            <button
              class="calendar-sidebar__month-action-btn calendar-sidebar__action-btn--prev"
              id="prev-month"
            >
              <img
                class="calendar-sidebar__month-action-btn-image"
                src="{{ asset('icons/arrow-left.svg') }}"
                alt="Previous month"
                width="7"
                height="12"
              />
            </button>
            <button
              class="calendar-sidebar__month-action-btn calendar-sidebar__action-btn--next"
              id="next-month"
            >
              <img
                class="calendar-sidebar__month-action-btn-image"
                src="{{ asset('icons/arrow-right.svg') }}"
                alt="Next month"
                width="7"
                height="12"
              />
            </button>
          </div>
        </div>

        <div class="calendar-sidebar__calendar">
          <ul class="calendar-sidebar__weekdays">
            <li class="calendar-sidebar__weekday">Sun</li>
            <li class="calendar-sidebar__weekday">Mon</li>
            <li class="calendar-sidebar__weekday">Tue</li>
            <li class="calendar-sidebar__weekday">Wed</li>
            <li class="calendar-sidebar__weekday">Thu</li>
            <li class="calendar-sidebar__weekday">Fri</li>
            <li class="calendar-sidebar__weekday">Sat</li>
          </ul>
          <ul
            class="calendar-sidebar__days"
            id="sidebar-days"
          ></ul>
        </div>
      </section>

      <section class="calendar-sidebar__tasks">
        <ul class="calendar-sidebar__task-list"></ul>
      </section>
    </main>
  </div>
</aside>
