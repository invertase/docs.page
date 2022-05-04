interface DartPadProps {
  // ID of a GitHub gist to load into the editor
  id?: string;
  // Percentage of the iframe width to use for the editor (the rest may be used by the console or Flutter/HTML output).
  split?: number;
  mode?: 'default' | 'inline' | 'flutter' | 'html';
  //  Set this to 'dark' to use the dark theme (seen in the first screenshot above).
  theme?: 'dark';
  //  Set this to true to enable null safety mode.
  null_safety: boolean;
  //
  // Set this to 'true' to auto-run the sample once loaded.
  run: boolean;
  // ID of an API doc sample to load into the editor (see https://api.flutter.dev/snippets/index.json for a list)
  sample_id?: string;
  // If this parameter is set to "master", DartPad will load API Doc samples from the master doc server (master-api.flutter.dev). Any other values (or no value) will cause DartPad to load from the stable doc server (api.flutter.dev).
  sample_channel?: string;
  // The following parameters are used together when loading a sample directly from a GitHub repo
  // Owner of the GitHub account.
  gh_owner?: string;
  // Name of the repo within the above account.
  gh_repo?: string;
  // Path to a dartpad_metadata.yaml file within the repo.
  gh_path?: string;
  // Optional ref, defaults to master
  gh_ref?: string;
}

// TODO: css styling (how do we want to do layout?)

export const DartPad = ({
  id,
  split,
  mode,
  theme,
  null_safety,
  run,
  sample_id,
  sample_channel,
  gh_owner,
  gh_repo,
  gh_path,
  gh_ref,
}: DartPadProps) => {
  if (!id && !gh_owner && !gh_repo && !gh_path) {
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
    src += `?id=${gh_owner}`;
    src += serialize({ gh_repo, gh_path, gh_ref });
  }
  src += serialize({
    split,
    theme,
    null_safety,
    run,
    sample_id,
    sample_channel,
  });

  return (
    <div className="dartpad-container h-[600px] w-full overflow-hidden rounded">
      <iframe className="h-[600px] w-full" src={src}></iframe>
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
  return str.join('&');
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
