import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Flags from 'country-flag-icons/react/3x2'


/**
 * Renders a switch which toggles locale
 */



export function LocaleSelect({ locales }: { locales: Record<string, string> }) {
  const location = useLocation()
  const pathNameArray = location?.pathname?.split('/')
  const navigate = useNavigate();

  const onChange = (prefix: string) => {
    pathNameArray[3] = prefix;
    const newLocation = pathNameArray.join('/')
    navigate(newLocation, { replace: true });
  }

  const container = (children?: React.ReactElement) => (
    <div className="relative w-full px-1 h-8 flex items-center dark:text-white bg-[#fbfbfb] hover:bg-transparent dark:bg-transparent border hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 rounded focus:outline-none">
      {children}
    </div>
  );
  //@ts-ignore
  const Flag = Flags[pathNameArray[3].toUpperCase()];
  return container(
    <>
      <div className="flex-1 bg-gray-200 dark:bg-zinc-900 rounded pl-2">
        <Flag className="w-4 h-6" />
      </div>
      <select
        role="button"
        className="absolute inset-0 appearance-none w-full flex items-center font-medium bg-transparent focus:outline-none pl-10 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white text-xs pr-3"
        value={location?.pathname?.split('/')[3]}
        onChange={e => {
          onChange(e.target.value);
        }}
      >
        {Object.entries(locales).map(([locale, localeName]) => <option className="dark:text-white" key={locale} value={locale}>{localeName}</option>)}
      </select>
      <div className="flex-2" >
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