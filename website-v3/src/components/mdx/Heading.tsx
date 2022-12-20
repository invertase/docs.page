import { createElement } from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  id?: string;
  eyebrow?: boolean;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading: React.FC<HeadingProps> = props => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, type, ...other } = props;

  const el = createElement(props.type, {
    ...other,
  });

  return el;
};

export default Heading;
