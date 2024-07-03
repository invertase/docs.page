import type { Request, Response } from 'express';
import { z } from 'zod';
import { ok, badRequest, serverError, response } from '../res';
import { Bundler, type BundlerOutput } from '../bundler/index';
import { BundlerError } from '../bundler/error';

const QuerySchema = z.object({
  owner: z
    .string({
      required_error: 'Missing owner parameter.',
      invalid_type_error: 'Owner parameter must be a string.',
    })
    .min(1),
  repository: z
    .string({
      required_error: 'Missing repository parameter.',
      invalid_type_error: 'Repository parameter must be a string.',
    })
    .min(1),
  ref: z.string().optional(),
  path: z.string().optional().default('index'),
});

export type BundleResponse =
  | {
      code: 'OK';
      data: BundlerOutput;
    }
  | BundleErrorResponse;

export type BundleErrorResponse = {
  code:
    | 'NOT_FOUND'
    | 'BAD_REQUEST'
    | 'REPO_NOT_FOUND'
    | 'FILE_NOT_FOUND'
    | 'BUNDLE_ERROR'
    | 'INTERNAL_SERVER_ERROR';
  error:
    | string
    | {
        message: string;
        cause?: string | unknown;
        links?: { title: string; url: string }[];
      };
};

export default async function bundle(req: Request, res: Response): Promise<Response> {
  const input = QuerySchema.safeParse(req.query);

  if (!input.success) {
    return badRequest(res, input.error);
  }

  try {
    const bundler = new Bundler(input.data);
    return ok(res, await bundler.build());
  } catch (e: unknown) {
    if (e instanceof BundlerError) {
      return response(res, e.code, e.name, {
        error: {
          message: e.message,
          cause: e.cause,
          links: e.links,
        },
      });
    }
    return serverError(res, e);
  }
}
