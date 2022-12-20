type VimeoProps = {
  id?: string;
  video?: string;
};

function Vimeo({ id, video }: VimeoProps) {
  if (!id || !video) {
    return <div />;
  }

  return (
    <iframe
      className="aspect-video w-full overflow-hidden rounded"
      src={`https://player.vimeo.com/video/${id || video}`}
      allowFullScreen
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}

export default Vimeo;
