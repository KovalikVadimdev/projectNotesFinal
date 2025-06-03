@extends('layouts.app')

@section('title', 'Notebook')

@section('styles')
  @vite('resources/scss/main.scss')
@endsection

@section('scripts')
  @vite(['resources/js/main.js'])
@endsection

@section('content')
  <main class="main main__container">
    @include('components.calendar.sidebar')

    <section class="calendar container">
      @include('components.calendar.header')

      <main class="calendar__main">
        @include('components.calendar.day-view')
      </main>
    </section>
  </main>

  @include('components.auth.modal')
@endsection 