export interface YouTubeProps {
  id: string;
}

export const YouTube: React.FC<YouTubeProps> = ({ id }: YouTubeProps) => {
  if (!id) {
    return <div />;
  }

  return (
    <div
      className="my-4 relative h-0 rounded overflow-hidden"
      style={{
        paddingBottom: '56.25%',
        paddingTop: 12,
      }}
    >
      <iframe
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        src={`https://www.youtube.com/embed/${id}`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
