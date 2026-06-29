type VimeoProps = {
  id?: string;
  video?: string;
};

export function Vimeo({ id, video }: VimeoProps) {
  if (!id && !video) {
    return <div />;
  }

  const src = `https://player.vimeo.com/video/${id || video}`;

  return (
    <iframe
      title="Vimeo video"
      className="aspect-video w-full rounded-md overflow-hidden"
      src={src}
      allowFullScreen
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
