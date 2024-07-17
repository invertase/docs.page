import type { ComponentProps } from "react";

type TableProps = ComponentProps<"table">;

export function Table(props: TableProps) {
	return (
		<div className="[& img]:inline">
			<table {...props} className="table" />
		</div>
	);
}
