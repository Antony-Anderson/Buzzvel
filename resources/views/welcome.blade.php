<!DOCTYPE html>
<html lang="en" class="dark h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buzzvel - Payment Portal</title>
    <script>
        (function () {
            try {
                var theme = localStorage.getItem('buzzvel_theme');
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme === 'light' ? 'light' : 'dark');
            } catch (e) {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="h-full bg-brand-dark text-brand-foreground antialiased overflow-x-hidden">
    <div id="root" class="min-h-screen flex flex-col"></div>
</body>
</html>
