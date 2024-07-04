import type { Request, Response } from "express";
import { z } from "zod";
import { BundlerError } from "../bundler/error";
import { Bundler, type BundlerOutput } from "../bundler/index";
import { badRequest, ok, bundleError, serverError } from "../res";

const QuerySchema = z.object({
	owner: z
		.string({
			required_error: "Missing owner parameter.",
			invalid_type_error: "Owner parameter must be a string.",
		})
		.min(1),
	repository: z
		.string({
			required_error: "Missing repository parameter.",
			invalid_type_error: "Repository parameter must be a string.",
		})
		.min(1),
	ref: z.string().optional(),
	path: z.string().optional().default("index"),
});

export type BundleResponse =
	| {
			code: "OK";
			data: BundlerOutput;
	  }
	| BundleErrorResponse;

export type BundleErrorResponse = {
	code:
		| "NOT_FOUND"
		| "BAD_REQUEST"
		| "REPO_NOT_FOUND"
		| "FILE_NOT_FOUND"
		| "BUNDLE_ERROR"
		| "INTERNAL_SERVER_ERROR";
	error:
		| string
		| {
				message: string;
				source?: string;
		  };
};

export default async function bundle(
	req: Request,
	res: Response,
): Promise<Response> {
	const input = QuerySchema.safeParse(req.query);

	if (!input.success) {
		return badRequest(res, input.error);
	}

	try {
		const bundler = new Bundler(input.data);
		return ok(res, await bundler.build());
	} catch (e: unknown) {
		if (e instanceof BundlerError) {
			return bundleError(res, e);
		}
		return serverError(res, e);
	}
}
