import { useStore } from '@nanostores/react';
import { MoonIcon, SunIcon } from './icons';
import context from 'src/context';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const { owner, repository, domain, ref } = useStore(context);

  useEffect(() => {
    const html = document.documentElement;
    const isDark = () => html.getAttribute('data-theme') === 'dark';

    const toggle = document.querySelector('button[data-theme-toggle]');
    const light = toggle?.querySelector('span[data-theme-type="light"]') as HTMLSpanElement;
    const dark = toggle?.querySelector('span[data-theme-type="dark"]') as HTMLSpanElement;

    function toggleElements() {
      if (isDark()) {
        if (light) {
          light.style.display = 'none';
        }
        if (dark) {
          dark.style.display = 'inline';
        }
      } else {
        if (dark) {
          dark.style.display = 'none';
        }
        if (light) {
          light.style.display = 'inline';
        }
      }
    }

    toggle?.addEventListener('click', () => {
      const theme = isDark() ? 'light' : 'dark';
      // Update the theme attribute on the <html> element
      theme === 'light'
        ? html.removeAttribute('data-theme')
        : html.setAttribute('data-theme', 'dark');
      // Toggle the icons
      toggleElements();
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
          theme,
        }),
      });
    });

    toggleElements();
  }, []);

  return (
    <button data-theme-toggle className="relative h-6 w-6 transition-opacity hover:opacity-75">
      <span data-theme-type="dark" className="hidden">
        <MoonIcon />
      </span>
      <span data-theme-type="light" className="hidden">
        <SunIcon />
      </span>
    </button>
  );
}
