import { HashIcon } from "lucide-react";
import { createElement } from "react";
import { cn } from "~/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
	id?: string;
	anchor?: "true"; // This is a string because it's translated to an HTML attribute in MDX
	type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading(props: HeadingProps) {
	const { id, type, className, ...other } = props;

	return createElement(
		type,
		{
			...other,
			className: cn("group relative flex items-center gap-2", className),
		},
		<>
			<span className="font-bold tracking-normal">{props.children}</span>
			{!!props.anchor && !!id && <Anchor id={id} />}
		</>,
	);
}

function Anchor(props: { id: string }) {
	return (
		<a
			href={`#${props.id}`}
			className="no-prose inline-flex h-6 w-6 items-center justify-center rounded border text-sm no-underline opacity-0 transition  group-hover:opacity-100 hover:border-black/10 dark:border-white/10"
		>
			<HashIcon size={12} />
		</a>
	);
}
