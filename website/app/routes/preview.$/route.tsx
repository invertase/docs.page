import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, useFetcher, useParams } from "@remix-run/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Layout } from "../../Layout";
import { getPreviewBundle } from "../../api";
import { PageContext } from "../../context";
import { Toolbar } from "./Toolbar";
import {
	getFile,
	queryClient,
	useDirectoryHandle,
	usePageContent,
	useSelectDirectory,
} from "./utils";

import docsearch from "@docsearch/css/dist/style.css?url";
import { ensureLeadingSlash, isExternalLink } from "~/utils";

export const meta: MetaFunction = () => {
	return [
		{
			tagName: "link",
			rel: "stylesheet",
			href: docsearch,
		},
	];
};

export default function PreviewOutlet() {
	return (
		<QueryClientProvider client={queryClient}>
			<Preview />
		</QueryClientProvider>
	);
}

export const action = async (args: ActionFunctionArgs) => {
	const json = await args.request.json();
	const bundle = await getPreviewBundle(json).catch((response) => {
		args.response = response;
		throw args.response;
	});

	// Check if the user has set a redirect in the frontmatter of this page.
	const redirectTo =
		typeof bundle.frontmatter.redirect === "string"
			? bundle.frontmatter.redirect
			: undefined;

	// Redirect to the specified URL.
	if (redirectTo && redirectTo.length > 0) {
		const url = isExternalLink(String(redirectTo))
			? String(redirectTo)
			: `/preview${ensureLeadingSlash(String(redirectTo))}`;

		throw redirect(url);
	}

	return {
		bundle,
	};
};

function Preview() {
	const params = useParams();
	const path = params["*"] || "";

	const fetcher = useFetcher<typeof action>({ key: "bundle" });
	const directory = useDirectoryHandle();
	const selectDirectory = useSelectDirectory();
	const content = usePageContent(path, directory.data);
	const bundle = fetcher.data?.bundle;

	useEffect(() => {
		if (content.data) {
			fetcher.submit(content.data, {
				method: "POST",
				encType: "application/json",
			});
		}
	}, [fetcher, content.data]);

	if (directory.isLoading) {
		return <div>Loading...</div>;
	}

	if (directory.error) {
		return <div>Error: {directory.error.message}</div>;
	}

	if (content.isFetched && content.error) {
		return <div>Not found...</div>;
	}

	if (directory.data === null) {
		return (
			<button
				type="button"
				onClick={() => {
					selectDirectory.mutate();
				}}
			>
				{selectDirectory.isPending ? "Loading..." : "Select Directory"}
			</button>
		);
	}

	if (!bundle) {
		return <div>Not got yet...</div>;
	}

	return (
		<PageContext.Provider
			value={{
				path: ensureLeadingSlash(path),
				bundle,
				preview: true,
				getFile,
			}}
		>
			<Layout />
			<Toolbar />
		</PageContext.Provider>
	);
}
