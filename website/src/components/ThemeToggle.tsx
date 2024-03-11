import { useStore } from '@nanostores/react';
import { MoonIcon, SunIcon } from './icons';
import context from 'src/context';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { owner, repository, domain, ref, theme } = useStore(context);
  const [themeMode, setThemeMode] = useState(theme || 'dark');

  const isDark = themeMode === 'dark';

  useEffect(() => {
    context.setKey('theme', themeMode);
    document.querySelector('html')?.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleThemeMode = () => {
    if (isDark) {
      setThemeMode('light');
    } else {
      setThemeMode('dark');
    }

    // Update the theme via server and return a cookie
    fetch('/api/docs.page/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner,
        repository,
        ref,
        domain,
        theme: themeMode,
      }),
    });
  };
  return (
    <button
      data-theme-toggle
      onClick={toggleThemeMode}
      className="relative h-6 w-6 transition-opacity hover:opacity-75"
    >
      {themeMode === 'dark' ? (
        <span data-theme-type="dark">
          <MoonIcon />
        </span>
      ) : (
        <span data-theme-type="light">
          <SunIcon />
        </span>
      )}
    </button>
  );
}
