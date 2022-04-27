import Embed, { VimeoProps as ReactVimeoProps } from '@u-wave/react-vimeo';
import { useState } from 'react';

type VimeoProps = ReactVimeoProps & { caption?: string };

function Vimeo(props: VimeoProps) {
  const [ready, setReady] = useState<boolean>(false);

  return (
    <figure
      id="vimeo-wrapper"
      className="mx-auto overflow-hidden rounded shadow"
      style={{ width: props.width || 'inherit' }}
    >
      {!ready && (
        <div className="mx-auto flex h-64 items-center justify-center rounded">
          <span>Loading...</span>
        </div>
      )}
      <Embed onReady={() => setReady(true)} responsive={true} {...props} />
      {props.caption && (
        <figcaption className="mt-4 text-center text-xs dark:text-white">
          {props.caption}
        </figcaption>
      )}
    </figure>
  );
}

export { Vimeo, VimeoProps };
