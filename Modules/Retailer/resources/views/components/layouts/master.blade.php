<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <title>Retailer Module - {{ config('app.name', 'Laravel') }}</title>

        <meta name="description" content="{{ $description ?? '' }}">
        <meta name="keywords" content="{{ $keywords ?? '' }}">
        <meta name="author" content="{{ $author ?? '' }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=playfair-display:400,500,600,700|libre-baskerville:400,700|source-sans-3:400,500,600,700&display=swap" rel="stylesheet" />

        <style>
            body {
                margin: 0;
                min-height: 100vh;
                background: var(--bg-forest, #071e18);
                color: var(--text-dark, #0b2721);
                font-family: 'Source Sans 3', sans-serif;
            }

            .rc-module-shell {
                min-height: 100vh;
                background:
                    radial-gradient(circle at top right, color-mix(in srgb, var(--paper, #F5F3EC) 6%, transparent), transparent 30%),
                    radial-gradient(circle at bottom left, color-mix(in srgb, var(--sage, #DCEDE4) 5%, transparent), transparent 24%),
                    linear-gradient(180deg, var(--bg-forest, #071e18) 0%, color-mix(in srgb, var(--bg-forest, #071e18) 72%, var(--paper, #F5F3EC) 28%) 100%);
            }
        </style>

        {{-- Vite CSS --}}
        {{-- {{ module_vite('build-retailer', 'resources/assets/sass/app.scss') }} --}}
    </head>

    <body>
        <div class="rc-module-shell">
        {{ $slot }}
        </div>

        {{-- Vite JS --}}
        {{-- {{ module_vite('build-retailer', 'resources/assets/js/app.js') }} --}}
    </body>
</html>
