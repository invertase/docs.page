import { useEffect } from 'react';
import { BarsIcon } from './icons';
import { sideBarToggleLogic } from 'src/utils';

export function SideBarToggle() {
  useEffect(() => {
    sideBarToggleLogic();
  }, []);

  return (
    <button data-sidebar-toggle className="h-6 w-6 transition-opacity hover:opacity-75">
      <BarsIcon />
    </button>
  );
}
