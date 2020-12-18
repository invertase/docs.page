import useDarkMode from 'use-dark-mode';
import { useNoSSR } from '../hooks';

import { DARK_MODE_CLASS_NAME, LIGHT_MODE_CLASS_NAME, STORAGE_KEY } from '../scripts/noflash';
import { Moon, Sun } from './Icons';

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
  const darkMode = useDarkMode(false, {
    storageKey: STORAGE_KEY,
    classNameDark: DARK_MODE_CLASS_NAME,
    classNameLight: LIGHT_MODE_CLASS_NAME,
  });

  return (
    <div className="relative w-28 px-2 h-8 flex items-center bg-gray-100 dark:bg-gray-900 border hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 rounded focus:outline-none">
      {ready && (
        <>
          <div className="flex-1">
            {darkMode.value && <Moon size={14} />}
            {!darkMode.value && <Sun size={14} />}
          </div>
          <select
            role="button"
            className="absolute inset-0 appearance-none w-full flex items-center bg-transparent focus:outline-none pl-8 text-gray-600 dark:text-gray-300 font-mono text-xs pr-3"
            value={darkMode.value ? 'dark' : 'light'}
            onChange={e => {
              const value = e.target.value;
              if (value === 'dark') {
                darkMode.enable();
              } else {
                darkMode.disable();
              }
            }}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <div>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              shape-rendering="geometricPrecision"
            >
              <path d="M17 8.517L12 3 7 8.517M7 15.48l5 5.517 5-5.517"></path>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
