import { DetailedHTMLProps } from 'react';

export function Table(
  props: DetailedHTMLProps<React.ImgHTMLAttributes<HTMLTableElement>, HTMLTableElement>,
) {
  return (
    <div className="mdx-table overflow-scroll sm:overflow-visible">
      <table {...props} />
    </div>
  );
}
