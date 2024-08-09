export function Header() {
  return (
    <header className="max-w-5xl mx-auto py-5 px-3 flex items-center">
      <div>Logo</div>
      <div className="grow flex justify-end gap-3">
        <ul>
          <li>Docs</li>
        </ul>
        <div>Made by Invertase</div>
      </div>
    </header>
  );
}
