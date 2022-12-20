type ZappProps = {
  id: string;
  lazy?: boolean;
  theme?: 'light' | 'dark';
};

const Zapp: React.FC<ZappProps> = props => {
  if (!props.id) {
    return <div />;
  }

  const lazy = props.lazy === undefined ? false : props.lazy;
  const theme = props.theme || 'dark';

  return (
    <iframe
      src={`http://zapp.run/embed/${props.id}?theme=${theme}&lazy=${lazy}`}
      className="aspect-video w-full"
      style={{
        width: '100%',
        height: '100%',
        border: 0,
        overflow: 'hidden',
      }}
    />
  );
};

export default Zapp;
