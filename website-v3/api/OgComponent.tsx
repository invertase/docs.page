type Props = {
  owner: string;
  repository: string;
};

export const OgComponent = (props: Props) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1>Open Graph Component</h1>
    </div>
  );
};
