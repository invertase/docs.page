type VimeoProps = {
  video: string;
};

function Vimeo({ video }: VimeoProps) {
  if (!video) {
    return <div />;
  }

  return (
    <iframe
      className="aspect-video w-full overflow-hidden rounded"
      src={`https://player.vimeo.com/video/${video}`}
      allowFullScreen
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}

export default Vimeo;
