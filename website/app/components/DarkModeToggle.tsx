import React, { useContext, useState } from 'react';
import { useNoSSR } from '../hooks';
import { MoonIcon, SunIcon, DesktopComputerIcon } from '@heroicons/react/solid';
import { DarkModeContext } from '~/context';

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
  const { setDarkModeValue } = useContext(DarkModeContext);

  const ready = useNoSSR();
  const darkMode = useDarkMode();

  // Null on SSR since we don't know the users setting
  const [mode, setMode] = useState<string | null>(null);

  const container = (children?: React.ReactElement) => (
    <div className="relative flex h-8 w-full items-center rounded border bg-[#fbfbfb] px-2 hover:border-gray-300 hover:bg-transparent focus:outline-none dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:border-gray-600 md:w-28">
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
        {option === 'dark' && <MoonIcon width={14} />}
        {option === 'light' && <SunIcon width={14} />}
        {option === 'system' && <DesktopComputerIcon width={14} />}
      </div>
      <select
        role="button"
        className="absolute inset-0 flex w-full appearance-none items-center bg-transparent pl-8 pr-3 text-xs font-medium text-gray-600 hover:text-black focus:outline-none dark:text-gray-300 dark:hover:text-white"
        value={option}
        onChange={e => {
          const value = e.target.value;
          setMode(value);
          setDarkModeValue(value as 'light' | 'dark' | 'system');
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
