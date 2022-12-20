import { createElement } from 'react';
import cx from 'classnames';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  id?: string;
  eyebrow?: boolean;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading: React.FC<HeadingProps> = props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, type, eyebrow, ...other } = props;

  const el = createElement(props.type, {
    ...other,
    className: cx(props.className, {
      'text-docs-theme': eyebrow,
    }),
  });

  return el;
};

export default Heading;
