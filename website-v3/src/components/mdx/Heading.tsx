import { createElement } from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  id?: string;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading: React.FC<HeadingProps> = props => {
  const el = createElement(props.type, {
    ...props,
  });

  return el;
};

export default Heading;
