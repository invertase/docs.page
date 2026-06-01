import { cn } from "@/lib/utils";

type YouTubeProps = {
  id?: string;
  allowFullScreen?: boolean;
  allow?: string;
};

export function YouTube({
  id,
  allowFullScreen = true,
  allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
}: YouTubeProps) {
  if (!id) {
    return null;
  }

  return (
    <iframe
      title="YouTube video"
      className={cn("aspect-video w-full rounded-md overflow-hidden")}
      src={`https://www.youtube.com/embed/${id}`}
      allowFullScreen={allowFullScreen}
      allow={allow}
    />
  );
}
