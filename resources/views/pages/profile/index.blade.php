@extends('layouts.app')

@section('title', 'Notebook | User Account')

@section('styles')
  @vite('resources/scss/main.scss')
@endsection

@section('scripts')
  @vite('resources/js/userAccount.js')
@endsection

@section('content')
  <main class="user-main">
    <header class="user-header">
      <a
        href="http://localhost:8000/"
        class="user-header__link"
      >Return to Notebook
      </a>

    </header>

    <div class="user-main__container">
      <div class="user-main__header">
        <h1
          class="user-main__header-title"
          id="profile-header-title"
        ></h1>
        <p
          class="user-main__header-text"
          id="profile-header-text"
        ></p>

      </div>

      <div class="user-main__profile">
        @include('components.profile.overview')
        @include('components.profile.settings')

        <div class="user-main__profile-emails">
          <h3 class="user-main__profile-emails-title">My email Address</h3>
          <ul class="user-main__profile-emails-list">
            <li class="user-main__profile-emails-item">
              <img
                src="{{ asset('icons/sms.svg') }}"
                alt="Icon SMS"
                class="user-main__profile-emails-image"
              />
              <div class="user-main__profile-emails-info">
                <a
                  class="user-main__profile-emails-email"
                  id="profile-emails-email"
                >
                  user@gmail.com
                </a>
              </div>
            </li>
          </ul>
          <div class="user-main__profile-emails-wrapper">
            <button
              class="user-main__profile-emails-button"
              id="profile-emails-button"
            >Edit Email Address
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
@endsection
