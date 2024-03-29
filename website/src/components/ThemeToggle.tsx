import { useEffect } from 'react';
import { MoonIcon, SunIcon } from './icons';
import context from 'src/context';
import { useStore } from '@nanostores/react';
import { themeToggleLogic } from 'src/utils';

export default function ThemeToggle() {
  const { owner, repository, domain, ref } = useStore(context);

  useEffect(() => {
    themeToggleLogic({ owner, repository, domain, ref });
  }, []);

  return (
    <button data-theme-toggle className="relative h-6 w-6 transition-opacity hover:opacity-75">
      <span data-theme-type="dark" className="hidden">
        <MoonIcon />
      </span>
      <span data-theme-type="light" className="hidden">
        <SunIcon />
      </span>
    </button>
  );
}
