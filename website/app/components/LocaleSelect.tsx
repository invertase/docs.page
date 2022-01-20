import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";


/**
 * Renders a switch which toggles locale
 */



export function LocaleSelect({ locales }: { locales: string[] }) {
  const location = useLocation()
  const navigate = useNavigate();

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
      <select
        role="button"
        className="absolute inset-0 appearance-none w-full flex items-center font-medium bg-transparent focus:outline-none pl-8 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white text-xs pr-3"
        value={location?.pathname?.split('/')[3]}
        onChange={e => {
          onChange(e.target.value);
        }}
      >
        {locales.map(locale => <option key={locale} value={locale}>{locale}</option>)}
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
