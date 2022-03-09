import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';

export function Checkout(): JSX.Element {
  const [repo, setRepo] = useState<string>('');
  const [valid, setValid] = useState<boolean | null>(null);
  const url = useRef<string | null>();
  const githubRegex = '^https:\\/\\/[^\\/:]+[\\/:]([^\\/:]+)\\/(.+)';

  useEffect(() => {
    if (!repo) {
      url.current = null;
      return setValid(null);
    }

    if (repo.startsWith('https://github.com')) {
      const chunks = repo.match(githubRegex);
      if (chunks && chunks.length === 3) {
        url.current = `https://docs.page/${chunks[1]}/${chunks[2]}`;
        return setValid(true);
      }
    }

    url.current = null;
    return setValid(false);
  }, [repo]);

  return (
    <div>
      <div className="mb-4 px-3">
        <input
          type="text"
          placeholder="https://github.com/invertase/docs.page"
          className="w-full appearance-none rounded border bg-transparent px-3 py-3 placeholder-gray-500 focus:border-orange-400"
          value={repo}
          onChange={e => setRepo(e.target.value)}
        />
      </div>
      <p className="px-3 text-lg">
        Enter your GitHub repository URL above to view your new documentation!
      </p>
      <div className="mt-8 px-3">
        <button
          type="button"
          className={cx(
            'rounded bg-gradient-to-br from-yellow-500 to-yellow-600 px-8 py-3 font-semibold text-white',
            {
              'hover:from-yellow-600 hover:to-yellow-700': valid === true,
              'cursor-not-allowed opacity-50': !valid,
            },
          )}
          onClick={() => {
            if (valid && url.current) {
              window.location.href = url.current;
            }
          }}
        >
          View Docs
        </button>
      </div>
      <div className="mt-4 h-4 px-3">
        <p
          className={cx('text-red-500 transition-opacity duration-100', {
            'opacity-0': valid === true || valid === null,
          })}
        >
          Please enter a valid GitHub repository URL.
        </p>
      </div>
    </div>
  );
}
