import { useEffect, useState } from 'react';
import { BarsIcon } from './icons';

export function SideBarToggle() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSideBar = () => {
    setSidebarOpen(!sidebarOpen);
    updateSideBar();
  };

  // potentially we need to fall back to ReactWay of getting Refs
  const updateSideBar = () => {
    document.body.setAttribute(
      'sidebar-open',
      (document.body.getAttribute('sidebar-open') !== 'true').toString(),
    );
  };

  useEffect(() => {
    const sidebar = document.querySelector('div[data-sidebar]');
    const mask = document.querySelector('div[data-sidebar-mask]');

    mask?.addEventListener('click', () => {
      document.body.setAttribute('sidebar-open', 'false');
    });

    new MutationObserver(() => {
      const open = document.body.getAttribute('sidebar-open') === 'true';
      for (const el of [sidebar, mask]) el?.setAttribute('data-visible', `${open}`);
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ['sidebar-open'],
    });
  }, [sidebarOpen]);

  return (
    <button onClick={toggleSideBar} className="h-6 w-6 transition-opacity hover:opacity-75">
      <BarsIcon />
    </button>
  );
}
