import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Flags from 'country-flag-icons/react/3x2';

/**
 * Renders a switch which toggles locale
 */

export function LocaleSelect({ locales }: { locales: Record<string, string> }) {
  const location = useLocation();
  const pathNameArray = location?.pathname?.split('/');
  const navigate = useNavigate();

  const onChange = (prefix: string) => {
    pathNameArray[3] = prefix;
    const newLocation = pathNameArray.join('/');
    navigate(newLocation, { replace: true });
  };

  const container = (children?: React.ReactElement) => (
    <div className="relative flex h-8 w-full items-center rounded border bg-[#fbfbfb] px-1 hover:border-gray-300 hover:bg-transparent focus:outline-none dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:border-gray-600">
      {children}
    </div>
  );
  //@ts-ignore
  const Flag = Flags[pathNameArray[3].toUpperCase()];
  return container(
    <>
      <div className="flex-1 rounded bg-gray-200 pl-2 dark:bg-zinc-900">
        <Flag className="h-6 w-4" />
      </div>
      <select
        role="button"
        className="absolute inset-0 flex w-full appearance-none items-center bg-transparent pl-10 pr-3 text-xs font-medium text-gray-600 hover:text-black focus:outline-none dark:text-gray-300 dark:hover:text-white"
        value={location?.pathname?.split('/')[3]}
        onChange={e => {
          onChange(e.target.value);
        }}
      >
        {Object.entries(locales).map(([locale, localeName]) => (
          <option className="dark:text-white" key={locale} value={locale}>
            {localeName}
          </option>
        ))}
      </select>
      <div className="flex-2">
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
