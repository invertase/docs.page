type TableProps = React.DetailedHTMLProps<
  React.TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
>;

export function Table({ ...props }: TableProps): JSX.Element {
  const wrapper = (child: React.ReactElement) => <div className="overflow-scroll">{child}</div>;

  return wrapper(<table {...props} />);
}
