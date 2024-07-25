import type { ComponentProps } from "react";

type PropertyProps = ComponentProps<"div"> & {
	name: string;
	type?: string;
	required?: boolean;
	optional?: boolean;
};

export function Property({
	name,
	type,
	required,
	optional,
	children,
	...props
}: PropertyProps) {
	return (
		<div {...props}>
			<div className="flex items-center gap-2 not-prose">
				<code className="font-bold text-primary">{name}</code>
				{!!type && (
					<code className="font-semibold text-xs bg-white/5 px-1.5 py-1 rounded-md">
						{type}
					</code>
				)}
				{!!required && (
					<code className="font-semibold text-xs bg-red-500/30 px-1.5 py-1 rounded-md">
						required
					</code>
				)}
				{!!optional && (
					<code className="font-semibold text-xs bg-yellow-500/30 px-1.5 py-1 rounded-md">
						optional
					</code>
				)}
			</div>
			{!!children && (
				<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0 text-sm mt-3">
					{children}
				</div>
			)}
		</div>
	);
}
