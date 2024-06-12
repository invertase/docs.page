import { Logo } from './Logo';

export function Header() {
  return (
    <header className="px-4">
      <div className="h-12 flex items-center">
        <Logo />
      </div>
    </header>
  );
}
