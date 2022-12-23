import { createElement } from 'react';
import cx from 'classnames';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  id?: string;
  anchor?: boolean;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading: React.FC<HeadingProps> = props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, type, className, ...other } = props;

  const el = createElement(
    props.type,
    {
      ...other,
      className: cx(className, 'group relative flex items-center gap-2'),
    },
    <>
      <span>{props.children}</span>
      {!!props.anchor && (
        <a
          href={`#${id}`}
          className="no-prose inline-flex h-6 w-6 items-center justify-center rounded border bg-gray-50/50 text-sm no-underline opacity-0 transition hover:border-gray-300 group-hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-800/50 hover:dark:border-zinc-600"
        >
          #
        </a>
      )}
    </>,
  );

  return el;
};

export default Heading;
