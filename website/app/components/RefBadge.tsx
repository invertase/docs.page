import { usePageContext, useRefUrl } from "~/context";
import { cn } from "~/utils";

export function RefBadge() {
	const ctx = usePageContext();
	const url = useRefUrl();

	// If we're in preview mode or the page doesn't have a ref, don't show the badge.
	if (ctx.preview || !ctx.ref) {
		return null;
	}

	const ref = ctx.ref;
	const source = ctx.bundle.source;

	return (
		<a
			target="_blank"
			rel="noopener noreferrer"
			href={url}
			className={cn(
				"font-display border rounded-full py-1 px-3 text-sm text-white transition",
				{
					"bg-green-500/80 dark:bg-green-500 border-green-500/70 hover:bg-green-500":
						source.type === "branch",
					"bg-blue-500/80 dark:bg-blue-500/20 border-blue-500/70 hover:bg-blue-500":
						source.type === "commit",
					"bg-orange-500/80 dark:bg-orange-500/20 border-orange-500/70 hover:bg-orange-500":
						source.type === "PR",
				},
			)}
		>
			{source.type === "branch" && `${ref}`}
			{source.type === "commit" && ref.substring(0, 7)}
			{source.type === "PR" && `PR #${ref}`}
		</a>
	);
}
