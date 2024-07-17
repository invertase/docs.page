import type { ComponentProps } from "react";

type SectionProps = ComponentProps<"section">;

export function Section(props: SectionProps) {
	const { id, ...rest } = props;

	return (
		<div className="relative" data-section={id}>
			<span id={id} className="pointer-events-none absolute -mt-36 pt-36" />
			<section {...rest} />
		</div>
	);
}
