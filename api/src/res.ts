import type { Response } from "express";
import type { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import type { BundlerError } from "./bundler/error";

const status = {
	200: "OK",
	400: "BAD_REQUEST",
	404: "NOT_FOUND",
	500: "INTERNAL_SERVER_ERROR",
} as const;

export function ok<T extends object>(res: Response, data: T): Response {
	res.status(200);
	return res.json({
		code: status[200],
		data,
	});
}

export function bundleError(res: Response, error: BundlerError): Response {
	res.status(error.code);
	return res.json({
		code: error.name,
		error: {
			message: error.message,
			source: error.source,
		},
	});
}

export function badRequest(res: Response, message: string): Response;
export function badRequest(res: Response, error: ZodError): Response;
export function badRequest(res: Response, input: string | ZodError): Response {
	// Set the HTTP Status code
	res.status(400);

	if (typeof input === "string") {
		return res.json({
			code: status[400],
			error: input,
		});
	}

	return res.json({
		code: status[400],
		error: fromZodError(input).message,
	});
}

export function notFound(res: Response): Response {
	res.status(404);
	return res.json({
		code: status[404],
		error: "Resource not found.",
	});
}

export function serverError(res: Response, error: unknown): Response {
	console.error(error);
	res.status(500);
	return res.json({
		code: status[500],
		error: "Something went wrong.",
	});
}
