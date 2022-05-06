import { useContext, useEffect, useRef } from 'react';
import { DarkModeContext } from '~/context';

interface DartPadProps {
  // ID of a GitHub gist to load into the editor
  id?: string;
  // Percentage of the iframe width to use for the editor (the rest may be used by the console or Flutter/HTML output).
  split?: number;
  mode?: 'default' | 'inline' | 'flutter' | 'html';
  //  Set this to 'dark' to use the dark theme (seen in the first screenshot above).
  theme?: 'dark';
  //  Set this to true to enable null safety mode.
  nullSafety: boolean;
  //
  height: string;
  // Set this to 'true' to auto-run the sample once loaded.
  run: boolean;
  // ID of an API doc sample to load into the editor (see https://api.flutter.dev/snippets/index.json for a list)
  sampleId?: string;
  // If this parameter is set to "master", DartPad will load API Doc samples from the master doc server (master-api.flutter.dev). Any other values (or no value) will cause DartPad to load from the stable doc server (api.flutter.dev).
  sampleChannel?: string;
  // The following parameters are used together when loading a sample directly from a GitHub repo
  // Owner of the GitHub account.
  ghOwner?: string;
  // Name of the repo within the above account.
  ghRepo?: string;
  // Path to a dartpad_metadata.yaml file within the repo.
  ghPath?: string;
  // Optional ref, defaults to master
  ghRef?: string;
}

// TODO: css styling (how do we want to do layout?)

export const DartPad = ({
  id,
  split,
  mode,
  theme,
  nullSafety,
  run,
  sampleId,
  sampleChannel,
  ghOwner,
  ghRepo,
  ghPath,
  ghRef,
  height,
}: DartPadProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const { darkModeValue } = useContext(DarkModeContext);

  useEffect(() => {
    if (elementRef.current) {
      const iframe = elementRef.current.firstChild as HTMLIFrameElement;

      if (iframe && darkModeValue !== 'system' && !theme) {
        console.log(iframe);
        console.log(darkModeValue);

        const oldSrc = iframe.src;
        const notTheme = darkModeValue === 'dark' ? 'light' : 'dark';

        if (oldSrc.includes(notTheme)) {
          const newSrc = iframe.src.replace(notTheme, darkModeValue);
          iframe.src = newSrc;
        }
      }
    }
  }, [darkModeValue]);

  if (!id && !ghOwner && !ghRepo && !ghPath) {
    return (
      <div className="items-align flex w-full justify-center">
        (Insufficient Source info to load DartPad)
      </div>
    );
  }

  let src = `https://dartpad.dev/${getMode(mode || 'default')}`;

  if (id) {
    src += `?id=${id}`;
  } else {
    src += `?id=${ghOwner}`;
    src += serialize({ gh_repo: ghRepo, gh_path: ghPath, gh_ref: ghRef });
  }

  src += serialize({
    split,
    theme: theme || 'light',
    null_safety: nullSafety,
    run,
    sample_id: sampleId,
    sample_channel: sampleChannel,
  });

  return (
    <div
      ref={elementRef}
      className={`dartpad-container h-[${height || '600px'}] overflow-hidden rounded py-4`}
    >
      <iframe className="h-full w-full" src={src}></iframe>
    </div>
  );
};

const serialize = function (obj: Record<string, string | boolean | number | undefined>) {
  const str = [];
  for (const p in obj) {
    const val = obj[p];
    if (obj.hasOwnProperty(p) && val !== undefined) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(val));
    }
  }
  return '&' + str.join('&');
};

const getMode = (mode: 'default' | 'inline' | 'flutter' | 'html') => {
  switch (mode) {
    case 'html':
      return 'embed-html.html';
    case 'flutter':
      return 'embed-flutter.html';
    case 'inline':
      return 'embed-inline.html';
    default:
      return 'embed-dart.html';
  }
};
