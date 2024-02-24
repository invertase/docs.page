type ZappProps = {
  id: string;
  lazy?: boolean;
  theme?: 'light' | 'dark';
};

const Zapp: React.FC<ZappProps> = props => {
  if (!props.id) {
    return <div />;
  }

  // Allows for GitHub, Gist, and other Zapps.
  // If no / is included, we assume the user supplied a Zapp id,
  // like 'flutter', which should be prefixed by 'edit/'.
  // Otherwise, we assume the user specified their own Zapp path,
  // and treat it as such.
  const id = props.id.includes('/') ? props.id : `edit/${props.id}`;

  const lazy = props.lazy === undefined ? false : props.lazy;
  const theme = props.theme || 'dark';

  return (
    <iframe
      src={`https://zapp.run/${id}?theme=${theme}&lazy=${lazy}`}
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
