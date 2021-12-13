export type YouTubeProps = {
  id: string;
};

export function YouTube({ id }: YouTubeProps) {
  if (!id) {
    return <div />;
  }

  return (
    <iframe
      className="w-full aspect-video rounded overflow-hidden"
      src={`https://www.youtube.com/embed/${id}`}
      allowFullScreen
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}

export default {
  YouTube,
};
