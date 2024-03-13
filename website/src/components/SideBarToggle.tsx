import { BarsIcon } from './icons';

export function SideBarToggle() {
  return (
    <button data-sidebar-toggle className="h-6 w-6 transition-opacity hover:opacity-75">
      <BarsIcon />
    </button>
  );
}
