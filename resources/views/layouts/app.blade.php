<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >
  <meta
    name="csrf-token"
    content="{{ csrf_token() }}"
  >

  <title>@yield('title', 'Notebook')</title>

  <!-- Styles -->
  @yield('styles')
</head>
<body>
@yield('content')

<!-- Scripts -->
@yield('scripts')
</body>
</html>
