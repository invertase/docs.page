import Embed, { VimeoProps as ReactVimeoProps } from '@u-wave/react-vimeo';

const DEFAULT_WIDTH = 400;

type VimeoProps = ReactVimeoProps & { caption?: string };

function Vimeo(props: VimeoProps) {
  return (
    <figure className="flex aspect-video w-full items-center justify-center overflow-hidden rounded">
      <Embed {...{ width: DEFAULT_WIDTH, ...props }} />
      {props.caption && (
        <figcaption className="mt-4 text-center text-xs dark:text-white">
          {props.caption}
        </figcaption>
      )}
    </figure>
  );
}

export { Vimeo, VimeoProps };
