import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


/**
 * Renders a switch which toggles light & dark mode.
 *
 * The toggle itself provides the `checked` value, and enables/disables
 * the value via the `useDarkMode` hook.
 *
 * Since the user przeference is only available on the client, an empty container
 * is rendered on the server.
 */
export function LocaleSelect() {
  const [locale, setLocale] = useState<string>()
  const navigate = useNavigate();
  // console.log(location)
  const onChange = (locale: string) => {
    navigate(locale, { replace: true });
  }

  const container = (children?: React.ReactElement) => (
    <div className="relative w-28 px-2 h-8 flex items-center dark:text-white bg-[#fbfbfb] hover:bg-transparent dark:bg-transparent border hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 rounded focus:outline-none">
      {children}
    </div>
  );

  return container(
    <>
      <div className="flex-1">
        <p>Language</p>
      </div>
      <select
        role="button"
        className="absolute inset-0 appearance-none w-full flex items-center font-medium bg-transparent focus:outline-none pl-8 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white text-xs pr-3"
        value={locale}
        onChange={e => {
          const value = e.target.value;


          if (value === 'es') {
            onChange('es')
          } else {
            onChange('en')
          }
        }}
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
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
