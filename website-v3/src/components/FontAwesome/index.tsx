import brands from './brands';

export type FontAwesomeProps = {
  name: keyof typeof brands | string;
};

const FontAwesome: React.FC<FontAwesomeProps> = props => {
  // @ts-expect-error - the string can be any type of icon
  const base = brands[props.name] ? 'fa-brands' : 'fa-solid';
  return <span className={`fa-fw ${base} fa-${props.name}`} />;
};

export default FontAwesome;
