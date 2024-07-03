import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, unstable_defineLoader } from "@remix-run/node";
import {
	type MetaDescriptor,
	type MetaFunction,
	useLoaderData,
} from "@remix-run/react";
import { Layout } from "~/Layout";
import { getBundle } from "~/api";
import { Scripts } from "~/components/Scripts";
import { type Context, PageContext } from "~/context";

import docsearch from "@docsearch/css/dist/style.css?url";
import { ensureLeadingSlash } from "~/utils";
import domains from "../../../../domains.json";

export const loader = async (args: LoaderFunctionArgs) => {
	const owner = args.params.owner;
	const path = args.params["*"] || "";
	let repository = args.params.repository;
	let ref: string | undefined;

	if (!owner || !repository) {
		throw new Error("Invalid routing scenario.");
	}

	// Check if the repo includes a ref (invertase/foo~bar)
	if (repository.includes("~")) {
		[repository, ref] = repository.split("~");
	}

	const bundle = await getBundle({
		owner,
		repository,
		path,
		ref,
	}).catch((response) => {
		args.response = response;
		throw args.response;
	});

	// Check whether the repository has a domain assigned.
	const domain = domains
		.find(([, repo]) => repo === `${owner}/${repository}`)
		?.at(0);

	// Check if the user has set a redirect in the frontmatter of this page.
	const redirectTo =
		typeof bundle.frontmatter.redirect === "string"
			? bundle.frontmatter.redirect
			: undefined;

	// Redirect to the specified URL.
	if (redirectTo && redirectTo.length > 0) {
		if (redirectTo.startsWith("http://") || redirectTo.startsWith("https://")) {
			throw redirect(redirectTo);
		}

		let url = "";
		if (domain) {
			// If there is a domain setup, always redirect to it.
			url = `https://${domain}`;
			if (ref) url += `/~${ref}`;
			url += redirectTo;
		} else {
			// If no domain, redirect to docs.page.
			url = `https://docs.page/${owner}/${repository}`;
			if (ref) url += `~${ref}`;
			url += redirectTo;
		}

		args.response!.status = 301;
		args.response!.headers.set("Location", url);
		throw args.response;
	}

	return {
		path: ensureLeadingSlash(path),
		owner,
		repository,
		ref,
		domain: import.meta.env.PROD ? domain : undefined,
		bundle,
		preview: false,
	} satisfies Context;
};

export default function DocsPage() {
	const context = useLoaderData<typeof loader>();

	return (
		<PageContext.Provider value={context}>
			<Scripts />
			<Layout />
		</PageContext.Provider>
	);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	const descriptors: MetaDescriptor[] = [];

	if (!data) {
		return descriptors;
	}

	descriptors.push({
		tagName: "link",
		rel: "icon",
		href: data.bundle.config.favicon || "/favicon.ico",
	});

	// Add noindex meta tag if the frontmatter or config has noindex set to true.
	if (
		data.bundle.frontmatter.noindex === true ||
		data.bundle.config.seo?.noindex === true
	) {
		descriptors.push({
			name: "robots",
			content: "noindex",
		});
	}

	const title =
		data.bundle.frontmatter.title || data.bundle.config.name || "docs.page";
	const description =
		data.bundle.frontmatter.description || data.bundle.config.description;

	descriptors.push({
		title,
	});

	descriptors.push({
		property: "og:title",
		content: title,
	});

	descriptors.push({
		name: "twitter:title",
		content: title,
	});

	descriptors.push({
		name: "twitter:card",
		content: "summary_large_image",
	});

	if (description) {
		descriptors.push({
			name: "description",
			content: description,
		});
		descriptors.push({
			property: "og:description",
			content: description,
		});
		descriptors.push({
			name: "twitter:description",
			content: description,
		});
	}

	if ("domain" in data && data.domain) {
		descriptors.push({
			property: "og:url",
			content: `https://${data.domain}`,
		});
	}

	if (data.bundle.config.social?.x) {
		descriptors.push({
			name: "twitter:site",
			content: `@${data.bundle.config.social.x}`,
		});
	}

	if (data.bundle.config.search?.docsearch) {
		// https://docsearch.algolia.com/docs/DocSearch-v3#preconnect
		descriptors.push({
			tagName: "link",
			rel: "preconnect",
			crossOrigin: "true",
			href: `https://${data.bundle.config.search?.docsearch.appId}-dsn.algolia.net`,
		});

		descriptors.push({
			tagName: "link",
			rel: "stylesheet",
			href: docsearch,
		});
	}

	return descriptors;
};
