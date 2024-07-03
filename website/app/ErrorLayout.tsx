import type { BundleErrorResponse } from "./api";

type Props =
	| {
			title: string;
			description: string;
	  }
	| {
			error: BundleErrorResponse;
	  };

export function ErrorLayout(props: Props) {
	console.log(props);
	return <div>Hello</div>;
}
