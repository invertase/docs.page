import { PencilIcon, StarIcon } from "lucide-react";
import { usePageContext, useSourceUrl } from "~/context";

export function Edit() {
  const ctx = usePageContext();
  const url = useSourceUrl();

  if (ctx.bundle.private) {
    return null;
  }

  return (
    <div className="flex justify-end mb-2">
      <a
        href={url}
        className="group border border-black/20 dark:border-white/20 transition-all hover:border-black/70 hover:dark:border-white/70 rounded-md px-2.5 py-1.5 inline-flex items-center gap-2"
      >
        <PencilIcon
          size={16}
          className="opacity-50 transition-all group-hover:opacity-75"
        />
        <span className="text-sm">Edit this page on GitHub</span>
      </a>
    </div>
  );
}
