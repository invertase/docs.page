import type {
	BundleErrorResponse,
	BundleResponse,
	BundlerOutput,
	SidebarGroup,
} from "../../api/src/types";
export type {
	BundleResponse,
	BundleErrorResponse,
	BundlerOutput,
	SidebarGroup,
};

type GetBundleArgs = {
	owner: string;
	repository: string;
	ref?: string;
	path?: string;
};

const PRODUCTION = process.env.NODE_ENV === "production";
const API_URL =
	process.env.API_URL ||
	(PRODUCTION ? "https://api.docs.page" : "http://localhost:8080");
const API_PASSWORD = Buffer.from(`admin:${process.env.API_PASSWORD}`).toString(
	"base64",
);

export async function getBundle(args: GetBundleArgs): Promise<BundlerOutput> {
	const params = new URLSearchParams({
		owner: args.owner,
		repository: args.repository,
	});

	if (args.path) params.append("path", args.path);
	if (args.ref) params.append("ref", args.ref);

	const response = await fetch(`${API_URL}/bundle?${params.toString()}`, {
		headers: new Headers({
			Authorization: `Bearer ${API_PASSWORD}`,
		}),
	});

	const json = await response.json();

	if (!response.ok) {
		throw Response.json(json, {
			status: response.status,
		});
	}

	return json.data as BundlerOutput;
}

type GetPreviewBundleArgs = {
	markdown: string;
	config: {
		json?: string;
		yaml?: string;
	};
};

export async function getPreviewBundle(
	args: GetPreviewBundleArgs,
): Promise<BundlerOutput> {
	const response = await fetch(`${API_URL}/preview`, {
		method: "POST",
		headers: new Headers({
			Authorization: `Bearer ${API_PASSWORD}`,
		}),
		body: JSON.stringify({
			markdown: args.markdown,
			config: args.config,
		}),
	});

	const json = await response.json();

	if (!response.ok) {
		throw Response.json(json, {
			status: response.status,
		});
	}

	return json.data as BundlerOutput;
}
