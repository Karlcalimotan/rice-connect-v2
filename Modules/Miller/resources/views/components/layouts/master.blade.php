<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <title>Miller Module - {{ config('app.name', 'Laravel') }}</title>

        <meta name="description" content="{{ $description ?? '' }}">
        <meta name="keywords" content="{{ $keywords ?? '' }}">
        <meta name="author" content="{{ $author ?? '' }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        {{-- Vite CSS --}}
        {{-- {{ module_vite('build-miller', 'resources/assets/sass/app.scss') }} --}}
    </head>

    <body class="bg-slate-50 text-slate-900">
        <header class="bg-white border-b shadow-sm">
            <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <div>
                    <h1 class="text-lg font-semibold">Miller Module</h1>
                </div>
                <div class="flex items-center gap-3">
                    @guest
                        @if(Route::has('login'))
                            <a href="{{ route('login') }}" class="text-blue-600 hover:text-blue-800">Sign In</a>
                        @endif
                    @else
                        <span class="text-sm text-slate-600">{{ Auth::user()->name ?? Auth::user()->email }}</span>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Log Out</button>
                        </form>
                    @endguest
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-6 py-6">
            {{ $slot }}
        </main>

        {{-- Vite JS --}}
        {{-- {{ module_vite('build-miller', 'resources/assets/js/app.js') }} --}}
    </body>
</html>
