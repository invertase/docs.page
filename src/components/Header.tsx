import React, { useContext } from "react";
import DarkModeToggle from "react-dark-mode-toggle";
import useDarkMode from "use-dark-mode";

import { ConfigContext } from "../config";
import {
  DARK_MODE_CLASS_NAME,
  LIGHT_MODE_CLASS_NAME,
  STORAGE_KEY,
} from "../noflash";
import { SlugPropertiesContext } from "../properties";
import { isClient } from "../utils";

import { Link } from "./Link";

export function Header() {
  const config = useContext(ConfigContext);
  const properties = useContext(SlugPropertiesContext);
  const repo = `${properties.owner}/${properties.repository}`;

  return (
    <header className="desktop:px-4 sticky top-0 z-10 desktop:flex items-center justify-center h-32 desktop:h-16 bg-white text-sm dark:bg-gray-800 text-gray-900 dark:text-white border-b dark:border-gray-800">
      <div className="flex-1 flex items-center justify-center desktop:justify-start space-x-4 h-16">
        {!!config.logo && (
          <Link href="/" className="h-10 w-10">
            <img src={config.logo} alt={repo} style={{ maxHeight: "100%" }} />
          </Link>
        )}
        <span>
          {!!config.name ? (
            <span className="font-mono font-semibold text-lg tracking-wide">
              {config.name}
            </span>
          ) : (
            <a
              href={`https://github.com/${repo}`}
              className="font-mono hover:underline"
            >
              {repo}
            </a>
          )}
        </span>
      </div>
      <div className="flex items-center justify-center desktop:justify-start space-x-6 font-mono h-16">
        {config.navigation.length > 0 && (
          <ul className="flex items-center space-x-6 overflow-x-auto px-3 desktop:px-0">
            {config.navigation.map(([title, url]) => (
              <li key={url}>
                <Link href={url} className="hover:underline whitespace-no-wrap">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="hidden desktop:flex items-center space-x-6">
          {!!config.name && (
            <a href={`https://github.com/${repo}`} className="hover:underline">
              {repo}
            </a>
          )}
          <Toggle />
        </div>
      </div>
    </header>
  );
}

function Toggle() {
  const darkMode = useDarkMode(false, {
    storageKey: STORAGE_KEY,
    classNameDark: DARK_MODE_CLASS_NAME,
    classNameLight: LIGHT_MODE_CLASS_NAME,
  });

  return (
    <div className="flex items-center" style={{ width: 70 }}>
      {isClient() && (
        <DarkModeToggle
          onChange={(checked) => {
            if (checked) darkMode.enable();
            else darkMode.disable();
          }}
          checked={darkMode.value}
          size={70}
        />
      )}
    </div>
  );
}
