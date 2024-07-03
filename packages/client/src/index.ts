import { type MDXContentProps, getMDXComponent } from "mdx-bundler/client";
import { type FunctionComponent, useMemo } from "react";

interface UseHydratedProps {
	code: string;
}

function getMDXComp(code: string): FunctionComponent<MDXContentProps> {
	return getMDXComponent(code);
}

export function useHydratedMdx({
	code,
}: UseHydratedProps): FunctionComponent<MDXContentProps> {
	return useMemo<FunctionComponent<MDXContentProps>>(
		() => getMDXComp(code),
		[code],
	);
}
