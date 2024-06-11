import { usePageContext } from '../context';

export function Header() {
  const { owner } = usePageContext();

  return (
    <header className="px-4">
      <div className="h-12 flex items-center">
        {owner}
      </div>
    </header>
  );
}
