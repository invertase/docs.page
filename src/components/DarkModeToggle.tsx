import Toggle from 'react-dark-mode-toggle';
import useDarkMode from 'use-dark-mode';
import { useNoSSR } from '../hooks';

import { DARK_MODE_CLASS_NAME, LIGHT_MODE_CLASS_NAME, STORAGE_KEY } from '../scripts/noflash';

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
    <div className="flex items-center" style={{ width: 70 }}>
      {ready && (
        <Toggle
          onChange={checked => {
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
