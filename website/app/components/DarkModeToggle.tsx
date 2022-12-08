import { Switch } from '@headlessui/react';
import cx from 'classnames';
import { useNoSSR } from '../hooks';
import { Moon, Sun } from './Icons';

export const STORAGE_KEY = 'docs.page:dark-mode';
export const DARK_MODE_CLASS_NAME = '';
export const LIGHT_MODE_CLASS_NAME = 'light';
export const HTML_DATA_ATTRIBUTE = 'theme';

function useDarkMode() {
  return {
    enable() {
      localStorage.setItem(STORAGE_KEY, 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('color-scheme', 'dark');
    },
    disable() {
      localStorage.setItem(STORAGE_KEY, 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('color-scheme', 'light');
    },
    auto() {
      localStorage.removeItem(STORAGE_KEY);
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.setProperty('color-scheme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.setProperty('color-scheme', 'light');
      }
    },
  };
}

/**
 * Renders a switch which toggles light & dark mode.
 *
 * The toggle itself provides the `checked` value, and enables/disables
 * the value via the `useDarkMode` hook.
 *
 * Since the user preference is only available on the client, an empty container
 * is rendered on the server.
 */
export function DarkModeToggle() {
  const ready = useNoSSR();
  const darkMode = useDarkMode();

  // Render an empty container during SSR
  if (!ready) {
    return <div></div>;
  }

  const stored = localStorage[STORAGE_KEY] || 'system';
  const checked: boolean =
    stored === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : stored === 'dark';

  return (
    <Switch
      defaultChecked={checked}
      onChange={(value: boolean) => {
        value ? darkMode.enable() : darkMode.disable();
      }}
      className={cx(
        'relative inline-flex h-3 w-10 items-center rounded-full bg-[#E8E8E8] dark:bg-[#363636]',
      )}
    >
      {({ checked }) => (
        <>
          <span className="sr-only">Toggle dark mode</span>
          <span
            className={cx(
              'inline-flex h-6 w-6 transform items-center justify-center rounded-full border transition',
              {
                'translate-x-6 border-purple-800/50 bg-black text-purple-500': checked,
                'translate-x-0 border-gray-200 bg-white text-black': !checked,
              },
            )}
          >
            {checked && <Moon size={14} />}
            {!checked && <Sun size={14} />}
          </span>
        </>
      )}
    </Switch>
  );
}
