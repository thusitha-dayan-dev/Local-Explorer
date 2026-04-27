<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- link rel="icon" href="/bear_icon.ico" sizes="any" >
        <link rel="icon" href="/bear_icon.svg" type="image/svg+xml" >
        <link rel="apple-touch-icon" href="/bear_icon.png" -->

    <link rel="icon" href="{{ asset('bear_icon.ico') }}" sizes="any">
    <link rel="icon" href="{{ asset('bear_icon.svg') }}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{{ asset('bear_icon.png') }}">

    <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
        rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
        rel="stylesheet">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx", 'resources/scss/web/app.scss'])
    @inertiaHead
    @routes
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
