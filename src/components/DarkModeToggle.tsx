import React, { useState } from 'react';
import { useNoSSR } from '../hooks';
import { STORAGE_KEY } from '../scripts/dark-mode';

import { Moon, Sun, Computer } from './Icons';

function useDarkMode() {
  return {
    enable() {
      localStorage.setItem(STORAGE_KEY, 'dark');
      document.body.classList.add('dark');
    },
    disable() {
      localStorage.setItem(STORAGE_KEY, 'light');
      document.body.classList.remove('dark');
    },
    auto() {
      localStorage.removeItem(STORAGE_KEY);
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
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
export function DarkModeToggle(): JSX.Element {
  const ready = useNoSSR();
  const darkMode = useDarkMode();

  // Null on SSR since we don't know the users setting
  const [mode, setMode] = useState<string | null>(null);

  const container = (children?: React.ReactElement) => (
    <div className="relative w-28 px-2 h-8 flex items-center dark:text-white bg-docs-background border hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 rounded focus:outline-none">
      {children}
    </div>
  );

  function getSelectOption() {
    return !!mode
      ? mode
      : localStorage[STORAGE_KEY]
      ? localStorage[STORAGE_KEY] === 'dark'
        ? 'dark'
        : 'light'
      : 'system';
  }

  // Render an empty container during SSR
  if (!ready) {
    return container();
  }

  const option = getSelectOption();

  return container(
    <>
      <div className="flex-1">
        {option === 'dark' && <Moon size={14} />}
        {option === 'light' && <Sun size={14} />}
        {option === 'system' && <Computer size={14} />}
      </div>
      <select
        role="button"
        className="absolute inset-0 appearance-none w-full flex items-center bg-transparent focus:outline-none pl-8 text-gray-600 dark:text-gray-300 font-mono text-xs pr-3"
        value={option}
        onChange={e => {
          const value = e.target.value;
          setMode(value);

          if (value === 'dark') {
            darkMode.enable();
          } else if (value === 'light') {
            darkMode.disable();
          } else {
            darkMode.auto();
          }
        }}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="system">System</option>
      </select>
      <div>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <path d="M17 8.517L12 3 7 8.517M7 15.48l5 5.517 5-5.517"></path>
        </svg>
      </div>
    </>,
  );
}
