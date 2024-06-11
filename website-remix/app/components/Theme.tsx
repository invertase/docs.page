import { usePageContext } from '../context';

function getThemeKey(owner: string, repository: string) {
  return `docs.page:theme:${owner}/${repository}`;
}

export function ThemeScript() {
  const { owner, repository } = usePageContext();

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `const key = '${getThemeKey(owner, repository)}';
if (localStorage[key] === 'dark' || (!(key in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.setAttribute('data-theme', 'dark');
} else {
  document.documentElement.setAttribute('data-theme', 'light');
}
`,
      }}
    />
  );
}
