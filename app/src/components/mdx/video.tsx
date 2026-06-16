type VideoProps = {
  src?: string;
  type?: string;
};

export function Video({ src, type }: VideoProps) {
  if (!src) {
    return null;
  }

  return (
    // biome-ignore lint/a11y/useMediaCaption: we can't add a caption to the video
    <video
      title="Video"
      controls
      className="aspect-video w-full rounded-md overflow-hidden"
    >
      <source src={src} type={type} />
    </video>
  );
}
