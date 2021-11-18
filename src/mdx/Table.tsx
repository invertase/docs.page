interface ImageProps
  extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {}

export function Table({ ...props }: ImageProps): JSX.Element {
  const wrapper = (child: React.ReactElement) => <div className="overflow-scroll">{child}</div>;

  return wrapper(<table {...props} />);
}
