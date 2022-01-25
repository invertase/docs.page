export type YouTubeProps = {
  id: string;
};

export function YouTube({ id }: YouTubeProps) {
  if (!id) {
    return <div />;
  }

  return (
    <iframe
      className="aspect-video w-full overflow-hidden rounded"
      src={`https://www.youtube.com/embed/${id}`}
      allowFullScreen
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
