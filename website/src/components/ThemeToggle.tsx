import { MoonIcon, SunIcon } from './icons';

export default function ThemeToggle() {
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
