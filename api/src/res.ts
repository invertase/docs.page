import type { Response } from "express";
import type { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const status = {
	200: "OK",
	400: "BAD_REQUEST",
	404: "NOT_FOUND",
	500: "INTERNAL_SERVER_ERROR",
} as const;

export function response<T extends object>(
	res: Response,
	status: number,
	code: string,
	other:
		| {
				error: {
					message: string;
					cause?: string | unknown;
					links?: { title: string; url: string }[];
				};
		  }
		| {
				data: T;
		  },
): Response {
	res.status(status);
	return res.json({
		code,
		...other,
	});
}

export function ok<T extends object>(res: Response, data: T): Response {
	res.status(200);
	return res.json({
		code: status[200],
		data,
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
